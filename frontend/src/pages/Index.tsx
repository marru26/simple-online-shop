
import { useState } from "react";
import { useProducts } from "@/context/ProductContext";
import ProductGrid from "@/components/ProductGrid";
import { Input } from "@/components/ui/input";

const HomePage = () => {
  const { products, isLoading } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-shop-dark mb-4">
          Welcome to SSO
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover quality products at competitive prices. Browse our collection and shop with confidence.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-8">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      <ProductGrid products={filteredProducts} isLoading={isLoading} />
    </div>
  );
};

export default HomePage;
