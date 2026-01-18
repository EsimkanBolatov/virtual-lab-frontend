import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

const SolutionPreparationExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [salt, setSalt] = useState(0); // грамм
  const [water, setWater] = useState(0); // мл
  const [mixed, setMixed] = useState(false);
  const [message, setMessage] = useState('');

  // Мақсат: 200г 5% ерітінді (10г тұз + 190мл су)
  const targetSalt = 10;
  const targetWater = 190;

  const currentConcentration = water + salt > 0 ? (salt / (water + salt)) * 100 : 0;
  const totalMass = water + salt;

  const handleAddSalt = () => {
    if (mixed) return;
    setSalt(prev => prev + 1);
  };

  const handleAddWater = () => {
    if (mixed) return;
    setWater(prev => prev + 10);
  };

  const handleMix = () => {
    setMixed(true);
    if (salt === targetSalt && water === targetWater) {
      setMessage('🎉 Тамаша! Сіз дәл 5%-дық ерітінді дайындадыңыз!');
    } else {
      const diff = Math.abs(currentConcentration - 5);
      if (diff < 1) setMessage('👍 Жақсы, бірақ дәл емес. 5%-ға өте жақынсыз!');
      else setMessage(`❌ Қате. Сіздің ерітіндіңіз: ${currentConcentration.toFixed(1)}%. Қайтадан көріңіз.`);
    }
  };

  const reset = () => {
    setSalt(0);
    setWater(0);
    setMixed(false);
    setMessage('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto min-h-[600px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">№5 Практикалық жұмыс</h2>
          <p className="text-slate-500">Интерактивті ерітінді дайындау</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl mb-8 border border-blue-200">
        <h3 className="font-bold text-blue-900">🎯 Тапсырма:</h3>
        <p className="text-blue-800">Массасы **200 г**, концентрациясы **5%** болатын тұз ерітіндісін дайындаңыз.</p>
        <p className="text-xs text-blue-600 mt-1">(Қажетті тұз: 10г, Су: 190мл)</p>
      </div>

      <div className="grid grid-cols-2 gap-10 flex-grow">
        {/* Басқару панелі */}
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">1. Тұз қосу (1 басқанда +1г)</h4>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleAddSalt}
                disabled={mixed}
                className="w-16 h-16 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center text-2xl hover:border-indigo-500 hover:bg-indigo-50 active:scale-95 transition-all shadow-sm"
              >
                🧂
              </button>
              <div className="flex-1">
                <div className="text-sm text-slate-500">Тұз массасы:</div>
                <div className="text-3xl font-bold text-slate-800">{salt} г</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">2. Су құю (1 басқанда +10мл)</h4>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleAddWater}
                disabled={mixed}
                className="w-16 h-16 bg-white border-2 border-blue-300 rounded-full flex items-center justify-center text-2xl hover:bg-blue-50 active:scale-95 transition-all shadow-sm"
              >
                💧
              </button>
              <div className="flex-1">
                <div className="text-sm text-slate-500">Су көлемі:</div>
                <div className="text-3xl font-bold text-blue-600">{water} мл</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleMix}
            disabled={mixed || (salt === 0 && water === 0)}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${mixed ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            <RefreshCw className={mixed ? "" : "animate-spin-slow"} /> Араластыру және тексеру
          </button>
        </div>

        {/* Визуализация (Стакан) */}
        <div className="relative bg-slate-100 rounded-2xl flex items-end justify-center p-8 overflow-hidden">
           {/* Стакан контуры */}
           <div className="w-40 h-64 border-x-4 border-b-8 border-slate-400 bg-white/40 backdrop-blur-sm rounded-b-3xl relative overflow-hidden z-10">
              
              {/* Су деңгейі */}
              <motion.div 
                className="absolute bottom-0 w-full bg-blue-400/80 transition-all duration-500"
                style={{ height: `${Math.min((water / 250) * 100, 100)}%` }}
              >
                 {/* Көпіршіктер */}
                 {mixed && (
                   <div className="absolute inset-0">
                     {[...Array(5)].map((_, i) => (
                       <motion.div 
                         key={i}
                         className="absolute bg-white/50 rounded-full"
                         style={{ 
                           width: Math.random() * 10 + 5, 
                           height: Math.random() * 10 + 5,
                           left: `${Math.random() * 100}%` 
                         }}
                         animate={{ y: [0, -200], opacity: [0, 1, 0] }}
                         transition={{ repeat: Infinity, duration: 2 + Math.random() }}
                       />
                     ))}
                   </div>
                 )}
              </motion.div>

              {/* Тұз түйіршіктері (түбінде жиналады) */}
              {!mixed && salt > 0 && (
                <motion.div 
                  className="absolute bottom-0 w-full bg-slate-200"
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.min(salt * 2, 20)}%` }}
                />
              )}
           </div>

           {/* Ақпараттық панель */}
           <div className="absolute top-4 right-4 bg-white/90 p-4 rounded-xl shadow-md text-right">
              <div className="text-xs text-slate-500 font-bold uppercase">Жалпы масса</div>
              <div className="text-2xl font-bold">{totalMass} г</div>
              {mixed && (
                <>
                  <div className="w-full h-px bg-slate-200 my-2"></div>
                  <div className="text-xs text-slate-500 font-bold uppercase">Концентрация</div>
                  <div className={`text-2xl font-bold ${Math.abs(currentConcentration - 5) < 0.1 ? 'text-green-600' : 'text-red-500'}`}>
                    {currentConcentration.toFixed(1)}%
                  </div>
                </>
              )}
           </div>

           {/* Нәтиже хабарламасы */}
           <AnimatePresence>
             {message && (
               <motion.div 
                 initial={{ y: 50, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 className={`absolute bottom-8 left-8 right-8 p-4 rounded-xl text-center font-bold shadow-2xl flex items-center justify-center gap-2 ${message.includes('Тамаша') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
               >
                 {message.includes('Тамаша') ? <CheckCircle2 /> : <AlertCircle />}
                 {message}
                 <button onClick={reset} className="ml-4 bg-white px-3 py-1 rounded shadow text-sm hover:bg-slate-50">Қайталау</button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SolutionPreparationExperiment;