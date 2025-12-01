# Deployment Guide

## Vercel Deployment (Recommended)

### 1. Prepare Repository
```bash
# Ensure git is initialized
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### 3. Configure Environment Variables
In Vercel Dashboard:
1. Project Settings → Environment Variables
2. Add these variables:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/digital_menu
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   JWT_SECRET=your-production-secret-key
   SMTP_HOST=smtp.sendgrid.net (or your provider)
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASSWORD=SG.xxxxx
   SMTP_FROM=noreply@yourdomain.com
   ```

### 4. Setup Database
```bash
# Run migrations on production database
npx prisma migrate deploy
```

### 5. Deploy
```bash
vercel --prod
```

## Self-Hosted Deployment

### Option 1: Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: digital_menu
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  app:
    build: .
    environment:
      DATABASE_URL: postgresql://postgres:secure_password@db:5432/digital_menu
      NEXT_PUBLIC_APP_URL: http://localhost:3000
      JWT_SECRET: your-secret-key
      SMTP_HOST: smtp.sendgrid.net
      SMTP_PORT: 587
      SMTP_USER: apikey
      SMTP_PASSWORD: ${SENDGRID_API_KEY}
      SMTP_FROM: noreply@example.com
    ports:
      - "3000:3000"
    depends_on:
      - db
    command: sh -c "npx prisma migrate deploy && npm start"

volumes:
  postgres_data:
```

Run:
```bash
docker-compose up -d
```

### Option 2: Linux/Ubuntu Server

#### Prerequisites
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx
```

#### Application Setup
```bash
# Create app directory
sudo mkdir -p /var/www/digital-menu
cd /var/www/digital-menu

# Clone repository
git clone <your-repo> .

# Install dependencies
npm ci --only=production

# Generate Prisma client
npx prisma generate

# Build application
npm run build
```

#### Database Setup
```bash
# Create database
sudo -u postgres createdb digital_menu

# Create database user
sudo -u postgres createuser app_user
sudo -u postgres psql -c "ALTER USER app_user WITH PASSWORD 'strong_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE digital_menu TO app_user;"

# Update .env
echo "DATABASE_URL=postgresql://app_user:strong_password@localhost:5432/digital_menu" > .env.local

# Run migrations
npx prisma migrate deploy
```

#### Process Manager (PM2)
```bash
# Install PM2
sudo npm install -g pm2

# Create ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'digital-menu',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
EOF

# Start application
pm2 start ecosystem.config.js

# Enable auto-start
pm2 startup
pm2 save
```

#### Nginx Configuration
Create `/etc/nginx/sites-available/digital-menu`:
```nginx
upstream app {
  server 127.0.0.1:3000;
}

server {
  listen 80;
  server_name yourdomain.com www.yourdomain.com;
  client_max_body_size 10M;

  location / {
    proxy_pass http://app;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
  }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/digital-menu /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is enabled by default
```

## Email Service Setup

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.your_api_key
SMTP_FROM=noreply@yourdomain.com
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your_email@yourdomain.com
SMTP_PASSWORD=your_password
SMTP_FROM=noreply@yourdomain.com
```

### Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=app_specific_password
SMTP_FROM=your_email@gmail.com
```

## Database Backups

### PostgreSQL Backup
```bash
# Manual backup
pg_dump -U postgres digital_menu > backup.sql

# Restore from backup
psql -U postgres digital_menu < backup.sql

# Automated daily backups
# Add to crontab:
# 0 2 * * * pg_dump -U postgres digital_menu > /backups/digital_menu_$(date +\%Y\%m\%d).sql
```

## Monitoring

### Health Check Endpoint
Add to `app/api/health/route.ts`:
```typescript
export async function GET() {
  return Response.json({ status: 'ok' });
}
```

Monitor at: `https://yourdomain.com/api/health`

### Logging
Check application logs:
```bash
# PM2 logs
pm2 logs digital-menu

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Security Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Use strong database passwords
- [ ] Enable HTTPS (Let's Encrypt)
- [ ] Set secure CORS origins
- [ ] Enable database backups
- [ ] Configure firewall rules
- [ ] Monitor error logs
- [ ] Set up security headers
- [ ] Regular security updates
- [ ] Use environment variables for all secrets

## Performance Optimization

### Caching
```env
# Add to .env
NEXT_PUBLIC_REVALIDATE=3600  # Revalidate every hour
```

### Database Optimization
```sql
-- Create indexes
CREATE INDEX idx_restaurant_owner ON restaurants(owner_id);
CREATE INDEX idx_category_restaurant ON categories(restaurant_id);
CREATE INDEX idx_dish_restaurant ON dishes(restaurant_id);
```

### CDN Setup
Use Vercel's built-in CDN or configure:
- CloudFlare for DNS + Caching
- AWS CloudFront for images
- Bunny CDN for global distribution

## Troubleshooting

### Application won't start
```bash
# Check logs
pm2 logs digital-menu

# Check Node version
node --version  # Should be 18+

# Check dependencies
npm ci --only=production
```

### Database connection issues
```bash
# Test connection
psql postgresql://user:pass@host:5432/digital_menu

# Check DATABASE_URL format
echo $DATABASE_URL
```

### High memory usage
```bash
# Monitor resources
pm2 monit

# Restart application
pm2 restart digital-menu
```

---

For additional help, check PROJECT_DOCUMENTATION.md
