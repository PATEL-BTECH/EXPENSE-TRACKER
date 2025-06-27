'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { Category, TransactionFormData } from '@/types';
import { getCurrentDate, getCurrentTime, combineDateAndTime } from '@/lib/date-utils';

const transactionSchema = z.object({
  amount: z.number().positive('Amount must be positive').max(1000000, 'Amount too large'),
  description: z.string().min(1, 'Description is required').max(200, 'Description too long'),
  categoryId: z.string().min(1, 'Category is required'),
  type: z.enum(['income', 'expense']),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  currency: z.string().min(1, 'Currency is required'),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  categories: Category[];
  onSubmit: (data: TransactionFormData) => Promise<void>;
  trigger?: React.ReactNode;
}

export default function TransactionForm({ 
  categories, 
  onSubmit, 
  trigger 
}: TransactionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      date: getCurrentDate(),
      time: getCurrentTime(),
      currency: 'INR',
    },
  });

  const watchedType = watch('type');
  const watchedCategoryId = watch('categoryId');

  const filteredCategories = categories.filter(cat => cat.type === activeTab);

  const onFormSubmit = async (data: TransactionFormValues) => {
    setIsLoading(true);
    try {
      // Combine date and time into a single Date object
      const transactionData = {
        ...data,
        date: combineDateAndTime(data.date, data.time),
        categoryId: data.categoryId as any, // Will be converted to ObjectId in API
      };
      // Remove the separate time field as it's now combined with date
      delete (transactionData as any).time;

      await onSubmit(transactionData);
      reset();
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    const type = value as 'expense' | 'income';
    setActiveTab(type);
    setValue('type', type);
    setValue('categoryId', ''); // Reset category when switching types
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expense" className="text-red-600">Expense</TabsTrigger>
            <TabsTrigger value="income" className="text-green-600">Income</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Enter description"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={watchedCategoryId}
                onValueChange={(value) => setValue('categoryId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={filteredCategories.length === 0 ? "No categories available" : "Select a category"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <p>No {activeTab} categories available</p>
                      <p className="text-xs mt-1">Please create categories first</p>
                    </div>
                  ) : (
                    filteredCategories.map((category) => (
                      <SelectItem key={category._id?.toString()} value={category._id?.toString() || ''}>
                        <div className="flex items-center space-x-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-red-600">{errors.categoryId.message}</p>
              )}
              {filteredCategories.length === 0 && (
                <p className="text-sm text-amber-600">
                  No {activeTab} categories available. Please create categories first in the Categories page.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date')}
                />
                {errors.date && (
                  <p className="text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  {...register('time')}
                />
                {errors.time && (
                  <p className="text-sm text-red-600">{errors.time.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || filteredCategories.length === 0}
                className={activeTab === 'expense' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
              >
                {isLoading ? 'Adding...' : `Add ${activeTab === 'expense' ? 'Expense' : 'Income'}`}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
