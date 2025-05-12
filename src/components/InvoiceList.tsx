
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InvoiceStatusBadge from "@/components/InvoiceStatusBadge";
import { Invoice, PaymentStatus } from "@/types";
import { formatDate, formatPrice } from "@/utils/invoiceUtils";

interface InvoiceListProps {
  invoices: Invoice[];
  handleUpdateStatus: (invoiceId: string, newStatus: PaymentStatus) => void;
}

const InvoiceList = ({ invoices, handleUpdateStatus }: InvoiceListProps) => {
  if (invoices.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No invoices found. Please create a new invoice or adjust your filters.
      </div>
    );
  }
  
  return (
    <div className="rounded-md border overflow-hidden mb-6">
      <Table>
        <TableCaption>List of all invoices</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
              <TableCell>{invoice.customerName}</TableCell>
              <TableCell>{formatDate(invoice.createdAt)}</TableCell>
              <TableCell>{invoice.dueDate ? formatDate(invoice.dueDate) : '-'}</TableCell>
              <TableCell className="text-right">{formatPrice(invoice.totalAmount)}</TableCell>
              <TableCell>
                <InvoiceStatusBadge status={invoice.paymentStatus || 'not_paid'} />
              </TableCell>
              <TableCell className="text-right">
                <Select 
                  value={invoice.paymentStatus || 'not_paid'} 
                  onValueChange={(value) => handleUpdateStatus(invoice.id, value as PaymentStatus)}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="not_paid">Not Paid</SelectItem>
                    <SelectItem value="half_paid">Half Paid</SelectItem>
                    <SelectItem value="due">Due</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceList;
