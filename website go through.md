# ShopEasy V2 - Website Full Go-Through

Welcome to the definitive overview of **ShopEasy V2**, a modern, high-performance, and fully resilient E-Commerce platform. This document serves as the complete tour of every feature, module, and architectural safeguard built into the system.

---

## 🏗️ 1. Storefront & Customer Experience

### 🔍 Advanced Full-Text Search
- **PostgreSQL Full-Text Search**: Shoppers can search for products instantly with high-relevance keyword matching.
- **Dynamic Filters**: Refine search results by Category, Price Range, Minimum Rating, and Availability.
- **Sorting Options**: Sort by newest, price (low-high/high-low), and highest rated.
- **Blazing Fast**: Storefront listing APIs are heavily cached using **Redis** to ensure sub-100ms response times for browsing.

### 🛍️ Product Discovery & Variants
- **Variant Selection**: Detailed product pages featuring size, color, and material variants. 
- **Dynamic Interactions**: Price and stock availability dynamically update on the frontend as the customer changes their selected variant.
- **Out-of-Stock Protection**: The UI automatically disables variant combinations that are currently out of stock.

### ⭐ Verified Customer Reviews
- **Trust-first Reviews**: Only customers who have actually purchased the product can leave a review.
- **Rich Media**: Customers can attach images to their reviews.
- **Moderation**: Admins have full control to moderate, approve, or hide reviews.

### 🔐 Customer Account & Security
- **Multi-device Management**: Customers can view all active sessions and "Logout from all devices" instantly.
- **Order History**: Full visibility into past orders, invoices, and shipment tracking.

---

## 💳 2. Checkout & Order Fulfillment

### 🛒 Resilient Checkout Transactions
- **Transactional Integrity**: When a customer places an order, the system decrements the exact stock from the `Inventory` and `StockMovement` ledgers inside a strict database transaction.
- **Zero Overselling**: Concurrent checkouts are safeguarded. If stock drops to zero during a split-second race condition, the checkout is cleanly aborted.

### 💰 Payments & Automated Billing
- **Webhook Integration**: The system listens for payment gateway success webhooks to automatically mark orders as `PAID`.
- **Instant Invoices**: The exact millisecond a payment clears, a PDF Invoice is securely generated, attached to the order, and made available for download.

### 🚚 Shipping & Logistics
- **Tracking Timelines**: Orders are linked to `Shipment` entities with multi-stage `TrackingEvents` (e.g., *Processing* ➡️ *Dispatched* ➡️ *Out for Delivery*).
- **Automated Notifications**: Customers are automatically queued for Email/SMS notifications via the `NotificationLog` whenever their order status or tracking updates.

---

## 🛡️ 3. Admin & Business Operations

### 📊 Real-Time Analytics Dashboard
- Admins have access to real-time aggregations of **Total Revenue**, **Total Orders**, and **Pending Fulfillments** calculated instantly from the database.

### 🔒 Zero-Trust Admin Security (2FA)
- **Time-based One-Time Passwords (TOTP)**: Admin accounts can enforce strict Two-Factor Authentication. 
- **Partial Login Defense**: If 2FA is enabled, standard password entry only yields a `401 Unauthorized (require2FA: true)` until the exact 6-digit TOTP code is provided, preventing credential stuffing.

### 🕵️ Comprehensive Audit Logging
- **Action Traceability**: Every sensitive action taken by an Admin (e.g., updating user roles, changing product prices, enabling/disabling 2FA) is permanently recorded in the `AuditLog`.
- Logs include the `actorId`, `action` taken, target `entity`, and IP metadata.

---

## 🚀 4. Enterprise-Grade Infrastructure

### 🔄 Active-Mirror Replication (Dual-Writes)
- **Zero-Downtime Replication**: Every time data is updated in the primary database, the application actively mirrors (Dual-Writes) the data to an isolated **Backup Database** project in real-time.
- **Hot-Failover Safeguard**: If the primary database ever crashes or drops connection, the application catches the failure and **instantly auto-routes** all live traffic to the backup database without the web server ever going offline.

### 💾 Automated Schema Backups
- Scheduled via GitHub Actions (`cron`), the platform runs cross-project `pg_dump` and `pg_restore` routines daily to snapshot the entire database into 30-day rolling archives.

### ⚡ Performance & API Security
- **Redis Caching**: `ioredis` wraps the most intensive GET routes, automatically flushing itself when admins edit products or stock changes.
- **Hardened Middleware**: The API is shielded by `Helmet` (setting strict HTTP headers), `express-rate-limit` (blocking DDoS or brute force attempts), and `CORS`. 
- **Structured Logging**: All system logs are written in structured JSON via `Winston` for easy parsing by monitoring tools like Datadog or ELK.
