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
          exit={{ opacity: 0, scale: 1.1 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl"
        >
          <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center max-w-md">
            <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🔊</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Ativar Som?
            </h2>
            <p className="text-slate-500 mb-8">
              Para uma melhor experiência, ative os alertas sonoros das
              chamadas.
            </p>
            <button
              onClick={handleStart}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-sky-200"
            >
              ENTRAR NO SISTEMA
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
