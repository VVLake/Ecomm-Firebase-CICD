import axios from 'axios';

export const fetchProducts = async () => {
  const res = await axios.get('https://fakestoreapi.com/products');
  return res.data;
};

export const fetchCategories = async () => {
  const res = await axios.get('https://fakestoreapi.com/products/categories');
  return res.data;
};

export const fetchProductsByCategory = async (category) => {
  const res = await axios.get(`https://fakestoreapi.com/products/category/${category}`);
  return res.data;
};
