import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '@/components/product/ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'Test description',
  price: 99.99,
  images: ['test-image.jpg'],
  category: 'test',
};

describe('ProductCard', () => {
  test('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockProduct.images[0]);
  });

  test('handles missing image gracefully', () => {
    const productWithoutImage = { ...mockProduct, images: [] };
    render(<ProductCard product={productWithoutImage} />);
    
    expect(screen.getByRole('img')).toHaveAttribute('src', '/placeholder.jpg');
  });

  test('Add to Cart button triggers callback', () => {
    const handleAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={handleAddToCart} />);
    
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(handleAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  test('Quick View button opens modal', () => {
    render(<ProductCard product={mockProduct} />);
    
    fireEvent.click(screen.getByText('Quick View'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});