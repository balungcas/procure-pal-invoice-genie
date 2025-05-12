
import { Database } from "@/integrations/supabase/types";

// Type for products from Supabase
export type DbProduct = Database['public']['Tables']['products']['Row'];

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

export type PaymentStatus = 'paid' | 'not_paid' | 'half_paid' | 'due' | 'overdue';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail?: string;
  customerAddress?: string;
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  createdAt?: string;
  paymentStatus?: PaymentStatus;
  dueDate?: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
