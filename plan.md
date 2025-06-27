

---

## 🔧 Phase 1: Project Setup & Planning

### 1.1 Project Planning

* Define user flow and app structure (Login → Dashboard → Add/View/Delete → Summary).
* Create wireframes/UI mockups (use Figma or Pen & Paper).
* Choose a color scheme (light violet + dark mode).

### 1.2 Initialize Environment

* Create GitHub repo and project folder.
* Initialize `Next.js` frontend with TypeScript.
* Setup Tailwind CSS with custom theme (light violet + dark mode).
* Initialize `Express.js` backend server.
* Connect backend to MongoDB (Atlas preferred for remote dev).

---

## ⚙️ Phase 2: Backend Development (Express.js + MongoDB)

### 2.1 Authentication API

* Register user (`POST /api/register`)
* Login user with JWT (`POST /api/login`)
* Middleware for JWT auth (`authMiddleware`)
* Logout (handled on client side by removing token)

### 2.2 Expense/Income API

* `POST /api/transaction` – Add transaction
* `GET /api/transactions` – Fetch all (filterable by user, type)
* `DELETE /api/transaction/:id` – Delete transaction

### 2.3 User Summary & Dashboard API

* `GET /api/summary` – Return totals, charts data
* `GET /api/dashboard` – Return recent transactions, chart trends

---

## 🧑‍🎨 Phase 3: Frontend Development (Next.js + Tailwind CSS)

### 3.1 Layout Setup

* Create shared `Layout`, `Header`, `Sidebar` components
* Implement dark mode toggle with `useTheme` or `next-themes`
* Setup Tailwind color config (`light-violet`, `gray-900`, etc.)

### 3.2 Authentication Pages

* `RegisterPage.tsx` – Form + API integration
* `LoginPage.tsx` – Form + Token storage in cookies/localStorage
* Authenticated route protection using `getServerSideProps`

### 3.3 Main Pages

* `DashboardPage.tsx` – Overview, recent activity, graphs
* `TransactionsPage.tsx` – List of income & expenses, filter by type/date
* `AddTransactionPage.tsx` – Form for income/expense
* `SummaryPage.tsx` – Graphs, stats (monthly/yearly breakdown)

### 3.4 Components

* `TransactionCard.tsx`
* `Graph.tsx` using Recharts/Chart.js
* `ThemeToggle.tsx`
* `StatsBox.tsx` (for summary)
* `Modal.tsx` for confirm delete

---

## 📊 Phase 4: Charts & Data Visualization

### 4.1 Graphs

* Use `Chart.js` or `Recharts` for:

  * Income vs Expense over time
  * Pie chart of category-wise spending
  * Monthly trend line graph

### 4.2 Data Summary

* Total income/expense
* Highest expense category
* Spending trends

---

## 🔒 Phase 5: Security & Optimization

### 5.1 Security

* Use Helmet & rate-limiter on Express backend
* Password hashing using bcrypt
* Secure JWT token handling
* CSRF protection (if required)

### 5.2 Optimization

* Lazy loading components
* Server-side rendering or static props where needed
* Bundle analysis (`next build` analyzer)

---

## 🚀 Phase 6: Deployment

### 6.1 Backend Deployment

* Host Express API on Render / Railway / Fly.io
* Use `.env` securely for MongoDB URI, JWT secret

### 6.2 Frontend Deployment

* Host Next.js app on Vercel or Netlify
* Connect domain
* Set up environment variables for API base URL

---

## ✅ Phase 7: Final Touches

### 7.1 QA & Testing

* Manual test on mobile + desktop (responsive layout)
* Check all user flows: login → dashboard → add → delete → logout
* Cross-browser testing

### 7.2 Extra Features (Optional)

* Search/filter by category
* Export to PDF/CSV
* Notification system
* Recurring transactions

---
