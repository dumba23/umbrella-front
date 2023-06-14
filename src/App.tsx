import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ProductListPage from './pages/ProductListPage';
import AdminRoutes from './routes/AdminRoutes';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
};

export default App;