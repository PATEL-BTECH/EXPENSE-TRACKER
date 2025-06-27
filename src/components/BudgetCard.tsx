import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Budget } from '@/types';
import { formatCurrency } from '@/lib/currency';

interface BudgetCardProps {
  budget: Budget;
  onEdit?: (budget: Budget) => void;
  onDelete?: (budgetId: string) => void;
}

export default function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const spentPercentage = (budget.spent / budget.amount) * 100;
  const remaining = budget.amount - budget.spent;
  const isOverBudget = budget.spent > budget.amount;
  const isNearLimit = spentPercentage >= 80 && !isOverBudget;

  const formatCurrencyValue = (amount: number) => {
    return formatCurrency(amount, 'INR');
  };

  const getStatusColor = () => {
    if (isOverBudget) return 'text-red-600';
    if (isNearLimit) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressColorClass = () => {
    if (isOverBudget) return 'bg-red-500';
    if (isNearLimit) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusIcon = () => {
    if (isOverBudget) return <AlertTriangle className="w-4 h-4 text-red-600" />;
    if (isNearLimit) return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    return <CheckCircle className="w-4 h-4 text-green-600" />;
  };

  const getStatusText = () => {
    if (isOverBudget) return 'Over Budget';
    if (isNearLimit) return 'Near Limit';
    return 'On Track';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{budget.name}</CardTitle>
          <div className="flex items-center space-x-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(budget)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(budget._id?.toString() || '')}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <Badge
            variant="secondary"
            className={`${getStatusColor()} bg-transparent border-current`}
          >
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Spent</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatCurrencyValue(budget.spent)} of {formatCurrencyValue(budget.amount)}
            </span>
          </div>
          <div className="relative">
            <Progress 
              value={Math.min(spentPercentage, 100)} 
              className="h-2"
            />
            <div
              className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColorClass()}`}
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{spentPercentage.toFixed(1)}% used</span>
            <span>
              {isOverBudget ?
                `${formatCurrencyValue(Math.abs(remaining))} over` :
                `${formatCurrencyValue(remaining)} remaining`
              }
            </span>
          </div>
        </div>

        {/* Budget Details */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Period</p>
            <p className="font-medium capitalize text-gray-900 dark:text-white">{budget.period}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Days Left</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {Math.max(0, Math.ceil((new Date(budget.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
            </p>
          </div>
        </div>

        {/* Warning Messages */}
        {isOverBudget && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-800">
                You've exceeded this budget by {formatCurrencyValue(Math.abs(remaining))}
              </p>
            </div>
          </div>
        )}

        {isNearLimit && !isOverBudget && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                You're approaching your budget limit. {formatCurrencyValue(remaining)} remaining.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
