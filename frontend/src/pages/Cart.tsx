
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/CartItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShoppingCart } from "lucide-react";

const CartPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">
          You haven't added any items to your cart yet.
        </p>
        <Button onClick={() => navigate("/")} className="flex items-center mx-auto">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Button>
      </div>
    );
  }

  const shipping = 0; // Free shipping for this demo
  const total = subtotal + shipping;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="space-y-2">
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
            <Button 
              variant="outline" 
              onClick={() => clearCart()}
            >
              Clear Cart
            </Button>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
