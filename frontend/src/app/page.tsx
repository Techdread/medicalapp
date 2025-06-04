import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-bold tracking-tight text-sky-400 sm:text-6xl">
          Welcome to the MedGemma Educational App
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl">
          This application leverages the power of MedGemma to provide tools for medical students.
          Start by exploring our Medical Terminology Explainer.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/explain" legacyBehavior passHref>
            <Button 
              size="lg"
              className="px-8 py-4 text-lg bg-sky-600 hover:bg-sky-700 active:bg-sky-800 transition-colors duration-150 shadow-lg hover:shadow-sky-500/50"
            >
              Go to Terminology Explainer
            </Button>
          </Link>
        </div>
      </div>
      <footer className="absolute bottom-8 text-center w-full text-slate-500 text-sm">
        <p>Built with Next.js, shadcn/ui, Tailwind CSS, and FastAPI. Powered by MedGemma.</p>
        <p className="mt-1">
            Disclaimer: This application is for educational purposes only and is not intended for real-world medical diagnosis or treatment.
        </p>
      </footer>
    </main>
  );
}
