import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Customer {
  id: string;
  name: string;
  email: string;
  joinDate: Date;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'blocked';
  notes?: string;
}

interface CustomerDetails extends Customer {
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  phoneNumber?: string;
  lastOrderDate?: Date;
  orderHistory: {
    id: string;
    date: Date;
    total: number;
    status: string;
  }[];
}

export function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const updateCustomerStatus = async (customerId: string, status: Customer['status']) => {
    try {
      const response = await fetch(`/api/admin/customers/${customerId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update customer status');

      setCustomers(customers.map(customer => 
        customer.id === customerId ? { ...customer, status } : customer
      ));

      toast({
        title: 'Status Updated',
        description: `Customer status changed to ${status}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update customer status',
        variant: 'destructive',
      });
    }
  };

  const fetchCustomerDetails = async (customerId: string) => {
    try {
      const response = await fetch(`/api/admin/customers/${customerId}`);
      if (!response.ok) throw new Error('Failed to fetch customer details');

      const data = await response.json();
      setSelectedCustomer(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch customer details',
        variant: 'destructive',
      });
    }
  };

  const addCustomerNote = async (customerId: string, note: string) => {
    try {
      const response = await fetch(`/api/admin/customers/${customerId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });

      if (!response.ok) throw new Error('Failed to add note');

      setCustomers(customers.map(customer => 
        customer.id === customerId ? { ...customer, notes: note } : customer
      ));

      toast({
        title: 'Note Added',
        description: 'Customer note has been updated',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add note',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Management</h2>
        <div className="flex gap-4">
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button onClick={() => window.print()}>Export List</Button>
        </div>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      customer.status === 'active'
                        ? 'secondary'
                        : customer.status === 'blocked'
                        ? 'destructive'
                        : 'default'
                    }
                  >
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell>{customer.totalOrders}</TableCell>
                <TableCell>{formatPrice(customer.totalSpent)}</TableCell>
                <TableCell>{customer.joinDate.toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchCustomerDetails(customer.id)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    {selectedCustomer && selectedCustomer.id === customer.id && (
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Customer Details</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-semibold mb-2">Contact Information</h3>
                            <p>Email: {selectedCustomer.email}</p>
                            <p>Phone: {selectedCustomer.phoneNumber || 'Not provided'}</p>
                            {selectedCustomer.address && (
                              <div className="mt-4">
                                <h3 className="font-semibold mb-2">Address</h3>
                                <p>{selectedCustomer.address.street}</p>
                                <p>
                                  {selectedCustomer.address.city},{' '}
                                  {selectedCustomer.address.state}{' '}
                                  {selectedCustomer.address.postalCode}
                                </p>
                                <p>{selectedCustomer.address.country}</p>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">Order History</h3>
                            <div className="space-y-2">
                              {selectedCustomer.orderHistory.map((order) => (
                                <div
                                  key={order.id}
                                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                >
                                  <div>
                                    <p className="font-medium">Order #{order.id}</p>
                                    <p className="text-sm text-gray-500">
                                      {order.date.toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">
                                      {formatPrice(order.total)}
                                    </p>
                                    <Badge variant="outline">{order.status}</Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}