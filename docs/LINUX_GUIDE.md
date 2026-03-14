# Linux Deployment & Run Guide

This guide explains how to run the project on a Linux environment (e.g., Ubuntu, Debian, CentOS, or WSL).

## Prerequisites

Ensure the following are installed on your Linux machine:

1.  **Node.js** (v18 or higher recommended)
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```

2.  **Git**
    ```bash
    sudo apt-get install -y git
    ```

3.  **PM2** (Process Manager, only for production deployment)
    ```bash
    sudo npm install -g pm2
    ```

## Running in Development Mode

For local development on Linux or WSL:

1.  Open a terminal in the project root.
2.  Make the script executable (only needed once):
    ```bash
    chmod +x scripts/run_linux.sh
    ```
3.  Run the script:
    ```bash
    ./scripts/run_linux.sh
    ```

This will:
- Install dependencies if missing.
- Generate Prisma client.
- Start the Backend on port 3001.
- Start the Frontend on port 3000.
- Press `Ctrl+C` to stop both.

## Deploying to Production

To deploy the application for production use:

1.  Ensure you have your `.env` files set up in `backend/` and `frontend/`.
2.  Make the deploy script executable:
    ```bash
    chmod +x scripts/deploy.sh
    ```
3.  Run the deployment script:
    ```bash
    ./scripts/deploy.sh
    ```

This script will:
- Install production dependencies.
- Build the NestJS backend.
- Build the Next.js frontend.
- Start or reload the application using PM2.

## Troubleshooting

- **Permission Denied**: If you get `permission denied` errors when running scripts, ensure you run `chmod +x scripts/*.sh`.
- **Port Conflicts**: Ensure ports 3000 and 3001 are free. You can check with `sudo lsof -i :3000` and `sudo lsof -i :3001`.
- **Database Connection**: Ensure `backend/.env` has the correct `DATABASE_URL`. If using SQLite, ensure the file permissions allow writing to the database file.
