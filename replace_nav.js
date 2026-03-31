const fs = require('fs');
const file = 'c:/Users/Znatic/Documents/Project/OtakEncer/app/page.tsx';
let data = fs.readFileSync(file, 'utf8');

const regex = /<div className="flex items-center gap-3 md:gap-4">\s*\{\/\* Desktop Login & Signup \*\/\}[\s\S]*?\{\/\* Mobile Hamburger Menu Icon \*\/\}/g;

const replacement = `<div className="flex items-center gap-3 md:gap-4">
             {user ? (
               <div className="flex items-center gap-3 md:gap-4">
                 <Link href="/dashboard" className="hidden md:flex items-center justify-center bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-full font-medium text-[12px] md:text-[13px] transition-transform hover:scale-105 shadow-md group">
                   Go to Dashboard
                   <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">👉</span>
                 </Link>
                 <Link href="/dashboard" className="md:hidden flex items-center justify-center bg-gray-900 text-white px-4 py-2 rounded-full font-medium text-[11px] shadow-md group">
                   Dashboard <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">👉</span>
                 </Link>
                 {user.picture ? (
                   <Image src={user.picture} alt="Profile" width={36} height={36} className="rounded-full border border-gray-200" />
                 ) : (
                   <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                     {user.name?.[0] || user.email?.[0] || 'U'}
                   </div>
                 )}
               </div>
             ) : (
               <>
                 {/* Desktop Login & Signup */}
                 <div className="hidden md:flex items-center gap-4 mr-1">
                   <Link href="/login" className="text-[13px] font-bold text-gray-800 hover:text-black transition-colors">Log In</Link>
                 </div>

                 <Link href="/login" className="hidden md:flex items-center justify-center bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-full font-medium text-[12px] md:text-[13px] transition-transform hover:scale-105 shadow-md">   
                   Sign In
                 </Link>
                 <Link href="/login" className="md:hidden flex items-center justify-center bg-gray-900 text-white px-4 py-2 rounded-full font-medium text-[11px] shadow-md">
                   Sign In
                 </Link>
               </>
             )}
             {/* Mobile Hamburger Menu Icon */}`;

const newData = data.replace(regex, replacement);
fs.writeFileSync(file, newData);
console.log('Done!');