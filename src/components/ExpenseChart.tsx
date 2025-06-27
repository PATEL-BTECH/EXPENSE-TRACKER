'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/currency';

interface ChartData {
  name: string;
  value: number;
  income?: number;
  expenses?: number;
  color?: string;
}

interface ExpenseChartProps {
  data: ChartData[];
  type: 'pie' | 'bar' | 'line';
  title: string;
  height?: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

export default function ExpenseChart({ data, type, title, height = 300 }: ExpenseChartProps) {
  const formatCurrencyValue = (value: number) => {
    return formatCurrency(value, 'INR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const renderChart = () => {
    switch (type) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrencyValue(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'bar':
        // Check if data has income and expenses properties for comparison chart
        const hasIncomeExpenses = data.some(item => 'income' in item && 'expenses' in item);

        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatCurrencyValue} />
              <Tooltip formatter={(value) => formatCurrencyValue(Number(value))} />
              <Legend />
              {hasIncomeExpenses ? (
                <>
                  <Bar dataKey="income" fill="#4ECDC4" name="Income" />
                  <Bar dataKey="expenses" fill="#FF6B6B" name="Expenses" />
                </>
              ) : (
                <Bar dataKey="value" fill="#8884d8" />
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        // Check if data has income and expenses properties for comparison chart
        const hasIncomeExpensesLine = data.some(item => 'income' in item && 'expenses' in item);

        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatCurrencyValue} />
              <Tooltip formatter={(value) => formatCurrencyValue(Number(value))} />
              <Legend />
              {hasIncomeExpensesLine ? (
                <>
                  <Line type="monotone" dataKey="income" stroke="#4ECDC4" strokeWidth={2} name="Income" />
                  <Line type="monotone" dataKey="expenses" stroke="#FF6B6B" strokeWidth={2} name="Expenses" />
                </>
              ) : (
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium">No data available</p>
              <p className="text-sm mt-2">Add some transactions to see analytics</p>
            </div>
          </div>
        ) : (
          renderChart()
        )}
      </CardContent>
    </Card>
  );
}
