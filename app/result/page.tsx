'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, BarChart3, Loader2, Table, ArrowLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useRouter } from 'next/navigation';

const defaultQuery = `SELECT 
  c.name as customer_name,
  COUNT(o.id) as total_orders,
  SUM(o.amount) as total_value
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY total_value DESC
LIMIT 5;`;

const defaultTableData = [
  { customer_name: 'John Smith', total_orders: 5, total_value: 1250.00 },
  { customer_name: 'Sarah Johnson', total_orders: 8, total_value: 1180.50 },
  { customer_name: 'Mike Davis', total_orders: 3, total_value: 980.75 },
  { customer_name: 'Lisa Wilson', total_orders: 6, total_value: 875.25 },
  { customer_name: 'Tom Brown', total_orders: 4, total_value: 745.00 },
];

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];

export default function ResultPage() {
  const router = useRouter();
  const [chartLoading, setChartLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [queryData, setQueryData] = useState({
    title: 'Query Results',
    sqlQuery: defaultQuery,
    executionTime: '0.45s',
    resultRows: 5,
    tableData: defaultTableData,
  });

  useEffect(() => {
    // Check if we have a selected query from saved queries
    const selectedQuery = sessionStorage.getItem('selectedQuery');
    if (selectedQuery) {
      const parsedQuery = JSON.parse(selectedQuery);
      setQueryData({
        title: parsedQuery.title || 'Query Results',
        sqlQuery: parsedQuery.sqlQuery || defaultQuery,
        executionTime: parsedQuery.executionTime || '0.45s',
        resultRows: parsedQuery.resultRows || 5,
        tableData: defaultTableData, // In a real app, this would come from the API
      });
      // Clear the session storage after using it
      sessionStorage.removeItem('selectedQuery');
    }
  }, []);

  const chartData = queryData.tableData.map(item => ({
    name: item.customer_name.split(' ')[0],
    value: item.total_value,
    orders: item.total_orders,
  }));

  const handleDownload = async (format: string) => {
    setDownloading(true);
    // Simulate download
    await new Promise(resolve => setTimeout(resolve, 2000));
    setDownloading(false);
  };

  const handleChartView = () => {
    setChartLoading(true);
    setTimeout(() => setChartLoading(false), 1500);
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{queryData.title}</h1>
          <p className="mt-2 text-gray-600">
            View and analyze your query results in table or chart format.
          </p>
        </div>
      </div>

      {/* Query Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-amber-500" />
            Executed Query
          </CardTitle>
          <CardDescription>
            Query executed on database • {queryData.resultRows} rows returned • Execution time: {queryData.executionTime}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-50 p-4 rounded-lg text-sm font-mono overflow-x-auto border">
            {queryData.sqlQuery}
          </pre>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Success
              </Badge>
              <span className="text-sm text-gray-500">
                Query completed successfully
              </span>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDownload('csv')}
                disabled={downloading}
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Download CSV
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDownload('excel')}
                disabled={downloading}
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Download Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-amber-500" />
            Results Visualization
          </CardTitle>
          <CardDescription>
            View your data in table or chart format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="table" className="flex items-center">
                <Table className="h-4 w-4 mr-2" />
                Table
              </TabsTrigger>
              <TabsTrigger value="bar" onClick={handleChartView}>
                Bar Chart
              </TabsTrigger>
              <TabsTrigger value="line" onClick={handleChartView}>
                Line Chart
              </TabsTrigger>
              <TabsTrigger value="pie" onClick={handleChartView}>
                Pie Chart
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="table" className="mt-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium">Customer Name</th>
                      <th className="text-left py-3 px-4 font-medium">Total Orders</th>
                      <th className="text-left py-3 px-4 font-medium">Total Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queryData.tableData.map((row, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">{row.customer_name}</td>
                        <td className="py-3 px-4">{row.total_orders}</td>
                        <td className="py-3 px-4 font-mono">${row.total_value.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="bar" className="mt-6">
              {chartLoading ? (
                <div className="flex items-center justify-center h-80">
                  <div className="text-center space-y-2">
                    <Loader2 className="h-8 w-8 text-amber-500 mx-auto animate-spin" />
                    <p className="text-amber-600 font-medium">Rendering chart...</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [`$${value.toFixed(2)}`, 'Total Value']}
                    />
                    <Bar dataKey="value" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </TabsContent>
            
            <TabsContent value="line" className="mt-6">
              {chartLoading ? (
                <div className="flex items-center justify-center h-80">
                  <div className="text-center space-y-2">
                    <Loader2 className="h-8 w-8 text-amber-500 mx-auto animate-spin" />
                    <p className="text-amber-600 font-medium">Rendering chart...</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [`$${value.toFixed(2)}`, 'Total Value']}
                    />
                    <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </TabsContent>
            
            <TabsContent value="pie" className="mt-6">
              {chartLoading ? (
                <div className="flex items-center justify-center h-80">
                  <div className="text-center space-y-2">
                    <Loader2 className="h-8 w-8 text-amber-500 mx-auto animate-spin" />
                    <p className="text-amber-600 font-medium">Rendering chart...</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Total Value']} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}