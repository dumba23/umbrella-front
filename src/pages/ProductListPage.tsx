import React, { useEffect, useState, useRef } from 'react';
import { Table } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CategoryObject, Product } from '../types';
import { deleteProduct, getProducts } from '../api/products';
import { getCategories } from '../api/category';
import useOutsideClick from '../hooks/useOutsideClick';
import { debounce } from '../utils/debounce';

import DownArrow from '../assets/images/down-arrow.svg';
import '../assets/styles/ProductListPage.css';

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(0);
  const [categories, setCategories] = useState<CategoryObject[]>([]);
  const [selectedCategories, setSelectedCategories] = useState <String[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState<Boolean>(false);

  const location = useLocation();
  const [queryParams, setQueryParams] = useState(new URLSearchParams(location.search));

  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts(queryParams, currentPage);
        setProducts(response.data);
        setLastPage(response.last_page);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const debouncedFetchProducts = debounce(fetchProducts, 300);
    const cleanup = debouncedFetchProducts();

    return cleanup;
  }, [currentPage, queryParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response);
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    };

    fetchCategories();
  }, [])

  useOutsideClick(dropdownRef, () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false)
    }
  })

  const handleQueryParamChange = (param: string, value: string) => {
    const updatedParams = new URLSearchParams(queryParams);
    if (value) {
      updatedParams.set(param, value);
    } else {
      updatedParams.delete(param);
    }

    const newURL = `${window.location.pathname}?${updatedParams.toString()}`;
    navigate(newURL, { replace: true });

    setQueryParams(updatedParams);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (selectedCategories: String[]) => {
    handleQueryParamChange('category', selectedCategories.join(','));
  };

  const handleCategoryCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedCategory = e.target.value;
    const updatedSelectedCategories = selectedCategories.includes(selectedCategory)
      ? selectedCategories.filter((category) => category !== selectedCategory)
      : [...selectedCategories, selectedCategory];
  
    setSelectedCategories(updatedSelectedCategories);
    handleCategoryFilterChange(updatedSelectedCategories);
  };

  const handleDelete = async (productId: number) => {
    try {
      await deleteProduct(productId);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
      console.log('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="product-list-container">
      <h1>Product List</h1>
      <Link to='/admin' className="navigation">Admin Panel</Link>
      <Table striped bordered responsive className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name 
              <input
              type="text"
              placeholder="Type to filter by name"
              style={{ maxWidth: '90%', marginTop: '10px'}}
              value={queryParams.get('name') || ''}
              onChange={(e) => handleQueryParamChange('name', e.target.value)}
            />
            </th>
            <th>Description
            <input
              type="text"
              placeholder="Type to filter by description"
              style={{ maxWidth: '90%', marginTop: '10px'}}
              value={queryParams.get('description') || ''}
              onChange={(e) =>
                handleQueryParamChange('description', e.target.value)
              }
            />
            </th>
            <th>Price
            <select
                style={{ marginLeft: '10px' }}
                value={queryParams.get('price') || ''}
                onChange={(e) =>
                  handleQueryParamChange('price', e.target.value)
                }
              >
                <option value="">Default</option>
                <option value="under100">Under 100</option>
                <option value="under500">Under 500</option>
                <option value="more500">More than 500</option>
              </select>
            </th>
              <th>
                <div className="dropdown-header" onClick={() => setIsDropdownOpen(!isDropdownOpen)} ref={dropdownRef}> 
                <span>Category</span>
                <img src={DownArrow} alt="arrow" width={14} style={{ margin: '2px 0 0 6px'}}/>
                {isDropdownOpen && (
                    <div className="category-dropdown">
                      {categories.map((category) => (
                        <label key={category.id}>
                          <input
                            type="checkbox"
                            value={category.name}
                            checked={selectedCategories.includes(category.name)}
                            onChange={handleCategoryCheckboxChange}
                          />
                          {category.name}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                {product.images && product.images.length > 0 && (
                  <img src={`${product.images[0].image_path.includes('http') ? product.images[0].image_path : `http://localhost:8000/storage/${product.images[0].image_path}`} `} alt={product.name} className="product-image" />
                )}
              </td>
              <td>{product.name}</td>
              <td>
              {product.description.length > 30 ? `${product.description.slice(0, 30).trim()}...` : product.description}  
              </td>
              <td>{product.price}</td>
              <td>{product.categories[0].name}</td>
              <td>
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: '#337ab7' }}>View</Link> |{' '}
                <button className="delete-button" onClick={() => handleDelete(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="pagination-container">
        <button
          className="pagination-button"
          onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
          disabled={currentPage === 1}
        >
          Previous Page
        </button>
        <button
          style={{ marginLeft: '20px' }}
          className="pagination-button"
          onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
          disabled={currentPage === lastPage}
        >
          Next Page
        </button>
      </div>
    </div>
  );
};

export default ProductListPage;