import React from 'react';

const ProductCard = ({ product, onAddToCart = () => {} }) => (
  <div>
    <h2>{product.title}</h2>
    <p>${product.price}</p>
    <p>{product.category}</p>
    <p>{product.description}</p>
    <p>{product.rating?.rate ?? "No rating"}</p>
    <button onClick={() => onAddToCart(product)}>Add to Cart</button>
  </div>
);

export default ProductCard;