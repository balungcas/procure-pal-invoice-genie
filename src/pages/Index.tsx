
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import ProductTable from "@/components/ProductTable";
import UploadFile from "@/components/UploadFile";
import AddProductForm from "@/components/AddProductForm";
import { Product } from "@/types";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const handleUploadSuccess = (newProducts: Product[]) => {
    setProducts([...products, ...newProducts]);
  };

  const handleProductAdd = (product: Product) => {
    setProducts([...products, product]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6 text-dashboard-text">Procurement Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-dashboard-text">Total Products</CardTitle>
              <CardDescription>All available products</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-dashboard-primary">{products.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-dashboard-text">Suppliers</CardTitle>
              <CardDescription>Unique suppliers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-dashboard-primary">
                {new Set(products.map(p => p.company)).size}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-dashboard-text">Total Value</CardTitle>
              <CardDescription>Sum of all products</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-dashboard-primary">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(products.reduce((sum, product) => sum + product.price, 0))}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="products" className="mb-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="add">Add Product</TabsTrigger>
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="mt-4">
            <ProductTable products={products} />
          </TabsContent>
          <TabsContent value="add" className="mt-4">
            <AddProductForm onProductAdd={handleProductAdd} />
          </TabsContent>
          <TabsContent value="upload" className="mt-4">
            <UploadFile onUploadSuccess={handleUploadSuccess} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
