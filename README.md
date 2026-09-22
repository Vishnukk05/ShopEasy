# ShopEasy E-Commerce Platform

A fully-featured, modern E-commerce web application built with a React/Next.js frontend and an Express/Node.js backend, powered by Prisma and PostgreSQL.

## 🚀 Features & Highlights

### For Customers (Frontend)
- **Modern User Interface**: A responsive, fast, and sleek UI styled with Tailwind CSS.
- **Product Catalog**: View thousands of products seamlessly with client-side pagination.
- **Deals of the Day**: Live dynamic deals fetched from the database with active countdown timers.
- **Authentication**: Secure JWT-based authentication. Includes a robust "Forgot Password" flow with Vonage SMS and Email OTP verification.
- **Shopping Cart & Wishlist**: Keep track of items to purchase, managed globally via Zustand state.
- **Checkout Automation**: Automated checkout experience featuring an India Post API integration that auto-fills state and city dropdowns based on a 6-digit Pincode.

### For Administrators (Admin Panel)
- **Dashboard**: Track total users, active tickets, and running campaigns.
- **Product Management**: Create, edit, and delete products. Includes an **Excel Bulk Import/Export** tool that features ExcelJS Data Validation to automatically provide dropdowns for active categories in the spreadsheet.
- **Category Management**: Manage product categories and hierarchy.
- **Dynamic Banners**: Upload and manage promotional image banners that automatically replace static homepage carousels.
- **Deals Management**: Schedule and manage "Deals of the Day" with custom pricing, active timestamps, and image uploads.
- **Email Marketing**: Compose HTML marketing emails (with image attachments) and blast them out to the entire userbase securely using Nodemailer BCC.

### Technical & Performance Architecture
- **In-Memory Caching (`node-cache`)**: The backend heavily utilizes memory caching for high-traffic public endpoints (Products, Deals, Banners, Categories) reducing 500ms database load times down to sub-10ms response times. Caches are automatically flushed when admins mutate the data.
- **Client-Side Pagination**: Efficiently slices large product datasets in the browser, preventing DOM overload and maintaining 60FPS scrolling even with thousands of products.
- **Prisma ORM**: Strongly-typed schema management, easy migrations, and high-performance Postgres querying.

## 🛠 Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS, Zustand, Axios, Lucide Icons, ExcelJS.
- **Backend**: Node.js, Express, TypeScript, Prisma (PostgreSQL), Node-Cache, Nodemailer, Multer (File Uploads), Vonage (SMS).

## 📦 Getting Started

### 1. Database Setup
Ensure you have a PostgreSQL instance running. The easiest way is via Docker:
```bash
cd backend
docker-compose up -d
```

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The application will be accessible at:
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

## ⚙️ Environment Variables
Ensure the following variables are present in your backend `.env`:
- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: Secret key for signing auth tokens.
- `VONAGE_API_KEY` & `VONAGE_API_SECRET`: Credentials for SMS delivery.
- `SMTP_USER` & `SMTP_PASS`: Nodemailer configuration for sending emails.
