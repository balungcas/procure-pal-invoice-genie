
export interface Product {
  id: string;
  name: string;
  price: number;
  company: string;
  address: string;
  contactNumber: string;
  email: string;
  costPrice?: number; // Optional for profit margin calculations in Phase 2
}

export interface FileUploadProps {
  onUploadSuccess: (products: Product[]) => void;
}

export interface ProductTableProps {
  products: Product[];
}

export interface AddProductFormProps {
  onProductAdd: (product: Product) => void;
}
