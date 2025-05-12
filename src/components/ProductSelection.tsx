
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Product } from "@/types";

interface ProductSelectionProps {
  products: Product[];
  selectedProducts: Map<string, { product: Product, quantity: number }>;
  onProductSelect: (product: Product, selected: boolean) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  loading: boolean;
}

const ProductSelection = ({
  products,
  selectedProducts,
  onProductSelect,
  onQuantityChange,
  loading
}: ProductSelectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter products based on search term
  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.company.toLowerCase().includes(searchLower)
    );
  });

  // Format price to Philippine Peso currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      currencyDisplay: 'symbol'
    }).format(price);
  };

  if (loading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No products available. Please add products first.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="Search products or suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Select</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const isSelected = selectedProducts.has(product.id);
                const selectedItem = selectedProducts.get(product.id);
                
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox 
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          onProductSelect(product, checked === true);
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.company}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={selectedItem?.quantity || 0}
                        onChange={(e) => {
                          const qty = parseInt(e.target.value) || 0;
                          if (qty > 0) {
                            onQuantityChange(product.id, qty);
                          }
                        }}
                        disabled={!isSelected}
                        className="w-20"
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No products match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {selectedProducts.size > 0 && (
        <div className="mt-4 text-sm text-muted-foreground">
          {selectedProducts.size} product{selectedProducts.size !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
};

export default ProductSelection;
