import React, { useState, useEffect } from 'react';

const ProductForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  categories = [],
  loading = false,
  onDelete,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    image: '',
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        price: '',
        category: '',
        image: '',
        description: ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.name === 'price' ? Number(e.target.value) : e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.category) {
      alert('Title, price, and category are required!');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <h3>{isEditing ? 'Edit Product' : 'Create Product'}</h3>
      <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
      <input name="price" placeholder="Price" type="number" value={formData.price} onChange={handleChange} required />
      <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} required />
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      >
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
      <button type="submit" disabled={loading}>
        {isEditing ? 'Update Product' : 'Add Product'}
      </button>
      {isEditing && (
        <>
          <button
            type="button"
            onClick={onDelete}
            style={{ marginLeft: '0.5rem', backgroundColor: '#dc3545', color: '#fff' }}
            disabled={loading}
          >
            Delete Product
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{ marginLeft: '0.5rem' }}
            disabled={loading}
          >
            Cancel
          </button>
        </>
      )}
    </form>
  );
};

export default ProductForm;