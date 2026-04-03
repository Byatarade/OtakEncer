"use client";

type Item = {
  id: number;
  name: string;
  role: string;
  text: string;
  avatar: string;
};

export function TestimonialCard({ t }: { t: Item }) {
  return (
    <div className="w-[240px] md:w-[320px] h-[220px] md:h-[280px] bg-white rounded-[20px] md:rounded-[32px] p-4 md:p-6 flex flex-col justify-between shrink-0 shadow-[0_8px_30px_-15px_rgba(103,44,185,0.06)] border border-gray-100/50">
      <div className="w-full flex items-start justify-between">
        <div className="text-[#d8c7f7] text-[35px] md:text-[50px] font-black leading-[0.5] font-serif select-none pointer-events-none">&quot;</div>
        <div className="flex gap-0.5 pt-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <svg key={s} className="w-[10px] h-[10px] md:w-[13px] md:h-[13px]" viewBox="0 0 24 24" fill="none" stroke="#fcd34d" strokeWidth="1.5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center my-2 md:my-3">
        <p className="text-[12px] md:text-[14px] text-gray-700 leading-[1.5] font-medium tracking-tight line-clamp-5 md:line-clamp-6 overflow-hidden">{t.text}</p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] rounded-full bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm border border-gray-50">
          <div className="w-full h-full bg-[#0a0a0a] border border-gray-200 rounded-full"></div>
        </div>
        <div className="flex flex-col">
          <h4 className="text-[13px] md:text-[15px] font-bold text-gray-900 leading-tight tracking-tight line-clamp-1">{t.name}</h4>
          <p className="text-[9px] md:text-[10px] text-gray-400 font-medium leading-tight mt-0.5 max-w-[120px] md:max-w-none line-clamp-1">{t.role}</p>
        </div>
      </div>
    </div>
  );
}
