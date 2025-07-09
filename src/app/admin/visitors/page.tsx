
// =============================
// Admin Visitors Page Code
// =============================
'use client';

import { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Users, 
  Eye, 
  Clock,
  MapPin,
  Monitor,
  RefreshCw
} from 'lucide-react';

interface VisitorLog {
  timestamp: string;
  ip: string;
  userAgent: string;
  url: string;
  country: string;
  city: string;
}

interface VisitorStats {
  totalVisitors: number;
  uniqueIPs: number;
  topPages: Array<{ url: string; count: number }>;
  topCountries: Array<{ country: string; count: number }>;
  recentVisitors: VisitorLog[];
}

export default function VisitorsPage() {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadVisitorData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/visitors');
      if (response.ok) {
        const data = await response.json();
        calculateStats(data.visitors || []);
      }
    } catch (error) {
      console.error('Error loading visitor data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const calculateStats = (visitorData: VisitorLog[]) => {
    const uniqueIPs = new Set(visitorData.map(v => v.ip)).size;
    
    // Top pages
    const pageCount: Record<string, number> = {};
    visitorData.forEach(v => {
      pageCount[v.url] = (pageCount[v.url] || 0) + 1;
    });
    const topPages = Object.entries(pageCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([url, count]) => ({ url, count }));

    // Top countries
    const countryCount: Record<string, number> = {};
    visitorData.forEach(v => {
      countryCount[v.country] = (countryCount[v.country] || 0) + 1;
    });
    const topCountries = Object.entries(countryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }));

    // Recent visitors (last 20)
    const recentVisitors = visitorData
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);

    setStats({
      totalVisitors: visitorData.length,
      uniqueIPs,
      topPages,
      topCountries,
      recentVisitors
    });
  };

  useEffect(() => {
    loadVisitorData();
  }, []);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getBrowserFromUserAgent = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  };

  const getDeviceFromUserAgent = (userAgent: string) => {
    if (userAgent.includes('Mobile')) return 'Mobile';
    if (userAgent.includes('Tablet')) return 'Tablet';
    return 'Desktop';
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading visitor data...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Visitor Analytics</h1>
            <p className="text-gray-600 dark:text-gray-300">Track all IP addresses and visitor activity</p>
          </div>
          <Button onClick={loadVisitorData} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalVisitors}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique IPs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.uniqueIPs}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Page</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{stats.topPages[0]?.url || 'N/A'}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.topPages[0]?.count || 0} visits
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Visit</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-bold">
                  {stats.recentVisitors[0] ? formatTimestamp(stats.recentVisitors[0].timestamp) : 'N/A'}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Visitors Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Timestamp</th>
                    <th className="text-left p-2">IP Address</th>
                    <th className="text-left p-2">Page</th>
                    <th className="text-left p-2">Browser</th>
                    <th className="text-left p-2">Device</th>
                    <th className="text-left p-2">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentVisitors.map((visitor, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-2">{formatTimestamp(visitor.timestamp)}</td>
                      <td className="p-2">
                        <Badge variant="outline">{visitor.ip}</Badge>
                      </td>
                      <td className="p-2">{visitor.url}</td>
                      <td className="p-2">{getBrowserFromUserAgent(visitor.userAgent)}</td>
                      <td className="p-2">
                        <Badge variant="secondary">
                          <Monitor className="w-3 h-3 mr-1" />
                          {getDeviceFromUserAgent(visitor.userAgent)}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {visitor.country !== 'Unknown' ? `${visitor.city}, ${visitor.country}` : 'Unknown'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Pages */}
        {stats && stats.topPages.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.topPages.map((page, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{page.url}</span>
                      <Badge>{page.count} visits</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.topCountries.map((country, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{country.country}</span>
                      <Badge>{country.count} visits</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
