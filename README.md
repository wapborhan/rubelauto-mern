# Rubel Auto - Dealership & Showroom Management System (MERN)

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18+-lightgrey.svg?logo=express)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.3+-blue.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4+-purple.svg?logo=vite)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg?logo=mongodb)](https://www.mongodb.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-RTK%20Query-purple.svg?logo=redux)](https://redux-toolkit.js.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-orange.svg?logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4+-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![PrimeReact](https://img.shields.io/badge/PrimeReact-10.9+-06b6d4.svg?logo=primereact)](https://primereact.org/)

**Rubel Auto** is a full-stack MERN automobile dealership and showroom management system. Designed specifically for vehicle dealerships, distributors, and spare parts centers (such as authorized dealers of Runner Automobiles PLC), it provides end-to-end management for leads, vehicle inventory, purchases, credit/cash sales, installment collections, customer documentation, multi-showroom accounting, and staff management.

---

## Table of Contents

- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Overview](#api-overview)
- [Authentication Workflow](#authentication-workflow)
- [Scripts Reference](#scripts-reference)
- [Deployment](#deployment)
- [License](#license)

---

## Features

### 1. Dashboard & Analytics

- Multi-showroom KPIs, sales metrics, and stock overview.
- Specialized dashboards for vehicle showrooms and spare parts departments.

### 2. Lead & Contact Management

- Lead intake with demographic and guarantor details.
- Status tracking from prospective buyer to customer conversion.
- Complete supplier directories for vehicles and spare parts.

### 3. Product & Stock Inventory

- Motorcycle, vehicle, and spare parts catalog.
- Stock distribution and quantity tracking across showroom branches.

### 4. Sales & Installment Management

- **Cash Sales & Credit Sales**: Flexible billing and customer ledger integration.
- **Installment Tracking**: Automated monthly installment generation, installment cards, and payment logs.
- **Vehicle Status Tracking**: Active running contracts and seized/repossessed vehicle management.
- **Return Handling**: Customer return processing with balance updates.

### 5. Purchases & Suppliers

- Vehicle and spare parts purchase orders.
- Supplier ledger and installment/due payment logs.

### 6. Accounts & Financial Control

- Income & expense/cost tracking tagged by showroom and category.
- Fund transfers between accounts and showrooms.
- Daily/monthly financial reports and account balance reconciliation.

### 7. Documentation & Memos

- Vehicle registration, transfer, and customer document archival.
- Printable memos and invoices with instant export to **PDF**, **Excel (XLSX)**, and **CSV**.

### 8. Staff & Permissions

- Staff directory with designations, blood groups, and showroom assignments.
- Role-based permissions (`admin`, `user`) and account activation verification.

---

## System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Client (React + Vite)                │
│  - PrimeReact UI & Tailwind CSS                        │
│  - Redux Toolkit + RTK Query (State & Caching)         │
│  - Redux Persist (Offline & Session Rehydration)       │
│  - Firebase Auth SDK (Client Authentication)           │
└──────────────┬────────────────────────▲────────────────┘
               │ HTTP / REST            │
               ▼                        │ JSON Responses
┌───────────────────────────────────────┴────────────────┐
│                   Server (Node + Express)              │
│  - Helmet (CSP & Security Headers)                     │
│  - Centralized Error Handling & Morgan Logging         │
│  - Modular Route Architecture                          │
└──────────────┬─────────────────────────────────────────┘
               │ Mongoose ODM
               ▼
┌────────────────────────────────────────────────────────┐
│                   MongoDB Database                     │
│  - Users, Customers, Leads, Installments               │
│  - Products, Stocks, Showrooms                         │
│  - Incomes, Costs, Accounts, Suppliers                 │
└────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend

- **Framework**: React 18 with Vite
- **State Management**: Redux Toolkit (RTK) & RTK Query
- **State Persistence**: `redux-persist`
- **UI & Components**: PrimeReact UI library, PrimeIcons, Tailwind CSS
- **Forms**: React Hook Form
- **Navigation**: React Router v6
- **Exports & Printing**: `jspdf`, `jspdf-autotable`, `xlsx`, `file-saver`
- **Authentication**: Firebase Authentication (Email/Password)

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security & Utilities**: Helmet, CORS, Dotenv, Morgan

---

## Directory Structure

```text
rubelauto-mern/
├── config/                  # Server configuration
│   └── dbConnection.js      # MongoDB Mongoose connection
├── controllers/             # Express route controllers
│   ├── accounts.js          # Accounts & transfers
│   ├── cost.js              # Expense management
│   ├── customer.js          # Customer profiles & dues
│   ├── income.js            # Income tracking
│   ├── installment.js       # Installment schedules & payments
│   ├── lead.js              # Customer leads & guarantors
│   ├── parts.js             # Spare parts operations
│   ├── product.js           # Vehicle & parts product catalog
│   ├── showroom.js          # Showrooms and branches
│   ├── stock.js             # Inventory stock levels
│   ├── supplier.js          # Suppliers & supplier payments
│   └── user.js              # User profiles & permissions
├── middlewares/             # Express middlewares (CORS, Helmet, Error handler)
├── models/                  # Mongoose data schemas
├── routers/                 # Modular API route definitions
│   └── routes.js            # Route aggregator
├── client/                  # Frontend Vite + React application
│   ├── public/              # Static public assets
│   ├── src/
│   │   ├── assets/          # Stylesheets and images
│   │   ├── components/      # Shared buttons, dropdowns, exports, spinner
│   │   ├── hooks/           # Custom reusable data hooks
│   │   ├── layout/          # App layout, Header, Sidebar, Auth wrappers
│   │   ├── pages/           # Views (Dashboard, Accounts, Sales, Products, etc.)
│   │   ├── provider/        # AuthProvider & PrivateRoute guards
│   │   ├── redux/           # Redux store & RTK Query API slices
│   │   └── routes/          # Client-side router configuration
│   ├── .env.local           # Client environment variables
│   ├── package.json         # Client dependencies
│   └── vite.config.js       # Vite configuration
├── index.js                 # Server entry point
├── package.json             # Root backend dependencies & scripts
├── vercel.json              # Vercel deployment configuration
└── README.md                # Project documentation
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas cluster)
- [Firebase Project](https://console.firebase.google.com/) for authentication credentials

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/rubelauto-mern.git
   cd rubelauto-mern
   ```

2. **Install backend dependencies:**

   ```bash
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd client
   npm install
   cd ..
   ```

---

## Environment Variables

### 1. Backend (`.env` in the root folder)

Create a `.env` file in the root directory:

```env
PORT=3300
NODE_ENV=development

# Database URIs
DATABASE_LOCAL=mongodb://localhost:27017
DATABASE_PROD=mongodb+srv://<username>:<password>@cluster.mongodb.net/
DB_NAME=db_name

# Database credentials (if applicable)
DATABASE_LOCAL_USERNAME=
DATABASE_LOCAL_PASSWORD=

# Client URLs (CORS)
CLIENT=http://localhost:3000
LOCAL_CLIENT=http://localhost:3000

# Security Tokens
ACCESS_TOKEN_SECRET=your_jwt_secret_token
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 2. Frontend (`client/.env.local`)

Create a `.env.local` file inside the `client/` directory:

```env
# Backend API Base URL
VITE_BASE_URL=http://localhost:3300

# Firebase Configuration
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your-app.firebaseapp.com
VITE_projectId=your-project-id
VITE_storageBucket=your-app.firebasestorage.app
VITE_messagingSenderId=your_messaging_sender_id
VITE_appId=your_firebase_app_id
```

---

## Running the Application

### Development Mode (Both Frontend & Backend)

Run the server and the Vite dev server concurrently from the root directory:

```bash
npm run dev
```

- **Backend API**: Runs at [http://localhost:3300](http://localhost:3300)
- **Frontend Client**: Runs at [http://localhost:3000](http://localhost:3000) (or the port specified by Vite)

### Running Separately

- **Run Backend Only**:
  ```bash
  npm run server
  ```
- **Run Frontend Only**:
  ```bash
  npm run client
  ```

---

## API Overview

All backend routes are prefixed with `/api`:

| Resource Endpoint  | Description                                                    |
| :----------------- | :------------------------------------------------------------- |
| `/api/user`        | User profiles, role assignments, and email lookups             |
| `/api/lead`        | Customer leads and guarantor records                           |
| `/api/customer`    | Customer accounts, installment cards, and active/seized status |
| `/api/installment` | Installment payments and schedule records                      |
| `/api/product`     | Vehicle and product catalog operations                         |
| `/api/stock`       | Showroom inventory quantities                                  |
| `/api/parts`       | Spare parts purchases and sales                                |
| `/api/supplier`    | Vehicle and parts supplier profiles and balances               |
| `/api/showroom`    | Showrooms and dealership branches                              |
| `/api/account`     | Financial accounts and inter-account fund transfers            |
| `/api/income`      | Income transactions                                            |
| `/api/cost`        | Operational expenses and costs                                 |
| `/api/document`    | Customer paperwork and registration archives                   |

---

## Authentication Workflow

```
[User Login] ──► Firebase Auth (Email/Password)
                       │
                       ▼ Success
         [AuthProvider] Captures Firebase User
                       │
                       ▼
        [RTK Query] useGetUserByEmailQuery(email)
                       │
                       ▼ Fetches profile & showroom roles
            [Redux Store] Dispatches setUser
                       │
                       ▼
         [PrivateRoute] Grants Access to Protected App
```

- **Token Persistence**: Firebase securely preserves session tokens across page reloads.
- **Profile Synchronization**: [`AuthProvider`](client/src/provider/AuthProvider.jsx) synchronizes Firebase auth state with MongoDB user profiles and privileges in Redux.
- **Route Guard**: [`PrivateRoute`](client/src/provider/PrivateRoute.jsx) ensures unauthenticated or unauthorized users are safely redirected to `/auth/signin`.

---

## Scripts Reference

### Root Directory

- `npm run dev`: Runs both backend server and client frontend concurrently.
- `npm run server`: Starts the Express server with `nodemon` for auto-restart.
- `npm run client`: Starts the Vite client dev server.
- `npm run build`: Builds the production bundle of the React client into `client/dist`.
- `npm start`: Runs the Node.js production server.

### Client Directory (`/client`)

- `npm run dev`: Starts Vite local dev server.
- `npm run build`: Compiles production assets into `/dist`.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint over JSX/JS source files.

---

## Deployment

### Vercel Deployment

The repository includes a [`vercel.json`](vercel.json) configuration for seamless serverless deployment. Configure the environment variables directly in the Vercel project dashboard.

### Single-Host Production (Node Server)

Build the frontend and run the Express server:

```bash
npm run build
npm start
```

The server serves static files from `client/dist` and handles API requests under `/api/*`.

---

## License

This project is licensed under the [ISC License](LICENSE).
