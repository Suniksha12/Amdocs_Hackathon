import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Database, Server, Layout, Clock, Shield } from 'lucide-react';

const SystemDemo = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cachedData, setCachedData] = useState(null);

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const simulateRequest = async () => {
    setLoading(true);
    
    // Frontend Request
    addLog("Frontend: Initiating request to backend");
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Authentication
    addLog("Auth Layer: Verifying user credentials");
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check Cache
    if (cachedData) {
      addLog("Cache Layer: Retrieved data from cache");
      setLoading(false);
      return;
    }
    
    // Database Query
    addLog("Database: Querying user data");
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // External API
    addLog("External API: Fetching additional data");
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Processing
    addLog("Backend Processing: Applying business logic");
    await new Promise(resolve => setTimeout(resolve, 700));
    
    setCachedData("Sample cached data");
    addLog("Response: Data sent to frontend");
    setLoading(false);
  };

  const clearCache = () => {
    setCachedData(null);
    addLog("Cache cleared");
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader className="text-xl font-bold">System Architecture Demo</CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="col-span-3 md:col-span-1">
              <Card className="h-full">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Layout className="h-5 w-5" />
                    <h3 className="font-semibold">Frontend</h3>
                  </div>
                  <Button 
                    onClick={simulateRequest} 
                    disabled={loading}
                    className="w-full"
                  >
                    Send Request
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-3 md:col-span-1">
              <Card className="h-full">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5" />
                    <h3 className="font-semibold">Cache Status</h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>{cachedData ? "Cache: Hit" : "Cache: Miss"}</div>
                    <Button 
                      onClick={clearCache} 
                      variant="outline"
                      className="w-full"
                    >
                      Clear Cache
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-3 md:col-span-1">
              <Card className="h-full">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5" />
                    <h3 className="font-semibold">System Status</h3>
                  </div>
                  <div className={`text-sm ${loading ? "text-yellow-500" : "text-green-500"}`}>
                    {loading ? "Processing..." : "Ready"}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5" />
                <h3 className="font-semibold">System Logs</h3>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg max-h-60 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index} className="text-sm mb-1">{log}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemDemo;