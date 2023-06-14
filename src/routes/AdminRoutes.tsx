import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import CreateCategoryForm from '../components/CreateCategoryForm';
import CreateProductForm from '../components/CreateProductForm';

const AdminRoutes: React.FC = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Admin Panel</h1>
      <div>
        <Link to='/admin/products/create' style={{ color: '#337ab7', marginRight: '20px', textDecoration: 'none'}}>Create Products</Link>
        <Link to='/admin/categories/create' style={{ color: '#337ab7', textDecoration: 'none'}}>Create Category</Link>
      </div>
      <Routes>
        <Route path="products/create" element={<CreateProductForm />} />
        <Route path="categories/create" element={<CreateCategoryForm />} />
      </Routes>
    </div>
  
  );
};

export default AdminRoutes;