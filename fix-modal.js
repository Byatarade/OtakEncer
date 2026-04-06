const fs = require('fs');

let content = fs.readFileSync('app/dashboard/page.tsx', 'utf-8');

const newModal = `      {/* Modal Upload Popup */}
      {isUploadPopupOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => { if(!isUploading) setIsUploadPopupOpen(false); }}
          />
          <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#f3f4f6] to-[#e5e7eb] rounded-[32px] shadow-2xl p-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[26px] font-bold text-slate-800 flex-1 text-center pl-10">Pilih Tipe Upload</h2>
              <button 
                onClick={() => setIsUploadPopupOpen(false)}
                disabled={isUploading}
                className="text-slate-500 hover:text-slate-800 bg-transparent rounded-full p-2 transition-colors ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={28} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {isUploading ? (
                <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-12 bg-white/70 backdrop-blur rounded-[24px] border border-white">
                   <div className="flex gap-3 mb-6">
                     <Sparkles className="text-[#672cb9] animate-bounce" size={32} />
                   </div>
                   <h3 className="text-xl font-bold text-[#672cb9] mb-2 animate-pulse">AI Sedang Membaca & Merangkum Materi...</h3>
                   <p className="text-slate-500 font-medium text-center">Proses ini mungkin memakan waktu hingga satu menit. Harap jangan tutup jendela ini.</p>
                </div>
              ) : (
                <>
                  {/* File PDF / DOCX */}
                  <div className="relative flex flex-col items-start bg-white/70 backdrop-blur hover:bg-white hover:shadow-lg p-7 rounded-[24px] border border-white transition-all text-left group overflow-hidden cursor-pointer">
                    <div className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-[#ed2d07] to-[#871c07] flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 transition-transform relative">
                      <FileText className="text-white" size={26} />
                      <span className="absolute text-[8px] font-bold text-[#672cb9] bg-white px-1 leading-none rounded-sm mt-3.5">DOC</span>
                    </div>
                    <h3 className="text-[20px] font-bold text-slate-800 mb-2.5">Upload Dokumen</h3>
                    <p className="text-[15px] text-slate-600 leading-relaxed pr-2 mb-2">Unggah PDF, DOCX, atau PPT (Max 10MB).</p>
                    <input 
                      type="file" 
                      accept=".pdf, .docx, .pptx"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 outline-none cursor-pointer z-10"
                      title="Pilih File"
                    />
                  </div>

                  {/* Link Artikel */}
                  <button onClick={() => alert('Fitur web link segera hadir!')} className="flex flex-col items-start bg-white/70 backdrop-blur p-7 rounded-[24px] border border-white transition-all text-left opacity-60 cursor-not-allowed">
                    <div className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-[#0883ff] to-[#064a8f] flex items-center justify-center mb-5 shadow-sm">
                      <LinkIcon className="text-white" size={26} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-[20px] font-bold text-slate-800 mb-2.5">Link Artikel</h3>
                    <p className="text-[15px] text-slate-600 leading-relaxed pr-2">Tautkan ke artikel eksternal untuk referensi (Segera hadir).</p>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}`;

const replaced = content.replace(/\{\/\* Modal Upload Popup \*\/\}[\s\S]*?(?=\s*\}\s*<\/div>\s*\);\s*\})/m, newModal);
fs.writeFileSync('app/dashboard/page.tsx', replaced);
console.log('Update UI Upload Modal Berhasil');