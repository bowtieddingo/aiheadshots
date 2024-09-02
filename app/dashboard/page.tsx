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
    if (!predictionId) return;

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/replicate/status?id=${predictionId}`);
        if (!response.ok) {
          throw new Error('Failed to check prediction status');
        }
        const data = await response.json();
        
        if (data.status === 'complete') {
          setGeneratedImageUrl(data.output[0]);
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
  }, [predictionId]);

  // ... rest of the component (return statement) remains the same
}
