
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, 1);
    
    // Add a slight delay before resetting state for animation effect
    setTimeout(() => setIsAdding(false), 500);
  };

  const defaultImage = "/placeholder.svg";
  const getImageUrl = (url: string) => {
    if (!url) return defaultImage;
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}${url}`;
  };
  const imageUrl = product.images && product.images.length > 0 ? getImageUrl(product.images[0].url) : defaultImage;

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md">
      <Link to={`/product/${product.id}`} className="flex-grow">
        <div className="aspect-[4/3] relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt={product.title} 
            className="w-full h-48 object-cover bg-gray-100"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold truncate mb-1">{product.title}</h3>
          <p className="text-lg font-bold text-shop-primary">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{product.description}</p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button 
          variant="default" 
          className={`w-full ${isAdding ? 'animate-cart-pulse bg-shop-secondary' : ''}`}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
