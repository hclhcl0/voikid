'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminContext, DEFAULT_ADMIN_PIN } from '@/context/AdminContext';

export function AdminGateModal() {
  const {
    isAdminModalOpen,
    closeAdminModal,
    loginAdmin,
    verifyPin,
    onSuccessCallback,
    hasCustomPin,
  } = useAdminContext();

  const [inputPin, setInputPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [mode, setMode] = useState<'pin' | 'math'>('pin');

  // Math challenge state
  const [mathQuestion, setMathQuestion] = useState({ q: '8 x 7', ans: 56 });
  const [mathInput, setMathInput] = useState('');

  const generateNewMath = () => {
    const a = Math.floor(6 + Math.random() * 8); // 6 - 13
    const b = Math.floor(5 + Math.random() * 9); // 5 - 13
    setMathQuestion({ q: `${a} x ${b}`, ans: a * b });
    setMathInput('');
  };

  useEffect(() => {
    if (isAdminModalOpen) {
      setInputPin('');
      setErrorMsg('');
      generateNewMath();
    }
  }, [isAdminModalOpen]);

  const handleDigit = (digit: string) => {
    if (inputPin.length < 8) {
      const next = inputPin + digit;
      setInputPin(next);
      setErrorMsg('');

      // Auto verify if 4 digits
      if (next.length === 4 && verifyPin(next)) {
        loginAdmin(next);
        setTimeout(() => {
          closeAdminModal();
          if (onSuccessCallback) onSuccessCallback();
        }, 300);
      }
    }
  };

  const handleDeleteDigit = () => {
    setInputPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    setInputPin('');
    setErrorMsg('');
  };

  const handleSubmitPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loginAdmin(inputPin)) {
      closeAdminModal();
      if (onSuccessCallback) onSuccessCallback();
    } else {
      setErrorMsg('Mã PIN không chính xác! Vui lòng thử lại.');
      setInputPin('');
    }
  };

  const handleSubmitMath = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(mathInput.trim(), 10) === mathQuestion.ans) {
      loginAdmin(DEFAULT_ADMIN_PIN);
      closeAdminModal();
      if (onSuccessCallback) onSuccessCallback();
    } else {
      setErrorMsg('Kết quả phép tính chưa đúng! Bé chưa làm được câu này đâu nhé.');
      generateNewMath();
    }
  };

  if (!isAdminModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="bg-white rounded-2xl w-full max-w-sm shadow-sm border-3 border-slate-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-orange-600 p-5 text-white relative text-center">
            <button
              onClick={closeAdminModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center text-sm transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              ✕
            </button>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl mx-auto mb-2 shadow-inner">
              🔒
            </div>
            <h3 className="font-bold text-lg drop-shadow-xs">Xác Thực Quyền Admin</h3>
            <p className="text-white/80 text-xs font-semibold mt-0.5">
              Khu vực dành cho Phụ huynh & Quản trị viên
            </p>

            {/* Mode switch */}
            <div className="flex gap-1 mt-3 p-1 rounded-xl bg-black/20 text-xs font-bold">
              <button
                type="button"
                onClick={() => setMode('pin')}
                className={`flex-1 py-1 rounded-lg transition-all cursor-pointer ${
                  mode === 'pin' ? 'bg-white text-orange-700 shadow-xs' : 'text-white/80 hover:text-white'
                }`}
              >
                🔢 Mã PIN
              </button>
              <button
                type="button"
                onClick={() => setMode('math')}
                className={`flex-1 py-1 rounded-lg transition-all cursor-pointer ${
                  mode === 'math' ? 'bg-white text-orange-700 shadow-xs' : 'text-white/80 hover:text-white'
                }`}
              >
                🧮 Phép tính phụ huynh
              </button>
            </div>
          </div>

          <div className="p-5">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold text-center"
              >
                ⚠️ {errorMsg}
              </motion.div>
            )}

            {mode === 'pin' ? (
              <div className="space-y-4">
                {/* Visual PIN dots */}
                <div className="flex justify-center gap-3 py-2">
                  {[0, 1, 2, 3].map((idx) => {
                    const filled = idx < inputPin.length;
                    return (
                      <div
                        key={idx}
                        className={`w-4 h-4 rounded-full border-2 transition-all ${
                          filled
                            ? 'bg-orange-600 border-violet-600 scale-125 shadow-xs'
                            : 'bg-gray-100 border-gray-300'
                        }`}
                      />
                    );
                  })}
                </div>

                {!hasCustomPin && (
                  <p className="text-center text-[11px] font-bold text-slate-500">
                    💡 Mã PIN mặc định: <span className="text-orange-700 font-mono">1234</span>
                  </p>
                )}

                {/* Numeric Keypad */}
                <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto pt-1">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleDigit(num)}
                      className="h-12 rounded-2xl bg-gray-50 hover:bg-slate-50 hover:border-violet-300 border border-gray-200 text-gray-800 font-bold text-lg active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleClear}
                    className="h-12 rounded-2xl bg-gray-50 hover:bg-rose-50 text-gray-500 font-bold text-xs active:scale-95 transition-all cursor-pointer"
                  >
                    Xóa hết
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDigit('0')}
                    className="h-12 rounded-2xl bg-gray-50 hover:bg-slate-50 hover:border-violet-300 border border-gray-200 text-gray-800 font-bold text-lg active:scale-95 transition-all shadow-xs cursor-pointer"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteDigit}
                    className="h-12 rounded-2xl bg-gray-50 hover:bg-amber-50 text-gray-700 font-bold text-base active:scale-95 transition-all cursor-pointer"
                  >
                    ⌫
                  </button>
                </div>

                {inputPin.length >= 4 && (
                  <button
                    type="button"
                    onClick={() => handleSubmitPin()}
                    className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 hover:bg-orange-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
                  >
                    Mở khóa quyền Admin 🚀
                  </button>
                )}
              </div>
            ) : (
              /* Math Challenge Mode */
              <form onSubmit={handleSubmitMath} className="space-y-4">
                <div className="text-center py-2 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-xs font-bold text-gray-500 mb-1">Hãy giải phép tính dưới đây:</p>
                  <div className="text-3xl font-bold text-orange-700 tracking-wider">
                    {mathQuestion.q} = ?
                  </div>
                </div>

                <div>
                  <input
                    type="number"
                    value={mathInput}
                    onChange={(e) => setMathInput(e.target.value)}
                    placeholder="Nhập kết quả..."
                    className="w-full text-center px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-violet-600 focus:outline-hidden text-gray-800 font-bold text-xl"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 hover:bg-orange-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
                >
                  Xác nhận là Phụ Huynh 🚀
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
