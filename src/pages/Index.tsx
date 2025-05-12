
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductTable from "@/components/ProductTable";
import UploadFile from "@/components/UploadFile";
import AddProductForm from "@/components/AddProductForm";
import { Product } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load products from Supabase when component mounts
    fetchProducts();
    
    // Set up real-time subscription for product updates
    const channel = supabase
      .channel('public:products')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'products' 
      }, () => {
        // Fetch products again when there's any change
        fetchProducts();
      })
      .subscribe();

    return () => {
      // Clean up subscription
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        throw error;
      }

      // Map database products to our Product interface
      const mappedProducts: Product[] = data.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        company: product.company,
        address: product.address,
        contactNumber: product.contact_number,
        email: product.email,
        costPrice: product.cost_price,
      }));
      
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (newProducts: Product[]) => {
    // We don't need to update state manually as the real-time subscription will handle it
    toast.success(`${newProducts.length} products uploaded successfully`);
  };

  const handleProductAdd = (product: Product) => {
    // We don't need to update state manually as the real-time subscription will handle it
    toast.success('Product added successfully');
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
                {formatPrice(products.reduce((sum, product) => sum + product.price, 0))}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6">
          <Link to="/create-invoice">
            <Button className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue="products" className="mb-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="add">Add Product</TabsTrigger>
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="mt-4">
            {loading ? (
              <div className="text-center p-8 text-gray-500">Loading products...</div>
            ) : (
              <ProductTable products={products} />
            )}
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
