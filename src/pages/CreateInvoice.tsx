
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Invoice, InvoiceItem, Product } from "@/types";
import Navbar from "@/components/Navbar";
import ProductSelection from "@/components/ProductSelection";
import InvoiceForm from "@/components/InvoiceForm";
import InvoicePreview from "@/components/InvoicePreview";

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<Map<string, { product: Product, quantity: number }>>(new Map());
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
  });
  const [taxRate, setTaxRate] = useState(12); // Default 12% VAT in Philippines
  const [discountAmount, setDiscountAmount] = useState(0);
  const [generatedInvoice, setGeneratedInvoice] = useState<Invoice | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [activeStep, setActiveStep] = useState<'select' | 'details' | 'preview'>('select');

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        throw error;
      }

      // Map database products to our Product interface
      const mappedProducts: Product[] = data.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        company: product.company,
        address: product.address,
        contactNumber: product.contact_number,
        email: product.email,
        costPrice: product.cost_price,
      }));
      
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product: Product, selected: boolean) => {
    const updatedSelection = new Map(selectedProducts);

    if (selected) {
      updatedSelection.set(product.id, { product, quantity: 1 });
    } else {
      updatedSelection.delete(product.id);
    }

    setSelectedProducts(updatedSelection);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    const updatedSelection = new Map(selectedProducts);
    const item = updatedSelection.get(productId);
    
    if (item) {
      updatedSelection.set(productId, { ...item, quantity });
      setSelectedProducts(updatedSelection);
    }
  };

  const calculateSubtotal = () => {
    let subtotal = 0;
    selectedProducts.forEach(({ product, quantity }) => {
      subtotal += product.price * quantity;
    });
    return subtotal;
  };

  const calculateTaxAmount = (subtotal: number) => {
    return subtotal * (taxRate / 100);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = calculateTaxAmount(subtotal);
    return subtotal + taxAmount - discountAmount;
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `INV-${year}${month}${day}-${random}`;
  };

  const handleCreateInvoice = async () => {
    if (selectedProducts.size === 0) {
      toast({
        title: "No products selected",
        description: "Please select at least one product",
        variant: "destructive",
      });
      return;
    }

    if (!customerInfo.name) {
      toast({
        title: "Missing customer information",
        description: "Please provide the customer name",
        variant: "destructive",
      });
      return;
    }

    try {
      const subtotal = calculateSubtotal();
      const taxAmount = calculateTaxAmount(subtotal);
      const totalAmount = calculateTotal();
      
      // Create invoice
      const invoiceNumber = generateInvoiceNumber();
      
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          customer_name: customerInfo.name,
          customer_email: customerInfo.email || null,
          customer_address: customerInfo.address || null,
          subtotal,
          tax_rate: taxRate,
          tax_amount: taxAmount,
          discount_amount: discountAmount,
          total_amount: totalAmount
        })
        .select()
        .single();

      if (invoiceError) {
        throw invoiceError;
      }

      // Create invoice items
      const invoiceId = invoiceData.id;
      const items: any[] = [];
      
      for (const [productId, { product, quantity }] of selectedProducts.entries()) {
        const unitPrice = product.price;
        const totalPrice = unitPrice * quantity;
        
        const { data, error } = await supabase
          .from('invoice_items')
          .insert({
            invoice_id: invoiceId,
            product_id: productId,
            quantity,
            unit_price: unitPrice,
            total_price: totalPrice
          })
          .select('*, products(*)')
          .single();

        if (error) {
          throw error;
        }
        
        items.push({
          id: data.id,
          invoiceId: data.invoice_id,
          productId: data.product_id,
          product,
          quantity: data.quantity,
          unitPrice: data.unit_price,
          totalPrice: data.total_price
        });
      }

      // Set generated invoice
      const invoice: Invoice = {
        id: invoiceData.id,
        invoiceNumber: invoiceData.invoice_number,
        customerName: invoiceData.customer_name,
        customerEmail: invoiceData.customer_email,
        customerAddress: invoiceData.customer_address,
        subtotal: invoiceData.subtotal,
        taxRate: invoiceData.tax_rate,
        taxAmount: invoiceData.tax_amount,
        discountAmount: invoiceData.discount_amount,
        totalAmount: invoiceData.total_amount,
        createdAt: invoiceData.created_at
      };

      setGeneratedInvoice(invoice);
      setInvoiceItems(items);
      setActiveStep('preview');

      toast({
        title: "Invoice created",
        description: `Invoice #${invoiceNumber} has been created successfully`,
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
    }
  };

  const handleNextStep = () => {
    if (activeStep === 'select') {
      if (selectedProducts.size === 0) {
        toast({
          title: "No products selected",
          description: "Please select at least one product",
          variant: "destructive",
        });
        return;
      }
      setActiveStep('details');
    } else if (activeStep === 'details') {
      handleCreateInvoice();
    }
  };

  const handleBackStep = () => {
    if (activeStep === 'details') {
      setActiveStep('select');
    } else if (activeStep === 'preview') {
      setActiveStep('details');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6 text-dashboard-text">Create Invoice</h2>

        <Card>
          <CardHeader>
            <CardTitle>
              {activeStep === 'select' && 'Step 1: Select Products'}
              {activeStep === 'details' && 'Step 2: Invoice Details'}
              {activeStep === 'preview' && 'Step 3: Invoice Preview'}
            </CardTitle>
            <CardDescription>
              {activeStep === 'select' && 'Choose the products you want to include in your invoice.'}
              {activeStep === 'details' && 'Provide customer information and additional invoice details.'}
              {activeStep === 'preview' && 'Review and download your invoice.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeStep === 'select' && (
              <ProductSelection
                products={products}
                selectedProducts={selectedProducts}
                onProductSelect={handleProductSelect}
                onQuantityChange={handleQuantityChange}
                loading={loading}
              />
            )}
            
            {activeStep === 'details' && (
              <InvoiceForm
                customerInfo={customerInfo}
                setCustomerInfo={setCustomerInfo}
                taxRate={taxRate}
                setTaxRate={setTaxRate}
                discountAmount={discountAmount}
                setDiscountAmount={setDiscountAmount}
                subtotal={calculateSubtotal()}
                taxAmount={calculateTaxAmount(calculateSubtotal())}
                total={calculateTotal()}
                selectedProducts={selectedProducts}
              />
            )}
            
            {activeStep === 'preview' && generatedInvoice && (
              <InvoicePreview
                invoice={generatedInvoice}
                invoiceItems={invoiceItems}
              />
            )}

            <div className="flex justify-between mt-6">
              {activeStep !== 'select' && (
                <Button variant="outline" onClick={handleBackStep}>
                  Back
                </Button>
              )}
              
              {activeStep !== 'preview' ? (
                <Button className="ml-auto" onClick={handleNextStep}>
                  {activeStep === 'select' ? 'Next' : 'Generate Invoice'}
                </Button>
              ) : (
                <Button className="ml-auto" onClick={() => navigate('/')}>
                  Back to Dashboard
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateInvoice;
