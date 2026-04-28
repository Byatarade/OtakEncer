import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { formatInTimeZone } from "date-fns-tz";
import { OfficeParser } from "officeparser";
import pdfParse from "pdf-parse";
import { YoutubeTranscript } from "youtube-transcript";
import mammoth from "mammoth";
import fs from "fs";
import os from "os";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ─── Helper: Ekstrak YouTube Video ID dari semua format URL yang umum ───────────
function extractYoutubeVideoId(url: string): string | null {
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/, // youtube.com/watch?v=ID
    /youtu\.be\/([a-zA-Z0-9_-]{11})/, // youtu.be/ID
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/, // youtube.com/shorts/ID
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/, // youtube.com/embed/ID
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/, // youtube.com/v/ID
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m?.[1]) return m[1];
  }
  return null;
}

// ─── Helper: Mapping MIME type dari ekstensi audio (lebih reliable dari file.type) ─
const AUDIO_MIME_MAP: Record<string, string> = {
  mp3: "audio/mpeg",
  mp4: "audio/mp4",
  mpeg: "audio/mpeg",
  mpga: "audio/mpeg",
  m4a: "audio/mp4",
  wav: "audio/wav",
  webm: "audio/webm",
  ogg: "audio/ogg",
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const link = formData.get("link") as string | null;
    // user_id dari formData sengaja di abaikan/override, kita ambil murni dari token sesi demi keamanan.

    if (!file && !link) {
      return NextResponse.json(
        { error: "File atau Link wajib disertakan." },
        { status: 400 },
      );
    }

    // --- AUTHORIZATION & CHECK QUOTA LIMIT (MAX 3 PER DAY) ---
    const startOfDay = formatInTimeZone(
      new Date(),
      "Asia/Jakarta",
      "yyyy-MM-dd'T'00:00:00XXX",
    );
    const authHeader = request.headers.get("Authorization") || "";
    const accessToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : "";

    if (!accessToken) {
      return NextResponse.json(
        { error: "User tidak tertentikasi. Akses Ditolak." },
        { status: 401 },
      );
    }

    // Gunakan fungsi custom fetch untuk menghindari policy RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          fetch: async (url, options) => {
            const headers = new Headers(options?.headers);
            headers.set("Authorization", authHeader);
            return fetch(url, { ...options, headers });
          },
        },
      },
    );

    // Amankan pengambilan user_id dengan getUser() Supabase untuk mencegah IDOR / parameter tampering
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return NextResponse.json(
        { error: "User tidak tertentikasi. Akses Ditolak." },
        { status: 401 },
      );
    }
    const userId = user.id;

    const { count: usageCount, error: countError } = await supabase
      .from("materials")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", startOfDay);

    if (countError) {
      console.error("Failed to check quota:", countError);
      return NextResponse.json(
        { error: "Gagal mengecek kuota pengguna." },
        { status: 500 },
      );
    }

    if ((usageCount || 0) >= 3) {
      return NextResponse.json(
        {
          error:
            "Kuota harian Anda telah habis (Maks. 3 kali sehari). Silakan kembali besok.",
        },
        { status: 429 },
      );
    }
    // --- END CHECK QUOTA ---

    let extractedText = "";
    let sourceType = "other";
    let title = "Materi Baru";
    let fileSizeBytes = 0;
    let fileBuffer: Buffer | null = null;

    // Siapkan object untuk Native PDF upload ke Gemini
    let inlinePdfData: {
      inlineData: { data: string; mimeType: string };
    } | null = null;

    if (file) {
      // Limit file size (25 MB max untuk Audio/Whisper, 10 MB untuk Dokumen)
      const isAudio = file.name.match(/\.(mp3|mp4|mpeg|mpga|m4a|wav|webm)$/i);
      const MAX_SIZE = isAudio ? 25 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          {
            error: `Ukuran dokumen/audio melebihi batas (${isAudio ? "25MB" : "10MB"})!`,
          },
          { status: 400 },
        );
      }

      fileSizeBytes = file.size;
      title = file.name;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fileBuffer = buffer;
      const fileName = file.name.toLowerCase();

      try {
        if (fileName.endsWith(".pdf")) {
          sourceType = "pdf";
          // Gemini mendukung file PDF asli secara langsung tanpa perlu PDF parse tambahan
          inlinePdfData = {
            inlineData: {
              data: buffer.toString("base64"),
              mimeType: "application/pdf",
            },
          };
          // Set extracted text dummy agar bisa lolos validasi teks kosong di baris bawah
          extractedText =
            "[PDF Processing - Dihandle secara native oleh Gemini AI]";
        } else if (fileName.endsWith(".docx")) {
          sourceType = "docx";
          // Menggunakan mammoth untuk DOCX karena lebih stabil tanpa perlu mencocokkan magic bytes (bug file-type node.js)
          const result = await mammoth.extractRawText({ buffer: buffer });
          extractedText = result.value;
        } else if (fileName.endsWith(".pptx")) {
          sourceType = "ppt";
          // Simpan sementara sebagai temp file karena officeparser sering gagal menebak format dari Buffer murni di Vercel/Node
          const tempPath = path.join(
            os.tmpdir(),
            `temp-${Date.now()}-${Math.random().toString(36).substring(7)}.pptx`,
          );
          fs.writeFileSync(tempPath, buffer);
          try {
            // Menggunakan default OfficeParser method untuk parsing file fisik
            const ast = await OfficeParser.parseOffice(tempPath);
            extractedText =
              typeof ast === "string"
                ? ast
                : ast?.toText
                  ? ast.toText()
                  : JSON.stringify(ast);
          } finally {
            fs.unlinkSync(tempPath); // Pastikan selalu dihapus dari /tmp agar tidak memenuhi disk
          }
        } else if (fileName.match(/\.(mp3|mp4|mpeg|mpga|m4a|wav|webm)$/)) {
          sourceType = "audio";

          // Derive MIME type dari extension – lebih reliable dari file.type yang bisa kosong di server
          const audioExt = fileName.split(".").pop()?.toLowerCase() || "";
          const mimeType = AUDIO_MIME_MAP[audioExt] || "audio/mpeg";

          // Whisper transcription via Groq dengan retry logic untuk rate-limit (429)
          const MAX_WHISPER_RETRIES = 3;
          let whisperSuccess = false;
          let whisperLastError = "";

          for (let attempt = 1; attempt <= MAX_WHISPER_RETRIES; attempt++) {
            const audioFormData = new FormData();
            // Gunakan nama file asli agar ekstensi terbaca oleh Whisper
            const audioBlob = new Blob([buffer], { type: mimeType });
            audioFormData.append("file", audioBlob, file.name);
            audioFormData.append("model", "whisper-large-v3-turbo"); // turbo = lebih cepat & stabil
            audioFormData.append("response_format", "json");
            // TIDAK memaksa language='id' → biarkan Whisper auto-detect agar support semua bahasa

            const groqResponse = await fetch(
              "https://api.groq.com/openai/v1/audio/transcriptions",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                },
                body: audioFormData,
              },
            );

            if (groqResponse.ok) {
              const result = await groqResponse.json();
              extractedText = result.text || "";
              whisperSuccess = true;
              break;
            }

            const errBase = await groqResponse.text();
            whisperLastError = errBase;
            console.error(
              `[Whisper] Attempt ${attempt}/${MAX_WHISPER_RETRIES} failed (HTTP ${groqResponse.status}):`,
              errBase,
            );

            if (groqResponse.status === 429 && attempt < MAX_WHISPER_RETRIES) {
              // Rate limited – tunggu sebentar lalu coba lagi
              await new Promise((r) => setTimeout(r, 2000 * attempt));
              continue;
            }
            // Error lain (400, 500 dsb) – langsung berhenti
            break;
          }

          if (!whisperSuccess) {
            throw new Error(
              `[AUDIO] Gagal mengtranskripsi audio setelah ${MAX_WHISPER_RETRIES} percobaan. Pastikan file audio tidak rusak dan format didukung. Detail: ${whisperLastError}`,
            );
          }
        } else {
          return NextResponse.json(
            {
              error:
                "Format file tidak didukung. Harap gunakan PDF, DOCX, PPTX atau format Audio didukung.",
            },
            { status: 400 },
          );
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error("Gagal memproses file:", errMsg);
        // Teruskan pesan spesifik dari audio handler agar tidak tertimpa pesan dokumen yang menyesatkan
        if (errMsg.startsWith("[AUDIO]")) {
          return NextResponse.json(
            { error: errMsg.replace("[AUDIO] ", "") },
            { status: 400 },
          );
        }
        return NextResponse.json(
          {
            error:
              "Gagal membaca dokumen. Pastikan file tidak rusak atau terenkripsi.",
          },
          { status: 400 },
        );
      }
    } else if (link) {
      try {
        const isYoutube =
          link.includes("youtube.com") || link.includes("youtu.be");
        if (!isYoutube) {
          return NextResponse.json(
            {
              error: "Saat ini AI hanya mendukung konversi dari link YouTube.",
            },
            { status: 400 },
          );
        }

        // Ekstrak video ID secara robust dari semua format URL YouTube
        const videoId = extractYoutubeVideoId(link);
        if (!videoId) {
          return NextResponse.json(
            {
              error:
                "URL YouTube tidak valid atau tidak dikenali. Gunakan format: youtube.com/watch?v=ID atau youtu.be/ID",
            },
            { status: 400 },
          );
        }

        fileSizeBytes = 0;
        sourceType = "youtube";
        title = `Materi Video YouTube (${videoId})`;

        // Helper timeout untuk mencegah request hang selamanya
        const withTimeout = <T>(p: Promise<T>, ms: number): Promise<T> =>
          Promise.race([
            p,
            new Promise<T>((_, rej) =>
              setTimeout(() => rej(new Error("YOUTUBE_TIMEOUT")), ms),
            ),
          ]);

        // Coba fetch transcript dengan urutan bahasa: auto → 'id' → 'en'
        // Ini memastikan CC tetap bisa diambil meskipun CC Indonesia tidak tersedia
        const TIMEOUT_MS = 20000;
        const langTrials: (string | undefined)[] = [undefined, "id", "en"];
        let transcript: { text: string }[] | null = null;
        let lastYtErr = "";

        for (const lang of langTrials) {
          try {
            const opts = lang ? { lang } : {};
            const result = await withTimeout(
              YoutubeTranscript.fetchTranscript(videoId, opts),
              TIMEOUT_MS,
            );
            if (result && result.length > 0) {
              transcript = result;
              break;
            }
          } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            lastYtErr = msg;
            console.warn(`[YouTube] lang=${lang ?? "auto"} failed:`, msg);
            if (msg === "YOUTUBE_TIMEOUT") break; // timeout – tidak perlu coba bahasa lain
            continue; // bahasa tidak tersedia – coba bahasa berikutnya
          }
        }

        if (!transcript || transcript.length === 0) {
          if (lastYtErr === "YOUTUBE_TIMEOUT") {
            return NextResponse.json(
              {
                error:
                  "Koneksi ke YouTube timeout (>20 detik). Silakan coba lagi beberapa saat.",
              },
              { status: 408 },
            );
          }
          return NextResponse.json(
            {
              error:
                "Subtitle (CC) tidak ditemukan di video ini. Pastikan video bersifat publik dan memiliki Closed Caption yang aktif.",
            },
            { status: 400 },
          );
        }

        // Gabungkan semua segmen CC menjadi satu teks
        extractedText = transcript.map((t) => t.text).join(" ");
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error("[YouTube] Transcript Error:", errMsg);

        // Berikan pesan error spesifik sesuai jenis kesalahan
        if (errMsg.toLowerCase().includes("disabled")) {
          return NextResponse.json(
            { error: "Transkripsi dinonaktifkan oleh pemilik video ini." },
            { status: 400 },
          );
        }
        if (
          errMsg.toLowerCase().includes("private") ||
          errMsg.toLowerCase().includes("unavailable") ||
          errMsg.toLowerCase().includes("not available")
        ) {
          return NextResponse.json(
            {
              error:
                "Video tidak dapat diakses. Pastikan video bersifat publik dan tidak di-private.",
            },
            { status: 400 },
          );
        }
        if (
          errMsg.includes("429") ||
          errMsg.toLowerCase().includes("too many")
        ) {
          return NextResponse.json(
            {
              error:
                "Terlalu banyak permintaan ke YouTube. Tunggu beberapa menit lalu coba lagi.",
            },
            { status: 429 },
          );
        }
        return NextResponse.json(
          {
            error:
              "Gagal mengambil subtitle dari video YouTube. Pastikan video publik dan memiliki CC aktif.",
          },
          { status: 400 },
        );
      }
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Tidak ada teks yang dapat dibaca dari dokumen atau link ini.",
        },
        { status: 400 },
      );
    }

    // Mengambil 30.000 karakter pertama agar tidak melampaui token limit Gemini
    const safeText = extractedText.substring(0, 30000);

    // Prompt cerdas untuk Gemini AI mengatur jadi ringkuman / materi belajar
    const prompt = `Kamu adalah seorang guru AI yang sangat pintar, asik, dan mudah dimengerti.
Tugas kamu adalah MENGUBAH teks dokumen di bawah ini (atau dokumen asli PDF yang terlampir) menjadi sebuah MATERI BELAJAR yang terstruktur.
Gunakan markdown (Heading, Bullet points, Bold) untuk merapikannya.
Jelaskan seakan kamu mengajar orang awam agar cepat paham.

Berikut teks / dokumen pembantu:
---
${safeText}
---`;

    // Susun input prompt plus buffer (jika PDF) secara native ke model Flash terbaru
    const contentsToAI: (
      | string
      | { inlineData: { data: string; mimeType: string } }
    )[] = [prompt];
    if (inlinePdfData) {
      contentsToAI.push(inlinePdfData);
    }

    let aiSummary = "";

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const aiResult = await model.generateContent(contentsToAI);
      aiSummary = aiResult.response.text();
    } catch (aiError: unknown) {
      const errMsg =
        aiError instanceof Error ? aiError.message : String(aiError);
      const errStatus = (aiError as { status?: number })?.status;
      console.warn(
        "Gemini API Error, checking possibility for fallback:",
        errMsg,
      );

      const isHighDemand =
        errStatus === 503 ||
        errMsg.includes("503") ||
        errMsg.includes("demand");

      if (isHighDemand || errMsg.includes("GenerateContent")) {
        console.log("=== MELAKUKAN FALLBACK OTOMATIS KE GROQ LLAMA 3.3 ===");

        let finalPrompt = prompt;

        // Jika dokumen berbentuk PDF murni, kita harus ekstraksi teksnya terlebih dahulu untuk Groq
        if (inlinePdfData && fileBuffer) {
          console.log(
            "PDF detected during fallback. Extracting text for Groq...",
          );
          try {
            // Menggunakan pdf-parse karena officeparser tidak stabil untuk PDF asli di Node/Windows fallback
            const pdfData = await pdfParse(fileBuffer);
            const safePdfText = pdfData.text.substring(0, 30000);

            finalPrompt = `Kamu adalah seorang guru AI yang sangat pintar, asik, dan mudah dimengerti.
Tugas kamu adalah MENGUBAH teks dokumen di bawah ini menjadi sebuah MATERI BELAJAR yang terstruktur.
Gunakan markdown (Heading, Bullet points, Bold) untuk merapikannya.
Jelaskan seakan kamu mengajar orang awam agar cepat paham.

Berikut teks / dokumen pembantu:
---
${safePdfText}
---`;
          } catch (parseErr) {
            console.error(
              "Gagal mengekstrak teks PDF saat fallback:",
              parseErr,
            );
            throw new Error(
              "Gagal fallback: Teks PDF tidak dapat dibaca oleh sistem cadangan.",
            );
          }
        }

        let groqSuccess = false;
        try {
          const groqRes = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
              },
              body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: finalPrompt }],
                temperature: 0.3,
                max_tokens: 4000,
              }),
            },
          );

          if (groqRes.ok) {
            const groqData = await groqRes.json();
            aiSummary = groqData.choices[0].message.content;
            groqSuccess = true;
          } else {
            console.warn("Groq failed with status:", groqRes.status);
          }
        } catch (e) {
          console.warn("Groq fetch error:", e);
        }

        if (!groqSuccess) {
          console.log("=== GROQ SIBUK, FALLBACK KE OPENROUTER ===");
          let orSuccess = false;
          try {
            const orRes = await fetch(
              "https://openrouter.ai/api/v1/chat/completions",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                },
                body: JSON.stringify({
                  model: "google/gemini-2.5-flash",
                  messages: [{ role: "user", content: finalPrompt }],
                  temperature: 0.3,
                }),
              },
            );

            if (orRes.ok) {
              const orData = await orRes.json();
              aiSummary = orData.choices[0].message.content;
              orSuccess = true;
            } else {
              console.warn("OpenRouter failed with status:", orRes.status);
            }
          } catch (e) {
            console.warn("OpenRouter fetch error:", e);
          }

          if (!orSuccess) {
            console.log("=== OPENROUTER SIBUK, FALLBACK KE DEEPSEEK ===");
            let dsSuccess = false;
            try {
              const dsRes = await fetch(
                "https://api.deepseek.com/chat/completions",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                  },
                  body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [{ role: "user", content: finalPrompt }],
                    temperature: 0.3,
                  }),
                },
              );

              if (dsRes.ok) {
                const dsData = await dsRes.json();
                aiSummary = dsData.choices[0].message.content;
                dsSuccess = true;
              } else {
                console.warn("DeepSeek failed with status:", dsRes.status);
              }
            } catch (e) {
              console.warn("DeepSeek fetch error:", e);
            }

            if (!dsSuccess) {
              console.log(
                "=== DEEPSEEK SIBUK, FALLBACK TERAKHIR KE HUGGING FACE ===",
              );
              const hfRes = await fetch(
                "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct/v1/chat/completions",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                  },
                  body: JSON.stringify({
                    model: "Qwen/Qwen2.5-72B-Instruct",
                    messages: [{ role: "user", content: finalPrompt }],
                    temperature: 0.3,
                  }),
                },
              );

              if (!hfRes.ok) {
                await hfRes.text();
                throw new Error(
                  `Semua server AI (Gemini, Groq, OpenRouter, DeepSeek, HuggingFace) sedang sibuk. Mohon coba beberapa saat lagi.`,
                );
              }
              const hfData = await hfRes.json();
              aiSummary = hfData.choices[0].message.content;
            }
          }
        }
      } else {
        // Lempar ke frontend jika bukan masalah 503
        throw aiError;
      }
    }

    // Simpan ke Database
    const { data, error } = await supabase
      .from("materials")
      .insert([
        {
          user_id: userId,
          title: title,
          source_type: sourceType,
          file_size_bytes: fileSizeBytes,
          ai_summary: aiSummary,
          ai_status: "completed",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json(
        {
          error:
            "Gagal menyimpan materi ke Database. DB Error: " + error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    console.error("API Error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan internal server.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
