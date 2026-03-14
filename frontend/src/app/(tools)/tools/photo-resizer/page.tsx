"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Download, Upload, Trash2, Maximize, Crop } from "lucide-react";
import { toast } from "sonner";
import NextImage from "next/image";

export default function PhotoResizerPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [quality, setQuality] = useState<number>(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setResizedImage(null);
        // Load image to get original dimensions
        const img = new Image();
        img.onload = () => {
          setWidth(img.width);
          setHeight(img.height);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const resizeImage = useCallback(() => {
    if (!selectedImage) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality / 100);
        setResizedImage(dataUrl);
        toast.success("Image resized successfully!");
      }
      setIsProcessing(false);
    };
    img.src = selectedImage;
  }, [selectedImage, width, height, quality]);

  const downloadImage = () => {
    if (!resizedImage) return;
    const link = document.createElement("a");
    link.href = resizedImage;
    link.download = "resized-image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Professional Photo Resizer</h1>
        <p className="text-muted-foreground">
          Quickly resize your documents and photos for exam applications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Adjust dimensions and quality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width (px)</Label>
                <Input
                  id="width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (px)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <Label>Quality ({quality}%)</Label>
                </div>
                <Slider
                  value={[quality]}
                  onValueChange={(val) => setQuality(val[0])}
                  max={100}
                  step={1}
                />
              </div>
              <Button 
                onClick={resizeImage} 
                className="w-full mt-4" 
                disabled={!selectedImage || isProcessing}
              >
                {isProcessing ? "Processing..." : "Apply Resizing"}
              </Button>
            </CardContent>
          </Card>

          {resizedImage && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Ready to Download</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={downloadImage} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Download className="mr-2 h-4 w-4" /> Download JPG
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {!selectedImage ? (
            <div 
              className="border-2 border-dashed border-slate-300 rounded-2xl h-[400px] flex flex-col items-center justify-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-slate-400 mb-4" />
              <p className="text-slate-600 font-medium">Click or drag to upload photo</p>
              <p className="text-slate-400 text-sm mt-1">Supports JPG, PNG, WebP</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />
            </div>
          ) : (
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Preview</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setSelectedImage(null);
                    setResizedImage(null);
                  }}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-video bg-slate-100 flex items-center justify-center">
                  {resizedImage ? (
                    <NextImage 
                      src={resizedImage} 
                      alt="Resized preview" 
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  ) : (
                    <NextImage 
                      src={selectedImage} 
                      alt="Original preview" 
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  )}
                </div>
                <div className="p-4 bg-slate-50 border-t flex justify-between text-xs text-slate-500">
                  <span>Target: {width} x {height} px</span>
                  <span>Format: JPEG</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-50 border-none shadow-none">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    <Maximize className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Smart Scale</h4>
                    <p className="text-xs text-slate-500 mt-1">Automatically maintains aspect ratio for professional results.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-50 border-none shadow-none">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Crop className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Exam Ready</h4>
                    <p className="text-xs text-slate-500 mt-1">Perfect for UPS, SSC, and University application forms.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
