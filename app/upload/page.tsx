'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Database, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockSchema = {
  tables: [
    {
      name: 'users',
      columns: [
        { name: 'id', type: 'INTEGER', primary: true },
        { name: 'name', type: 'VARCHAR(255)' },
        { name: 'email', type: 'VARCHAR(255)' },
        { name: 'created_at', type: 'TIMESTAMP' },
      ],
    },
    {
      name: 'orders',
      columns: [
        { name: 'id', type: 'INTEGER', primary: true },
        { name: 'user_id', type: 'INTEGER' },
        { name: 'amount', type: 'DECIMAL(10,2)' },
        { name: 'status', type: 'VARCHAR(50)' },
      ],
    },
  ],
};

export default function UploadPage() {
  const [fileType, setFileType] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [schema, setSchema] = useState(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleUpload = async (file?: File) => {
    if (!fileType) {
      alert('Please select a file type first');
      return;
    }

    setUploading(true);
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUploading(false);
    setUploaded(true);
    
    // Start parsing
    setParsing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setParsing(false);
    setSchema(mockSchema);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Data</h1>
        <p className="mt-2 text-gray-600">
          Upload your SQL files or CSV data to get started with querying.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2 text-amber-500" />
              File Upload
            </CardTitle>
            <CardDescription>
              Choose your file type and upload your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                File Type
              </label>
              <Select value={fileType} onValueChange={setFileType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select file type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sql">SQL (.sql)</SelectItem>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
                dragActive 
                  ? 'border-amber-500 bg-amber-50' 
                  : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50/50'
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <input
                id="fileInput"
                type="file"
                className="hidden"
                accept={fileType === 'sql' ? '.sql' : '.csv'}
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              />
              
              {uploaded && !parsing ? (
                <div className="space-y-2">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  <p className="text-green-600 font-medium">File uploaded successfully!</p>
                </div>
              ) : uploading ? (
                <div className="space-y-2">
                  <Loader2 className="h-12 w-12 text-amber-500 mx-auto animate-spin" />
                  <p className="text-amber-600 font-medium">Uploading...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="text-gray-600">
                    <span className="font-medium text-amber-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    {fileType ? `${fileType.toUpperCase()} files only` : 'Select a file type first'}
                  </p>
                </div>
              )}
            </div>

            <Button 
              onClick={() => handleUpload()} 
              disabled={!fileType || uploading}
              className="w-full bg-amber-500 hover:bg-amber-600"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Browse Files'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Schema Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-amber-500" />
              Schema Preview
            </CardTitle>
            <CardDescription>
              Parsed database schema from your upload
            </CardDescription>
          </CardHeader>
          <CardContent>
            {parsing ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-2">
                  <Loader2 className="h-8 w-8 text-amber-500 mx-auto animate-spin" />
                  <p className="text-amber-600 font-medium">Parsing schema...</p>
                  <p className="text-sm text-gray-500">This may take a few moments</p>
                </div>
              </div>
            ) : schema ? (
              <div className="space-y-4">
                {schema.tables.map((table, index) => (
                  <div key={table.name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{table.name}</h4>
                      <Badge variant="outline">{table.columns.length} columns</Badge>
                    </div>
                    <div className="space-y-2">
                      {table.columns.map((column) => (
                        <div key={column.name} className="flex items-center justify-between text-sm">
                          <span className="font-mono text-gray-700">{column.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">{column.type}</span>
                            {column.primary && (
                              <Badge variant="secondary" className="text-xs">PK</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Upload a file to see the schema preview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}