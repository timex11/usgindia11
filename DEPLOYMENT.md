# USG India VPS Deployment Guide

This guide explains how to set up and deploy the USG India application on a Linux VPS.

## 1. Initial VPS Setup

Run the following script on your fresh Ubuntu VPS to install all necessary prerequisites (Docker, Node.js, PM2).

```bash
# Upload and run the setup script
bash scripts/setup-vps.sh
```

## 2. Manual Deployment

Once the VPS is set up, you can deploy the application manually using the deployment script.

```bash
# Ensure the app is in /var/www/usgindia
# Then run:
sudo /var/www/usgindia/scripts/deploy.sh
```

## 3. Automated CI/CD (GitHub Actions)

To enable automated deployments on every push to the `main` branch, you must configure the following **GitHub Secrets** in your repository settings:

| Secret Name | Description |
| ----------- | ----------- |
| `VPS_HOST` | The IP address or domain of your VPS. |
| `VPS_USER` | The SSH username (e.g., `root` or `ubuntu`). |
| `SSH_PRIVATE_KEY` | Your SSH private key used to connect to the VPS. |

### Important Notes:
- **SSH Key**: Ensure the corresponding public key is added to `~/.ssh/authorized_keys` on the VPS.
- **Environment Variables**: You must manually create/copy your `.env` files to the VPS in:
  - `/var/www/usgindia/backend/.env`
  - `/var/www/usgindia/frontend/.env.production`
- **Permissions**: The deployment script runs with `sudo`, so ensure the `VPS_USER` has passwordless sudo or the script is accessible.

## 4. Monitoring

You can monitor your application status using PM2:

```bash
pm2 list
pm2 monit
pm2 logs
```
