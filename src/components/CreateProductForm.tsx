import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CategoryObject } from '../types';

import '../assets/styles/CreateProduct.css';

interface Product {
  name: string;
  description: string;
  price: number;
  image: File[];
  categories: string[];
}

const CreateProductForm: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    image: [],
    categories: [],
  });
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
    categories: '',
  });
  const [categories, setCategories] = useState<CategoryObject[]>([]);
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      description: '',
      price: '',
      categories: '',
    };
  
    if (product.name.trim() === '') {
      newErrors.name = 'Name is required';
      isValid = false;
    }
  
    if (product.description.trim() === '') {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    if (String(product.price) === '' || String(product.price) === '0') {
      newErrors.price = 'Price is required';
      isValid = false;
    }

    if(product.categories.length === 0) {
      newErrors.categories = 'Categories is required';
      isValid = false;
    }
  
    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        const images = Array.from(files);
        setProduct((prevProduct) => ({
          ...prevProduct,
          image:  images,
        }));      
      }      
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const categoryName = event.target.value;
    const isChecked = event.target.checked;
    if (isChecked) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        categories: [...prevProduct.categories, categoryName],
      }));
    } else {
      setProduct((prevProduct) => ({
        ...prevProduct,
        categories: prevProduct.categories.filter((category) => category !== categoryName),
      }));
    }
  };

  const handleProductSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/products', 
      product, 
      {  headers: { "Content-Type": "multipart/form-data" }, }
      );
      console.log('Product created successfully:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="create-product-container">
    <h2>Create Product</h2>
    <form onSubmit={handleProductSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={product.name}
          onChange={(event) => setProduct({ ...product, name: event.target.value })}
        />
        {errors.name && <p className="error-message">{errors.name}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={product.description}
          onChange={(event) => setProduct({ ...product, description: event.target.value })}
        />
        {errors.description && <p className="error-message">{errors.description}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          name="price"
          value={product.price}
          onChange={(event) => setProduct({ ...product, price: parseFloat(event.target.value) })}
        />
        {errors.price && <p className="error-message">{errors.price}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="images">Images:</label>
        <input type="file" id="images" name="images" multiple onChange={handleImageChange} />
      </div>
      <div className="form-group category">
        <label>Category:</label>
        <div>
          {categories.map((category) => (
            <div className="category-item" key={category.id}>
              <input
                type="checkbox"
                id={`category-${category.id}`}
                value={category.name}
                onChange={handleCategoryChange}
              />
              <label htmlFor={`category-${category.id}`}>{category.name}</label>
            </div>
          ))}
        </div>
      </div>
      {errors.categories && <p className="error-message">{errors.categories}</p>}
      <button type="submit">Create Product</button>
    </form>
  </div>
  );
};

export default CreateProductForm;