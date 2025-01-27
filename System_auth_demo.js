import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertCircle, Database, Server, Layout, Clock, Shield, 
  User, Lock, RefreshCcw, FileText, AlertTriangle 
} from 'lucide-react';

// Simulated data store
const mockDatabase = {
  users: [
    { id: 1, username: 'user1', email: 'user1@example.com' },
    { id: 2, username: 'user2', email: 'user2@example.com' }
  ],
  products: [
    { id: 1, name: 'Product A', price: 99.99 },
    { id: 2, name: 'Product B', price: 149.99 }
  ]
};

const SystemDemo = () => {
  // State management
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cachedData, setCachedData] = useState({});
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeRequests, setActiveRequests] = useState(0);
  const [systemStatus, setSystemStatus] = useState({
    database: 'operational',
    cache: 'operational',
    api: 'operational',
    auth: 'operational'
  });

  // Logging function
  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    }]);
  };

  // Simulated authentication
  const handleLogin = async () => {
    setLoading(true);
    addLog('Frontend: Initiating authentication request', 'auth');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (username === 'demo' && password === 'password') {
        addLog('Auth Layer: User authenticated successfully', 'success');
        setIsAuthenticated(true);
        setError(null);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      addLog(`Auth Layer: ${err.message}`, 'error');
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Simulated data fetch
  const fetchData = async (type) => {
    setActiveRequests(prev => prev + 1);
    addLog(`Frontend: Requesting ${type} data`);

    try {
      // Check cache
      if (cachedData[type]) {
        addLog('Cache Layer: Retrieved data from cache', 'success');
        setUserData(cachedData[type]);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      const data = mockDatabase[type];
      
      // Update cache
      setCachedData(prev => ({
        ...prev,
        [type]: data
      }));
      
      setUserData(data);
      addLog(`Backend: ${type} data retrieved successfully`, 'success');
    } catch (err) {
      addLog(`Error: Failed to fetch ${type} data`, 'error');
      setError(`Failed to fetch ${type} data`);
    } finally {
      setActiveRequests(prev => prev - 1);
    }
  };

  // Clear all data
  const handleReset = () => {
    setCachedData({});
    setUserData(null);
    setError(null);
    addLog('System: Cache and user data cleared', 'info');
  };

  // Simulate system monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      const services = ['database', 'cache', 'api', 'auth'];
      const randomService = services[Math.floor(Math.random() * services.length)];
      const newStatus = Math.random() > 0.9 ? 'degraded' : 'operational';
      
      if (systemStatus[randomService] !== newStatus) {
        setSystemStatus(prev => ({
          ...prev,
          [randomService]: newStatus
        }));
        addLog(`Monitor: ${randomService} status changed to ${newStatus}`, 
          newStatus === 'operational' ? 'success' : 'warning'
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [systemStatus]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-2xl font-bold">System Architecture Demo</h2>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-sm ${
              activeRequests > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
            }`}>
              {activeRequests > 0 ? 'Processing' : 'Ready'}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Authentication Section */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="h-5 w-5" />
                <h3 className="font-semibold">Authentication</h3>
              </div>
              
              {!isAuthenticated ? (
                <div className="space-y-4">
                  <Input
                    placeholder="Username (use 'demo')"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                  />
                  <Input
                    type="password"
                    placeholder="Password (use 'password')"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <Button 
                    onClick={handleLogin} 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Authenticating...' : 'Login'}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-green-600">Authenticated as {username}</span>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAuthenticated(false)}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data Operations */}
          {isAuthenticated && (
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Database className="h-5 w-5" />
                    <h3 className="font-semibold">Data Operations</h3>
                  </div>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => fetchData('users')} 
                      className="w-full"
                      disabled={loading}
                    >
                      Fetch Users
                    </Button>
                    <Button 
                      onClick={() => fetchData('products')} 
                      className="w-full"
                      disabled={loading}
                    >
                      Fetch Products
                    </Button>
                    <Button 
                      onClick={handleReset}
                      variant="outline" 
                      className="w-full"
                    >
                      Clear All Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5" />
                    <h3 className="font-semibold">Data View</h3>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg min-h-[200px]">
                    {userData ? (
                      <pre className="text-sm">
                        {JSON.stringify(userData, null, 2)}
                      </pre>
                    ) : (
                      <div className="text-gray-500 text-center">
                        No data loaded
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* System Status */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Server className="h-5 w-5" />
                <h3 className="font-semibold">System Status</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(systemStatus).map(([service, status]) => (
                  <div 
                    key={service}
                    className="flex items-center gap-2 p-2 rounded-lg bg-gray-50"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <span className="capitalize">{service}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Logs */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <h3 className="font-semibold">System Logs</h3>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setLogs([])}
                >
                  Clear Logs
                </Button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg max-h-[300px] overflow-y-auto">
                {logs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`text-sm mb-1 ${
                      log.type === 'error' ? 'text-red-600' :
                      log.type === 'warning' ? 'text-yellow-600' :
                      log.type === 'success' ? 'text-green-600' :
                      'text-gray-600'
                    }`}
                  >
                    <span className="font-mono">{log.timestamp}</span>: {log.message}
                  </div>
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