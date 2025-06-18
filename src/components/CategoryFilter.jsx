import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchCategories = async () => {
  const response = await axios.get('https://fakestoreapi.com/products/categories');
  return response.data;
};

const CategoryFilter = ({ value, onChange }) => {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  if (isLoading) return <p>Loading categories...</p>;
  if (error) return <p>Error loading categories</p>;

  const uniqueId = `category-filter-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div>
      <label htmlFor={uniqueId}>Category:</label>
      <select id={uniqueId} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">All</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;