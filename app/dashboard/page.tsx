"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import { Upload, Loader2, Download, LogOut } from "lucide-react";

type ConversionStyle = "quick" | "summary" | "deep";
type Voice = "rachel" | "adam" | "bella";

interface Conversion {
  id: string;
  title: string;
  audio_url: string;
  style: string;
  voice: string;
  created_at: string;
  status: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [style, setStyle] = useState<ConversionStyle>("summary");
  const [voice, setVoice] = useState<Voice>("rachel");
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    checkUser();
    loadConversions();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    setUser(session.user);
    setLoading(false);
  };

  const loadConversions = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("conversions")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) {
      setConversions(data);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please select a valid PDF file");
      return;
    }
    if (file.size > 4.5 * 1024 * 1024) {
      setError("PDF is too large. Maximum file size is 4.5MB.");
      return;
    }
    setSelectedFile(file);
    setError("");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please drop a valid PDF file");
      return;
    }
    if (file.size > 4.5 * 1024 * 1024) {
      setError("PDF is too large. Maximum file size is 4.5MB.");
      return;
    }
    setSelectedFile(file);
    setError("");
  };

  const handleConvert = async () => {
    if (!selectedFile || !user) return;

    setProcessing(true);
    setProgress(10);
    setError("");

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("pdf", selectedFile);
      formData.append("style", style);
      formData.append("voice", voice);
      formData.append("userId", user.id);

      setProgress(30);

      // Call API
      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      setProgress(60);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Conversion failed");
      }

      const result = await response.json();
      setProgress(100);

      // Reload conversions
      await loadConversions();
      
      // Set current audio to play
      setCurrentAudio(result.audioUrl);
      
      // Reset form
      setSelectedFile(null);
      setProgress(0);
    } catch (err: any) {
      setError(err.message || "Failed to convert PDF");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold">PodifyAI</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div>
            <h1 className="text-3xl font-bold mb-6">Create Podcast</h1>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* File Upload */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-6 hover:border-purple-400 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              {selectedFile ? (
                <div>
                  <p className="text-lg font-semibold text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-semibold text-gray-700">
                    Drop your PDF here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Maximum file size: 4.5MB</p>
                </div>
              )}
              <input
                id="file-input"
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Style Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Podcast Style
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setStyle("quick")}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    style === "quick"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold">Quick Take</div>
                  <div className="text-sm text-gray-600">~2 min</div>
                </button>
                <button
                  onClick={() => setStyle("summary")}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    style === "summary"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold">Summary</div>
                  <div className="text-sm text-gray-600">~5 min</div>
                </button>
                <button
                  onClick={() => setStyle("deep")}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    style === "deep"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold">Deep Dive</div>
                  <div className="text-sm text-gray-600">~15 min</div>
                </button>
              </div>
            </div>

            {/* Voice Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Voice
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setVoice("rachel")}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    voice === "rachel"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold">Rachel</div>
                  <div className="text-sm text-gray-600">Calm</div>
                </button>
                <button
                  onClick={() => setVoice("adam")}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    voice === "adam"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold">Adam</div>
                  <div className="text-sm text-gray-600">Deep</div>
                </button>
                <button
                  onClick={() => setVoice("bella")}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    voice === "bella"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold">Bella</div>
                  <div className="text-sm text-gray-600">Warm</div>
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleConvert}
              disabled={!selectedFile || processing}
              className="w-full"
              size="lg"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Podcast"
              )}
            </Button>

            {/* Progress */}
            {processing && (
              <div className="mt-4">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 mt-2 text-center">
                  {progress < 30 && "Uploading PDF..."}
                  {progress >= 30 && progress < 60 && "Analyzing content..."}
                  {progress >= 60 && progress < 100 && "Generating audio..."}
                  {progress === 100 && "Complete!"}
                </p>
              </div>
            )}

            {/* Current Audio Player */}
            {currentAudio && (
              <div className="mt-6 p-6 bg-white rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-3">Your Podcast is Ready!</h3>
                <audio controls className="w-full mb-3">
                  <source src={currentAudio} type="audio/mpeg" />
                </audio>
                <a href={currentAudio} download>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download MP3
                  </Button>
                </a>
              </div>
            )}
          </div>

          {/* History Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Recent Conversions</h2>
            <div className="space-y-4">
              {conversions.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-500">No conversions yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Upload a PDF to get started
                  </p>
                </div>
              ) : (
                conversions.map((conversion) => (
                  <div
                    key={conversion.id}
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{conversion.title}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(conversion.created_at).toLocaleDateString()} •{" "}
                          {conversion.style} • {conversion.voice}
                        </p>
                      </div>
                      {conversion.status === "complete" && (
                        <a href={conversion.audio_url} download>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                    {conversion.status === "complete" && conversion.audio_url && (
                      <audio controls className="w-full mt-3">
                        <source src={conversion.audio_url} type="audio/mpeg" />
                      </audio>
                    )}
                    {conversion.status === "processing" && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </div>
                    )}
                    {conversion.status === "failed" && (
                      <p className="text-sm text-red-600 mt-2">Failed to process</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
