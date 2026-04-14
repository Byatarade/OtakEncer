-- Tambahkan kolom ai_exam ke tabel materials untuk menyimpan prediksi soal ujian
-- Jalankan SQL ini di Supabase Dashboard > SQL Editor

ALTER TABLE materials 
ADD COLUMN IF NOT EXISTS ai_exam jsonb DEFAULT NULL;

-- Tambahkan komentar untuk dokumentasi
COMMENT ON COLUMN materials.ai_exam IS 'Stores AI-generated exam prediction data: 20 MCQ + 10 Essay questions as JSONB';
