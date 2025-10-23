// AdminDashboard.tsx.new - Temporary file to compare
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Plus,
  Edit,
  Trash2,
  Search,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  tags: string[];
  slug: string;
  createdAt: string;
}

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Handle escape key and click outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (showAddModal || editingProduct)) {
        setShowAddModal(false);
        setEditingProduct(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showAddModal, editingProduct]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/products/admin?id=${productId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Product deleted successfully');
        fetchProducts(); // Refresh the list
      } else {
        toast.error(data.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdate = async (updatedData: Partial<Product>) => {
    if (!editingProduct?._id) return;

    try {
      const response = await fetch('/api/products/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProduct._id,
          ...updatedData
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Product updated successfully');
        setEditingProduct(null);
        fetchProducts(); // Refresh the list
      } else {
        toast.error(data.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.tags.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const stats = [
    {
      title: 'Total Products',
      value: products.length.toString(),
      icon: Package,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Total Revenue',
      value: '$' + (products.reduce((sum, p) => sum + p.price, 0)).toFixed(2),
      icon: DollarSign,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Low Stock Items',
      value: products.filter(p => p.stock < 10).length.toString(),
      icon: ShoppingBag,
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Active Users',
      value: '1', // Mock data
      icon: Users,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const categories = ['streetwear', 'premium', 'limited', 'beanies', 'caps', 'snapback'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-heavy text-white">Admin Dashboard</h1>
          <p className="text-white/70 mt-2">Manage your Ouswear store</p>
        </div>
        
        <motion.button
          onClick={() => setShowAddModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-aura-gradient text-white font-semibold rounded-lg
                     hover:shadow-lg hover:shadow-brand-auraRed/25 transition-all duration-200
                     flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Products Management */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Products</h2>
          
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white
                          placeholder:text-white/50 focus:outline-none focus:border-brand-auraRed/50"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 bg-white/10 border border-white/20 rounded-lg text-white
                          focus:outline-none focus:border-brand-auraRed/50 appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category} className="bg-brand-black">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white/5 h-16 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Product</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Price</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Stock</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Category</th>
                  <th className="text-center py-3 px-4 text-white/70 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {product.images?.length > 0 ? (
                          <div className="w-12 h-12 bg-gradient-to-br from-brand-darkRed to-brand-crimson rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-white" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-white/50" />
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium">{product.title}</p>
                          <p className="text-white/50 text-sm">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white font-medium">${product.price}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock < 10 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : product.stock < 50
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                        {product.tags.length > 2 && (
                          <span className="px-2 py-1 bg-white/10 text-white/50 text-xs rounded">
                            +{product.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <motion.button
                          onClick={() => handleEdit(product)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(product._id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-white/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/70">No products found</p>
                <p className="text-white/50 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddModal || editingProduct) && (
        <div 
          className="fixed inset-0 bg-black/75 flex items-center justify-center"
          onClick={(e) => {
            // Only close if clicking the backdrop (not the modal itself)
            if (e.target === e.currentTarget) {
              setShowAddModal(false);
              setEditingProduct(null);
            }
          }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative glass-card p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto
                     before:absolute before:inset-0 before:p-[2px] before:rounded-2xl before:bg-gradient-to-r 
                     before:from-brand-auraRed/80 before:via-brand-crimson/50 before:to-brand-darkRed/80
                     before:-z-10 after:absolute after:inset-[2px] after:rounded-[14px] 
                     after:bg-brand-black/95 after:-z-10"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const title = formData.get('title')?.toString() || '';
              const description = formData.get('description')?.toString() || '';
              const price = parseFloat(formData.get('price')?.toString() || '0');
              const stock = parseInt(formData.get('stock')?.toString() || '0');
              const tags = formData.get('tags')?.toString().split(',').map(t => t.trim()) || [];
              const slug = formData.get('slug')?.toString() || '';

              const data = {
                title,
                description,
                price,
                stock,
                tags,
                slug,
                images: [], // Default empty array for images
                models: [], // Default empty array for 3D models
                currency: 'USD', // Default currency
                status: 'published', // Default status
                category: tags[0] || 'accessories', // Use first tag as category or default
                featured: false // Default not featured
              };

              if (editingProduct) {
                await handleUpdate(data);
                setEditingProduct(null);
              } else {
                try {
                  const response = await fetch('/api/products/admin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                  });
                  
                  const result = await response.json();
                  
                  if (result.success) {
                    toast.success('Product added successfully');
                    setShowAddModal(false);
                    fetchProducts();
                  } else {
                    toast.error(result.error || 'Failed to add product');
                  }
                } catch (error) {
                  console.error('Error adding product:', error);
                  toast.error('Failed to add product');
                }
              }
            }} className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingProduct?.title}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white
                            placeholder:text-white/30 focus:outline-none focus:border-brand-auraRed/50"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  defaultValue={editingProduct?.description}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white
                            placeholder:text-white/30 focus:outline-none focus:border-brand-auraRed/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    defaultValue={editingProduct?.price}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white
                              placeholder:text-white/30 focus:outline-none focus:border-brand-auraRed/50"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    required
                    min="0"
                    defaultValue={editingProduct?.stock}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white
                              placeholder:text-white/30 focus:outline-none focus:border-brand-auraRed/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  required
                  defaultValue={editingProduct?.tags.join(', ')}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white
                            placeholder:text-white/30 focus:outline-none focus:border-brand-auraRed/50"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  required
                  defaultValue={editingProduct?.slug}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white
                            placeholder:text-white/30 focus:outline-none focus:border-brand-auraRed/50"
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <motion.button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 border border-white/20 text-white font-medium rounded-lg
                           hover:bg-white/10 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-aura-gradient text-white font-medium rounded-lg
                           hover:shadow-lg hover:shadow-brand-auraRed/25 transition-all"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}