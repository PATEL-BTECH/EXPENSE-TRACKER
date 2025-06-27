# 💰 Budget Buddy

A modern, full-stack expense tracking web application built with Next.js 15, TypeScript, MongoDB, and Tailwind CSS. Track your income and expenses, manage budgets, and gain insights into your financial habits with beautiful charts and analytics.

## ✨ Features

- 🔐 **User Authentication** - Simple email-based authentication system
- 💸 **Transaction Management** - Add, edit, and categorize income and expenses
- 🏷️ **Category Management** - Create custom categories with icons and colors
- 📊 **Analytics Dashboard** - Visual insights with charts and financial trends
- 🎯 **Budget Tracking** - Set and monitor spending limits
- 📈 **Financial Reports** - Generate detailed reports and export data
- 💱 **Multi-Currency Support** - Support for multiple currencies
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🌙 **Dark/Light Theme** - Theme customization options
- 📄 **Data Export** - Export transactions to CSV format

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful and accessible UI components
- **Recharts** - Data visualization library
- **React Hook Form** - Form handling with validation
- **Zustand** - State management
- **Lucide React** - Beautiful icons

### Backend
- **MongoDB** - NoSQL database
- **Next.js API Routes** - Serverless API endpoints
- **Zod** - Schema validation

### Development & Testing
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/expense-tracker
   MONGODB_DB_NAME=expense-tracker
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### First Time Setup

1. **Login** - Use any email and password to create a demo account
2. **Categories** - Default categories will be created automatically
3. **Add Transactions** - Start adding your income and expenses
4. **Set Budgets** - Create budgets to track your spending limits
5. **View Analytics** - Explore your financial data with charts and insights

### Key Features

#### Dashboard
- Overview of your financial status
- Recent transactions
- Quick stats and balance information

#### Transactions
- Add income and expense transactions
- Categorize transactions with custom categories
- Search and filter transactions
- Edit and delete transactions

#### Categories
- Create custom categories for income and expenses
- Choose from various icons and colors
- Organize transactions by category

#### Budgets
- Set monthly, weekly, or yearly budgets
- Track spending against budget limits
- Get alerts when approaching limits
- Visual progress indicators

#### Analytics
- Expense breakdown by category
- Monthly income vs expense trends
- Top spending categories
- Financial insights and recommendations

#### Reports
- Generate detailed financial reports
- Filter by date range, category, or type
- Export data to CSV format
- Summary statistics

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── transactions/      # Transactions page
│   ├── categories/        # Categories page
│   ├── budgets/          # Budgets page
│   ├── analytics/        # Analytics page
│   ├── reports/          # Reports page
│   └── settings/         # Settings page
├── components/            # Reusable components
│   ├── ui/               # Shadcn/ui components
│   └── ...               # Custom components
├── contexts/             # React contexts
├── lib/                  # Utility functions and configurations
├── types/                # TypeScript type definitions
└── __tests__/            # Test files
```

## 🔧 Configuration

### MongoDB Setup

The application uses MongoDB for data storage. You can use either:

1. **Local MongoDB** - Install MongoDB locally
2. **MongoDB Atlas** - Use MongoDB's cloud service
3. **Docker** - Run MongoDB in a container

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/expense-tracker` |
| `MONGODB_DB_NAME` | Database name | `expense-tracker` |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret for authentication | Required |
| `NODE_ENV` | Environment mode | `development` |

## 📱 API Endpoints

### Transactions
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create new transaction

### Categories
- `GET /api/categories` - Get user categories
- `POST /api/categories` - Create new category

### Budgets
- `GET /api/budgets` - Get user budgets
- `POST /api/budgets` - Create new budget

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

### Utilities
- `GET /api/test-db` - Test database connection
- `POST /api/seed-categories` - Create default categories

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [MongoDB](https://www.mongodb.com/) - Database
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Review the FAQ section

---

Built with ❤️ using modern web technologies
