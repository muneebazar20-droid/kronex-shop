'use client';

import { useState } from 'react';
import { useSettingsStore } from '@/lib/store';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const { settings } = useSettingsStore();
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className={`${
        settings.theme === 'dark'
          ? 'bg-gray-800 border-gray-700'
          : 'bg-gray-100 border-gray-300'
      } border rounded-lg p-4 h-96 flex items-center justify-center overflow-hidden`}>
        <img
          src={images[selectedImage]}
          alt={productName}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Thumbnail Gallery */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
              selectedImage === index
                ? 'border-blue-600'
                : settings.theme === 'dark'
                ? 'border-gray-700 hover:border-gray-600'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <img src={image} alt={`${productName} ${index}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
