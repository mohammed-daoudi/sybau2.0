import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  status: 'processing' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  date: Date;
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
}

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
        <p className="text-gray-600 mb-4">
          You haven't placed any orders yet. Start shopping to see your order history here.
        </p>
        <Link href="/shop">
          <Button>Start Shopping</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Order History</h2>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Order #{order.id}</h3>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Placed on {order.date.toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatPrice(order.total)}</p>
                <Link href={`/orders/${order.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {order.status === 'shipped' && order.trackingNumber && (
              <div className="mt-4 pt-4 border-t">
                <Link href={`/orders/${order.id}/track`}>
                  <Button variant="link" className="p-0">
                    Track Package →
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}