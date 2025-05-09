
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/types";
import { toast } from "sonner";
import apiClient from "@/utils/apiClient";
import { getImageUrl } from "@/utils/imageUtils";

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: number, updatedProduct: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};

// Mock product data
const initialProducts: Product[] = [
  {
    id: 1,
    title: "Premium Wireless Headphones",
    sku: "AUDIO001",
    description: "High-quality wireless headphones with noise cancellation and 24-hour battery life.",
    price: 149.99,
    quantity: 50,
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        productId: 1
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b",
        productId: 1
      }
    ]
  },
  {
    id: 2,
    title: "Smart Fitness Tracker",
    sku: "WEAR002",
    description: "Track your activities, heart rate, sleep patterns and more with this advanced fitness tracker.",
    price: 89.99,
    quantity: 75,
    images: [
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288",
        productId: 2
      }
    ]
  },
  {
    id: 3,
    title: "Ultra HD Smart TV",
    sku: "TV003",
    description: "55-inch Ultra HD Smart TV with built-in streaming services and voice control.",
    price: 599.99,
    quantity: 15,
    images: [
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9",
        productId: 3
      }
    ]
  },
  {
    id: 4,
    title: "Professional Camera Kit",
    sku: "PHOTO004",
    description: "Complete professional camera kit with multiple lenses, tripod, and carrying case.",
    price: 1299.99,
    quantity: 8,
    images: [
      {
        id: 5,
        url: "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac",
        productId: 4
      },
      {
        id: 6,
        url: "https://images.unsplash.com/photo-1617196701537-7329482cc9fe",
        productId: 4
      }
    ]
  },
  {
    id: 5,
    title: "Ergonomic Office Chair",
    sku: "FURN005",
    description: "Comfortable ergonomic office chair with adjustable height, lumbar support, and breathable mesh back.",
    price: 249.99,
    quantity: 25,
    images: [
      {
        id: 7,
        url: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1",
        productId: 5
      }
    ]
  },
  {
    id: 6,
    title: "Smart Home Security System",
    sku: "HOME006",
    description: "Complete smart home security system with cameras, sensors, and mobile app integration.",
    price: 349.99,
    quantity: 30,
    images: [
      {
        id: 8,
        url: "https://images.unsplash.com/photo-1558002038-1055907df827",
        productId: 6
      }
    ]
  }
];

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextId, setNextId] = useState(7);
  const [nextImageId, setNextImageId] = useState(9);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get("/api/products");
        setProducts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load products from API:", error);
        toast.error("Failed to load products from API");
        setProducts(initialProducts); // Fallback to initial data
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (products.length > 0 && !isLoading) {
      try {
        localStorage.setItem("products", JSON.stringify(products));
      } catch (error) {
        console.error("Failed to save products to localStorage:", error);
      }
    }
  }, [products, isLoading]);

  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      const formData = new FormData();
      formData.append("title", product.title);
      formData.append("sku", product.sku);
      formData.append("description", product.description);
      formData.append("price", product.price.toString());
      formData.append("quantity", product.quantity.toString());
      if (product.images && product.images.length > 0) {
        product.images.forEach((img: any, idx: number) => {
          if (img.file) {
            formData.append("images", img.file);
          }
        });
      }
      console.log(formData);
      
      const response = await apiClient.post("/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProducts(prevProducts => [...prevProducts, response.data]);
      toast.success(`Product \"${product.title}\" added successfully`);
    } catch (error: any) {
      // Tangani error validasi dari backend
      const backendMsg = error?.response?.data?.message;
      if (backendMsg) {
        toast.error(backendMsg);
      } else {
        toast.error("Gagal menambah produk ke server");
      }
      console.error("Error addProduct:", error);
    }
  };

  const updateProduct = (id: number, updatedProduct: Partial<Product>) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === id ? { ...product, ...updatedProduct } : product
      )
    );
    toast.success("Product updated successfully");
  };

  const deleteProduct = (id: number) => {
    const productToDelete = products.find(p => p.id === id);
    setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    if (productToDelete) {
      toast.success(`Product "${productToDelete.title}" deleted`);
    }
  };

  const getImageUrlForProduct = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (!product || !product.images || product.images.length === 0) return "";
    return getImageUrl(product.images[0].url);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        addProduct,
        updateProduct,
        deleteProduct,
        getImageUrlForProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
