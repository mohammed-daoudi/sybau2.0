import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface SalesData {
  revenue: {
    daily: { date: string; amount: number }[];
    monthly: { month: string; amount: number }[];
    yearly: { year: string; amount: number }[];
  };
  orders: {
    total: number;
    daily: { date: string; count: number }[];
    statusDistribution: { status: string; count: number }[];
  };
  products: {
    topSelling: {
      id: string;
      name: string;
      sales: number;
      revenue: number;
    }[];
    categoryDistribution: {
      category: string;
      sales: number;
    }[];
  };
  customers: {
    new: { period: string; count: number }[];
    retention: number;
    averageOrderValue: number;
  };
}

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#6366f1'];

export function SalesAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [data, setData] = useState<SalesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales Analytics</h2>
        <div className="flex gap-4">
          <Select
            value={timeRange}
            onValueChange={(value) => setTimeRange(value)}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => window.print()}>Export Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-red-500">
            {data ? formatCurrency(data.revenue.monthly.reduce((acc, curr) => acc + curr.amount, 0)) : '-'}
          </p>
          <p className="text-sm text-gray-500 mt-2">vs previous period</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-blue-500">
            {data?.orders.total || '-'}
          </p>
          <p className="text-sm text-gray-500 mt-2">vs previous period</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Avg. Order Value</h3>
          <p className="text-3xl font-bold text-green-500">
            {data ? formatCurrency(data.customers.averageOrderValue) : '-'}
          </p>
          <p className="text-sm text-gray-500 mt-2">vs previous period</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Customer Retention</h3>
          <p className="text-3xl font-bold text-purple-500">
            {data ? `${(data.customers.retention * 100).toFixed(1)}%` : '-'}
          </p>
          <p className="text-sm text-gray-500 mt-2">vs previous period</p>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Over Time</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data?.revenue.daily}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#ef4444"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.orders.statusDistribution}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    label
                  >
                    {data?.orders.statusDistribution.map((entry, index) => (
                      <Cell
                        key={entry.status}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.products.topSelling}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">New Customers</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data?.customers.new}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}