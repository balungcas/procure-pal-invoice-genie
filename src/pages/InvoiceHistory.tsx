
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Calendar } from "lucide-react";
import { Invoice, PaymentStatus } from "@/types";
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import InvoiceStatusBadge from "@/components/InvoiceStatusBadge";

const InvoiceHistory = () => {
  const [filter, setFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const { data: invoices, isLoading, isError, refetch } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      // Convert dates and check for overdue status
      return data.map((invoice): Invoice => {
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
      });
    },
  });

  const handleUpdateStatus = async (invoiceId: string, newStatus: PaymentStatus) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ payment_status: newStatus })
        .eq('id', invoiceId);

      if (error) {
        throw error;
      }

      toast.success(`Invoice status updated to ${newStatus.replace('_', ' ')}`);
      refetch();
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast.error('Failed to update invoice status');
    }
  };

  // Filter and paginate invoices
  const filteredInvoices = invoices?.filter(invoice => {
    const matchesSearchTerm = filter === '' || 
      invoice.customerName.toLowerCase().includes(filter.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(filter.toLowerCase());
      
    const matchesStatus = statusFilter === '' || invoice.paymentStatus === statusFilter;
    
    return matchesSearchTerm && matchesStatus;
  }) || [];
  
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  const totalPages = Math.ceil(filteredInvoices.length / pageSize);

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  // Format price to Philippine Peso
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      currencyDisplay: 'symbol'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-dashboard-text">Invoice History</h2>
          <Link to="/create-invoice">
            <Button className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Create New Invoice
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <div className="p-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1">
                <div className="text-sm font-medium mb-1">Search</div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by customer or invoice number..."
                    className="pl-8"
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value);
                      setCurrentPage(1); // Reset to first page when filtering
                    }}
                  />
                </div>
              </div>
              <div className="w-full sm:w-auto">
                <div className="text-sm font-medium mb-1">Payment Status</div>
                <Select 
                  value={statusFilter} 
                  onValueChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1); // Reset to first page when filtering
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="not_paid">Not Paid</SelectItem>
                    <SelectItem value="half_paid">Half Paid</SelectItem>
                    <SelectItem value="due">Due</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {isLoading ? (
          <div className="text-center py-8">
            Loading invoices...
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-red-500">
            Error loading invoices. Please try again.
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No invoices found. Please create a new invoice or adjust your filters.
          </div>
        ) : (
          <>
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
                  {paginatedInvoices.map((invoice) => (
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

            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        isActive={currentPage === i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InvoiceHistory;
