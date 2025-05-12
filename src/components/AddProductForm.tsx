
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AddProductFormProps, Product } from "@/types";

const AddProductForm = ({ onProductAdd }: AddProductFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    company: "",
    address: "",
    contactNumber: "",
    email: "",
    costPrice: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = (): boolean => {
    // Basic validation
    if (!formData.name || !formData.price || !formData.company || !formData.email) {
      toast.error("Please fill all required fields");
      return false;
    }

    // Validate price
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      toast.error("Price must be a positive number");
      return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Validate cost price if provided
    if (formData.costPrice && (isNaN(parseFloat(formData.costPrice)) || parseFloat(formData.costPrice) < 0)) {
      toast.error("Cost price must be a non-negative number");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: formData.name,
      price: parseFloat(formData.price),
      company: formData.company,
      address: formData.address,
      contactNumber: formData.contactNumber,
      email: formData.email,
    };

    // Add cost price if provided
    if (formData.costPrice) {
      newProduct.costPrice = parseFloat(formData.costPrice);
    }

    onProductAdd(newProduct);
    toast.success("Product added successfully");

    // Reset form
    setFormData({
      name: "",
      price: "",
      company: "",
      address: "",
      contactNumber: "",
      email: "",
      costPrice: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price <span className="text-red-500">*</span></Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company/Supplier <span className="text-red-500">*</span></Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="supplier@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter supplier address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter contact number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price (Optional)</Label>
              <Input
                id="costPrice"
                name="costPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.costPrice}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="bg-dashboard-primary hover:bg-dashboard-secondary w-full">
            Add Product
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddProductForm;
