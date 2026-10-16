import React, { useState } from 'react';
import { Coffee, Utensils, Image as ImageIcon } from 'lucide-react';
import { getOptimizedImageUrl, ImageTransformOptions } from '../services/cloudinary';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  transformOptions?: ImageTransformOptions;
  fallbackCategory?: 'coffee' | 'breakfast' | 'dessert' | 'desserts' | 'ambiance' | 'general';
  containerClassName?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  transformOptions,
  fallbackCategory = 'general',
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const optimizedSrc = src ? getOptimizedImageUrl(src, transformOptions) : '';

  const getCategoryIcon = () => {
    switch (fallbackCategory) {
      case 'coffee':
        return <Coffee className="w-8 h-8 text-[#C5A059]" />;
      case 'breakfast':
      case 'dessert':
        return <Utensils className="w-8 h-8 text-[#C5A059]" />;
      default:
        return <ImageIcon className="w-8 h-8 text-[#C5A059]" />;
    }
  };

  if (!src || hasError) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-[#2C1810] to-[#1A0E0A] p-2 text-center select-none overflow-hidden ${containerClassName} ${className}`}
      >
        {/* Subtle decorative Moroccan geometric background pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #C5A059 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-1.5 max-w-full">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#3B2217] flex items-center justify-center border border-[#C5A059]/30 shrink-0">
            {getCategoryIcon()}
          </div>
          <span className="text-[11px] font-medium text-[#EADBCE]/80 line-clamp-1 max-w-[180px]">
            {alt || 'دار القهوة'}
          </span>
          <span className="text-[9px] text-[#C5A059]/70 tracking-wider uppercase">
            The Coffee House
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#2C1810]/20 animate-pulse flex items-center justify-center" />
      )}
      <img
        src={optimizedSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        {...props}
      />
    </div>
  );
};
