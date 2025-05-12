
import { Invoice, PaymentStatus } from "@/types";
import { Database } from "@/integrations/supabase/types";

export type DbInvoice = Database['public']['Tables']['invoices']['Row'];

export const transformDbInvoice = (invoice: DbInvoice): Invoice => {
  // Convert dates and check for overdue status
  const dueDate = invoice.due_date ? new Date(invoice.due_date) : null;
  let paymentStatus = invoice.payment_status as PaymentStatus || 'not_paid';
  
  // If status is 'due' and the due date has passed, mark as 'overdue'
  if (paymentStatus === 'due' && dueDate && dueDate < new Date()) {
    paymentStatus = 'overdue';
  }
  
  return {
    id: invoice.id,
    invoiceNumber: invoice.invoice_number,
    customerName: invoice.customer_name,
    customerEmail: invoice.customer_email,
    customerAddress: invoice.customer_address,
    subtotal: invoice.subtotal,
    taxRate: invoice.tax_rate,
    taxAmount: invoice.tax_amount,
    discountAmount: invoice.discount_amount,
    totalAmount: invoice.total_amount,
    createdAt: invoice.created_at,
    paymentStatus: paymentStatus,
    dueDate: invoice.due_date,
  };
};

// Format date function
export const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }).format(new Date(dateString));
};

// Format price to Philippine Peso
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    currencyDisplay: 'symbol'
  }).format(price);
};
