export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    categories: CategoryObject[];
    images?: any[];
  }

export interface CategoryObject {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  }