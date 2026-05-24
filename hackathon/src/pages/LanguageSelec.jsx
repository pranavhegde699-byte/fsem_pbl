import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Star, ArrowRight, Loader2 } from 'lucide-react';

const LANGS = [
  { code: 'en', label: 'English', native: 'English', auth: 'EN', confirm: 'Everything will appear in English.', fontClass: 'font-sans' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', auth: 'HI', confirm: 'सब कुछ हिंदी में दिखेगा।', fontClass: 'font-sans' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', auth: 'TA', confirm: 'எல்லாமே தமிழில் தெரியும்.', fontClass: 'font-sans' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', auth: 'TE', confirm: 'అన్నీ తెలుగులో కనిపిస్తాయి.', fontClass: 'font-sans' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', auth: 'KN', confirm: 'ಎಲ್ಲವೂ ಕನ್ನಡದಲ್ಲಿ ತೋರಿಸಲಾಗುತ್ತದೆ.', fontClass: 'font-sans' },
];

export default function LanguageSelec() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = (code) => {
    setSelected(code);
  };

  const proceed = () => {
    if (!selected) return;
    setLoading(true);
    localStorage.setItem('workproof_language', selected);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const selectedLang = LANGS.find(l => l.code === selected);

  return (
    <div className="min-h-screen bg-[#F7F4EF] font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E8E2D9] px-4 md:px-10 h-16 flex items-center shrink-0">
        <div className="max-w-5xl w-full mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2C2416] flex items-center justify-center">
              <Star className="w-4 h-4 text-[#F7F4EF] fill-current" />
            </div>
            <div>
              <div className="font-serif text-lg text-[#2C2416] leading-none font-bold">DIGNIFY</div>
              <div className="text-[9px] font-bold tracking-widest text-[#A89880] uppercase mt-0.5">Financial Identity</div>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-4">
             <div className="flex items-center gap-1.5">
               <div className="w-5 h-5 rounded-full bg-[#8B7355] text-white flex items-center justify-center text-[9px] font-bold">✓</div>
               <div className="w-6 h-1 bg-[#8B7355]" />
               <div className="w-5 h-5 rounded-full bg-[#2C2416] text-[#F7F4EF] flex items-center justify-center text-[10px] font-bold">2</div>
               <div className="w-6 h-1 bg-[#E8E2D9]" />
               <div className="w-5 h-5 rounded-full bg-[#F7F4EF] border-2 border-[#E8E2D9] text-[#A89880] flex items-center justify-center text-[10px] font-bold">3</div>
             </div>
             <span className="text-xs font-bold tracking-widest text-[#A89880] border-l border-[#E8E2D9] pl-4">STEP 2</span>
          </div>
          <Link to="/" className="text-xs font-bold border-b-2 border-[#2C2416] pb-0.5 text-[#2C2416] hover:text-[#8B7355] hover:border-[#8B7355] transition-colors">
            SIGN IN
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-[600px]">
          {/* Heading */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-[#EDE5D8] rounded-md px-3 py-1 mb-4">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#7A6245]">Personalise</span>
            </div>
            <h1 className="font-serif text-4xl text-[#2C2416] leading-tight mb-2">Choose Your Language</h1>
            <p className="text-sm font-medium text-[#A89880] max-w-sm mx-auto md:mx-0">
              Your score, schemes, and financial passport will all appear in the language you choose.
            </p>
          </motion.div>

          {/* Card Shell */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-[#E8E2D9] rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#C5B5A0] mb-5 text-center md:text-left">Select one language</div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {LANGS.slice(0, 3).map((l, i) => (
                <button
                  key={l.code}
                  onClick={() => handleSelect(l.code)}
                  className={`relative flex flex-col items-center p-5 rounded-xl border-2 transition-all ${selected === l.code ? 'border-[#8B7355] bg-[#FFFCF8] shadow-md -translate-y-0.5' : 'border-[#E8E2D9] bg-white hover:border-[#C5B5A0] hover:-translate-y-0.5'}`}
                >
                  <div className="text-2xl font-bold text-[#2C2416] mb-2">{l.native}</div>
                  <div className="text-[10px] font-bold tracking-widest uppercase text-[#A89880]">{l.label}</div>
                  <div className={`mt-2 text-[9px] font-bold px-2 py-0.5 rounded ${selected === l.code ? 'bg-[#EDE5D8] text-[#7A6245]' : 'bg-[#F5F0E8] text-[#A89880]'}`}>
                    {l.auth}
                  </div>
                  {selected === l.code && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-5 h-5 bg-[#8B7355] rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 mb-8 w-full md:w-2/3 mx-auto">
              {LANGS.slice(3).map((l, i) => (
                <button
                  key={l.code}
                  onClick={() => handleSelect(l.code)}
                  className={`relative flex flex-col items-center p-5 rounded-xl border-2 transition-all ${selected === l.code ? 'border-[#8B7355] bg-[#FFFCF8] shadow-md -translate-y-0.5' : 'border-[#E8E2D9] bg-white hover:border-[#C5B5A0] hover:-translate-y-0.5'}`}
                >
                  <div className="text-2xl font-bold text-[#2C2416] mb-2">{l.native}</div>
                  <div className="text-[10px] font-bold tracking-widest uppercase text-[#A89880]">{l.label}</div>
                  <div className={`mt-2 text-[9px] font-bold px-2 py-0.5 rounded ${selected === l.code ? 'bg-[#EDE5D8] text-[#7A6245]' : 'bg-[#F5F0E8] text-[#A89880]'}`}>
                    {l.auth}
                  </div>
                  {selected === l.code && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-5 h-5 bg-[#8B7355] rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>

            {/* Confirmation Box */}
            <div className="min-h-[50px] flex items-center justify-center mb-6">
              {selectedLang ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2.5 bg-[#F5F0E8] border border-[#E8E2D9] px-4 py-2.5 rounded-lg w-full justify-center text-center">
                  <Check className="w-4 h-4 text-[#8B7355] shrink-0" />
                  <span className="text-sm font-semibold text-[#7A6245]">{selectedLang.native}</span>
                  <span className="text-sm text-[#A89880] font-medium mx-1">·</span>
                  <span className="text-xs text-[#A89880] font-medium">{selectedLang.confirm}</span>
                </motion.div>
              ) : (
                <div className="flex items-center gap-2.5 bg-[#F7F4EF] border border-dashed border-[#E8E2D9] px-4 py-2.5 rounded-lg w-full justify-center">
                  <span className="text-xs text-[#C5B5A0] font-medium">No language selected yet</span>
                </div>
              )}
            </div>

            {/* Button */}
            <button
              disabled={!selected || loading}
              onClick={proceed}
              className={`w-full h-14 rounded-xl font-bold uppercase tracking-wider text-[13px] flex items-center justify-center gap-2 transition-all shadow-md
                ${selected && !loading ? 'bg-[#2C2416] hover:bg-[#3D3220] hover:-translate-y-0.5 hover:shadow-lg text-[#F7F4EF]' : 
                  loading ? 'bg-[#8B7355] text-white' : 'bg-[#E8E2D9] text-[#A89880] cursor-not-allowed'}`}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> SAVING PREFERENCE...</>
              ) : selectedLang ? (
                <>CONTINUE IN {selectedLang.label.toUpperCase()} <ArrowRight className="w-4 h-4" /></>
              ) : (
                "SELECT A LANGUAGE TO CONTINUE"
              )}
            </button>
          </motion.div>

          {/* Footer note */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-xs font-medium text-[#A89880]">
            <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Changeable in settings</div>
            <div className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> AI responses in your script</div>
            <div className="flex items-center gap-1.5"><ArrowRight className="w-3.5 h-3.5" /> All 5 languages supported</div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
