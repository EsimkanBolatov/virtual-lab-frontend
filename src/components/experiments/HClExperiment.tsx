import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Activity, ArrowDown } from 'lucide-react';

const HClExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [volumeAdded, setVolumeAdded] = useState(0); // мл NaOH
  const [isFlowing, setIsFlowing] = useState(false);
  const [ph, setPh] = useState(1); // Бастапқы pH (Күшті қышқыл)
  const [indicatorColor, setIndicatorColor] = useState('rgba(255, 255, 255, 0)'); // Мөлдір
  
  // Константалар
  const TOTAL_HCL = 20; // мл
  const EQUIVALENCE_POINT = 20; // 20 мл қосқанда бейтараптанады

  // Анимация және есептеу
  useEffect(() => {
    let interval: any;
    if (isFlowing && volumeAdded < 50) {
      interval = setInterval(() => {
        setVolumeAdded(prev => {
          const newVal = prev + 0.2;
          return newVal > 50 ? 50 : newVal;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isFlowing, volumeAdded]);

  // pH және Түс логикасы
  useEffect(() => {
    // Сигмоидты функция арқылы pH қисығын имитациялау
    // Титрлеу қисығына ұқсас формула
    let currentPh = 1;
    if (volumeAdded < EQUIVALENCE_POINT) {
      currentPh = 1 + (volumeAdded / EQUIVALENCE_POINT) * 2; // Баяу өсу
    } else if (Math.abs(volumeAdded - EQUIVALENCE_POINT) < 1) {
      currentPh = 7; // Секіріс
    } else {
      currentPh = 12 + (1 - Math.exp(-(volumeAdded - EQUIVALENCE_POINT) / 10)); // Сілтілік орта
    }
    setPh(currentPh);

    // Фенолфталеин түсі (pH > 8.2 болғанда күлгін бола бастайды)
    if (currentPh > 8.2) {
      const intensity = Math.min((currentPh - 8) / 4, 1);
      setIndicatorColor(`rgba(236, 72, 153, ${intensity})`); // Pink-500
    } else {
      setIndicatorColor('rgba(255, 255, 255, 0.1)');
    }
  }, [volumeAdded]);

  const reset = () => {
    setVolumeAdded(0);
    setPh(1);
    setIsFlowing(false);
    setIndicatorColor('rgba(255, 255, 255, 0)');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto min-h-[600px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">№8 Зертханалық жұмыс</h2>
          <p className="text-slate-500">Қышқылды бейтараптану реакциясы (Титрлеу)</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 flex-grow">
        
        {/* Сол жақ: Құрылғы (Бюретка + Колба) */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 relative flex flex-col items-center justify-end p-8 overflow-hidden h-[500px]">
           {/* Бюретка (NaOH) */}
           <div className="absolute top-0 w-8 h-64 bg-slate-200 border-x border-slate-300 z-20">
              <motion.div 
                className="w-full bg-blue-200 absolute bottom-0"
                style={{ height: `${100 - (volumeAdded * 2)}%` }} // Сұйықтық азаяды
              />
              <div className="absolute bottom-[-10px] left-[-10px] w-14 h-4 bg-slate-400 rounded cursor-pointer" onClick={() => setIsFlowing(!isFlowing)}>
                 <div className={`w-2 h-6 bg-slate-600 mx-auto transition-transform ${isFlowing ? 'rotate-0' : 'rotate-90'}`}></div>
              </div>
           </div>

           {/* Тамшы */}
           {isFlowing && (
             <motion.div 
               className="absolute top-64 w-3 h-3 bg-blue-300 rounded-full z-10"
               animate={{ y: [0, 150], opacity: [1, 0] }}
               transition={{ repeat: Infinity, duration: 0.3 }}
             />
           )}

           {/* Колба (HCl + Индикатор) */}
           <div className="relative w-48 h-56 z-10 mt-32">
              <svg viewBox="0 0 200 240" className="drop-shadow-2xl">
                <path d="M 70 0 L 70 80 L 10 240 L 190 240 L 130 80 L 130 0" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="4" />
                <path d="M 72 0 L 72 80 L 12 238 L 188 238 L 128 80 L 128 0" fill="white" opacity="0.5" />
                
                {/* Сұйықтық түсі */}
                <mask id="liquidMask">
                   <path d="M 12 238 L 188 238 L 128 80 L 72 80 L 72 238 Z" fill="white" />
                </mask>
                <g mask="url(#liquidMask)">
                   <rect x="0" y="100" width="200" height="140" fill={indicatorColor} className="transition-colors duration-300" />
                   <rect x="0" y="100" width="200" height="140" fill="blue" fillOpacity="0.05" /> {/* HCl базалық түсі */}
                </g>
              </svg>
              <div className="absolute bottom-4 left-0 right-0 text-center font-bold text-slate-500">HCl + Фенолфталеин</div>
           </div>
        </div>

        {/* Оң жақ: Деректер және График */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-end mb-4">
                 <div>
                    <p className="text-slate-500 text-sm">Қосылған NaOH көлемі:</p>
                    <p className="text-4xl font-bold text-blue-600">{volumeAdded.toFixed(1)} мл</p>
                 </div>
                 <div className="text-right">
                    <p className="text-slate-500 text-sm flex items-center justify-end gap-1"><Activity size={16}/> pH деңгейі:</p>
                    <p className={`text-4xl font-bold ${ph > 8 ? 'text-pink-500' : 'text-slate-700'}`}>{ph.toFixed(2)}</p>
                 </div>
              </div>

              {/* Басқару түймесі */}
              <button 
                onClick={() => setIsFlowing(!isFlowing)}
                className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${isFlowing ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
              >
                {isFlowing ? 'Тоқтату (Кранды жабу)' : 'Тамшылату (Кранды ашу)'}
              </button>
           </div>

           {/* Титрлеу қисығы */}
           <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 relative h-64">
              <p className="text-xs font-bold text-slate-400 absolute top-2 left-2">pH Графигі</p>
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 {/* Осьтер */}
                 <line x1="0" y1="90" x2="100" y2="90" stroke="#cbd5e1" strokeWidth="1" />
                 <line x1="10" y1="0" x2="10" y2="100" stroke="#cbd5e1" strokeWidth="1" />
                 
                 {/* Эквиваленттік нүкте сызығы */}
                 <line x1="40" y1="0" x2="40" y2="100" stroke="#fca5a5" strokeWidth="0.5" strokeDasharray="2" />
                 
                 {/* Қисық сызу */}
                 <motion.path
                   fill="none"
                   stroke="#6366f1"
                   strokeWidth="2"
                   d={`M 10 90 Q 25 88 38 85 L 40 40 L 42 15 Q 60 12 100 10`}
                   strokeDasharray="1000"
                   strokeDashoffset={1000 - (volumeAdded / 50) * 1000} // Анимация
                 />
                 
                 {/* Ағымдағы нүкте */}
                 <circle 
                    cx={10 + (volumeAdded / 50) * 90} 
                    cy={90 - ((ph - 1) / 13) * 80} 
                    r="2" 
                    fill="red" 
                 />
              </svg>
              <div className="absolute bottom-1 right-2 text-xs text-slate-400">V (NaOH), мл</div>
           </div>

           {ph > 8.2 && volumeAdded < 22 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-100 text-green-800 p-4 rounded-xl flex items-center gap-2">
                 <RefreshCw className="animate-spin-slow" />
                 <span className="font-bold">Эквиваленттік нүктеге жеттіңіз! Реакция аяқталды.</span>
              </motion.div>
           )}
           
           <button onClick={reset} className="text-slate-400 hover:text-slate-600 text-sm mx-auto block">Тәжірибені қайта бастау</button>
        </div>
      </div>
    </div>
  );
};

export default HClExperiment;