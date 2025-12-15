# 🍽️ Digital Menu Management System

A complete full-stack web application for restaurants to create, manage, and share digital menus. Built with Next.js, TypeScript, Prisma, and PostgreSQL.

## ✨ Key Features

### Restaurant Management
- **Multi-Restaurant Support**: Manage multiple restaurants from a single dashboard
- **Complete CRUD Operations**: Create, read, update, delete restaurants
- **Ownership-Based Access Control**: Each restaurant is owned by a user

### Menu Management
- **Categories**: Organize dishes into categories (Appetizers, Mains, Desserts, etc.)
- **Dishes**: Add dishes with images, descriptions, and spice levels
- **Multiple Category Assignments**: Each dish can belong to multiple categories
- **Image Optimization**: Automatic image optimization with Next.js Image component

### Customer Experience
- **Public Menu Access**: Share menus via links or QR codes
- **Fixed Category Headers**: Category name remains visible while scrolling
- **Floating Navigation**: Quick access menu to jump between categories
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

### Authentication & Security
- **Email Verification**: Secure registration with email verification codes
- **Session Management**: JWT-based authentication with secure cookies
- **Protected Routes**: Middleware protects authenticated endpoints
- **Owner Verification**: Only restaurant owners can manage their menus

## 📦 Tech Stack

- **Frontend**: React 19, Next.js 16, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with email verification
- **Styling**: Tailwind CSS 4
- **Validation**: Zod
- **QR Code Generation**: qrcode library
- **Email Service**: Mailtrap (Refer Readme.md)
- **Image Optimization**: Next.js Image component

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm or yarn

### Installation

1. **Clone and Install**
```bash
git clone <repository>
cd digital-menu
npm install
```

2. **Setup Environment**
```bash
# Create .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/digital_menu"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
JWT_SECRET="your-secret-key"
SMTP_HOST="localhost"
SMTP_PORT="1025"
SMTP_USER="user"
SMTP_PASSWORD="password"
SMTP_FROM="noreply@digital-menu.local"
```

3. **Initialize Database**
```bash
npx prisma migrate dev --name init
```

4. **Start Development Server**
```bash
npm run dev
```

Visit: http://localhost:3000

## 📚 Documentation

- **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)** - Complete technical documentation
- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute setup guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment instructions for Vercel, Docker, and self-hosted options

## 🗂️ Project Structure

```
digital-menu/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── categories/        # Category CRUD
│   │   ├── dishes/            # Dish CRUD
│   │   ├── restaurants/       # Restaurant management
│   │   └── public/            # Public menu access
│   ├── auth/                  # Authentication pages
│   ├── dashboard/             # Admin dashboard
│   ├── menu/[id]/             # Public menu view
│   └── page.tsx               # Home page
├── lib/
│   ├── auth/                  # Auth utilities
│   ├── utils/                 # Validation schemas
│   └── prisma.ts              # Database client
├── prisma/
│   └── schema.prisma          # Database schema
└── components/                # React components
```

## 🔑 Key Pages

### Public Pages
- `/` - Home page with features
- `/menu/[id]` - View restaurant menu (no auth required)
- `/auth/login` - Login page
- `/auth/register` - Registration page

### Protected Pages
- `/dashboard` - Restaurant management dashboard
- `/dashboard/restaurants/[id]` - Menu management (categories and dishes)
- `/dashboard/restaurants/[id]/qr` - QR code and sharing options

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register   - Register user
POST   /api/auth/verify     - Verify email code
POST   /api/auth/logout     - Logout user
```

### Restaurants
```
GET    /api/restaurants     - List user's restaurants
POST   /api/restaurants     - Create restaurant
GET    /api/restaurants/[id]/qr - Get QR code info
DELETE /api/restaurants/[id] - Delete restaurant
```

### Categories
```
GET    /api/categories?restaurantId=... - List categories
POST   /api/categories - Create category
DELETE /api/categories/[id] - Delete category
```

### Dishes
```
GET    /api/dishes?restaurantId=... - List dishes
POST   /api/dishes - Create dish
DELETE /api/dishes/[id] - Delete dish
```

### Public Menu
```
GET    /api/public/menu/[restaurantId] - Get public menu (no auth)
```

## 💾 Database Schema

### User
- id, email, fullName, country
- verificationCode, isVerified
- restaurants (relation)

### Restaurant
- id, name, location
- ownerId (foreign key)
- categories, dishes (relations)

### Category
- id, name
- restaurantId (foreign key)
- dishes (relation through DishCategory)

### Dish
- id, name, image, description
- spiceLevel (optional)
- restaurantId (foreign key)
- categories (relation through DishCategory)

## 🧪 Testing

### Test Account
1. Register: test@example.com
2. Name: Test User
3. Country: United States
4. Check email for verification code

### Create Test Menu
1. Create restaurant: "My Test Restaurant"
2. Add categories: "Appetizers", "Main Courses", "Desserts"
3. Add dishes with images
4. Share menu via QR code or link

## 🚢 Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Docker
```bash
docker-compose up -d
```

### Linux/Ubuntu
See DEPLOYMENT.md for complete instructions

## 🔒 Security Features

- Email verification required
- JWT session tokens
- Ownership verification on all operations
- Input validation with Zod
- SQL injection prevention (Prisma)
- HttpOnly secure cookies

## 📈 Performance

- Optimized Prisma queries
- Image optimization with Next.js
- Database indexing
- Server-side rendering
- Tailwind CSS minification

## 🛣️ Roadmap

- [ ] Restaurant analytics
- [ ] Menu pricing
- [ ] Dietary information & allergens
- [ ] Menu versioning
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Order integration
- [ ] Staff management
- [ ] Ratings & reviews

## 📝 License

MIT License - See LICENSE file

## 🤝 Support

For issues and questions:
1. Check PROJECT_DOCUMENTATION.md
2. Check QUICKSTART.md
3. Create an issue in the repository

---

**Built with ❤️ for restaurants everywhere** 🍽️
