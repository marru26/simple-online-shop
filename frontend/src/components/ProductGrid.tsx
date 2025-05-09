
import { Product } from "@/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

const ProductGrid = ({ products, isLoading = false }: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className="product-grid">
        {[...Array(6)].map((_, index) => (
          <div 
            key={index}
            className="bg-muted animate-pulse rounded-lg h-[320px]"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
