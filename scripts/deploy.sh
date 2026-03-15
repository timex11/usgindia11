#!/bin/bash

# ==============================================================================
#  USG India — Production Deployment Script
#  Compatible with: Ubuntu/Debian VPS | Node.js + PM2 + Docker
#  Usage: sudo bash deploy.sh [--skip-frontend] [--skip-backend] [--rollback]
# ==============================================================================

set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────────
# CONFIGURATION — Edit these variables to match your environment
# ──────────────────────────────────────────────────────────────────────────────

APP_DIR="/var/www/usgindia"
LOG_FILE="/var/log/usgindia_deploy.log"
BACKUP_DIR="/var/backups/usgindia"
GIT_BRANCH="main"
PM2_CONFIG="config/ecosystem.config.js"
MAX_BACKUPS=5               # How many old backups to keep
DB_READY_TIMEOUT=30         # Seconds to wait for DB to be ready
NODE_MEMORY_LIMIT=2048      # MB — increase if OOM errors occur

# Deployment flags (can be overridden via CLI args)
SKIP_FRONTEND=false
SKIP_BACKEND=false
DO_ROLLBACK=false

# ──────────────────────────────────────────────────────────────────────────────
# COLORS & LOGGING
# ──────────────────────────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

log()     { echo -e "${CYAN}[$(date +'%H:%M:%S')]${RESET} ${GREEN}[INFO]${RESET}  $1" | tee -a "$LOG_FILE"; }
warn()    { echo -e "${CYAN}[$(date +'%H:%M:%S')]${RESET} ${YELLOW}[WARN]${RESET}  $1" | tee -a "$LOG_FILE"; }
section() { echo -e "\n${BOLD}${BLUE}━━━  $1  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}" | tee -a "$LOG_FILE"; }

error_exit() {
    echo -e "${CYAN}[$(date +'%H:%M:%S')]${RESET} ${RED}[ERROR]${RESET} $1" | tee -a "$LOG_FILE" >&2
    echo -e "\n${RED}${BOLD}✗ Deployment FAILED. Check log: $LOG_FILE${RESET}"
    # Attempt to notify via system logger
    logger -t usgindia-deploy "FAILED: $1" 2>/dev/null || true
    exit 1
}

# ──────────────────────────────────────────────────────────────────────────────
# ARGUMENT PARSING
# ──────────────────────────────────────────────────────────────────────────────

parse_args() {
    for arg in "$@"; do
        case $arg in
            --skip-frontend) SKIP_FRONTEND=true ;;
            --skip-backend)  SKIP_BACKEND=true ;;
            --rollback)      DO_ROLLBACK=true ;;
            --help|-h)
                echo "Usage: sudo bash deploy.sh [--skip-frontend] [--skip-backend] [--rollback]"
                exit 0
                ;;
            *) warn "Unknown argument: $arg. Ignoring." ;;
        esac
    done
}

# ──────────────────────────────────────────────────────────────────────────────
# PREREQUISITES CHECK
# ──────────────────────────────────────────────────────────────────────────────

check_prerequisites() {
    section "Checking Prerequisites"

    # Must run as root
    if [[ "$EUID" -ne 0 ]]; then
        error_exit "This script must be run as root. Use: sudo bash deploy.sh"
    fi

    # Required directories
    [[ -d "$APP_DIR" ]] || error_exit "App directory '$APP_DIR' not found. Run the initial setup script first."

    # Required commands
    local required_cmds=("git" "node" "npm" "pm2" "docker")
    for cmd in "${required_cmds[@]}"; do
        if ! command -v "$cmd" &>/dev/null; then
            error_exit "Required command '$cmd' not found. Please install it first."
        fi
    done

    # Check PM2 config file exists
    [[ -f "$APP_DIR/$PM2_CONFIG" ]] || error_exit "PM2 config not found at $APP_DIR/$PM2_CONFIG"

    # Check Docker daemon is running
    docker info &>/dev/null || error_exit "Docker daemon is not running. Start it with: systemctl start docker"

    log "All prerequisites satisfied ✓"
}

# ──────────────────────────────────────────────────────────────────────────────
# BACKUP
# ──────────────────────────────────────────────────────────────────────────────

create_backup() {
    section "Creating Backup"

    mkdir -p "$BACKUP_DIR"
    local timestamp
    timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_path="$BACKUP_DIR/backup_$timestamp"

    log "Backing up current build to: $backup_path"
    mkdir -p "$backup_path"

    # Backup built artifacts (not node_modules — saves space & time)
    for dir in "backend/dist" "backend/build" "frontend/dist" "frontend/build" "frontend/out" ".next"; do
        if [[ -d "$APP_DIR/$dir" ]]; then
            cp -r "$APP_DIR/$dir" "$backup_path/" && log "  ✓ Backed up $dir"
        fi
    done

    # Save the current git commit hash so we know what's deployed
    git -C "$APP_DIR" rev-parse HEAD > "$backup_path/git_commit.txt" 2>/dev/null || true

    # Prune old backups, keep only the latest $MAX_BACKUPS
    local backup_count
    backup_count=$(ls -1d "$BACKUP_DIR"/backup_* 2>/dev/null | wc -l)
    if (( backup_count > MAX_BACKUPS )); then
        ls -1dt "$BACKUP_DIR"/backup_* | tail -n "+$((MAX_BACKUPS + 1))" | xargs rm -rf
        log "Pruned old backups, keeping last $MAX_BACKUPS."
    fi

    log "Backup created ✓  (at: $backup_path)"
    echo "$backup_path"  # Return path for rollback use
}

# ──────────────────────────────────────────────────────────────────────────────
# ROLLBACK
# ──────────────────────────────────────────────────────────────────────────────

do_rollback() {
    section "Rolling Back to Previous Build"

    local latest_backup
    latest_backup=$(ls -1dt "$BACKUP_DIR"/backup_* 2>/dev/null | head -n 1)

    if [[ -z "$latest_backup" ]]; then
        error_exit "No backups found in $BACKUP_DIR. Cannot rollback."
    fi

    log "Restoring from: $latest_backup"

    for dir in dist build out .next; do
        for prefix in backend frontend; do
            if [[ -d "$latest_backup/$dir" ]]; then
                log "  Restoring $prefix/$dir..."
                rm -rf "$APP_DIR/$prefix/$dir"
                cp -r "$latest_backup/$dir" "$APP_DIR/$prefix/$dir"
            fi
        done
    done

    log "Reloading PM2 with rolled-back build..."
    pm2 reload "$APP_DIR/$PM2_CONFIG" --env production --update-env || \
        error_exit "PM2 reload failed during rollback."

    log "Rollback complete ✓"
    if [[ -f "$latest_backup/git_commit.txt" ]]; then
        log "Rolled back to git commit: $(cat "$latest_backup/git_commit.txt")"
    fi
}

# ──────────────────────────────────────────────────────────────────────────────
# GIT PULL
# ──────────────────────────────────────────────────────────────────────────────

pull_latest_code() {
    section "Pulling Latest Code"

    cd "$APP_DIR" || error_exit "Cannot enter $APP_DIR"

    # Fix common git ownership issue when running with sudo
    git config --global --add safe.directory "$APP_DIR" 2>/dev/null || true

    log "Current commit: $(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"
    log "Fetching from origin/$GIT_BRANCH..."

    git fetch origin "$GIT_BRANCH" || error_exit "git fetch failed. Check your network and git credentials."
    git reset --hard "origin/$GIT_BRANCH" || error_exit "git reset failed."

    # Clean untracked files but preserve .env files
    git clean -fd --exclude='.env' --exclude='.env.*' --exclude='*.pem' --exclude='*.key' \
        || warn "git clean encountered issues — continuing anyway."

    log "Now at commit: $(git rev-parse --short HEAD) — $(git log -1 --pretty=%s)"
}

# ──────────────────────────────────────────────────────────────────────────────
# DOCKER INFRASTRUCTURE
# ──────────────────────────────────────────────────────────────────────────────

start_infrastructure() {
    section "Starting Docker Infrastructure"

    cd "$APP_DIR" || error_exit "Cannot enter $APP_DIR"

    log "Starting Docker Compose services..."
    docker compose up -d || error_exit "docker compose up failed."

    log "Waiting for services to be healthy (max ${DB_READY_TIMEOUT}s)..."
    local elapsed=0
    local interval=3

    while (( elapsed < DB_READY_TIMEOUT )); do
        # Check if all services with healthchecks are healthy
        local unhealthy
        unhealthy=$(docker compose ps --format json 2>/dev/null \
            | grep -c '"Health":"starting"\|"Health":"unhealthy"' || true)

        if [[ "$unhealthy" -eq 0 ]]; then
            log "All Docker services are healthy ✓"
            return 0
        fi

        sleep "$interval"
        elapsed=$(( elapsed + interval ))
        log "  Still waiting... ($elapsed/${DB_READY_TIMEOUT}s)"
    done

    warn "Health check timed out after ${DB_READY_TIMEOUT}s. Services may not be fully ready."
    warn "Continuing anyway — watch logs for database connection errors."
}

# ──────────────────────────────────────────────────────────────────────────────
# BACKEND BUILD
# ──────────────────────────────────────────────────────────────────────────────

build_backend() {
    section "Building Backend"

    cd "$APP_DIR/backend" || error_exit "Backend directory missing at $APP_DIR/backend"

    log "Installing backend dependencies..."
    npm install --no-audit --no-fund --legacy-peer-deps \
        || error_exit "Backend 'npm install' failed."

    # Prisma steps — only if prisma schema exists
    if [[ -f "prisma/schema.prisma" ]]; then
        log "Generating Prisma Client..."
        npx prisma generate || error_exit "prisma generate failed."

        log "Running database migrations..."
        npx prisma migrate deploy \
            || warn "prisma migrate deploy failed — DB may not be reachable yet. Run manually if needed."
    else
        warn "No prisma/schema.prisma found — skipping Prisma steps."
    fi

    log "Compiling TypeScript / building backend..."
    npm run build || error_exit "Backend 'npm run build' failed."

    log "Backend build complete ✓"
}

# ──────────────────────────────────────────────────────────────────────────────
# FRONTEND BUILD
# ──────────────────────────────────────────────────────────────────────────────

build_frontend() {
    section "Building Frontend"

    cd "$APP_DIR/frontend" || error_exit "Frontend directory missing at $APP_DIR/frontend"

    log "Installing frontend dependencies..."
    npm install --no-audit --no-fund --legacy-peer-deps \
        || error_exit "Frontend 'npm install' failed."

    log "Building frontend (Node memory limit: ${NODE_MEMORY_LIMIT}MB)..."
    export NODE_OPTIONS="--max-old-space-size=${NODE_MEMORY_LIMIT}"
    npm run build || error_exit "Frontend 'npm run build' failed."

    log "Frontend build complete ✓"
}

# ──────────────────────────────────────────────────────────────────────────────
# PM2 RELOAD
# ──────────────────────────────────────────────────────────────────────────────

reload_applications() {
    section "Reloading PM2 Applications"

    cd "$APP_DIR" || error_exit "Cannot enter $APP_DIR"

    # Check if any of the apps defined in the config are already running
    local config_apps
    config_apps=$(node -e "
        try {
            const c = require('./$PM2_CONFIG');
            const apps = c.apps || [];
            console.log(apps.map(a => a.name).join('|'));
        } catch(e) { console.log(''); }
    " 2>/dev/null || echo "")

    local apps_running=false
    if [[ -n "$config_apps" ]]; then
        while IFS='|' read -ra app_names; do
            for app in "${app_names[@]}"; do
                if pm2 list | grep -qw "$app" 2>/dev/null; then
                    apps_running=true
                    break 2
                fi
            done
        done <<< "$config_apps"
    fi

    if $apps_running; then
        log "Existing PM2 apps detected — performing zero-downtime reload..."
        pm2 reload "$APP_DIR/$PM2_CONFIG" --env production --update-env \
            || error_exit "PM2 reload failed."
    else
        log "No running PM2 apps found — starting fresh..."
        pm2 start "$APP_DIR/$PM2_CONFIG" --env production \
            || error_exit "PM2 start failed."
    fi

    # Save PM2 process list so it survives reboots
    pm2 save || warn "pm2 save failed — apps may not restart after reboot."

    log "PM2 reload complete ✓"
}

# ──────────────────────────────────────────────────────────────────────────────
# HEALTH CHECK (post-deploy)
# ──────────────────────────────────────────────────────────────────────────────

health_check() {
    section "Post-Deploy Health Check"

    # Check PM2 processes are online
    local offline_apps
    offline_apps=$(pm2 list 2>/dev/null | grep -v "online" | grep -E "stopped|errored" | wc -l || true)

    if [[ "$offline_apps" -gt 0 ]]; then
        warn "$offline_apps PM2 app(s) are not online. Check: pm2 logs"
    else
        log "All PM2 processes are online ✓"
    fi

    # Optionally ping an endpoint — set HEALTH_CHECK_URL in your env to enable
    if [[ -n "${HEALTH_CHECK_URL:-}" ]]; then
        log "Pinging health endpoint: $HEALTH_CHECK_URL"
        local http_code
        http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$HEALTH_CHECK_URL" || echo "000")
        if [[ "$http_code" == "200" ]]; then
            log "Health endpoint responded with 200 OK ✓"
        else
            warn "Health endpoint returned HTTP $http_code — verify the app manually."
        fi
    fi
}

# ──────────────────────────────────────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────────────────────────────────────

main() {
    parse_args "$@"

    # Ensure log file is writable
    mkdir -p "$(dirname "$LOG_FILE")"
    touch "$LOG_FILE" || { echo "Cannot write to $LOG_FILE"; exit 1; }

    echo ""
    echo -e "${BOLD}${BLUE}╔══════════════════════════════════════════════════════╗${RESET}"
    echo -e "${BOLD}${BLUE}║     USG INDIA — DEPLOYMENT PIPELINE                 ║${RESET}"
    echo -e "${BOLD}${BLUE}║     $(date +'%Y-%m-%d %H:%M:%S')                         ║${RESET}"
    echo -e "${BOLD}${BLUE}╚══════════════════════════════════════════════════════╝${RESET}"
    echo ""

    # Handle rollback mode
    if $DO_ROLLBACK; then
        do_rollback
        exit 0
    fi

    check_prerequisites
    create_backup       # Always backup before making changes

    pull_latest_code
    start_infrastructure

    if ! $SKIP_BACKEND; then
        build_backend
    else
        warn "--skip-backend flag set: skipping backend build."
    fi

    if ! $SKIP_FRONTEND; then
        build_frontend
    else
        warn "--skip-frontend flag set: skipping frontend build."
    fi

    reload_applications
    health_check

    echo ""
    echo -e "${BOLD}${GREEN}╔══════════════════════════════════════════════════════╗${RESET}"
    echo -e "${BOLD}${GREEN}║  ✓  DEPLOYMENT SUCCESSFUL                           ║${RESET}"
    echo -e "${BOLD}${GREEN}║     Finished at: $(date +'%H:%M:%S')                        ║${RESET}"
    echo -e "${BOLD}${GREEN}╚══════════════════════════════════════════════════════╝${RESET}"
    echo ""

    log "Full deploy log: $LOG_FILE"
    log "To rollback: sudo bash deploy.sh --rollback"
    echo ""

    pm2 list
}

main "$@"