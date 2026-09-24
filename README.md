<div align="center">

# 🛍️ ShopEasy

### A modern, full-stack e-commerce platform built for scale, security, and performance

<p>
  <img src="https://img.shields.io/badge/Next.js-App%20Router-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

<p>
  <img src="https://img.shields.io/badge/TypeScript-Enabled-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-Styled-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" />
</p>

<p>
  ShopEasy is a complete e-commerce platform with a customer storefront,
  secure authentication, product management, promotional campaigns,
  automated checkout utilities, and an administration panel.
</p>

</div>

---

## 📌 Overview

ShopEasy is a full-stack e-commerce application built with a **Next.js and React frontend** and an **Express.js backend**. It uses **Prisma and PostgreSQL** for reliable data management and provides the core tools needed to operate a modern online store.

Customers can browse products, manage shopping carts and wishlists, discover limited-time deals, and complete the checkout process. Administrators can manage products, categories, banners, deals, users, and email campaigns from a dedicated admin panel.

---

## ✨ Features

### 🛒 Customer Features

- Responsive and modern storefront interface
- Product catalog with client-side pagination
- Product browsing and category filtering
- Deals of the Day with live countdown timers
- Shopping cart managed with Zustand
- Wishlist support
- JWT-based authentication
- Forgot-password flow with OTP verification
- Email and SMS verification
- Pincode-based state and city auto-fill
- Mobile-friendly shopping experience

### 🛡️ Admin Features

- Dashboard with store statistics
- Product creation, editing, and deletion
- Category and subcategory management
- Product bulk import and export with ExcelJS
- Excel data validation with category dropdowns
- Promotional banner management
- Deals of the Day scheduling
- Custom deal pricing and active time ranges
- Product and banner image uploads
- HTML email marketing campaigns
- Secure bulk email delivery using Nodemailer BCC

---

## ⚡ Performance

### In-Memory Caching

ShopEasy uses `node-cache` for frequently requested public data, including:

- Products
- Deals
- Banners
- Categories

Caches are invalidated automatically when administrators create, update, or delete related data.

### Client-Side Pagination

Large product collections are divided into smaller pages on the client to reduce unnecessary rendering and maintain smooth browsing performance.

### Prisma ORM

Prisma provides:

- Type-safe database queries
- Schema management
- Database migrations
- PostgreSQL integration
- Improved developer productivity

---

## 🧰 Technology Stack

### Frontend

- Next.js with App Router
- React
- TypeScript
- Tailwind CSS
- Zustand
- Axios
- Lucide Icons
- ExcelJS

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JSON Web Tokens
- Node Cache
- Nodemailer
- Multer
- Vonage SMS API

---

## 🏗️ Application Architecture

```text
ShopEasy/
├── frontend/
│   ├── app/                  # Next.js App Router pages
│   ├── components/           # Reusable React components
│   ├── lib/                  # API clients and shared utilities
│   ├── stores/               # Zustand state stores
│   └── public/               # Static assets
│
├── backend/
│   ├── prisma/               # Prisma schema and database configuration
│   ├── src/
│   │   ├── controllers/      # Request and business logic handlers
│   │   ├── routes/           # Express API routes
│   │   ├── middleware/       # Authentication and validation middleware
│   │   ├── services/         # Email, SMS, and application services
│   │   └── server.ts         # Backend entry point
│   ├── uploads/              # Uploaded product and banner images
│   └── docker-compose.yml    # Local PostgreSQL configuration
│
├── .env.example              # Environment variable template
├── package.json
├── LICENSE
└── README.md
```

> The exact directory names may vary depending on the project implementation.

---

## 🚀 Quick Start

### Prerequisites

Install the following tools:

- Node.js 18 or later
- npm
- Docker and Docker Compose
- PostgreSQL, or Docker for running PostgreSQL locally

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ShopEasy.git
cd ShopEasy
```

### 2. Start PostgreSQL

From the backend directory:

```bash
cd backend
docker compose up -d
```

### 3. Configure the Backend

Create a local environment file:

```bash
cp .env.example .env
```

Install dependencies and initialize Prisma:

```bash
npm install
npx prisma generate
npx prisma db push
```

Start the backend development server:

```bash
npm run dev
```

The backend API will be available at:

```text
http://localhost:5000
```

### 4. Start the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend` directory:

```env
# Application
PORT=5000
FRONTEND_URL=http://localhost:3000

# PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shopeasy?schema=public"

# Authentication
JWT_SECRET="replace-with-a-long-random-secret"

# Vonage SMS
VONAGE_API_KEY="your-vonage-api-key"
VONAGE_API_SECRET="your-vonage-api-secret"
VONAGE_BRAND_NAME="ShopEasy"

# SMTP email configuration
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="your-email@example.com"
SMTP_PASS="your-email-password"
SMTP_FROM="ShopEasy <no-reply@example.com>"
```

> Never commit `.env` files, passwords, API keys, or production secrets to GitHub.

---

## 🗃️ Database Commands

Generate the Prisma client:

```bash
npx prisma generate
```

Apply the current Prisma schema:

```bash
npx prisma db push
```

Create a migration:

```bash
npx prisma migrate dev --name describe-your-change
```

Open Prisma Studio:

```bash
npx prisma studio
```

---

## 🔐 Authentication and Security

ShopEasy includes:

- JWT-based authentication
- Protected administrator routes
- Role-based access control
- Password-protected user accounts
- OTP-based password recovery
- Vonage SMS verification
- Email notification support
- Server-side request validation
- Secure environment variable management
- Protected backend API endpoints

For production deployments, configure HTTPS, strict CORS rules, rate limiting, secure cookies, upload validation, logging, and database backups.

---

## 📦 Product Import and Export

The admin panel includes ExcelJS-powered catalog tools for:

- Importing products in bulk
- Exporting products to Excel
- Validating spreadsheet fields
- Selecting active categories through dropdowns
- Reducing manual catalog entry

Always validate spreadsheet data and create a database backup before importing products into production.

---

## 📧 Email Marketing

Administrators can create and send HTML marketing emails to registered users using Nodemailer.

Emails are sent using BCC to help protect customer email addresses.

Recommended production practices:

- Use a verified sending domain
- Configure a trusted SMTP provider
- Include unsubscribe functionality
- Monitor bounced and failed emails
- Avoid sending large campaigns from a development server

---

## 🧪 Development Workflow

1. Start the PostgreSQL database.
2. Configure the backend `.env` file.
3. Generate the Prisma client.
4. Apply the database schema.
5. Start the backend server.
6. Start the frontend development server.
7. Test customer and administrator workflows.
8. Run production builds before deployment.

Build the frontend:

```bash
npm run build
npm start
```

Backend build and production commands depend on the scripts defined in `backend/package.json`.

---

## 🚢 Production Checklist

Before deploying ShopEasy:

- [ ] Use a production PostgreSQL database
- [ ] Replace all development secrets
- [ ] Set a strong and unique `JWT_SECRET`
- [ ] Enable HTTPS
- [ ] Restrict CORS to the production frontend domain
- [ ] Configure SMTP and Vonage credentials
- [ ] Validate uploaded files and images
- [ ] Set upload size limits
- [ ] Enable API rate limiting
- [ ] Configure database backups
- [ ] Add application logging and monitoring
- [ ] Test frontend and backend production builds
- [ ] Confirm `.env` files are excluded from Git

---

## 🤝 Contributing

Contributions are welcome.

```bash
git checkout -b feature/your-feature
git add .
git commit -m "Add your feature"
git push origin feature/your-feature
```

Then open a pull request with:

- A clear description of the changes
- Testing details
- Screenshots for UI changes
- Any required configuration updates

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ for a faster and smarter shopping experience.

⭐ If ShopEasy is useful to you, consider giving the project a star.

</div>
