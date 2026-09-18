# E-Commerce Backend Architecture & Technical Details

## 1. Overview
The backend of this e-commerce platform is a RESTful API built using Node.js and Express. It uses Prisma as an ORM to interact with a PostgreSQL database and implements JSON Web Tokens (JWT) for secure user authentication and role-based access control.

## 2. Technology Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (jsonwebtoken) & bcryptjs (password hashing)

## 3. Directory Structure
```text
backend/
├── prisma/
│   └── schema.prisma       # Database schema definition for Prisma
├── src/
│   ├── controllers/
│   │   └── auth.ts         # Handles logic for register and login
│   ├── middlewares/
│   │   └── authMiddleware.ts # Protects routes (JWT verification, Admin checks)
│   ├── routes/
│   │   └── auth.ts         # Express route definitions for authentication
│   ├── utils/
│   │   └── db.ts           # Initializes and exports the Prisma Client instance
│   └── index.ts            # Entry point of the Express application
├── .env                    # Environment variables (Database URL, JWT Secret)
├── docker-compose.yml      # (Optional) Docker setup for Postgres and Redis
├── package.json            # Project dependencies and npm scripts
└── tsconfig.json           # TypeScript compiler configuration
```

## 4. Database Schema
The database uses PostgreSQL and is managed via Prisma. Here are the core models and their relationships:

- **User**: Stores customer and admin details. Has a one-to-many relationship with `Order` and `Address`, and a one-to-one relationship with `Cart`.
  - Fields: `id`, `name`, `email`, `passwordHash`, `role` (CUSTOMER | ADMIN), `createdAt`
- **Category**: Supports a hierarchical category structure for products.
  - Fields: `id`, `name`, `slug`, `parentId` (for sub-categories)
- **Product**: Core product information.
  - Fields: `id`, `name`, `slug`, `description`, `price`, `stockQuantity`, `categoryId`, `images`, `isActive`
- **Cart & CartItem**: Manages shopping carts before checkout.
  - Cart: `id`, `userId`, `sessionId`
  - CartItem: `id`, `cartId`, `productId`, `quantity`, `unitPrice`
- **Order & OrderItem**: Records completed purchases.
  - Order: `id`, `userId`, `status` (PENDING | PAID | SHIPPED | DELIVERED | CANCELLED), `totalAmount`, `shippingAddressId`
  - OrderItem: `id`, `orderId`, `productId`, `quantity`, `unitPrice`, `subtotal`
- **Address**: Stores shipping addresses for users.
  - Fields: `id`, `userId`, `line1`, `line2`, `city`, `state`, `postalCode`, `country`, `isDefault`

## 5. Security & Authentication
- **Passwords**: Hashed with a generated salt before being stored in the database using `bcryptjs`.
- **Tokens**: On successful login/registration, a JWT is issued with a 1-hour expiration.
- **Middlewares**:
  - `authenticateJWT`: Extracts the token from the `Authorization` header, verifies it, and attaches the user payload to the request.
  - `requireAdmin`: Checks if the authenticated user has an `ADMIN` role.

## 6. Current API Endpoints

### Authentication
- `POST /api/auth/register`: Creates a new user account. Returns user data and JWT.
- `POST /api/auth/login`: Authenticates an existing user. Returns user data and JWT.

### System
- `GET /api/health`: Basic health check endpoint returning `{"status": "ok"}`.

