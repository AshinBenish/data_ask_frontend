'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Database, Loader2, CheckCircle, XCircle, Table } from 'lucide-react';
import { connectDb, getTableList } from '@/utils/dbConnection';
import { toast } from 'sonner';
import { tableList } from '@/types/tableList';
import Cookies from 'js-cookie';

// const mockTables = [
//   { name: 'users', rows: 1250, columns: 8 },
//   { name: 'orders', rows: 5430, columns: 12 },
//   { name: 'products', rows: 340, columns: 15 },
//   { name: 'categories', rows: 25, columns: 4 },
//   { name: 'reviews', rows: 2890, columns: 6 },
// ];

export default function RemoteDBPage() {
  const [formData, setFormData] = useState({
    dbType: '',
    host: '',
    port: '',
    username: '',
    password: '',
    database: '',
  });
  const [testing, setTesting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [mockTables, setMockTables] = useState<tableList[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Reset connection state when form changes
    if (connected) {
      setConnected(false);
      setMockTables([]);
    }
    if (connectionError) {
      setConnectionError('');
    }
  };

  const handleTestConnection = async () => {
    if (!formData.dbType || !formData.host || !formData.username || !formData.database) {
      setConnectionError('Please fill in all required fields');
      return;
    }

    setTesting(true);
    setConnectionError('');

    const token: string | undefined = Cookies.get('accessToken');
    var session_id = "";
    const toastId = toast.loading('Authenticating...');
    try {
      const response = await connectDb(token, formData.host, formData.username, formData.database, formData.password, formData.port);
      session_id = response.data.session_id;
      localStorage.setItem('sessionId', session_id);
      Cookies.set('sessionId', session_id, { path: '/', expires: 1 });
      setConnected(true);
      toast.success('Connected', { id: toastId });
    } catch (error: any) {
      // Handle Axios error properly
      if (error.response) {
        toast.error(error.response.data.detail || 'Login failed', { id: toastId });
      } else if (error.request) {
        toast.error('Connection failed: Unable to connect to database. Please check your credentials.', { id: toastId });
      } else {
        toast.error('Something went wrong', { id: toastId });
      }
    } finally {
      setTesting(false);
    }

    if (session_id) {
      toast.loading('fetching details...', { id: toastId });
      try {
        const response = await getTableList(token, session_id);
        toast.success('Table detailes feched successfully', { id: toastId });
        setMockTables(response.data);
      } catch (error: any) {
        // Handle Axios error properly
        if (error.response) {
          toast.error(error.response.data.detail || 'Failed to fetch table details', { id: toastId });
        } else if (error.request) {
          toast.error('No response from server', { id: toastId });
        } else {
          toast.error('Something went wrong', { id: toastId });
        }
      } finally {

      }
    }

  };

  const isFormValid = formData.dbType && formData.host && formData.username && formData.database;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Remote Database Connection</h1>
        <p className="mt-2 text-gray-600">
          Connect to your remote database to start querying your data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-amber-500" />
              Database Connection
            </CardTitle>
            <CardDescription>
              Enter your database connection details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dbType">Database Type</Label>
              <Select value={formData.dbType} onValueChange={(value) => handleInputChange('dbType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select database type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="sqlite">SQLite</SelectItem>
                  <SelectItem value="mongodb">MongoDB</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="host">Host</Label>
                <Input
                  id="host"
                  placeholder="localhost"
                  value={formData.host}
                  onChange={(e) => handleInputChange('host', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  type='number'
                  placeholder="5432"
                  value={formData.port}
                  onChange={(e) => handleInputChange('port', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="database">Database Name</Label>
              <Input
                id="database"
                placeholder="Enter database name"
                value={formData.database}
                onChange={(e) => handleInputChange('database', e.target.value)}
              />
            </div>

            {connectionError && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="h-4 w-4 text-red-500 mr-2" />
                <span className="text-sm text-red-700">{connectionError}</span>
              </div>
            )}

            {connected && (
              <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-green-700">
                  Successfully connected to database!
                </span>
              </div>
            )}

            <Button
              onClick={handleTestConnection}
              disabled={!isFormValid || testing}
              className="w-full bg-amber-500 hover:bg-amber-600"
            >
              {testing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                'Test Connection'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Database Tables */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Table className="h-5 w-5 mr-2 text-amber-500" />
              Database Tables
            </CardTitle>
            <CardDescription>
              {connected ? `${mockTables.length} tables found` : 'Connect to view tables'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!connected ? (
              <div className="text-center py-8 text-gray-500">
                <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Connect to your database to see available tables</p>
              </div>
            ) : testing ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-2">
                  <Loader2 className="h-8 w-8 text-amber-500 mx-auto animate-spin" />
                  <p className="text-amber-600 font-medium">Loading tables...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-[30rem] pb-8 overflow-auto">
                {mockTables.map((table, index) => (
                  <div
                    key={table.table_name}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors animate-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center">
                      <Table className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{table.table_name}</p>
                        <p className="text-xs text-gray-500">
                          {table.row_count.toLocaleString()} rows • {table.columns_count} columns
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      Active
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}