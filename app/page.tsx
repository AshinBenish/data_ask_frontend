'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Database, FileText, Play, Clock } from 'lucide-react';

const summaryCards = [
  {
    title: 'Connected Databases',
    value: '3',
    description: 'Active connections',
    icon: Database,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Saved Queries',
    value: '127',
    description: 'Total saved queries',
    icon: FileText,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Total Queries Run',
    value: '2,543',
    description: 'This month',
    icon: Play,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
];

const recentQueries = [
  {
    nlQuery: 'Show me top 5 cities by population',
    sqlPreview: 'SELECT city, population FROM cities ORDER BY...',
    executionTime: '0.45s',
    status: 'completed',
    timestamp: '2 minutes ago',
  },
  {
    nlQuery: 'Find customers who bought more than $1000',
    sqlPreview: 'SELECT * FROM customers WHERE total_spent >...',
    executionTime: '1.23s',
    status: 'completed',
    timestamp: '15 minutes ago',
  },
  {
    nlQuery: 'Get monthly sales trend for 2024',
    sqlPreview: 'SELECT MONTH(date), SUM(amount) FROM sales...',
    executionTime: '2.10s',
    status: 'completed',
    timestamp: '1 hour ago',
  },
  {
    nlQuery: 'Show products with low inventory',
    sqlPreview: 'SELECT product_name, stock FROM products...',
    executionTime: '0.78s',
    status: 'failed',
    timestamp: '2 hours ago',
  },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1500);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's an overview of your data dashboard activity.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card, index) => (
          <Card
            key={card.title}
            className="hover:shadow-lg transition-shadow duration-200 animate-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                  <p className="text-xs text-gray-500">{card.description}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Queries */}
      <Card className="animate-in slide-in-from-bottom-6" style={{ animationDelay: '300ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-amber-500" />
            Recent Queries
          </CardTitle>
          <CardDescription>
            Your latest natural language to SQL queries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentQueries.map((query, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0 hover:bg-gray-50 -mx-4 px-4 py-2 rounded-lg transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {query.nlQuery}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 font-mono bg-gray-100 p-1 rounded">
                        {query.sqlPreview}
                      </p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-xs text-gray-500">
                          Execution: {query.executionTime}
                        </span>
                        <Badge
                          variant={query.status === 'completed' ? 'default' : 'destructive'}
                          className={query.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {query.status}
                        </Badge>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 ml-4 flex-shrink-0">
                      {query.timestamp}
                    </span>
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