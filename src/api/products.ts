import axios from 'axios';
import { Product } from '../types';

const API_URL = 'http://localhost:8000/api';

export const getProducts = async (queryParams: URLSearchParams, currentPage: number): Promise<{ data: Product[]; last_page: number }> => {
  const response = await axios.get(`${API_URL}/products`, {
    params: {
      page: currentPage,
      ...Object.fromEntries(queryParams),
    }
  });
  return {data: response.data.data, last_page: response.data.last_page};
};

export const deleteProduct = async (productId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/products/${productId}`);
  } catch (error) {
    throw new Error(`Error deleting product: ${error}`);
  }
};

export const getProductById = async (productId: string): Promise<Product> => {
  try {
    const response = await axios.get(`${API_URL}/products/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching product');
  }
};
