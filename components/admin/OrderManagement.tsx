import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { OrderStatus } from '@/lib/types';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  date: Date;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  notes?: string;
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update order status');

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));

      toast({
        title: 'Status Updated',
        description: `Order #${orderId} status changed to ${status}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  const addTrackingNumber = async (orderId: string, trackingNumber: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/tracking`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber }),
      });

      if (!response.ok) throw new Error('Failed to add tracking number');

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, trackingNumber } : order
      ));

      toast({
        title: 'Tracking Updated',
        description: `Tracking number added to order #${orderId}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add tracking number',
        variant: 'destructive',
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <Button onClick={() => window.print()}>Print Orders</Button>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-gray-500">{order.customerEmail}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={order.status === 'delivered' ? 'secondary' : 'default'}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatPrice(order.total)}</TableCell>
                <TableCell>{order.date.toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        const tracking = window.prompt('Enter tracking number:');
                        if (tracking) addTrackingNumber(order.id, tracking);
                      }}>
                        Add Tracking Number
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'processing')}>
                        Mark as Processing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'shipped')}>
                        Mark as Shipped
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'delivered')}>
                        Mark as Delivered
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}