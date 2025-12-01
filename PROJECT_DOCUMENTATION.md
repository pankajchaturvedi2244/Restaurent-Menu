# Digital Menu Management System

A modern, full-stack web application for restaurants to manage and share their digital menus. Built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Features

### 🍽️ Core Features

#### 1. **User Management**
- Email-based registration and login with verification codes
- Secure session management with JWT tokens
- User profiles with full name and country information
- Protected routes with authentication middleware

#### 2. **Restaurant Management**
- Create and manage multiple restaurants
- Store restaurant name and location
- Owner-based access control
- Restaurant deletion with cascading data cleanup

#### 3. **Menu Management**
- Create menu categories (Starters, Main Courses, Desserts, etc.)
- Add dishes with:
  - Name and description
  - High-quality images
  - Optional spice level (0-5 scale)
  - Multiple category assignments per dish
- Edit and delete menu items
- Organize dishes by categories

#### 4. **Customer Access**
- **Public Menu Viewing**: Access via shared links without authentication
- **QR Code Generation**: Generate downloadable QR codes for each restaurant
- **Fixed Category Headers**: Category name stays at top while scrolling
- **Floating Navigation Menu**: Quick access to jump between categories
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 🚀 Technical Features

- Type-safe database with Prisma ORM
- Zod validation for all API inputs
- RESTful API architecture
- Secure authentication with email verification
- Image optimization with Next.js Image component
- Tailwind CSS for responsive styling
- Environment-based configuration

## Project Structure

```
digital-menu/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   │   ├── register/
│   │   │   ├── verify/
│   │   │   └── logout/
│   │   ├── categories/    # Category management
│   │   ├── dishes/        # Dish management
│   │   ├── restaurants/   # Restaurant management
│   │   └── public/        # Public menu access
│   ├── auth/              # Auth pages
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/         # Admin dashboard
│   │   └── restaurants/[id]/
│   │       ├── page.tsx   # Menu management
│   │       └── qr/        # QR code sharing
│   └── menu/[id]/         # Public menu view
├── lib/
│   ├── auth/              # Auth utilities
│   │   ├── email.ts
│   │   ├── session.ts
│   │   └── verification.ts
│   ├── utils/             # Validation schemas
│   └── prisma.ts          # Prisma client singleton
├── prisma/
│   └── schema.prisma      # Database schema
├── components/            # React components
└── public/                # Static assets
```

## Database Schema

### User
- id, email, fullName, country
- verificationCode, isVerified
- timestamps

### Restaurant
- id, name, location
- ownerId (foreign key to User)
- timestamps

### Category
- id, name
- restaurantId (foreign key to Restaurant)
- timestamps

### Dish
- id, name, image, description
- spiceLevel (optional, 0-5)
- restaurantId (foreign key to Restaurant)
- timestamps

### DishCategory (Junction Table)
- id, dishId, categoryId
- Enables dishes in multiple categories

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- SMTP server (for email verification)

### Installation

1. **Clone and Install**
```bash
npm install
```

2. **Configure Environment**
Create `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/digital_menu"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
JWT_SECRET="your-secret-key-change-in-production"
SMTP_HOST="localhost"
SMTP_PORT="1025"
SMTP_USER="user"
SMTP_PASSWORD="password"
SMTP_FROM="noreply@digital-menu.local"
```

3. **Setup Database**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. **Start Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify` - Verify email with code
- `POST /api/auth/logout` - Logout user

### Restaurants
- `GET /api/restaurants` - List user's restaurants
- `POST /api/restaurants` - Create restaurant
- `GET /api/restaurants/[id]` - Get restaurant details
- `DELETE /api/restaurants/[id]` - Delete restaurant
- `GET /api/restaurants/[id]/qr` - Get QR code info

### Categories
- `GET /api/categories?restaurantId=...` - List categories
- `POST /api/categories` - Create category
- `DELETE /api/categories/[id]` - Delete category

### Dishes
- `GET /api/dishes?restaurantId=...` - List dishes
- `POST /api/dishes` - Create dish
- `DELETE /api/dishes/[id]` - Delete dish

### Public Menu
- `GET /api/public/menu/[restaurantId]` - Get public menu (no auth required)

## Usage Guide

### For Restaurant Owners

1. **Register**
   - Visit home page and click "Get Started"
   - Enter email, name, and country
   - Verify with code sent to email

2. **Create Restaurant**
   - Go to Dashboard
   - Click "Add Restaurant"
   - Enter name and location

3. **Manage Menu**
   - Click "Manage Menu" on restaurant card
   - Add categories (e.g., Appetizers, Main Courses)
   - Add dishes with images and descriptions
   - Assign dishes to categories

4. **Share Menu**
   - Click "Share Menu" button
   - Download QR code or copy menu link
   - Share QR code or link with customers

### For Customers

1. **Access Menu**
   - Scan QR code with phone, OR
   - Click/open the menu link

2. **Browse Menu**
   - Use floating category menu to jump between sections
   - View dish details with images
   - See spice levels and descriptions

## Technologies Used

- **Frontend**: React 19, Next.js 16
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with email verification
- **Styling**: Tailwind CSS 4
- **Validation**: Zod
- **QR Code**: qrcode library
- **Email**: Nodemailer
- **Type Safety**: TypeScript

## Key Implementation Details

### Authentication Flow
1. User registers with email
2. Verification code sent via email
3. User enters code to verify email
4. JWT session created in httpOnly cookie
5. Middleware protects authenticated routes

### Menu Access Control
- Authenticated: Dashboard, edit menus, create restaurants
- Public: View menus via ID, scan QR codes
- Owner-only: Delete, manage restaurants

### Data Relationships
- One User owns multiple Restaurants
- One Restaurant has multiple Categories
- One Restaurant has multiple Dishes
- One Dish can belong to multiple Categories (via junction table)

## Security Features

- Password verification through email codes
- JWT session tokens in httpOnly cookies
- Ownership verification on all operations
- Input validation with Zod
- SQL injection prevention via Prisma
- CORS and security headers ready

## Performance Optimizations

- Prisma Client singleton pattern
- Image optimization with Next.js Image component
- Database query optimization with proper indexing
- Server-side rendering where possible
- CSS minification with Tailwind

## Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Self-Hosted
1. Set environment variables
2. Run migrations: `npx prisma migrate deploy`
3. Build: `npm run build`
4. Start: `npm start`

## Future Enhancements

- [ ] Restaurant analytics and view tracking
- [ ] Menu item pricing
- [ ] Dietary information and allergens
- [ ] Menu versioning and history
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Order integration
- [ ] Table/area management
- [ ] Staff management
- [ ] Ratings and reviews

## Troubleshooting

### Database Connection Issues
```bash
# Check DATABASE_URL in .env.local
# Ensure PostgreSQL is running
npx prisma db push  # Re-sync database
```

### Email Not Sending
```bash
# Check SMTP settings in .env.local
# Use MailHog for development:
# docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog
```

### Build Errors
```bash
npm run lint
npx prisma generate
npm run build
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push and create pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ for restaurants**
