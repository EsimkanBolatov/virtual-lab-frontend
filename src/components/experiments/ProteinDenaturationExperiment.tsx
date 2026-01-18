import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Activity, AlertTriangle, RefreshCw } from 'lucide-react'; // ArrowRight алынып тасталды

const ProteinDenaturationExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [temp, setTemp] = useState(37); // Оптимум ~37°C
  const [ph, setPh] = useState(7);      // Оптимум ~7
  const [status, setStatus] = useState<'active' | 'denatured'>('active');
  const [efficiency, setEfficiency] = useState(100);

  // Денатурация логикасы
  useEffect(() => {
    // Температура әсері: 37-ден ауытқыған сайын тиімділік төмендейді
    // 60-тан жоғары = қайтымсыз денатурация
    const tempDiff = Math.abs(temp - 37);
    const tempEffect = Math.max(0, 100 - (tempDiff * 3));

    // pH әсері: 7-ден ауытқыған сайын төмендейді
    // <3 немесе >11 = денатурация
    const phDiff = Math.abs(ph - 7);
    const phEffect = Math.max(0, 100 - (phDiff * 20));

    // Жалпы тиімділік (ең төменгі көрсеткіш бойынша)
    const totalEfficiency = Math.min(tempEffect, phEffect);
    setEfficiency(totalEfficiency);

    if (temp > 55 || ph < 3 || ph > 11) {
      setStatus('denatured');
    } else {
      setStatus('active');
    }
  }, [temp, ph]);

  const reset = () => {
    setTemp(37);
    setPh(7);
    setStatus('active');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">№1 Зертханалық жұмыс</h2>
          <p className="text-slate-500">Нәруыздарға температура мен pH әсері (Денатурация)</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Визуализация аймағы */}
        <div className="col-span-2 bg-slate-50 rounded-2xl border border-slate-200 h-[400px] flex items-center justify-center relative overflow-hidden">
           
           {/* Нәруыз молекуласы (SVG анимация) */}
           <motion.svg 
             width="300" 
             height="300" 
             viewBox="0 0 200 200"
             animate={{
               scale: status === 'denatured' ? 1.2 : 1,
               rotate: status === 'active' ? [0, 5, -5, 0] : 0,
             }}
             transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
           >
             {/* Активті (бұралған) күй немесе Денатурацияланған (жазылған) күй */}
             <motion.path
               d={status === 'active' 
                 ? "M 40 100 Q 60 40 80 100 T 120 100 T 160 100 T 100 160 T 40 100" // Ширатылған
                 : "M 20 100 Q 60 90 100 110 T 180 100"} // Түзу сызыққа жақын (үзілген байланыстар)
               fill="none"
               stroke={status === 'active' ? "#6366f1" : "#ef4444"}
               strokeWidth="8"
               strokeLinecap="round"
               initial={false}
               animate={{ d: status === 'active' 
                 ? "M 40 100 Q 60 40 80 100 T 120 100 T 160 100 T 100 160 T 40 100" 
                 : "M 20 150 Q 50 50 100 150 T 180 50" }} // Жайылған пішін
               transition={{ duration: 1 }}
             />
             
             {/* Байланыстар (сутектік) */}
             {status === 'active' && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                   <circle cx="80" cy="100" r="3" fill="#fbbf24" />
                   <circle cx="120" cy="100" r="3" fill="#fbbf24" />
                   <circle cx="100" cy="130" r="3" fill="#fbbf24" />
                </motion.g>
             )}
           </motion.svg>

           {/* Статус индикаторы */}
           <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100">
              <div className="flex items-center gap-2">
                 <div className={`w-3 h-3 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                 <span className="font-bold text-slate-700">
                    {status === 'active' ? 'Табиғи құрылым (Нативті)' : 'Денатурацияланды'}
                 </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Ферменттік белсенділік: {Math.round(efficiency)}%</p>
           </div>

           {status === 'denatured' && (
             <div className="absolute bottom-4 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-full animate-pulse">
                <AlertTriangle size={18} />
                <span className="font-bold text-sm">Құрылым бұзылды!</span>
             </div>
           )}
        </div>

        {/* Басқару панелі */}
        <div className="space-y-8">
           
           {/* Температура слайдері */}
           <div className="bg-slate-100 p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                 <label className="font-bold text-slate-700 flex items-center gap-2">
                    <Thermometer className="text-orange-500"/> Температура
                 </label>
                 <span className="text-xl font-bold text-slate-800">{temp}°C</span>
              </div>
              <input 
                type="range" min="0" max="100" value={temp} 
                onChange={(e) => setTemp(Number(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-blue-300 via-orange-300 to-red-500 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                 <span>0°C</span>
                 <span>100°C</span>
              </div>
           </div>

           {/* pH слайдері */}
           <div className="bg-slate-100 p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                 <label className="font-bold text-slate-700 flex items-center gap-2">
                    <Activity className="text-purple-500"/> pH ортасы
                 </label>
                 <span className="text-xl font-bold text-slate-800">{ph}</span>
              </div>
              <input 
                type="range" min="0" max="14" step="0.5" value={ph} 
                onChange={(e) => setPh(Number(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-red-400 via-green-400 to-blue-500 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                 <span>0 (Қышқыл)</span>
                 <span>14 (Сілті)</span>
              </div>
           </div>

           <button onClick={reset} className="w-full py-3 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 flex items-center justify-center gap-2 transition">
              <RefreshCw size={20} /> Параметрлерді қалпына келтіру
           </button>

           <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 border border-blue-100">
              <p><strong>Анықтама:</strong> Нәруыздар (мысалы, ферменттер) белгілі бір температура мен pH ортасында ғана жұмыс істейді. Қатты қыздыру немесе қышқыл/сілті қосу олардың пішінін бұзады.</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ProteinDenaturationExperiment;