// app/dashboard/past-generations/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ImageModal from '@/components/ImageModal';

interface Generation {
  _id: string;
  originalImageUrl: string;
  generatedImageUrl: string;
  gender: string;
  createdAt: string;
}

export default function PastGenerationsPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);

  useEffect(() => {
    fetchGenerations();
  }, []);

  const fetchGenerations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generations');
      if (!response.ok) {
        throw new Error('Failed to fetch generations');
      }
      const data = await response.json();
      setGenerations(data);
    } catch (error) {
      console.error('Error fetching generations:', error);
      setError('Failed to load past generations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (url: string, alt: string) => {
    setSelectedImage({ url, alt });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Past Generations</h1>
      {generations.length === 0 ? (
        <p>No past generations found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {generations.map((generation) => (
            <Card key={generation._id}>
              <CardHeader>
                <CardTitle>Generation ({generation.gender})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Original Image</h4>
                  <img 
                    src={generation.originalImageUrl} 
                    alt="Original" 
                    className="w-full h-40 object-cover rounded cursor-pointer" 
                    onClick={() => handleImageClick(generation.originalImageUrl, "Original Image")}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Generated Headshot</h4>
                  <img 
                    src={generation.generatedImageUrl} 
                    alt="Generated" 
                    className="w-full h-40 object-cover rounded cursor-pointer"
                    onClick={() => handleImageClick(generation.generatedImageUrl, "Generated Headshot")}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Created at: {new Date(generation.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {selectedImage && (
        <ImageModal 
          imageUrl={selectedImage.url} 
          altText={selectedImage.alt} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </div>
  );
}
