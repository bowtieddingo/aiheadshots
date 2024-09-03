// app/dashboard/page.
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Upload } from '@/components/Upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string>("male");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [userTokens, setUserTokens] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success === 'subscription_active') {
      setStatusMessage({ type: 'success', message: 'Your subscription is now active!' });
    } else if (error) {
      setStatusMessage({ type: 'error', message: 'There was an error processing your subscription. Please try again.' });
    }

    if (session) {
      fetchUserTokens();
    }
  }, [searchParams, session]);

  const fetchUserTokens = async () => {
    try {
      const response = await fetch('/api/user/tokens');
      if (response.ok) {
        const data = await response.json();
        setUserTokens(data.tokens);
      }
    } catch (error) {
      console.error('Error fetching user tokens:', error);
    }
  };

  const handleUploadComplete = (url: string, gender: string) => {
    setUploadedImageUrl(url);
    setSelectedGender(gender);
    setGeneratedImageUrl(null);
    setPredictionId(null);
    setError(null);
  };

  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender);
    setGeneratedImageUrl(null);
    setPredictionId(null);
    setError(null);
  };

  const handleGenerateHeadshot = async () => {
    if (!uploadedImageUrl) {
      setError("Please upload an image first.");
      return;
    }

    if (userTokens && userTokens <= 0) {
      setError("You don't have enough tokens. Please upgrade your plan.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch('/api/replicate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uploadedImageUrl, gender: selectedGender }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start image generation');
      }

      const data = await response.json();
      setPredictionId(data.predictionId);
      setUserTokens(data.remainingTokens);
    } catch (error) {
      console.error("Error starting headshot generation:", error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
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
          await fetchUserTokens(); // Refresh token count after successful generation
        } else if (data.status === 'failed') {
          throw new Error(data.error || 'Image generation failed');
        } else {
          // Still processing, check again in 2 seconds
          setTimeout(checkStatus, 2000);
        }
      } catch (error) {
        console.error("Error checking prediction status:", error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        setIsGenerating(false);
        setPredictionId(null);
      }
    };

    checkStatus();
  }, [predictionId, uploadedImageUrl, selectedGender]);

  return (
    <div className="container mx-auto py-10 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">AI Headshot Generator</h1>

      {statusMessage && (
        <Alert variant={statusMessage.type === 'success' ? 'default' : 'destructive'}>
          <AlertDescription>{statusMessage.message}</AlertDescription>
        </Alert>
      )}

      {userTokens !== null && (
        <p className="text-lg font-semibold">Available tokens: {userTokens}</p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upload Your Photo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Upload onUploadComplete={handleUploadComplete} onGenderChange={handleGenderChange} />
          {uploadedImageUrl && (
            <Button 
              onClick={handleGenerateHeadshot} 
              disabled={isGenerating || (userTokens !== null && userTokens <= 0)}
              className="w-full sm:w-auto"
            >
              {isGenerating ? "Generating..." : "Generate Headshot"}
            </Button>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                {error}
                {(error.toLowerCase().includes('no active subscription') || error.toLowerCase().includes('don\'t have enough tokens')) && (
                  <>
                    <br />
                    <Link href="/pricing" className="underline font-semibold">
                      View our pricing plans
                    </Link>
                  </>
                )}
              </AlertDescription>
            </Alert>
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
