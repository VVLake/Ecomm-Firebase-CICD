import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import CategoryFilter from './CategoryFilter';
import {
  fetchAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../utils/productService';

// Define the product type
interface Product {
  id?: string;
  title: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

const initialForm: Product = {
  title: '',
  price: 0,
  image: '',
  category: '',
  description: '',
};

const buttonStyle: React.CSSProperties = {
  marginRight: '0.5rem',
  marginTop: '0.5rem',
  padding: '0.5rem 1rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '1rem',
};

const dangerButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#dc3545',
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#6c757d',
};

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Product>(initialForm);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // Category filter state

  // Load products on mount and after changes
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = (await fetchAllProducts()).map((item: Partial<Product>) => ({
        id: item.id || '',
        title: item.title || '',
        price: item.price || 0,
        image: item.image || '',
        category: item.category || '',
        description: item.description || '',
      })) as Product[];
      setProducts(data);
    } catch (err) {
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // When editing, fill form with product data
  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        title: selectedProduct.title || '',
        price: selectedProduct.price || 0,
        image: selectedProduct.image || '',
        category: selectedProduct.category || '',
        description: selectedProduct.description || '',
      });
    } else {
      setFormData(initialForm);
    }
  }, [selectedProduct]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedProduct && selectedProduct.id) {
        await updateProduct(selectedProduct.id, formData);
      } else {
        await addProduct(formData);
      }
      await loadProducts();
      setSelectedProduct(null);
      setFormData(initialForm);
    } catch (error: any) {
      alert('Error saving product: ' + error.message);
    }
    setLoading(false);
  };

  const handleEdit = (product: Product) => setSelectedProduct(product);

  const handleDelete = async () => {
    if (selectedProduct && selectedProduct.id) {
      if (window.confirm('Are you sure you want to delete this product?')) {
        setLoading(true);
        await deleteProduct(selectedProduct.id);
        await loadProducts();
        setSelectedProduct(null);
        setFormData(initialForm);
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setSelectedProduct(null);
    setFormData(initialForm);
  };

  // Filter products based on the selected category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <div
      style={{
        margin: '2rem auto',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        maxWidth: 800,
      }}
    >
      <h2>Product Manager (Admin)</h2>
      {/* Category Filter */}
      <div style={{ marginBottom: '1.5rem' }}>
        <CategoryFilter
          value={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <h3>{selectedProduct ? 'Edit Product' : 'Create Product'}</h3>
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{
            display: 'block',
            margin: '0.5rem 0',
            padding: '0.5rem',
            width: '100%',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
        <input
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          type="number"
          min={0}
          step="0.01"
          required
          style={{
            display: 'block',
            margin: '0.5rem 0',
            padding: '0.5rem',
            width: '100%',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
        <input
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          required
          style={{
            display: 'block',
            margin: '0.5rem 0',
            padding: '0.5rem',
            width: '100%',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
        <input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
          style={{
            display: 'block',
            margin: '0.5rem 0',
            padding: '0.5rem',
            width: '100%',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          style={{
            display: 'block',
            margin: '0.5rem 0',
            padding: '0.5rem',
            width: '100%',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
        <button type="submit" style={buttonStyle} disabled={loading}>
          {selectedProduct ? 'Update Product' : 'Add Product'}
        </button>
        {selectedProduct && (
          <>
            <button
              type="button"
              onClick={handleDelete}
              style={dangerButtonStyle}
              disabled={loading}
            >
              Delete Product
            </button>
            <button
              type="button"
              onClick={handleCancel}
              style={secondaryButtonStyle}
              disabled={loading}
            >
              Cancel
            </button>
          </>
        )}
      </form>
      <h3>All Products</h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginTop: '1rem',
            justifyContent: 'flex-start',
          }}
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '12px',
                padding: '1rem',
                width: '250px',
                textAlign: 'center',
                backgroundColor: '#f9f9f9',
              }}
            >
              <img
                src={product.image}
                alt={product.title}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'contain',
                  marginBottom: '1rem',
                }}
              />
              <h4>{product.title}</h4>
              <p style={{ fontWeight: 'bold' }}>
                ${Number(product.price).toFixed(2)}
              </p>
              <button
                onClick={() => handleEdit(product)}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#28a745',
                  width: '100%',
                }}
                disabled={loading}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManager;