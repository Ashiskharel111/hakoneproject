# SK Limo Website - Deployment & Domain Setup Guide

The website has been built and tested with Next.js 16 (App Router), React 19, and Tailwind CSS. Below are the steps to deploy your website and connect it to your domain (e.g. `sk.limo`, `sklimo.jp`, or any other domain).

---

## Recommended Deployment Methods

### 1. Deploy with Vercel (Fastest & Recommended)
Vercel is the creators of Next.js and provides instant deployment with free SSL, global CDN, and automatic builds.

1. **Push your code to GitHub / GitLab / Bitbucket**:
   ```bash
   git init
   git add .
   git commit -m "Initial release of SK Limo website"
   git remote add origin <YOUR_GITHUB_REPO_URL>
   git push -u origin main
   ```
2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **"Add New Project"** and import your repository.
   - Click **"Deploy"**. (Build command is automatically set to `npm run build`).
3. **Connect Your Custom Domain**:
   - Go to **Project Settings > Domains**.
   - Enter your domain (e.g., `sk.limo` or `www.sklimo.jp`).
   - Add the provided **A record** (`76.76.21.21`) and **CNAME record** (`cname.vercel-dns.com`) at your domain registrar (GoDaddy, Cloudflare, Onamae, Namecheap, etc.).

---

### 2. Deploy on a VPS / Cloud Server (Ubuntu / Debian / Nginx)
If you are hosting on your own Linux server / AWS EC2 / DigitalOcean Droplet:

1. **Install Node.js 20+ and PM2**:
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm
   sudo npm install -g pm2
   ```
2. **Upload and Build the Project**:
   ```bash
   cd /var/www/sklimo
   npm install
   npm run build
   ```
3. **Start the Production Process**:
   ```bash
   pm2 start npm --name "sklimo" -- start
   pm2 save
   pm2 startup
   ```
4. **Configure Nginx Reverse Proxy**:
   ```nginx
   server {
       listen 80;
       server_name sk.limo www.sk.limo;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
5. **Issue Free SSL with Certbot**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d sk.limo -d www.sk.limo
   ```

---

### 3. Deploy with Firebase App Hosting (Google Cloud)
If you prefer Google Cloud / Firebase:

1. Install Firebase Tools:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```
2. Initialize App Hosting:
   ```bash
   firebase apphosting:backends:create
   ```
3. Connect your GitHub repository and link your custom domain directly in the Firebase Console.

---

## Build Artifacts Summary

- **Production Build**: `.next/` (Generated via `npm run build`)
- **Asset Images**: `public/images/`
- **Specification Catalog**: `public/images/README_IMAGE_SPECIFICATIONS.md`
- **Supported Languages**: English (`en`), Japanese (`ja`), Chinese (`zh`), French (`fr`), Spanish (`es`)
- **Routes Tested**:
  - `/` (Home landing redirect)
  - `/tours` (Executive tours landing page)
  - `/tours/winter` (Winter ski charter portal)
  - `/tours/airport-transfer` (VIP airport transfer portal)
  - `/destinations` (Sightseeing destinations hub)
  - `/destinations/[id]` (Destination details: `/destinations/fuji-kawaguchiko`, `/destinations/hakone-lake-ashi`, `/destinations/kamakura-enoshima`, `/destinations/nikko-unesco`, `/destinations/yokohama-bay`, `/destinations/karuizawa-resort`)
