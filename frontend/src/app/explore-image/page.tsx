"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function ExploreImagePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageDescription, setImageDescription] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      // Reset previous results when a new image is selected
      setImageDescription("");
      setQuestion("");
      setAnswer("");
      setError(null);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      setError("Please select an image file first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnswer(""); // Clear previous answer if only description was fetched

    const formData = new FormData();
    formData.append("image_file", selectedFile);
    if (question.trim()) {
      formData.append("question", question.trim());
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/explain-image", {
        method: "POST",
        body: formData,
        // Headers are not explicitly set for FormData; browser handles Content-Type
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Failed to process the request. Status: " + response.status }));
        throw new Error(errorData.detail || "An unknown error occurred");
      }

      const result = await response.json();
      setImageDescription(result.image_description || "No description provided.");
      if (result.answer) {
        setAnswer(result.answer);
      }
    } catch (err: any) {
      console.error("API Error:", err);
      setError(err.message || "Failed to get explanation from the backend.");
      setImageDescription(""); // Clear description on error
      setAnswer("");
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Image Exploration Mode</CardTitle>
          <CardDescription className="text-center">
            Upload a medical image to get an AI-generated description and ask questions about it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="imageUpload" className="text-lg font-semibold">Upload Medical Image</Label>
              <Input 
                id="imageUpload" 
                type="file" 
                accept="image/png, image/jpeg, image/webp" 
                onChange={handleFileChange} 
                className="mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>

            {previewUrl && (
              <div className="mt-4 border rounded-lg overflow-hidden">
                <img src={previewUrl} alt="Selected preview" className="w-full h-auto object-contain max-h-96" />
              </div>
            )}

            {selectedFile && (
              <>
                <div>
                  <Label htmlFor="question" className="text-lg font-semibold">Ask a question about the image (optional)</Label>
                  <Textarea 
                    id="question"
                    value={question}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setQuestion(e.target.value)}
                    placeholder="e.g., What abnormalities are visible? What is the likely diagnosis based on this image?"
                    className="mt-2 min-h-[80px]"
                  />
                </div>
                <Button type="submit" disabled={isLoading || !selectedFile} className="w-full text-lg py-6">
                  {isLoading ? "Processing..." : (question.trim() ? "Get Description & Answer" : "Get Description")}
                </Button>
              </>
            )}
          </form>

          {error && (
            <Alert variant="destructive" className="mt-6">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {imageDescription && (
            <Card className="mt-6 bg-secondary/30">
              <CardHeader>
                <CardTitle className="text-xl">Image Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{imageDescription}</p>
              </CardContent>
            </Card>
          )}

          {answer && (
            <Card className="mt-6 bg-secondary/30">
              <CardHeader>
                <CardTitle className="text-xl">Answer from MedGemma</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{answer}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground text-center block">
          <p><strong>Disclaimer:</strong> This tool is for educational purposes only and not for medical diagnosis. AI-generated content may be inaccurate.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
