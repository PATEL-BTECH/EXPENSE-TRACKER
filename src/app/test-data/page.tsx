'use client';

import { useState } from 'react';

export default function TestDataPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Test user ID that we know has data
  const testUserId = '6856983501c9221ef5b21326';

  const testMCPTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/transactions?userId=${testUserId}`);
      const result = await response.json();

      if (response.ok) {
        setData(result);
      } else {
        setError(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const testMCPCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/categories?userId=${testUserId}`);
      const result = await response.json();

      if (response.ok) {
        setData(result);
      } else {
        setError(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const testMCPDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/dashboard?userId=${testUserId}`);
      const result = await response.json();

      if (response.ok) {
        setData(result);
      } else {
        setError(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const testCreateCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/seed-categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: testUserId }),
      });
      const result = await response.json();

      if (response.ok) {
        setData(result);
      } else {
        setError(result.error || 'Failed to create categories');
      }
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Test Data Retrieval</h1>
      
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded border">
          <h2 className="font-semibold mb-2">Test User ID:</h2>
          <code className="bg-gray-100 px-2 py-1 rounded">{testUserId}</code>
          <p className="text-sm text-gray-600 mt-2">
            This user ID has existing transactions and categories in the database.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={testMCPTransactions}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Test MCP Transactions'}
          </button>

          <button
            type="button"
            onClick={testMCPCategories}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Test MCP Categories'}
          </button>

          <button
            type="button"
            onClick={testMCPDashboard}
            disabled={loading}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Test MCP Dashboard'}
          </button>

          <button
            type="button"
            onClick={testCreateCategories}
            disabled={loading}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Create Categories'}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded">
            <h3 className="font-semibold text-red-800 mb-2">Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {data && (
          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h3 className="font-semibold text-green-800 mb-2">Response:</h3>
            <pre className="bg-white p-3 rounded border overflow-auto text-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-semibold text-yellow-800 mb-2">Expected Behavior:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• <strong>Test Transactions:</strong> Should return 3 transactions (Clothes, Company Salary, medicine)</li>
            <li>• <strong>Test Categories:</strong> Should return 16 categories (10 expense + 6 income categories)</li>
            <li>• <strong>Test Dashboard:</strong> Should return stats with balance of ₹77,480 (78,000 - 520)</li>
            <li>• <strong>Create Categories:</strong> Should create default categories if none exist</li>
            <li>• This demonstrates that categories are available and users won't see "No categories found"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
