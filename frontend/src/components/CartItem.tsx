
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { CartItem as CartItemType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { product, quantity } = item;
  const { updateQuantity, removeFromCart } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      handleRemove();
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      updateQuantity(product.id, newQuantity);
    }
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeFromCart(product.id);
    }, 300); // Slight delay for animation
  };

  const defaultImage = "/placeholder.svg";
  const getImageUrl = (url: string) => {
    if (!url) return defaultImage;
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}${url}`;
  };
  const imageUrl = product.images && product.images.length > 0 ? getImageUrl(product.images[0].url) : defaultImage;
  
  return (
    <div className={`flex border-b py-4 transition-opacity ${isRemoving ? 'opacity-0' : 'opacity-100'}`}>
      <div className="w-20 h-20 flex-shrink-0">
        <Link to={`/product/${product.id}`}>
          <img 
            src={imageUrl} 
            alt={product.title} 
            className="w-full h-full object-cover rounded"
          />
        </Link>
      </div>
      <div className="ml-4 flex-grow">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg hover:text-shop-primary">
            {product.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm">{product.sku}</p>
        <div className="mt-2 font-semibold">${product.price.toFixed(2)}</div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-r-none"
            onClick={handleDecrement}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="h-8 w-16 text-center rounded-none"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-l-none"
            onClick={handleIncrement}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleRemove}
          className="text-gray-500 hover:text-red-500"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
