import { useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useImageUpload } from '@/hooks/useImageUpload';

interface SizeImageUploaderProps {
  image: string | undefined;
  onImageChange: (image: string | undefined) => void;
}

export const SizeImageUploader = ({
  image,
  onImageChange,
}: SizeImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, isUploading, uploadProgress } = useImageUpload();

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const url = await uploadImage(file, 'size-charts');
    if (url) {
      onImageChange(url);
    }
  };

  return (
    <div className="space-y-2">
      {image ? (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
          <img
            src={image}
            alt="Size reference"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => onImageChange(undefined)}
            className="absolute top-1 right-1 bg-background/80 rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="space-y-2">
              <Loader2 className="w-6 h-6 mx-auto animate-spin text-primary" />
              <Progress value={uploadProgress} className="w-full max-w-[120px] mx-auto" />
            </div>
          ) : (
            <div className="space-y-1">
              <Upload className="w-6 h-6 mx-auto text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Upload size chart</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
