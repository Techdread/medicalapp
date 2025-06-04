"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function ExplainPage() {
  const [term, setTerm] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setExplanation('');

    if (!term.trim()) {
      setError("Please enter a medical term.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/explain-term', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ term }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch explanation. Server returned an error.' }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExplanation(data.explanation);
    } catch (err: any) {
      console.error("Error fetching explanation:", err);
      setError(err.message || 'An unexpected error occurred.');
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Card className="w-full max-w-2xl mt-10 bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-sky-400">Medical Terminology Explainer</CardTitle>
          <CardDescription className="text-center text-slate-400">
            Enter a medical term below to get an AI-powered explanation from MedGemma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              value={term}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTerm(e.target.value)}
              placeholder="e.g., myocardial infarction, pneumothorax"
              disabled={isLoading}
              className="text-lg p-4 bg-slate-700 border-slate-600 placeholder-slate-500 text-white focus:ring-sky-500 focus:border-sky-500"
            />
            <Button type="submit" disabled={isLoading} className="w-full text-lg p-4 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 transition-colors duration-150">
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Getting Explanation...
                </>
              ) : 'Explain Term'}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-6 bg-red-900 border-red-700 text-white">
              <Terminal className="h-5 w-5" />
              <AlertTitle className="font-semibold">Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {explanation && !error && (
            <Card className="mt-8 bg-slate-700 border-slate-600 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-sky-400">Explanation for: <span className='font-semibold text-white'>{term}</span></CardTitle>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none text-slate-300 leading-relaxed">
                {explanation.split('\n').map((line, index) => (
                  <p key={index} className="mb-2">{line}</p>
                ))}
              </CardContent>
            </Card>
          )}
        </CardContent>
        <CardFooter className="text-xs text-slate-500 mt-6">
          <p className="text-center w-full">
            Disclaimer: AI-generated explanations are for educational purposes only and may not be fully accurate or complete. Always consult with qualified medical professionals for medical advice.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
