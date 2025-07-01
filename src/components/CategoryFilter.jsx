import React from 'react';

const CategoryFilter = ({ value, onChange }) => {
  const categories = ['electronics', 'jewelery', "men's clothing", "women's clothing"];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ marginBottom: '1rem' }}
    >
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
};

export default CategoryFilter;
