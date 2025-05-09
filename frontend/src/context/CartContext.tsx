
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { CartItem, Product } from "@/types";
import apiClient from "@/utils/apiClient";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  checkout: () => Promise<void>;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);

  // Cek user login dari localStorage/cookie
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  // Fetch cart dari backend jika user login
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setItems([]);
    }
  }, [user]);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchCart = async () => {
    if (!user) return;
    try {
      const response = await apiClient.get("/api/cart", { headers: getAuthHeader() });
      setItems(response.data || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal mengambil data keranjang");
      setItems([]);
    }
  };

  const addToCart = async (product: Product, quantity: number) => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu untuk menambah ke keranjang");
      window.location.href = "/login";
      return;
    }
    try {
      await apiClient.post(
        "/api/cart",
        { productId: product.id, quantity },
        { headers: getAuthHeader() }
      );
      toast.success(`Berhasil menambah ${product.title} ke keranjang`);
      await fetchCart();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal menambah ke keranjang");
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      await apiClient.delete(`/api/cart/${cartItemId}`, { headers: getAuthHeader() });
      toast.success("Item dihapus dari keranjang");
      await fetchCart();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal menghapus item dari keranjang");
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(cartItemId);
      return;
    }
    try {
      await apiClient.put(
        `/api/cart/${cartItemId}`,
        { quantity },
        { headers: getAuthHeader() }
      );
      toast.success("Jumlah item diupdate");
      await fetchCart();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal update jumlah item");
    }
  };

  const clearCart = async () => {
    try {
      // Hapus semua item satu per satu
      await Promise.all(items.map(item => removeFromCart(item.id)));
      toast.success("Keranjang dikosongkan");
      await fetchCart();
    } catch (error: any) {
      toast.error("Gagal mengosongkan keranjang");
    }
  };

  const checkout = async () => {
    try {
      await apiClient.post("/api/cart/checkout", {}, { headers: getAuthHeader() });
      toast.success("Checkout berhasil!");
      await fetchCart();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Checkout gagal");
    }
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
        checkout,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
