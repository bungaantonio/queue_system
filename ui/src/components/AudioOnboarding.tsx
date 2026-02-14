// src/components/AudioOnboarding.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  isAudioAllowed,
  requestAudioPermission,
} from "../utils/audioPermission";

export default function AudioOnboarding() {
  const [visible, setVisible] = useState(!isAudioAllowed());

  const handleStart = () => {
    requestAudioPermission();
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 backdrop-blur-2xl"
        >
          <div className="bg-white p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] text-center max-w-lg border border-slate-100">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-4xl animate-bounce">🔊</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">
              Ativar Alertas Sonoros?
            </h2>
            <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium">
              Para não perder a sua chamada, o sistema precisa de permissão para
              reproduzir áudio.
            </p>
            <button
              onClick={handleStart}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-6 rounded-[1.5rem] transition-all active:scale-95 shadow-xl shadow-indigo-200 text-xl uppercase tracking-widest"
            >
              Iniciar Painel
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
