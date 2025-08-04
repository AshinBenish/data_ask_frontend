'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { History, Eye, Play, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const mockHistory = [
  {
    id: 1,
    queryText: 'Show me top 5 customers by total order value',
    sqlGenerated: 'SELECT c.name, SUM(o.amount) FROM customers c...',
    date: '2024-01-15',
    duration: '0.45s',
    status: 'completed',
    rows: 5,
  },
  {
    id: 2,
    queryText: 'Find products with low inventory',
    sqlGenerated: 'SELECT product_name, stock FROM products WHERE...',
    date: '2024-01-15',
    duration: '0.78s',
    status: 'completed',
    rows: 12,
  },
  {
    id: 3,
    queryText: 'Get monthly sales trend for 2024',
    sqlGenerated: 'SELECT MONTH(date), SUM(amount) FROM sales...',
    date: '2024-01-14',
    duration: '2.10s',
    status: 'completed',
    rows: 12,
  },
  {
    id: 4,
    queryText: 'List all inactive users',
    sqlGenerated: 'SELECT * FROM users WHERE last_login <...',
    date: '2024-01-14',
    duration: '1.23s',
    status: 'failed',
    rows: 0,
  },
  {
    id: 5,
    queryText: 'Calculate average order value by region',
    sqlGenerated: 'SELECT region, AVG(amount) FROM orders...',
    date: '2024-01-13',
    duration: '0.89s',
    status: 'completed',
    rows: 8,
  },
  {
    id: 6,
    queryText: 'Show employee performance metrics',
    sqlGenerated: 'SELECT e.name, COUNT(s.id) FROM employees e...',
    date: '2024-01-13',
    duration: '1.45s',
    status: 'completed',
    rows: 25,
  },
];

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHistory, setFilteredHistory] = useState(mockHistory);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1500);
  }, []);

  useEffect(() => {
    const filtered = mockHistory.filter(item =>
      item.queryText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sqlGenerated.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHistory(filtered);
  }, [searchTerm]);

  const handleAction = (action: string, id: number) => {
    console.log(`${action} query with id: ${id}`);
    // Handle actions like view, rerun, delete
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Query History</h1>
        <p className="mt-2 text-gray-600">
          View and manage your previously executed queries.
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search queries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 mr-2 text-amber-500" />
            Saved Queries
          </CardTitle>
          <CardDescription>
            {loading ? 'Loading...' : `${filteredHistory.length} queries found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No queries found matching your search.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item, index) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow animate-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.queryText}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 font-mono bg-gray-50 p-2 rounded truncate">
                        {item.sqlGenerated}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 ml-4 flex-shrink-0">
                      {item.date}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge
                        variant={item.status === 'completed' ? 'default' : 'destructive'}
                        className={item.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {item.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Duration: {item.duration}
                      </span>
                      {item.status === 'completed' && (
                        <span className="text-xs text-gray-500">
                          {item.rows} rows
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction('view', item.id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      {item.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAction('rerun', item.id)}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Rerun
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction('delete', item.id)}
                        className="text-red-600 hover:text-red-700 hover:border-red-200"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}