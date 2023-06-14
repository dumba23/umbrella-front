import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateCategoryForm: React.FC = () => {
  const [category, setCategory] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (category.trim() === '') {
      setErrorMessage('Category Name is required');
      return false;
    }
    return true;
  };

  const handleCategorySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/categories', { name: category });
      console.log('Category created successfully:', response.data);
      navigate('/admin/products/create');
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  return (
    <div>
      <h2>Create Category</h2>
      <form onSubmit={handleCategorySubmit}>
        <div>
          <label htmlFor="categoryName">Category Name:</label>
          <input
            style={{ maxWidth: '200px', marginBottom: '10px', marginTop: '10px'}}
            type="text"
            id="categoryName"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          />
          {errorMessage && <div style={{ color: 'red', marginBottom: '20px' }}>{errorMessage}</div>}
        </div>
        <button type="submit">Create Category</button>
      </form>
    </div>
  );
};

export default CreateCategoryForm;