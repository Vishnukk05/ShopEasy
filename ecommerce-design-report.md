E-COMMERCE WEBSITE
                           │
              ┌────────────┴────────────┐
              │                         │
           CUSTOMER                    ADMIN
              │                         │
        ┌─────┴─────┐             ┌────┴─────┐
        │           │             │          │
      Login       Register       Products   Orders
        │
        ▼
     Home Page
        │
   ┌────┼───────────────┐
   │    │               │
Products Categories   Search
   │
   ▼
Product Details
   │
   ▼
Add to Cart
   │
   ▼
Cart
   │
   ▼
Checkout
   │
   ▼
Order Confirmation
   │
   ▼
My Orders# E-Commerce Website — Detailed Technical Design Report

## 1. Project Overview

This report expands the given site map into a full technical design covering frontend architecture, backend architecture, database schema, UI/UX design, deployment, and testing strategy.

**Confirmed scope (from site map):**

- **Customer side:** Login, Register, Home, Products, Categories, Search, Product Details, Add to Cart, Cart, Checkout, Order Confirmation, My Orders
- **Admin side:** Products management, Orders management

---

## 2. System Architecture (High Level)

```
┌─────────────┐      HTTPS/REST (JSON)      ┌──────────────┐
│  Frontend    │ ─────────────────────────▶ │   Backend     │
│  (SPA/SSR)   │ ◀───────────────────────── │   (API)       │
└─────────────┘                              └──────┬───────┘
                                                      │
                                    ┌─────────────────┼─────────────────┐
                                    ▼                 ▼                 ▼
                              ┌──────────┐     ┌────────────┐    ┌────────────┐
                              │ Database │     │   Cache     │    │  Storage    │
                              │(Postgres)│     │  (Redis)    │    │ (S3/Cloud)  │
                              └──────────┘     └────────────┘    └────────────┘
                                                      │
                                              ┌───────┴────────┐
                                              │ Payment Gateway │
                                              │ (Stripe/Razorpay)│
                                              └────────────────┘
```

**Recommended stack**

| Layer | Technology |
|---|---|
| Frontend | React (Next.js) |
| State management | Redux Toolkit / Zustand |
| Backend | Node.js (Express/NestJS) or Django/FastAPI |
| Database | PostgreSQL |
| Cache/Session | Redis |
| File storage | AWS S3 / Cloudinary |
| Auth | JWT + refresh tokens |
| Payments | Stripe / Razorpay |
| Deployment | Docker + AWS/DigitalOcean/Vercel |
| CI/CD | GitHub Actions |

---

## 3. Frontend Design

### 3.1 Page/Route Map

| Route | Page | Access |
|---|---|---|
| `/` | Home | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/products` | Product Listing | Public |
| `/categories/:id` | Category Listing | Public |
| `/search?q=` | Search Results | Public |
| `/products/:id` | Product Details | Public |
| `/cart` | Cart | Authenticated (or guest cart) |
| `/checkout` | Checkout | Authenticated |
| `/order-confirmation/:orderId` | Order Confirmation | Authenticated |
| `/account/orders` | My Orders | Authenticated |
| `/admin/products` | Product Management | Admin |
| `/admin/orders` | Order Management | Admin |

### 3.2 Component Breakdown

**Shared/Layout**
- `Navbar` (logo, search bar, cart icon w/ count, account menu)
- `Footer`
- `ProtectedRoute` (customer) / `AdminRoute` (admin, role-guarded)
- `Toast/Notification` system
- `LoadingSpinner`, `ErrorBoundary`

**Customer Components**
- `LoginForm`, `RegisterForm` (with client-side validation)
- `ProductCard`, `ProductGrid`, `ProductFilterSidebar` (price, category, rating)
- `SearchBar` with debounce + autocomplete
- `ProductGallery`, `ProductInfo`, `AddToCartButton`, `QuantitySelector`
- `CartItem`, `CartSummary`, `PromoCodeInput`
- `CheckoutSteps` (Shipping → Payment → Review)
- `AddressForm`, `PaymentForm`
- `OrderConfirmationCard`
- `OrderHistoryTable`, `OrderDetailModal`

**Admin Components**
- `AdminSidebar`
- `ProductTable` (CRUD, pagination, bulk actions)
- `ProductForm` (create/edit, image upload)
- `OrderTable` (filter by status), `OrderStatusUpdater`

### 3.3 State Management

- **Auth state:** current user, token, role — persisted in memory + httpOnly cookie/localStorage refresh token
- **Cart state:** items, quantities, totals — persisted in localStorage for guests, synced to backend on login
- **Product/catalog state:** fetched via React Query/SWR for caching + revalidation
- **UI state:** modals, filters, pagination — local component state

### 3.4 Key Frontend Concerns

- Debounced search with loading/empty states
- Optimistic UI updates for cart add/remove
- Form validation (React Hook Form + Zod/Yup)
- Responsive design (mobile-first, breakpoints for tablet/desktop)
- SEO for product/category pages (SSR or static generation via Next.js)
- Image optimization (lazy loading, `next/image`)
- Accessibility (keyboard nav, ARIA labels on forms/buttons)

---

## 4. Backend Design

### 4.1 Service Layers

```
Routes → Controllers → Services → Repositories/ORM → Database
                ↓
          Middleware (auth, validation, rate-limit, error handling)
```

### 4.2 API Endpoints

**Auth**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

**Products (Public)**
- `GET /api/products` (filters: category, price range, search, sort, pagination)
- `GET /api/products/:id`
- `GET /api/categories`

**Cart**
- `GET /api/cart`
- `POST /api/cart/items`
- `PUT /api/cart/items/:itemId`
- `DELETE /api/cart/items/:itemId`

**Checkout / Orders**
- `POST /api/checkout` (validates cart, calculates totals, creates payment intent)
- `POST /api/orders` (finalizes order after payment success)
- `GET /api/orders` (current user's orders)
- `GET /api/orders/:id`

**Admin (role-guarded)**
- `POST /api/admin/products`
- `PUT /api/admin/products/:id`
- `DELETE /api/admin/products/:id`
- `GET /api/admin/orders`
- `PUT /api/admin/orders/:id/status`

### 4.3 Middleware

- JWT verification + role check (`customer` vs `admin`)
- Request validation (Zod/Joi/DTO schemas)
- Centralized error handler → consistent JSON error shape
- Rate limiting on auth and checkout endpoints
- CORS, Helmet (security headers), input sanitization

### 4.4 Business Logic Highlights

- **Cart merge on login:** merge guest localStorage cart into user cart
- **Stock check:** validate inventory at add-to-cart and again at checkout (prevent overselling)
- **Order creation:** atomic transaction — decrement stock, create order, create order_items, clear cart
- **Payment:** create payment intent server-side, confirm via webhook, only mark order "paid" on verified webhook event (never trust client-side success alone)

---

## 5. Database Design

### 5.1 Core Tables

**users**
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| name | varchar | |
| email | varchar, unique | |
| password_hash | varchar | |
| role | enum('customer','admin') | |
| created_at | timestamp | |

**categories**
| id (PK) | name | slug | parent_id (nullable, self-FK) |

**products**
| Column | Type |
|---|---|
| id (PK) | UUID |
| name | varchar |
| slug | varchar, unique |
| description | text |
| price | numeric(10,2) |
| stock_quantity | integer |
| category_id | FK → categories |
| images | jsonb / separate `product_images` table |
| is_active | boolean |
| created_at, updated_at | timestamp |

**carts**
| id (PK) | user_id (FK, nullable for guest) | session_id (for guest) | created_at |

**cart_items**
| id (PK) | cart_id (FK) | product_id (FK) | quantity | unit_price (snapshot) |

**orders**
| Column | Type |
|---|---|
| id (PK) | UUID |
| user_id | FK |
| status | enum('pending','paid','shipped','delivered','cancelled') |
| total_amount | numeric |
| shipping_address_id | FK |
| payment_id | varchar (gateway reference) |
| created_at | timestamp |

**order_items**
| id (PK) | order_id (FK) | product_id (FK) | quantity | unit_price | subtotal |

**addresses**
| id (PK) | user_id (FK) | line1 | line2 | city | state | postal_code | country | is_default |

### 5.2 Relationships (ER summary)

```
users 1───∞ orders
users 1───∞ addresses
users 1───1 carts
categories 1───∞ products
carts 1───∞ cart_items ∞───1 products
orders 1───∞ order_items ∞───1 products
orders ∞───1 addresses
```

### 5.3 Indexing

- `products(category_id)`, `products(slug)` unique
- `products` full-text index on `name, description` for search (Postgres `tsvector` or Elasticsearch if scale requires)
- `orders(user_id, created_at)` for "My Orders" queries
- `cart_items(cart_id)`

---

## 6. UI/UX Design

### 6.1 Design System Basics

- **Typography:** one primary sans-serif (e.g., Inter), clear scale (H1–H6, body, caption)
- **Color:** primary brand color, neutral grays, semantic colors (success/error/warning) for stock and order status badges
- **Components:** consistent button variants (primary/secondary/danger), input fields with visible validation states, card components for products

### 6.2 Key Screens (wireframe intent)

- **Home:** hero banner, featured categories, featured/trending products grid
- **Product Listing:** left filter sidebar + grid, sort dropdown, pagination/infinite scroll
- **Product Details:** image gallery left, info + add-to-cart right, related products below
- **Cart:** line items with quantity steppers, order summary sidebar, sticky checkout CTA
- **Checkout:** stepper UI (Shipping → Payment → Review) to reduce cognitive load
- **My Orders:** table/list with status badges, expandable order detail
- **Admin dashboard:** sidebar nav, data tables with search/filter/pagination, modal forms for create/edit

### 6.3 UX Principles Applied

- Minimize checkout steps/fields (guest checkout option recommended)
- Persistent cart across sessions
- Clear stock/availability signals on product cards
- Order status visibility at every stage (confirmation email + in-app status)

---

## 7. Deployment Architecture

### 7.1 Environments

- **Development:** local Docker Compose (frontend, backend, Postgres, Redis)
- **Staging:** mirrors production, used for QA sign-off
- **Production:** cloud-hosted

### 7.2 Suggested Infrastructure

```
                    ┌────────────┐
 Users ──HTTPS──▶  │  CDN/Edge   │ (static assets, images)
                    └─────┬──────┘
                          ▼
                  ┌───────────────┐
                  │ Load Balancer  │
                  └───────┬───────┘
                          ▼
              ┌───────────────────────┐
              │  App Servers (Docker)  │  (Frontend: Vercel/Netlify
              │  Backend API (N nodes) │   or same container cluster)
              └───────────┬───────────┘
                          ▼
            ┌─────────────┴─────────────┐
            ▼                           ▼
     ┌─────────────┐            ┌──────────────┐
     │ Postgres RDS │            │ Redis Cache   │
     └─────────────┘            └──────────────┘
```

- **Frontend:** deploy on Vercel/Netlify (if Next.js) for CDN + SSR support
- **Backend:** containerize with Docker, deploy on AWS ECS/EKS, DigitalOcean App Platform, or Render
- **Database:** managed Postgres (AWS RDS / Supabase / Neon)
- **Static assets/images:** S3 + CloudFront (or Cloudinary)
- **Secrets:** environment variables via platform secret manager (never committed)

### 7.3 CI/CD Pipeline (GitHub Actions example)

```
on push to main:
  1. Install deps, lint, run unit tests
  2. Build frontend & backend
  3. Run integration tests against ephemeral test DB
  4. Build Docker images, push to registry
  5. Deploy to staging → run smoke tests
  6. Manual approval gate
  7. Deploy to production
  8. Run post-deploy health check
```

### 7.4 Observability

- Centralized logging (e.g., CloudWatch/ELK)
- Error tracking (Sentry)
- Uptime/health checks on `/api/health`
- Basic metrics dashboard (request rate, error rate, latency — Prometheus/Grafana if self-hosted)

---

## 8. Testing Strategy

### 8.1 Test Pyramid

```
        ▲
       / \        E2E (Cypress/Playwright) — key user journeys
      /---\
     /     \      Integration tests — API endpoints + DB
    /-------\
   /         \    Unit tests — functions, components, services
  /___________\
```

### 8.2 Frontend Testing

- **Unit:** components with Jest + React Testing Library (forms, cart logic, price calculations)
- **Integration:** page-level flows (add to cart updates cart badge, filter updates product list)
- **E2E (Cypress/Playwright):**
  - Register → Login → Browse → Add to Cart → Checkout → Order Confirmation
  - Search returns relevant results
  - Admin creates a product, it appears in customer product list

### 8.3 Backend Testing

- **Unit:** service-layer logic (price totals, stock checks) with Jest/Vitest or PyTest
- **Integration:** API endpoint tests against a test database (Supertest), including auth-protected and admin-only routes
- **Contract tests:** for payment webhook handling (simulate gateway payloads)

### 8.4 Non-Functional Testing

- **Load testing:** k6/Artillery on product listing and checkout endpoints
- **Security testing:** OWASP ZAP scan, dependency vulnerability scan (npm audit/Snyk), auth/role bypass attempts on admin routes
- **Data integrity testing:** concurrent checkout attempts on last-item-in-stock to confirm no overselling

### 8.5 QA Checklist (pre-release)

- [ ] All CRUD operations on products (admin) verified
- [ ] Order status transitions verified end-to-end
- [ ] Cart persists correctly across login/logout
- [ ] Payment success/failure/timeout paths all handled gracefully
- [ ] Mobile responsiveness checked on key breakpoints
- [ ] Role-based access enforced (customer cannot hit `/api/admin/*`)

---

## 9. Suggested Build Order

1. Database schema + backend auth (register/login/JWT)
2. Product & category CRUD (admin) + public listing/search APIs
3. Frontend: Home, Product Listing, Product Details
4. Cart (frontend + backend, guest + logged-in)
5. Checkout + payment integration + order creation
6. My Orders (customer) + Order Management (admin)
7. Polish: search relevance, filters, responsive/UI pass
8. Testing pass (unit → integration → E2E) + deployment pipeline
