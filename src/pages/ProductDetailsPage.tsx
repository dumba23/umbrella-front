import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteProduct, getProductById } from '../api/products';
import { Product } from '../types';

import '../assets/styles/ProductDetailsPage.css';

const ProductDetailsPage: React.FC = () => {
  const { id = ''} = useParams<string>();
  const [product, setProduct] = useState<Product | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
    }, [id]);

    if (!product) {
        return <div>Loading...</div>;
    }

    const handleDeleteProduct = async () => {
        try {
            await deleteProduct(Number(id));
            navigate('/');
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };
    console.log(product.description.length)
  return (
    <div className="product-details-container">
      <h1 className="product-details-title">Product Details</h1>
      <table className="product-details-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Images</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{product.name}</td>
            <td className="product-details-description">
              {product.description}
            </td>
            <td className="product-details-images">
              {product.images &&
                product.images.map((image: any, index: number) => (
                  <img
                    key={index}
                    src={`${image.image_path.includes('http') ? image.image_path : `http://localhost:8000/storage/${image.image_path}`}`}
                    alt={`Product ${index}`}
                    width={80}
                    height={80}
                  />
                ))}
            </td>
            <td>
              {product.categories.map((category) => (
                <div key={category.id}>{category.name}</div>
              ))}
            </td>
            <td>{product.price}</td>
            <td>
              <button className="delete-button" onClick={handleDeleteProduct}>Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductDetailsPage;