import React, { useState, useEffect } from 'react';

const ProductForm = ({ initialData = null, onSubmit, onCancel }) => {
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
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert('Title and price are required!');
      return;
    }
    onSubmit(formData);
    setFormData({ title: '', price: '', category: '', image: '', description: '' });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
      <input name="price" placeholder="Price" type="number" value={formData.price} onChange={handleChange} required />
      <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
      <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
      <button type="submit">{initialData ? 'Update' : 'Add'} Product</button>
      {onCancel && <button type="button" onClick={onCancel} style={{ marginLeft: '1rem' }}>Cancel</button>}
    </form>
  );
};

export default ProductForm;
