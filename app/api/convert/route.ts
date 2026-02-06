import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import OpenAI from "openai";
import pdf from "pdf-parse";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY!;

// ElevenLabs voice IDs
const VOICE_IDS = {
  rachel: "21m00Tcm4TlvDq8ikWAM",
  adam: "pNInz6obpgDQGcFmaJgB",
  bella: "EXAVITQu4vr4xnSDxMaL",
};

const STYLE_CONFIGS = {
  quick: {
    targetWords: 300,
    description: "a quick 2-minute overview",
  },
  summary: {
    targetWords: 750,
    description: "a comprehensive 5-minute summary",
  },
  deep: {
    targetWords: 2250,
    description: "a detailed 15-minute deep dive",
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File;
    const style = formData.get("style") as "quick" | "summary" | "deep";
    const voice = formData.get("voice") as "rachel" | "adam" | "bella";
    const userId = formData.get("userId") as string;

    if (!file || !style || !voice || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check usage limits
    const currentMonth = new Date().toISOString().slice(0, 7);
    const { data: usageData } = await supabaseAdmin
      .from("usage")
      .select("count")
      .eq("user_id", userId)
      .eq("month", currentMonth)
      .single();

    if (usageData && usageData.count >= 3) {
      return NextResponse.json(
        { error: "Monthly limit reached. Upgrade to Pro for unlimited conversions." },
        { status: 403 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const pdfData = await pdf(buffer);
    const pdfText = pdfData.text;

    if (!pdfText || pdfText.trim().length < 100) {
      return NextResponse.json(
        { error: "PDF appears to be empty or contains no extractable text" },
        { status: 400 }
      );
    }

    // Upload PDF to Supabase Storage
    const pdfFileName = `${userId}/${Date.now()}-${file.name}`;
    const { data: pdfUpload, error: pdfUploadError } = await supabaseAdmin.storage
      .from("pdfs")
      .upload(pdfFileName, buffer, {
        contentType: "application/pdf",
      });

    if (pdfUploadError) {
      console.error("PDF upload error:", pdfUploadError);
      return NextResponse.json(
        { error: "Failed to upload PDF" },
        { status: 500 }
      );
    }

    const { data: { publicUrl: pdfUrl } } = supabaseAdmin.storage
      .from("pdfs")
      .getPublicUrl(pdfFileName);

    // Create conversion record
    const { data: conversion, error: conversionError } = await supabaseAdmin
      .from("conversions")
      .insert({
        user_id: userId,
        title: file.name.replace(".pdf", ""),
        pdf_url: pdfUrl,
        style,
        voice,
        status: "processing",
      })
      .select()
      .single();

    if (conversionError || !conversion) {
      console.error("Conversion creation error:", conversionError);
      return NextResponse.json(
        { error: "Failed to create conversion record" },
        { status: 500 }
      );
    }

    // Generate script with GPT-4
    const styleConfig = STYLE_CONFIGS[style];
    const scriptPrompt = `You are a professional podcast scriptwriter. Convert the following PDF content into ${styleConfig.description} in a conversational, engaging podcast format.

Requirements:
- Target approximately ${styleConfig.targetWords} words
- Write in a natural, conversational tone as if speaking directly to the listener
- Include an engaging introduction and clear conclusion
- Break down complex concepts into easy-to-understand explanations
- Use transitions and signposting ("First...", "Now let's talk about...", "Here's the interesting part...")
- NO stage directions, NO sound effects, NO music cues - just the spoken script
- Write as a single narrator (no dialogue or multiple speakers)

PDF Content:
${pdfText.slice(0, 15000)}

Generate the podcast script now:`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert podcast scriptwriter who creates engaging, conversational audio content.",
        },
        {
          role: "user",
          content: scriptPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const script = completion.choices[0]?.message?.content;

    if (!script) {
      await supabaseAdmin
        .from("conversions")
        .update({ status: "failed" })
        .eq("id", conversion.id);

      return NextResponse.json(
        { error: "Failed to generate script" },
        { status: 500 }
      );
    }

    // Generate audio with ElevenLabs
    const voiceId = VOICE_IDS[voice];
    const elevenLabsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: script,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!elevenLabsResponse.ok) {
      const errorText = await elevenLabsResponse.text();
      console.error("ElevenLabs error:", errorText);
      await supabaseAdmin
        .from("conversions")
        .update({ status: "failed" })
        .eq("id", conversion.id);

      return NextResponse.json(
        { error: "Failed to generate audio" },
        { status: 500 }
      );
    }

    const audioBuffer = await elevenLabsResponse.arrayBuffer();

    // Upload audio to Supabase Storage
    const audioFileName = `${userId}/${Date.now()}.mp3`;
    const { data: audioUpload, error: audioUploadError } = await supabaseAdmin.storage
      .from("audio")
      .upload(audioFileName, audioBuffer, {
        contentType: "audio/mpeg",
      });

    if (audioUploadError) {
      console.error("Audio upload error:", audioUploadError);
      await supabaseAdmin
        .from("conversions")
        .update({ status: "failed" })
        .eq("id", conversion.id);

      return NextResponse.json(
        { error: "Failed to upload audio" },
        { status: 500 }
      );
    }

    const { data: { publicUrl: audioUrl } } = supabaseAdmin.storage
      .from("audio")
      .getPublicUrl(audioFileName);

    // Calculate estimated duration (rough estimate: ~150 words per minute)
    const wordCount = script.split(/\s+/).length;
    const durationSeconds = Math.round((wordCount / 150) * 60);

    // Update conversion record
    await supabaseAdmin
      .from("conversions")
      .update({
        audio_url: audioUrl,
        script,
        duration_seconds: durationSeconds,
        status: "complete",
      })
      .eq("id", conversion.id);

    // Update usage
    if (usageData) {
      await supabaseAdmin
        .from("usage")
        .update({ count: usageData.count + 1 })
        .eq("user_id", userId)
        .eq("month", currentMonth);
    } else {
      await supabaseAdmin.from("usage").insert({
        user_id: userId,
        month: currentMonth,
        count: 1,
      });
    }

    return NextResponse.json({
      success: true,
      audioUrl,
      script,
      conversionId: conversion.id,
    });
  } catch (error: any) {
    console.error("Conversion error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
