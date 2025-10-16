import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OrderManagement } from '@/components/admin/OrderManagement';
import { useToast } from '@/hooks/use-toast';

// Mock the useToast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

describe('OrderManagement', () => {
  const mockOrders = [
    {
      id: '1',
      customerId: 'c1',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      status: 'processing',
      items: [
        { id: 'i1', name: 'Product 1', quantity: 2, price: 99.99 },
      ],
      total: 199.98,
      date: new Date('2025-10-09'),
      shippingAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        postalCode: '12345',
        country: 'Test Country',
      },
    },
    {
      id: '2',
      customerId: 'c2',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      status: 'shipped',
      items: [
        { id: 'i2', name: 'Product 2', quantity: 1, price: 149.99 },
      ],
      total: 149.99,
      date: new Date('2025-10-09'),
      shippingAddress: {
        street: '456 Test Ave',
        city: 'Test City',
        state: 'TS',
        postalCode: '12345',
        country: 'Test Country',
      },
      trackingNumber: '1Z999AA1234567890',
    },
  ];

  const mockToast = jest.fn();

  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    global.fetch = jest.fn();
  });

  test('renders order list correctly', () => {
    render(<OrderManagement initialOrders={mockOrders} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('$199.98')).toBeInTheDocument();
    expect(screen.getByText('$149.99')).toBeInTheDocument();
  });

  test('updates order status', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ status: 'shipped' }),
    });

    render(<OrderManagement initialOrders={mockOrders} />);

    const actionButtons = screen.getAllByRole('button', { name: /actions/i });
    fireEvent.click(actionButtons[0]);
    
    const shipButton = screen.getByText(/mark as shipped/i);
    fireEvent.click(shipButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/admin/orders/1/status',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ status: 'shipped' }),
        })
      );
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Status Updated',
        })
      );
    });
  });

  test('adds tracking number to order', async () => {
    const trackingNumber = '1Z999AA1234567890';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ trackingNumber }),
    });

    render(<OrderManagement initialOrders={mockOrders} />);

    const actionButtons = screen.getAllByRole('button', { name: /actions/i });
    fireEvent.click(actionButtons[0]);
    
    // Mock window.prompt
    window.prompt = jest.fn().mockReturnValue(trackingNumber);
    
    const addTrackingButton = screen.getByText(/add tracking number/i);
    fireEvent.click(addTrackingButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/admin/orders/1/tracking',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ trackingNumber }),
        })
      );
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Tracking Updated',
        })
      );
    });
  });

  test('handles error when updating order status', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to update status')
    );

    render(<OrderManagement initialOrders={mockOrders} />);

    const actionButtons = screen.getAllByRole('button', { name: /actions/i });
    fireEvent.click(actionButtons[0]);
    
    const shipButton = screen.getByText(/mark as shipped/i);
    fireEvent.click(shipButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          variant: 'destructive',
        })
      );
    });
  });

  test('filters orders by status', () => {
    render(<OrderManagement initialOrders={mockOrders} />);

    const filterSelect = screen.getByLabelText(/filter by status/i);
    fireEvent.change(filterSelect, { target: { value: 'shipped' } });

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('sorts orders by date', () => {
    render(<OrderManagement initialOrders={mockOrders} />);

    const sortSelect = screen.getByLabelText(/sort by/i);
    fireEvent.change(sortSelect, { target: { value: 'date-desc' } });

    const orders = screen.getAllByRole('row');
    expect(orders[1]).toHaveTextContent('Jane Smith');
    expect(orders[2]).toHaveTextContent('John Doe');
  });

  test('exports orders to CSV', () => {
    // Mock window.URL.createObjectURL
    const mockCreateObjectURL = jest.fn();
    window.URL.createObjectURL = mockCreateObjectURL;
    
    // Mock document.createElement
    const mockLink = { click: jest.fn() };
    document.createElement = jest.fn().mockReturnValue(mockLink);

    render(<OrderManagement initialOrders={mockOrders} />);

    const exportButton = screen.getByText(/export/i);
    fireEvent.click(exportButton);

    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockLink.click).toHaveBeenCalled();
  });

  test('shows loading state', () => {
    render(<OrderManagement initialOrders={[]} isLoading={true} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('shows empty state', () => {
    render(<OrderManagement initialOrders={[]} />);
    expect(screen.getByText(/no orders found/i)).toBeInTheDocument();
  });

  test('handles search functionality', () => {
    render(<OrderManagement initialOrders={mockOrders} />);

    const searchInput = screen.getByPlaceholderText(/search orders/i);
    fireEvent.change(searchInput, { target: { value: 'john' } });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });
});