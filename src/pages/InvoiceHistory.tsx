
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Link } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Invoice, PaymentStatus } from "@/types";
import { transformDbInvoice } from "@/utils/invoiceUtils";
import InvoiceFilters from "@/components/InvoiceFilters";
import InvoiceList from "@/components/InvoiceList";

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
      
      return data.map(transformDbInvoice);
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

        <InvoiceFilters 
          filter={filter} 
          setFilter={setFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          setCurrentPage={setCurrentPage}
        />

        {isLoading ? (
          <div className="text-center py-8">
            Loading invoices...
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-red-500">
            Error loading invoices. Please try again.
          </div>
        ) : (
          <>
            <InvoiceList 
              invoices={paginatedInvoices} 
              handleUpdateStatus={handleUpdateStatus} 
            />

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
