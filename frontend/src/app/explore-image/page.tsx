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
    <div className="container mx-auto p-4 flex flex-col items-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Card className="w-full max-w-2xl mt-10 bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-sky-400">Image Exploration Mode</CardTitle>
          <CardDescription className="text-center text-slate-400">
            Upload a medical image to get an AI-generated description and ask questions about it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="imageUpload" className="text-lg font-semibold text-white">Upload Medical Image</Label>
              <Input 
                id="imageUpload" 
                type="file" 
                accept="image/png, image/jpeg, image/webp" 
                onChange={handleFileChange} 
                className="mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-600/20 file:text-sky-400 hover:file:bg-sky-600/30 bg-slate-700 border-slate-600 text-white focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            {previewUrl && (
              <div className="mt-4 border border-slate-600 rounded-lg overflow-hidden">
                <img src={previewUrl} alt="Selected preview" className="w-full h-auto object-contain max-h-96" />
              </div>
            )}

            {selectedFile && (
              <>
                <div>
                  <Label htmlFor="question" className="text-lg font-semibold text-white">Ask a question about the image (optional)</Label>
                  <Textarea 
                    id="question"
                    value={question}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setQuestion(e.target.value)}
                    placeholder="e.g., What abnormalities are visible? What is the likely diagnosis based on this image?"
                    className="mt-2 min-h-[80px] bg-slate-700 border-slate-600 placeholder-slate-500 text-white focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                <Button type="submit" disabled={isLoading || !selectedFile} className="w-full text-lg p-4 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 transition-colors duration-150">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Image...
                    </>
                  ) : (question.trim() ? "Get Description & Answer" : "Get Description")}
                </Button>
              </>
            )}
          </form>

          {error && (
            <Alert variant="destructive" className="mt-6 bg-red-900 border-red-700 text-white">
              <Terminal className="h-5 w-5" />
              <AlertTitle className="font-semibold">Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {imageDescription && (
            <Card className="mt-8 bg-slate-700 border-slate-600 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-sky-400">Image Description</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none text-slate-300 leading-relaxed">
                <p className="whitespace-pre-wrap">{imageDescription}</p>
              </CardContent>
            </Card>
          )}

          {answer && (
            <Card className="mt-6 bg-slate-700 border-slate-600 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-sky-400">Answer from MedGemma</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none text-slate-300 leading-relaxed">
                <p className="whitespace-pre-wrap">{answer}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
        <CardFooter className="text-xs text-slate-500 mt-6">
          <p className="text-center w-full">
            Disclaimer: AI-generated descriptions and answers are for educational purposes only and may not be fully accurate or complete. Always consult with qualified medical professionals for medical advice.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
