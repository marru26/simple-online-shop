
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/context/ProductContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";
import { toast } from "sonner";

const AddProductPage = () => {
  const { addProduct } = useProducts();
  const { isMerchant } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    sku: "",
    description: "",
    price: "",
    quantity: "",
  });
  const [images, setImages] = useState<{ url: string; file: File; productId: number }[]>([]);

  // Ensure only merchants can access this page
  if (!isMerchant) {
    navigate("/");
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Form validation
    if (!formData.title || !formData.sku || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    const price = parseFloat(formData.price);
    const quantity = parseInt(formData.quantity);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (isNaN(quantity) || quantity < 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    setIsSubmitting(true);
    try {
      await addProduct({
        title: formData.title,
        sku: formData.sku,
        description: formData.description,
        price,
        quantity,
        images,
      });
      toast.success(`Product "${formData.title}" added successfully`);
      setIsSubmitting(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Product Name *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Product Images</Label>
            <ImageUpload onImagesChange={setImages} />
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? "Adding Product..." : "Add Product"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
