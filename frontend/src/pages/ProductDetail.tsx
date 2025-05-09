
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { ShoppingCart, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { getImageUrl } from "@/utils/imageUtils";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "0");
  const navigate = useNavigate();
  const { products, isLoading, deleteProduct } = useProducts();
  const { isMerchant } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-shop-primary"></div>
      </div>
    );
  }
  
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">Sorry, the product you are looking for does not exist.</p>
        <Button onClick={() => navigate("/")} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Shop
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(product.id);
      navigate("/");
    }
  };

  const defaultImage = "/placeholder.svg";
  const getImageUrl = (url: string) => {
    if (!url) return defaultImage;
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}${url}`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center hover:bg-transparent hover:text-shop-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="md:sticky md:top-24">
          {product.images.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={image.id}>
                    <div className="aspect-square rounded-md overflow-hidden">
                      <img 
                        src={getImageUrl(image.url)} 
                        alt={`${product.title} - Image ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          ) : (
            <div className="aspect-square rounded-md overflow-hidden">
              <img 
                src={defaultImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="text-muted-foreground mt-1">SKU: {product.sku}</p>
          </div>

          <div className="text-2xl font-bold text-shop-primary">
            ${product.price.toFixed(2)}
          </div>

          <div className="prose max-w-none">
            <p>{product.description}</p>
          </div>

          {product.quantity > 0 ? (
            <div className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="w-24">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product.quantity}
                    value={quantity}
                    onChange={handleQuantityChange}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {product.quantity} in stock
                </p>
              </div>

              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full sm:w-auto"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          ) : (
            <div className="inline-block bg-muted px-4 py-2 rounded-md">
              <p className="font-medium text-red-500">Out of Stock</p>
            </div>
          )}

          {isMerchant && (
            <div className="pt-4 flex gap-4">
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={() => navigate(`/edit-product/${product.id}`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Product
              </Button>
              <Button 
                variant="destructive"
                className="flex items-center"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Product
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
