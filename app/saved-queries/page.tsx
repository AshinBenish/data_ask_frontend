'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { BookmarkCheck, Search, Play, Eye, Trash2, Calendar, Clock, Database } from 'lucide-react';

const mockSavedQueries = [
  {
    id: 1,
    title: 'Top Customers Analysis',
    description: 'Find top 5 customers by total order value',
    nlQuery: 'Show me the top 5 customers by total order value',
    sqlQuery: `SELECT 
  c.name as customer_name,
  COUNT(o.id) as total_orders,
  SUM(o.amount) as total_value
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY total_value DESC
LIMIT 5;`,
    savedDate: '2024-01-15',
    lastRun: '2024-01-15',
    category: 'Customer Analytics',
    executionTime: '0.45s',
    resultRows: 5,
    isFavorite: true,
  },
  {
    id: 2,
    title: 'Low Inventory Alert',
    description: 'Products with inventory below threshold',
    nlQuery: 'Find all products with inventory below 10 units',
    sqlQuery: `SELECT 
  product_name, 
  stock_quantity,
  category,
  supplier_name
FROM products p
JOIN suppliers s ON p.supplier_id = s.id
WHERE stock_quantity < 10
ORDER BY stock_quantity ASC;`,
    savedDate: '2024-01-14',
    lastRun: '2024-01-14',
    category: 'Inventory Management',
    executionTime: '0.78s',
    resultRows: 12,
    isFavorite: false,
  },
  {
    id: 3,
    title: 'Monthly Sales Trend',
    description: 'Sales performance analysis for 2024',
    nlQuery: 'Get monthly sales trends for the past year',
    sqlQuery: `SELECT 
  MONTH(order_date) as month,
  YEAR(order_date) as year,
  COUNT(*) as total_orders,
  SUM(amount) as total_revenue,
  AVG(amount) as avg_order_value
FROM orders
WHERE order_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
GROUP BY YEAR(order_date), MONTH(order_date)
ORDER BY year DESC, month DESC;`,
    savedDate: '2024-01-13',
    lastRun: '2024-01-13',
    category: 'Sales Analytics',
    executionTime: '2.10s',
    resultRows: 12,
    isFavorite: true,
  },
  {
    id: 4,
    title: 'New Employee Report',
    description: 'Employees hired in the last quarter',
    nlQuery: 'List all employees who joined in the last 3 months',
    sqlQuery: `SELECT 
  employee_id,
  first_name,
  last_name,
  department,
  position,
  hire_date,
  salary
FROM employees
WHERE hire_date >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
ORDER BY hire_date DESC;`,
    savedDate: '2024-01-12',
    lastRun: '2024-01-12',
    category: 'HR Analytics',
    executionTime: '1.23s',
    resultRows: 8,
    isFavorite: false,
  },
  {
    id: 5,
    title: 'Regional Performance',
    description: 'Sales performance by geographic region',
    nlQuery: 'Calculate average order value by region',
    sqlQuery: `SELECT 
  region,
  COUNT(o.id) as total_orders,
  SUM(o.amount) as total_revenue,
  AVG(o.amount) as avg_order_value,
  COUNT(DISTINCT c.id) as unique_customers
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN addresses a ON c.address_id = a.id
GROUP BY region
ORDER BY total_revenue DESC;`,
    savedDate: '2024-01-11',
    lastRun: '2024-01-11',
    category: 'Regional Analytics',
    executionTime: '0.89s',
    resultRows: 6,
    isFavorite: true,
  },
  {
    id: 6,
    title: 'Product Category Analysis',
    description: 'Performance metrics by product category',
    nlQuery: 'Show product performance by category',
    sqlQuery: `SELECT 
  pc.category_name,
  COUNT(p.id) as total_products,
  SUM(oi.quantity) as total_sold,
  SUM(oi.quantity * oi.price) as total_revenue,
  AVG(oi.price) as avg_price
FROM product_categories pc
JOIN products p ON pc.id = p.category_id
JOIN order_items oi ON p.id = oi.product_id
GROUP BY pc.id, pc.category_name
ORDER BY total_revenue DESC;`,
    savedDate: '2024-01-10',
    lastRun: '2024-01-10',
    category: 'Product Analytics',
    executionTime: '1.45s',
    resultRows: 15,
    isFavorite: false,
  },
];

const categories = ['All', 'Customer Analytics', 'Inventory Management', 'Sales Analytics', 'HR Analytics', 'Regional Analytics', 'Product Analytics'];

export default function SavedQueriesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredQueries, setFilteredQueries] = useState(mockSavedQueries);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1500);
  }, []);

  useEffect(() => {
    let filtered = mockSavedQueries;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(query => query.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(query =>
        query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.nlQuery.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredQueries(filtered);
  }, [searchTerm, selectedCategory]);

  const handleRunQuery = (query: any) => {
    // Store the selected query in sessionStorage to pass to result page
    sessionStorage.setItem('selectedQuery', JSON.stringify({
      id: query.id,
      title: query.title,
      nlQuery: query.nlQuery,
      sqlQuery: query.sqlQuery,
      executionTime: query.executionTime,
      resultRows: query.resultRows,
    }));
    
    // Navigate to result page
    router.push('/result');
  };

  const handleViewQuery = (query: any) => {
    // Store query for viewing and navigate to query page
    sessionStorage.setItem('viewQuery', JSON.stringify(query));
    router.push('/query');
  };

  const handleDeleteQuery = (id: number) => {
    console.log(`Delete query with id: ${id}`);
    // Handle delete functionality
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Saved Queries</h1>
        <p className="mt-2 text-gray-600">
          Access and manage your collection of saved database queries.
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search saved queries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-amber-500 hover:bg-amber-600" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Queries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          // Loading skeletons
          [...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-5 w-20" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredQueries.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookmarkCheck className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No saved queries found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start by saving some queries from the Query page'
              }
            </p>
          </div>
        ) : (
          filteredQueries.map((query, index) => (
            <Card
              key={query.id}
              className="hover:shadow-lg transition-all duration-200 animate-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg flex items-center">
                      {query.isFavorite && (
                        <BookmarkCheck className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                      )}
                      <span className="truncate">{query.title}</span>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {query.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-4 flex-shrink-0">
                    {query.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700 font-medium mb-2">Natural Language Query:</p>
                  <p className="text-sm text-gray-600 italic">"{query.nlQuery}"</p>
                </div>

                <div className="bg-gray-900 p-3 rounded-lg">
                  <p className="text-xs text-gray-300 mb-2">Generated SQL:</p>
                  <pre className="text-xs text-gray-100 font-mono overflow-x-auto whitespace-pre-wrap">
                    {query.sqlQuery.length > 150 
                      ? `${query.sqlQuery.substring(0, 150)}...` 
                      : query.sqlQuery
                    }
                  </pre>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Saved: {query.savedDate}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {query.executionTime}
                    </div>
                    <div className="flex items-center">
                      <Database className="h-3 w-3 mr-1" />
                      {query.resultRows} rows
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewQuery(query)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteQuery(query.id)}
                      className="text-red-600 hover:text-red-700 hover:border-red-200"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                  <Button
                    onClick={() => handleRunQuery(query)}
                    size="sm"
                    className="bg-amber-500 hover:bg-amber-600"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Run Query
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}