'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  label?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  value?: string[];
  onChange?: (files: string[]) => void;
  onFileSelect?: (files: File[]) => void;
  className?: string;
}

export const ImageUpload = ({
  label,
  maxFiles = 1,
  maxSizeMB = 5,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  value = [],
  onChange,
  onFileSelect,
  className,
}: ImageUploadProps) => {
  const [previews, setPreviews] = useState<string[]>(value);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setError('');

    // Validate file count
    if (previews.length + files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} image(s)`);
      return;
    }

    // Validate file types and sizes
    const validFiles: File[] = [];
    for (const file of files) {
      if (!acceptedTypes.includes(file.type)) {
        setError(`Invalid file type. Only ${acceptedTypes.join(', ')} are allowed.`);
        continue;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File size must be less than ${maxSizeMB}MB`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Create previews
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    const updatedPreviews = [...previews, ...newPreviews].slice(0, maxFiles);
    
    setPreviews(updatedPreviews);
    onChange?.(updatedPreviews);
    onFileSelect?.(validFiles);
  };

  const handleRemove = (index: number) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    onChange?.(updated);
    
    // Revoke object URL to free memory
    URL.revokeObjectURL(previews[index]);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
          {maxFiles > 1 && (
            <span className="ml-1 text-gray-500">(up to {maxFiles} images)</span>
          )}
        </label>
      )}

      {/* File Input (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        multiple={maxFiles > 1}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Area */}
      {previews.length < maxFiles && (
        <div
          onClick={handleClick}
          className="mb-4 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-colors hover:border-primary-400 hover:bg-gray-100"
        >
          <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            Click to upload or drag and drop
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {acceptedTypes.join(', ').toUpperCase()} up to {maxSizeMB}MB
          </p>
        </div>
      )}

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {previews.map((preview, index) => (
            <div key={index} className="group relative">
              <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-xs text-white">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {/* Helper Text */}
      {previews.length > 0 && previews.length < maxFiles && (
        <p className="mt-2 text-xs text-gray-500">
          {maxFiles - previews.length} more image(s) can be uploaded
        </p>
      )}
    </div>
  );
};

