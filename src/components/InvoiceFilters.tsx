
import React from 'react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";

interface InvoiceFiltersProps {
  filter: string;
  setFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  setCurrentPage: (page: number) => void;
}

const InvoiceFilters = ({
  filter,
  setFilter,
  statusFilter,
  setStatusFilter,
  setCurrentPage
}: InvoiceFiltersProps) => {
  return (
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
  );
};

export default InvoiceFilters;
