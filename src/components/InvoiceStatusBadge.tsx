
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { PaymentStatus } from "@/types";

interface InvoiceStatusBadgeProps {
  status: PaymentStatus;
}

const InvoiceStatusBadge = ({ status }: InvoiceStatusBadgeProps) => {
  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return { label: 'Paid', variant: 'bg-green-100 text-green-800 hover:bg-green-200' };
      case 'half_paid':
        return { label: 'Half Paid', variant: 'bg-blue-100 text-blue-800 hover:bg-blue-200' };
      case 'due':
        return { label: 'Due', variant: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' };
      case 'overdue':
        return { label: 'Overdue', variant: 'bg-red-100 text-red-800 hover:bg-red-200' };
      case 'not_paid':
      default:
        return { label: 'Not Paid', variant: 'bg-gray-100 text-gray-800 hover:bg-gray-200' };
    }
  };

  const { label, variant } = getStatusConfig(status);

  return (
    <Badge className={variant} variant="outline">
      {label}
    </Badge>
  );
};

export default InvoiceStatusBadge;
