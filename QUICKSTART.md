# Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
Create a PostgreSQL database and update `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/digital_menu"
```

### 3. Create Database Schema
```bash
npx prisma migrate dev --name init
```

### 4. Configure Email (Optional for Development)
```env
# Use MailHog for testing:
# docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog
SMTP_HOST=localhost
SMTP_PORT=1025
```

### 5. Start Server
```bash
npm run dev
```

Visit: http://localhost:3000

## Testing the Application

### Create Test Account
1. Go to http://localhost:3000
2. Click "Get Started"
3. Register with email: `test@example.com`
4. Name: `Test User`
5. Country: `United States`
6. Check email for verification code (MailHog at http://localhost:8025)
7. Enter code to verify

### Create Test Restaurant
1. Click "Add Restaurant"
2. Name: `My Test Restaurant`
3. Location: `New York, NY`
4. Click "Create"

### Create Menu
1. Click "Manage Menu"
2. Go to "Categories" tab
3. Create categories: `Appetizers`, `Main Courses`, `Desserts`
4. Go to "Dishes" tab
5. Add dishes with:
   - Name: `Pasta Carbonara`
   - Image URL: Any valid image URL
   - Description: `Classic Italian pasta`
   - Spice: 2
   - Categories: Main Courses

### Share Menu
1. Click "Share Menu"
2. Download QR code or copy link
3. Open menu link in new tab (http://localhost:3000/menu/[id])

## Key Files

- `.env.local` - Configuration
- `prisma/schema.prisma` - Database schema
- `app/api/` - API routes
- `app/dashboard/` - Admin pages
- `app/menu/[id]/` - Public menu view
- `lib/` - Utilities and helpers

## Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Linting
npm run lint

# Database
npx prisma studio              # GUI database manager
npx prisma migrate dev --name  # Create migration
npx prisma db push             # Sync database
```

## Email Testing

### Option 1: MailHog (Recommended)
```bash
docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog
```
Check emails at: http://localhost:8025

### Option 2: Real Email (Gmail)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## Troubleshooting

### Port 3000 in use?
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>
```

### Prisma errors?
```bash
npx prisma generate
npx prisma migrate resolve --rolled-back init
npx prisma migrate dev
```

### Dependencies issues?
```bash
rm package-lock.json node_modules
npm install
```

## Next Steps

1. Update environment variables for production
2. Add more restaurants and menus
3. Customize styling in `app/globals.css`
4. Deploy to Vercel or self-host
5. Set up email service (SendGrid, Mailgun, etc.)

## Support

Check `PROJECT_DOCUMENTATION.md` for detailed information.

---

Happy serving! 🍽️
