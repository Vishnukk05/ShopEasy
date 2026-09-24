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
  ShopEasy is a complete shopping platform with a customer storefront, secure authentication,
  product and category management, promotional campaigns, automated checkout utilities, and an administration panel.
</p>

</div>

---

## 📌 Overview

ShopEasy is a full-stack e-commerce application built with a **Next.js and React frontend** and an **Express.js backend**. The platform uses **Prisma with PostgreSQL** for reliable data management and includes the essential tools required to operate a modern online store.

Customers can browse products, manage carts and wishlists, discover limited-time deals, and complete their checkout experience. Administrators can manage the catalog, campaigns, banners, customer communications, and store analytics from a dedicated admin panel.

---

## ✨ Features

### 🛒 Customer Experience

- Responsive and modern storefront UI
- Product catalog with client-side pagination
- Product browsing and category-based discovery
- Deals of the Day with live countdown timers
- Shopping cart managed with Zustand
- Wishlist support
- Secure JWT-based authentication
- Forgot-password flow with OTP verification
- Email and SMS verification support
- Pincode-based state and city auto-fill during checkout
- Smooth and responsive shopping experience across devices

### 🛡️ Administration Panel

- Dashboard with key store metrics
- User, product, and category management
- Create, update, and delete products
- Hierarchical category management
- Bulk product import and export with ExcelJS
- Spreadsheet validation with active-category dropdowns
- Promotional banner upload and management
- Deals of the Day scheduling
- Custom deal pricing and active time ranges
- Product and campaign image uploads
- HTML email marketing campaigns
- Secure bulk email delivery using Nodemailer BCC

---

## ⚡ Performance Architecture

ShopEasy is designed to provide a fast user experience even when the catalog grows significantly.

### In-Memory Caching

Public, high-traffic endpoints use `node-cache` to reduce repeated database queries. Product, deal, banner, and category responses can be served from memory, reducing typical response times from database-heavy requests to sub-10ms cache responses.

Caches are automatically invalidated when administrators create, update, or delete related data, helping ensure customers receive fresh content.

### Client-Side Pagination

Large product collections are efficiently sliced on the client to reduce unnecessary DOM rendering and maintain smooth scrolling performance while browsing thousands of products.

### Strongly Typed Data Layer

Prisma provides type-safe database access, schema management, migrations, and efficient PostgreSQL queries across the backend.

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
├── frontend/                 # Next.js customer storefront and UI
│   ├── app/                  # App Router pages and layouts
│   ├── components/           # Reusable UI components
│   ├── lib/                  # API clients and shared utilities
│   └── stores/               # Zustand state stores
│
├── backend/                  # Express.js API server
│   ├── prisma/               # Prisma schema and database configuration
│   ├── src/
│   │   ├── controllers/      # Request and business logic handlers
│   │   ├── routes/            # API route definitions
│   │   ├── middleware/        # Authentication and request middleware
│   │   ├── services/          # Email, SMS, and application services
│   │   └── server.ts          # Backend entry point
│   ├── uploads/              # Uploaded product and banner images
│   └── docker-compose.yml    # Local PostgreSQL service
│
└── README.md
The exact directory names may vary depending on the current implementation. The structure above represents the main application boundaries.

🚀 Quick Start
Prerequisites
Install the following before running the project:

Node.js 18 or later
npm
Docker and Docker Compose
PostgreSQL, or Docker for running PostgreSQL locally
1. Clone the repository
bash
git clone https://github.com/Developmentvs/Newstudentportal.git
cd Newstudentportal
2. Start PostgreSQL
From the backend directory:

bash
cd backend
docker-compose up -d
3. Configure the backend
Create a backend environment file:

bash
cp .env.example .env
Install dependencies, generate the Prisma client, and apply the database schema:

bash
npm install
npx prisma generate
npx prisma db push
Start the backend development server:

bash
npm run dev
The API will be available at:

Text
http://localhost:5000
4. Start the frontend
Open a second terminal:

bash
cd frontend
npm install
npm run dev
The storefront will be available at:

Text
http://localhost:3000
⚙️ Environment Variables
Create a .env file inside the backend directory and configure the required values:

env
# Server
PORT=5000

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shopeasy?schema=public"

# Authentication
JWT_SECRET="replace-with-a-long-random-secret"

# Frontend
FRONTEND_URL="http://localhost:3000"

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
Never commit .env files, API credentials, JWT secrets, or production database passwords to version control.

🗃️ Database Commands
Generate the Prisma client:

bash
npx prisma generate
Apply the current Prisma schema to the database:

bash
npx prisma db push
Create a migration during development:

bash
npx prisma migrate dev --name describe-your-change
Open Prisma Studio:

bash
npx prisma studio
🔐 Authentication and Security
ShopEasy includes the following security-oriented features:

JWT-based authentication
Password-protected user accounts
OTP-based account recovery
SMS verification through Vonage
Email verification and notification support
Protected administrator routes
Role-aware access control
Secure backend API endpoints
Server-side validation for important operations
Environment-based secret management
For production deployments, also configure HTTPS, rate limiting, secure cookies where applicable, strict CORS rules, upload validation, and database backups.

📦 Product Import and Export
Administrators can use the ExcelJS-powered catalog tools to:

Export product information to an Excel workbook
Import multiple products in bulk
Validate spreadsheet fields
Select active categories from generated dropdowns
Reduce manual catalog entry
Before importing a large spreadsheet, validate the data in a staging environment and keep a backup of the production database.

📧 Email Marketing
Administrators can compose HTML marketing emails and distribute them to registered users. Email delivery uses Nodemailer and BCC to avoid exposing customer email addresses to other recipients.

Recommended production practices:

Configure a trusted SMTP provider
Use a verified sender domain
Add unsubscribe support
Monitor bounce and delivery rates
Avoid sending large campaigns directly from a development server
🧪 Recommended Development Workflow
Start the PostgreSQL container.
Run Prisma generation and schema commands.
Start the backend on port 5000.
Start the frontend on port 3000.
Test customer and administrator workflows.
Check API logs and database records when troubleshooting.
Run production builds before deployment.
Frontend production build:

bash
npm run build
npm start
Backend production build and start commands depend on the scripts defined in backend/package.json.

🚢 Production Deployment Checklist
 Use a managed or production-ready PostgreSQL database
 Replace all development secrets
 Set a strong, unique JWT_SECRET
 Configure HTTPS and secure reverse-proxy headers
 Restrict CORS to the production frontend domain
 Configure SMTP and Vonage production credentials
 Validate image and file uploads
 Set upload size and type limits
 Enable API rate limiting
 Configure database backups
 Configure cache invalidation and monitoring
 Add application and error logging
 Build and test the frontend before deployment
 Never expose .env files or private credentials
🤝 Contributing
Contributions are welcome.

bash
git checkout -b feature/your-feature
git add .
git commit -m "Add your feature"
git push origin feature/your-feature
Then open a pull request with a clear description of the changes and testing performed.

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

<div align="center">
Built with ❤️ for a faster and smarter shopping experience
⭐ If ShopEasy is useful to you, consider giving the project a star.

</div> ```
If you want, I can also make it:

more professional and enterprise-style,
more compact for GitHub,
or more visually premium with badges and sections like “Screenshots”, “Roadmap”, and “Demo”.
