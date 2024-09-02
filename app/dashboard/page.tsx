// app/dashboard/page.
"use client";

import { useState, useEffect } from 'react';
import { Upload } from '@/components/Upload'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string>("male");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [predictionId, setPredictionId] = useState<string | null>(null);

  const handleUploadComplete = (url: string, gender: string) => {
    setUploadedImageUrl(url);
    setSelectedGender(gender);
    setGeneratedImageUrl(null);
    setPredictionId(null);
  };

  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender);
    setGeneratedImageUrl(null);
    setPredictionId(null);
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
        throw new Error('Failed to start image generation');
      }

      const data = await response.json();
      setPredictionId(data.predictionId);
    } catch (error) {
      console.error("Error starting headshot generation:", error);
      alert("Failed to start headshot generation. Please try again.");
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!predictionId || !uploadedImageUrl) return;

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/replicate/status?id=${predictionId}&originalImageUrl=${encodeURIComponent(uploadedImageUrl)}&gender=${selectedGender}`);
        if (!response.ok) {
          throw new Error('Failed to check prediction status');
        }
        const data = await response.json();
        
        if (data.status === 'complete') {
          setGeneratedImageUrl(data.output);
          setIsGenerating(false);
          setPredictionId(null);
        } else if (data.status === 'failed') {
          throw new Error(data.error || 'Image generation failed');
        } else {
          // Still processing, check again in 2 seconds
          setTimeout(checkStatus, 2000);
        }
      } catch (error) {
        console.error("Error checking prediction status:", error);
        alert("Failed to generate headshot. Please try again.");
        setIsGenerating(false);
        setPredictionId(null);
      }
    };

    checkStatus();
  }, [predictionId, uploadedImageUrl, selectedGender]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">AI Headshot Generator</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upload Your Photo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Upload onUploadComplete={handleUploadComplete} onGenderChange={handleGenderChange} />
          {uploadedImageUrl && (
            <Button 
              onClick={handleGenerateHeadshot} 
              disabled={isGenerating}
              className="w-full sm:w-auto"
            >
              {isGenerating ? "Generating..." : "Generate Headshot"}
            </Button>
          )}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Before and After</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-md font-medium">Original Image</h4>
                <div className="bg-muted rounded-lg p-4 flex items-center justify-center h-[200px] sm:h-[300px]">
                  {uploadedImageUrl ? (
                    <img src={uploadedImageUrl} alt="Original Image" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <p className="text-muted-foreground text-center">Upload an image to see it here</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-md font-medium">Generated Headshot</h4>
                <div className="bg-muted rounded-lg p-4 flex items-center justify-center h-[200px] sm:h-[300px]">
                  {isGenerating ? (
                    <p className="text-center">Generating headshot...</p>
                  ) : generatedImageUrl ? (
                    <img src={generatedImageUrl} alt="Generated Headshot" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <p className="text-muted-foreground text-center">Your generated headshot will appear here</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
