
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImageUploadProps {
  onImagesChange: (images: { url: string; file: File; productId: number }[]) => void;
}

const ImageUpload = ({ onImagesChange }: ImageUploadProps) => {
  const [images, setImages] = useState<{ url: string; file: File; productId: number }[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => {
        const url = URL.createObjectURL(file);
        return { url, file, productId: 0 };
      });
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onImagesChange(updatedImages);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
            <img 
              src={image.url} 
              alt={`Product image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 h-8 w-8 opacity-90"
              onClick={() => removeImage(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        <input
          type="file"
          id="imageUpload"
          className="hidden"
          onChange={handleImageChange}
          multiple
          accept="image/*"
        />
        <label 
          htmlFor="imageUpload"
          className="cursor-pointer bg-muted hover:bg-muted/80 text-muted-foreground flex justify-center p-4 rounded-md border-2 border-dashed"
        >
          <div className="text-center">
            <p className="font-medium mb-1">Click to upload images</p>
            <p className="text-sm">Supported formats: JPG, PNG, GIF</p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;
