// app/dashboard/page.tsx
"use client";
import { useState } from 'react';
import { Upload } from '@/components/Upload'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string>("male");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleUploadComplete = (url: string, gender: string) => {
    setUploadedImageUrl(url);
    setSelectedGender(gender);
    setGeneratedImageUrl(null); // Reset generated image when a new file is uploaded
  };

  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender);
    setGeneratedImageUrl(null); // Reset generated image when gender is changed
  };

  const handleGenerateHeadshot = async () => {
    if (!uploadedImageUrl) {
      alert("Please upload an image first.");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/replicate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uploadedImageUrl, gender: selectedGender }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImageUrl(data.generatedImageUrl);
    } catch (error) {
      console.error("Error generating headshot:", error);
      alert("Failed to generate headshot. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">AI Headshot Generator</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upload Your Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <Upload onUploadComplete={handleUploadComplete} onGenderChange={handleGenderChange} />
          {uploadedImageUrl && (
            <Button 
              onClick={handleGenerateHeadshot} 
              disabled={isGenerating}
              className="mt-4"
            >
              {isGenerating ? "Generating..." : "Generate Headshot"}
            </Button>
          )}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Before and After</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-md font-medium mb-2">Original Image</h4>
                <div className="bg-muted rounded-lg p-4 flex items-center justify-center h-[300px]">
                  {uploadedImageUrl ? (
                    <img src={uploadedImageUrl} alt="Original Image" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <p className="text-muted-foreground">Upload an image to see it here</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-md font-medium mb-2">Generated Headshot</h4>
                <div className="bg-muted rounded-lg p-4 flex items-center justify-center h-[300px]">
                  {isGenerating ? (
                    <p>Generating headshot...</p>
                  ) : generatedImageUrl ? (
                    <img src={generatedImageUrl} alt="Generated Headshot" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <p className="text-muted-foreground">Your generated headshot will appear here</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
