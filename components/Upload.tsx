// components/Upload.tsx
"use client";
import { useState } from 'react'
import { Upload as UploadIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function Upload() {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Here you would typically handle the file upload to your backend
    console.log('File to upload:', file)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Picture</Label>
        <Input id="picture" type="file" onChange={handleFileChange} accept="image/png, image/jpeg" />
      </div>
      {file && (
        <div className="text-sm text-muted-foreground">
          Selected file: {file.name}
        </div>
      )}
      <Button type="submit">
        <UploadIcon className="mr-2 h-4 w-4" /> Generate Headshot
      </Button>
    </form>
  )
}
