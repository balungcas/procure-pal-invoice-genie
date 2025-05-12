
import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FileUploadProps, Product } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const UploadFile = ({ onUploadSuccess }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }
    
    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const products = parseCSV(text);
        
        // Save products to Supabase
        const supabaseProducts = products.map(product => ({
          name: product.name,
          price: product.price,
          company: product.company,
          address: product.address,
          contact_number: product.contactNumber,
          email: product.email,
          cost_price: product.costPrice,
        }));

        const { error } = await supabase.from('products').insert(supabaseProducts);
        
        if (error) {
          throw error;
        }

        onUploadSuccess(products);
        toast.success(`Successfully imported ${products.length} products`);
      } catch (error) {
        console.error('Error processing file:', error);
        toast.error('Error processing file. Please check the format.');
      } finally {
        setIsProcessing(false);
      }
    };
    
    reader.readAsText(file);
  };

  // Simple CSV parser
  const parseCSV = (text: string): Product[] => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    const requiredHeaders = ['name', 'price', 'company', 'address', 'contactNumber', 'email'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
    }
    
    const products: Product[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',').map(value => value.trim());
      if (values.length !== headers.length) continue;
      
      const product: any = { id: crypto.randomUUID() };
      
      headers.forEach((header, index) => {
        if (header === 'price' || header === 'costPrice') {
          product[header] = parseFloat(values[index]);
        } else {
          product[header] = values[index];
        }
      });
      
      products.push(product as Product);
    }
    
    return products;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Upload Product Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-dashboard-primary bg-blue-50' : 'border-gray-300 hover:border-dashboard-primary'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Upload className="h-10 w-10 mx-auto mb-3 text-gray-400" />
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium text-dashboard-primary">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">CSV files only (max 10MB)</p>
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
            disabled={isProcessing}
          />
        </div>
        <div className="mt-3">
          <p className="text-xs text-gray-500">
            CSV must include these headers: name, price, company, address, contactNumber, email
          </p>
        </div>
        {isProcessing && (
          <div className="mt-3 text-center text-sm text-blue-600">
            Processing your file, please wait...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadFile;
