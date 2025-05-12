
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Invoice, InvoiceItem } from "@/types";
import { FileText, Download, Printer } from "lucide-react";
import { useReactToPrint } from 'react-to-print';

interface InvoicePreviewProps {
  invoice: Invoice;
  invoiceItems: InvoiceItem[];
}

const InvoicePreview = ({ invoice, invoiceItems }: InvoicePreviewProps) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice-${invoice.invoiceNumber}`,
  });

  // Format price to Philippine Peso currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      currencyDisplay: 'symbol'
    }).format(price);
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-PH', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Invoice Preview</h3>
        <div className="space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button onClick={handlePrint}>
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div ref={invoiceRef} className="p-6 bg-white">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">INVOICE</h1>
                <p className="text-gray-600"># {invoice.invoiceNumber}</p>
                <p className="text-gray-600">Issue Date: {formatDate(invoice.createdAt)}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end mb-2">
                  <FileText className="h-6 w-6 mr-2 text-primary" />
                  <span className="text-xl font-semibold">Your Company Name</span>
                </div>
                <p className="text-gray-600">123 Business Street</p>
                <p className="text-gray-600">Manila, Philippines</p>
                <p className="text-gray-600">contact@yourcompany.com</p>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">Bill To:</h2>
              <p className="font-medium">{invoice.customerName}</p>
              {invoice.customerEmail && <p className="text-gray-600">{invoice.customerEmail}</p>}
              {invoice.customerAddress && <p className="text-gray-600">{invoice.customerAddress}</p>}
            </div>

            {/* Invoice Items */}
            <div className="mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-2 text-left">Item</th>
                    <th className="py-2 text-right">Quantity</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-3">
                        <div className="font-medium">{item.product?.name}</div>
                        <div className="text-sm text-gray-500">from {item.product?.company}</div>
                      </td>
                      <td className="py-3 text-right">{item.quantity}</td>
                      <td className="py-3 text-right">{formatPrice(item.unitPrice)}</td>
                      <td className="py-3 text-right font-medium">{formatPrice(item.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Invoice Summary */}
            <div className="w-full md:w-1/2 ml-auto">
              <div className="space-y-2">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatPrice(invoice.subtotal)}</span>
                </div>
                
                {invoice.taxAmount && invoice.taxAmount > 0 && (
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
                    <span className="font-medium">{formatPrice(invoice.taxAmount)}</span>
                  </div>
                )}
                
                {invoice.discountAmount && invoice.discountAmount > 0 && (
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium">- {formatPrice(invoice.discountAmount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between py-2 border-t border-gray-300 text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatPrice(invoice.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="mt-12 pt-6 border-t border-gray-300">
              <h3 className="font-semibold mb-2">Terms & Notes</h3>
              <p className="text-gray-600 text-sm">
                Thank you for your business! Payment is due within 30 days.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicePreview;
