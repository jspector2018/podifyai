import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Upload, Wand2, Headphones, Check } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold">PodifyAI</div>
          <div className="flex items-center gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6">
          Turn any PDF into a<br />
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            podcast in 60 seconds
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Upload your PDFs, let AI transform them into engaging conversational podcasts.
          Perfect for learning on the go or making content accessible.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/signup">
            <Button size="lg" className="text-base">
              Start for Free
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="text-base">
              Try Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Upload Your PDF</h3>
            <p className="text-gray-600">
              Drag and drop any PDF document. Research papers, articles, reports - anything works.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wand2 className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">2. AI Magic</h3>
            <p className="text-gray-600">
              Our AI reads, summarizes, and creates a natural conversational script in your chosen style.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Listen & Download</h3>
            <p className="text-gray-600">
              Get a professional-quality podcast in minutes. Stream online or download MP3.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Player */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Hear the Difference</h2>
          <p className="text-gray-600 text-center mb-8">
            Listen to a sample conversion of a research paper
          </p>
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
            <audio controls className="w-full">
              <source src="/demo-podcast.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Sample: "Machine Learning Basics" - 5 minute summary
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="border border-gray-200 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span>3 conversions per month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span>All podcast styles</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span>Multiple voice options</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span>Download MP3</span>
              </li>
            </ul>
            <Link href="/auth/signup">
              <Button variant="outline" className="w-full">Get Started</Button>
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="border-2 border-purple-600 rounded-lg p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">$9.99</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Unlimited conversions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span>All podcast styles</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span>Premium voices</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span>Priority processing</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span>Download MP3</span>
              </li>
            </ul>
            <Link href="/auth/signup">
              <Button className="w-full">Upgrade to Pro</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-gray-600">
          <p>&copy; 2025 PodifyAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
