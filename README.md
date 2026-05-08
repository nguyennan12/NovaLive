<h1 align="center">🛒 Livestream E-Commerce Platform</h1>

<p align="center">
  A full-stack, real-time e-commerce platform with integrated live video selling, multi-vendor support, and complete order-to-payment flows.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-8-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/github/actions/workflow/status/nguyennan12/E-commerce/ci.yml?branch=master&style=flat-square&label=CI" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
  - [Development](#development)
  - [Docker (Full Stack)](#docker-full-stack)
- [API Reference](#api-reference)
- [Available Scripts](#available-scripts)
- [CI/CD](#cicd)
- [Roadmap](#roadmap)

---

## Overview

This platform combines live video streaming with a fully featured e-commerce experience. Sellers can host live sessions to showcase and sell products in real time, while buyers can browse, add to cart, apply discounts, and complete purchases through multiple payment channels — all within the same application.

**Key characteristics:**
- Monorepo architecture with Yarn Workspaces (`apps/backend`, `apps/frontend`)
- Event-driven backend using RabbitMQ for async inventory and order processing
- Containerized with Docker Compose; production-ready with multi-stage builds
- Full CI pipeline on GitHub Actions: lint → test → build → docker

---

## Features

### Consumer
- **Product Catalog** — Browse products with full-text search (Elasticsearch), category filtering, and multiple layout views
- **Product Detail** — SKU-based variant selection, attributes, seller info, and reviews
- **Shopping Cart** — Per-shop line items, quantity controls, real-time price summary, shop-level and global discount application
- **Checkout & Orders** — Address management with GHN cascading dropdown, real-time shipping fee calculation, voucher application, and order submission
- **Payment** — VNPay redirect flow with IPN callback verification; COD with email OTP confirmation
- **Live Sessions** — Watch and interact with live selling streams powered by Agora

### Seller / Shop
- **Product Management** — Create, update, and organize products with variant support
- **Inventory Management** — Track stock, import/export history, and inventory statistics
- **Discount & Voucher Management** — Create shop-specific and global discount codes
- **Live Session Management** — Start, manage, and end live selling sessions with Agora token generation

### System
- **RBAC** — Role-based access control (`accesscontrol`) enforced on every route
- **Inventory Locking** — Stock reserved at order time; auto-released on cancellation or VNPay timeout
- **Real-time Events** — Socket.io for live notifications and streaming events
- **Async Processing** — RabbitMQ queues decouple order events from inventory and notification processing
- **Logging** — Structured Winston logs with daily rotation

---

## Tech Stack

### Frontend
| Technology | Role |
|---|---|
| **React 19** | UI framework (function components + hooks) |
| **Vite 8** | Dev server and production build tool |
| **Redux Toolkit** | Global client state (cart, auth, user session) |
| **redux-persist** | Persist Redux state across page reloads |
| **TanStack React Query v5** | Server state management, caching, refetching, and mutations |
| **Axios** | HTTP client used within all API service layers |
| **Material UI v9** | Primary component library; custom theme applied globally |
| **@emotion/styled** | CSS-in-JS for keyframe animations and pseudo-element styling |
| **react-hook-form** | Performant form state management and validation |
| **react-router-dom v7** | Client-side routing |
| **recharts** | Data visualization for analytics and dashboard charts |
| **react-toastify** | Toast notification system for API feedback and errors |
| **Agora RTC SDK** | Live video streaming and real-time audio/video communication |

### Backend
| Technology | Role |
|---|---|
| **Node.js 20** | JavaScript runtime |
| **Express 5** | REST API web framework |
| **Socket.io v4** | WebSocket layer for real-time events and live stream signaling |
| **Mongoose** | MongoDB ODM with schema definition and query builder |
| **jsonwebtoken** | Stateless auth via JWT access/refresh tokens |
| **bcrypt** | Password hashing |
| **accesscontrol** | RBAC enforcement at route level |
| **Joi** | Request schema validation at API boundary |
| **Multer + Cloudinary** | File upload middleware and cloud image storage |
| **Nodemailer + Brevo** | Transactional emails (OTP, order confirmations) |
| **Winston** | Structured logging with daily file rotation |
| **Swagger** | Auto-generated interactive API documentation |
| **amqplib** | RabbitMQ client for publishing and consuming async messages |
| **redis** | Redis client for caching and OTP/session storage |

### Database
| Technology | Role |
|---|---|
| **MongoDB 8** | Primary NoSQL document database for all domain data |
| **Redis 7** | In-memory caching layer for sessions, OTPs, and rate limiting |

### Infrastructure & System Components
| Technology | Role |
|---|---|
| **Redis** | Caching layer for short-lived data (OTPs, session tokens, rate limits) |
| **RabbitMQ** | Message broker for async processing (order events, inventory release on cancel/timeout) |
| **Elasticsearch 8** | Full-text search engine for product and content search |
| **Socket.io** | Real-time pub/sub event bus for live sessions and notifications |
| **Agora.io** | External platform providing live streaming infrastructure |
| **Nginx** | Reverse proxy and static file server for the React SPA with gzip and long-term cache headers |
| **VNPay** | Vietnamese online payment gateway — redirect + IPN callback flow |
| **GHN (Giao Hàng Nhanh)** | Shipping fee calculation and delivery management API |
| **Cloudinary** | Cloud-based image and media hosting |

### DevOps / Deployment
| Technology | Role |
|---|---|
| **Docker** | Containerizes both services, ensuring consistent environments across dev and production |
| **Docker Compose** | Orchestrates the full local stack: API, React/Nginx, MongoDB, Redis, Elasticsearch, RabbitMQ |
| **GitHub Actions** | CI/CD — lint, integration tests, Vite build, and Docker production build on every push |
| **Multi-stage Dockerfile** | Optimized images: `node:20-alpine` for build, `nginx:stable-alpine` for serving |

### Dev Tools
| Technology | Role |
|---|---|
| **Yarn Workspaces** | Monorepo package management |
| **ESLint** | Linting enforced on both frontend and backend |
| **Prettier** | Code formatting integrated with ESLint |
| **Nodemon** | Auto-restarts Express on file changes in development |
| **Jest** | Unit and integration testing framework |
| **Supertest** | HTTP assertion library for backend integration tests |
| **mongodb-memory-server** | In-memory MongoDB for isolated unit tests |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│              React 19 + Vite + Redux + React Query           │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP / WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Nginx (Port 80)                          │
│             Serves SPA static assets + reverse proxy        │
└───────────────────────────┬─────────────────────────────────┘
                            │ REST + Socket.io
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               Express API Server (Port 3031)                 │
│         REST /v1/* · Socket.io · JWT Auth · RBAC            │
└───┬──────────┬───────────┬────────────┬──────────────┬──────┘
    │          │           │            │              │
    ▼          ▼           ▼            ▼              ▼
MongoDB     Redis      RabbitMQ   Elasticsearch   Agora.io
(primary   (cache,    (async msg  (full-text      (livestream
 database)  OTPs)      broker)     search)         platform)
```

**Request flow for order placement:**
1. Client submits order → Express validates (Joi) and checks RBAC
2. Inventory is locked atomically in MongoDB
3. Order event published to RabbitMQ
4. Consumer processes: confirms inventory, triggers email via Nodemailer
5. For VNPay: redirect URL returned → IPN callback verifies hash → confirms/releases inventory
6. For COD: OTP sent via email → client confirms OTP → order activated

---

## Project Structure

```
livestream-ecommerce/
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions CI pipeline
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── modules/            # Domain modules (module-based architecture)
│   │   │   │   ├── address/        # controllers · models · repos · routes · services
│   │   │   │   ├── auth/           # access, token, otp services + user repo
│   │   │   │   ├── cart/
│   │   │   │   ├── category/       # category + attribute (models, services, routes)
│   │   │   │   ├── common/         # email · socket · upload (shared services)
│   │   │   │   ├── discount/
│   │   │   │   ├── flashSale/
│   │   │   │   ├── inventory/      # inventory + history
│   │   │   │   ├── live/           # livestream session lifecycle
│   │   │   │   ├── order/
│   │   │   │   ├── payment/        # VNPay + COD OTP flow
│   │   │   │   ├── product/        # SPU + SKU
│   │   │   │   ├── rbac/           # roles, resources, grants
│   │   │   │   ├── shipping/       # GHN fee calculation
│   │   │   │   └── shop/
│   │   │   ├── shared/             # Cross-module utilities (alias: #shared/*)
│   │   │   │   ├── core/           # ApiError, ApiSuccess response wrappers
│   │   │   │   ├── helpers/        # auth, agora, file, object, order helpers
│   │   │   │   ├── middlewares/    # authentication, RBAC, validation, error
│   │   │   │   └── utils/          # constants, converter, generator, data utils
│   │   │   ├── infrastructure/     # External system integrations (alias: #infrastructure/*)
│   │   │   │   ├── config/         # mongodb, redis, nodemailer, RBAC, environment, swagger
│   │   │   │   ├── database/       # init.mongodb, init.redis, init.rabbitMQ, init.elasticsearch
│   │   │   │   ├── loggers/        # Winston logger
│   │   │   │   ├── lua/            # Lua scripts for Redis atomic operations
│   │   │   │   ├── scripts/        # One-time setup scripts (Elasticsearch index)
│   │   │   │   └── workers/        # RabbitMQ consumer workers (order, inventory)
│   │   │   └── app.js              # Express app entry point
│   │   ├── tests/
│   │   │   ├── helpers/            # appFactory, auth helpers, RBAC seed
│   │   │   ├── integration/        # auth · full-flow · livestream · vnpay · rbac
│   │   │   ├── mocks/              # redis.mock.js
│   │   │   └── jest.setup.js       # MongoMemoryServer + env setup
│   │   ├── jest.config.cjs
│   │   ├── Dockerfile
│   │   └── package.json
│   └── frontend/
│       ├── src/
│       │   ├── common/
│       │   │   ├── apis/services/  # Axios API service functions per domain
│       │   │   ├── components/     # Shared UI (layout, AppBar, Sidebar, Footer)
│       │   │   ├── hooks/          # Shared custom hooks
│       │   │   └── utils/          # Query string builders, formatters
│       │   ├── features/           # Feature modules (one folder per domain)
│       │   │   ├── Address/
│       │   │   ├── Auth/
│       │   │   ├── Cart/
│       │   │   ├── Discount/
│       │   │   ├── Home/
│       │   │   ├── Inventory/
│       │   │   ├── LiveSession/
│       │   │   ├── Order/
│       │   │   ├── Product/
│       │   │   ├── Review/
│       │   │   └── Shop/
│       │   ├── store/              # Redux Toolkit slices (cart, user, discount, product)
│       │   ├── routers/            # React Router route definitions
│       │   └── main.jsx            # App entry: Redux + QueryClient + ThemeProvider
│       ├── Dockerfile
│       ├── nginx.conf
│       └── package.json
├── docker-compose.yml
├── package.json                    # Yarn workspace root
└── .env                            # Root environment variables
```

### Backend path aliases (`package.json` imports)

| Alias | Resolves to |
|---|---|
| `#modules/*` | `src/modules/*` |
| `#shared/*` | `src/shared/*` |
| `#infrastructure/*` | `src/infrastructure/*` |

---

## Getting Started

### Prerequisites

- **Node.js** >= 20
- **Yarn** >= 1.22
- **Docker** + **Docker Compose** (for full stack)

### Installation

```bash
# Clone the repository
git clone https://github.com/nguyennan12/NovaLive.git
cd NovaLive

# Install all workspace dependencies
yarn install
```

### Environment Variables

Create a `.env` file at the project root. All required keys are listed below — do **not** commit actual values.

```env
# ── Server ──────────────────────────────────────────────────
PORT=3031
HOST=localhost
BASE_URL_LOCAL=http://localhost:3031

# ── MongoDB ─────────────────────────────────────────────────
DEV_MONGODB_URI=mongodb://localhost:27017/livestream_ecommerce
DEV_MONGODB_MAX_POOL_SIZE=10
PRO_MONGODB_URI=
PRO_MONGODB_MAX_POOL_SIZE=

# ── Redis ────────────────────────────────────────────────────
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# ── Elasticsearch ────────────────────────────────────────────
ELASTIC_HOST=localhost
ELASTIC_PORT=9200
ELASTIC_USER_NAME=elastic
ELASTIC_PASSWORD=
KIBANA_PASSWORD=

# ── RabbitMQ ─────────────────────────────────────────────────
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER_NAME=guest
RABBITMQ_PASSWORD=

# ── JWT ──────────────────────────────────────────────────────
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

# ── Email (Brevo SMTP) ───────────────────────────────────────
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=
BREVO_SMTP_PASS=
EMAIL_FROM=

# ── Cloudinary ───────────────────────────────────────────────
CLOUDINAY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# ── VNPay ────────────────────────────────────────────────────
VNP_TMN_CODE=
VNP_HASH_SECRET=
VNP_URL=
VNP_RETURN_URL=

# ── GHN (Giao Hàng Nhanh) ───────────────────────────────────
GHN_API_TOKEN=
GHN_API_URL=
GHN_SHOP_ID=

# ── Agora ────────────────────────────────────────────────────
AGORA_APP_ID=
AGORA_APP_CERTIFICATE=
```

Frontend (`apps/frontend/.env`):

```env
VITE_API_URL=http://localhost:3031
VITE_AGORA_APP_ID=
VITE_GHN_API_TOKEN=
VITE_GHN_API_URL=
```

---

## Running the Application

### Development

Run backend and frontend independently in separate terminals:

```bash
# Backend (hot-reload via Nodemon)
yarn workspace livestream-ecommerce dev

# Frontend (Vite dev server)
yarn workspace livestream-ecommerce-frontend dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:80 |
| Backend API | http://localhost:3031 |
| Swagger Docs | http://localhost:3031/api-docs |

> **Note:** For local development without Docker, ensure MongoDB, Redis, Elasticsearch, and RabbitMQ are running locally or update the `.env` to point to existing instances.

### Docker (Full Stack)

Spin up the entire platform — API, frontend, MongoDB, Redis, Elasticsearch, and RabbitMQ — with a single command:

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend (Nginx) | http://localhost:80 |
| Backend API | http://localhost:3031 |
| MongoDB | localhost:27017 |
| Redis | localhost:6379 |
| Elasticsearch | http://localhost:9200 |
| RabbitMQ Management UI | http://localhost:15672 |

To stop and clean up:

```bash
docker compose down -v
```

---

## API Reference

All endpoints are versioned under `/v1`. Interactive documentation is available at `/api-docs` when the server is running.

| Router | Prefix | Description |
|---|---|---|
| Access | `/v1/access` | Register, login, refresh token, logout |
| Product | `/v1/product` | CRUD for products and variants |
| Category | `/v1/category` | Product category management |
| Attribute | `/v1/attribute` | Product attribute definitions |
| Inventory | `/v1/inventory` | Stock management and import/export |
| Inventory History | `/v1/inventoryHistory` | Audit log of stock changes |
| Cart | `/v1/cart` | Add, update, remove cart items |
| Discount | `/v1/discount` | Create and validate discount codes |
| Order | `/v1/order` | Place and manage orders |
| Payment | `/v1/payment` | VNPay redirect, IPN callback, COD OTP |
| Address | `/v1/address` | User delivery address CRUD |
| Shop | `/v1/shop` | Shop profile and settings |
| Livestream | `/v1/livestream` | Session lifecycle and Agora token generation |
| Upload | `/v1/upload` | Image upload to Cloudinary |
| RBAC | `/v1/rbac` | Role and permission management |

---

## Available Scripts

### Backend (`apps/backend`)

```bash
yarn dev          # Start dev server with hot reload (Nodemon)
yarn pro          # Start production server
yarn test         # Run all tests
yarn test:watch   # Run tests in watch mode
yarn test:cov     # Run tests with coverage report
yarn lint         # Run ESLint
yarn swagger      # Regenerate Swagger documentation
```

### Frontend (`apps/frontend`)

```bash
yarn dev          # Start Vite dev server
yarn build        # Build for production
yarn preview      # Preview the production build locally
yarn lint         # Run ESLint
```

---

## CI/CD

The GitHub Actions pipeline (`.github/workflows/ci.yml`) runs on every push and pull request to `master`.

```
Push / PR to master
        │
        ├── lint-backend    → yarn lint (Express app)
        ├── lint-frontend   → yarn lint (React app)
        ├── test-backend    → yarn test:cov (Jest + Supertest, in-memory MongoDB)
        └── build-frontend  → yarn build (Vite production build)
                │
                └── [master push only]
                        └── docker-build → docker compose build (production images)
```

All jobs run on `ubuntu-latest` with Node.js 20 and Yarn caching enabled.

---

## Roadmap

| Status | Feature |
|---|---|
| ✅ | Auth UI (login / register) |
| ✅ | Product management (CRUD, variants, attributes) |
| ✅ | Inventory management + history |
| ✅ | Discount & voucher system |
| ✅ | Live session management (Agora) |
| ✅ | Home page (banner, categories, product listings) |
| ✅ | Product detail page |
| ✅ | Shopping cart with real-time summary |
| ✅ | Checkout — address (GHN), shipping fee, voucher, payment method |
| ✅ | COD flow with email OTP confirmation |
| ✅ | VNPay redirect + IPN callback + inventory lock/release |
| ✅ | RBAC on all routes + integration tests + CI |
| ⬜ | Order list & order detail pages |
| ⬜ | VNPay return page (post-payment status) |
| ⬜ | Customer profile & address management |
| ⬜ | Admin dashboard & analytics (recharts) |
