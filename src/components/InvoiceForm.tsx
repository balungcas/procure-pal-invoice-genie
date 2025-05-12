
import React from 'react';
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/types";

interface InvoiceFormProps {
  customerInfo: {
    name: string;
    email: string;
    address: string;
  };
  setCustomerInfo: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    address: string;
  }>>;
  taxRate: number;
  setTaxRate: React.Dispatch<React.SetStateAction<number>>;
  discountAmount: number;
  setDiscountAmount: React.Dispatch<React.SetStateAction<number>>;
  subtotal: number;
  taxAmount: number;
  total: number;
  selectedProducts: Map<string, { product: Product; quantity: number }>;
}

const InvoiceForm = ({
  customerInfo,
  setCustomerInfo,
  taxRate,
  setTaxRate,
  discountAmount,
  setDiscountAmount,
  subtotal,
  taxAmount,
  total,
  selectedProducts
}: InvoiceFormProps) => {
  // Format price to Philippine Peso currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      currencyDisplay: 'symbol'
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Customer Information */}
      <div>
        <h3 className="text-lg font-medium mb-4">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customer-name">Customer Name *</Label>
            <Input
              id="customer-name"
              placeholder="Customer or Company Name"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-email">Customer Email</Label>
            <Input
              id="customer-email"
              placeholder="customer@example.com"
              type="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="customer-address">Customer Address</Label>
            <Input
              id="customer-address"
              placeholder="Full Address"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Selected Products Summary */}
      <div>
        <h3 className="text-lg font-medium mb-4">Selected Products</h3>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              {Array.from(selectedProducts.values()).map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span>
                    {product.name} x {quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Calculations */}
      <div>
        <h3 className="text-lg font-medium mb-4">Invoice Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tax-rate">Tax Rate (%)</Label>
            <Input
              id="tax-rate"
              type="number"
              min="0"
              step="0.01"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount">Discount Amount (₱)</Label>
            <Input
              id="discount"
              type="number"
              min="0"
              step="0.01"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Totals */}
        <div className="mt-6 space-y-2 text-right">
          <div className="flex justify-between">
            <span className="font-medium">Subtotal:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Tax ({taxRate}%):</span>
            <span>{formatPrice(taxAmount)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between">
              <span className="font-medium">Discount:</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
            <span>Total:</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
