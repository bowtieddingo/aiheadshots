// components/Upload.tsx
"use client";
import { useState, useEffect } from 'react'
import { Upload as UploadIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UploadDropzone } from "@/utils/uploadthing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function Upload({ onUploadComplete, onGenderChange }: { 
  onUploadComplete: (url: string, gender: string) => void,
  onGenderChange: (gender: string) => void 
}) {
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string>("male");

  const handleUploadComplete = (res: { url: string }[]) => {
    if (res && res[0]) {
      const url = res[0].url;
      setUploadedFileUrl(url);
      onUploadComplete(url, selectedGender);
    }
  };

  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender);
    onGenderChange(gender);
  };

  return (
    <div className="space-y-4">
      <Select onValueChange={handleGenderChange} defaultValue="male">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
        </SelectContent>
      </Select>
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={handleUploadComplete}
        onUploadError={(error: Error) => {
          alert(`Upload ERROR! ${error.message}`);
        }}
      />
      {uploadedFileUrl && (
        <div className="text-sm text-muted-foreground">
          File uploaded successfully. URL: {uploadedFileUrl}
        </div>
      )}
    </div>
  )
}
