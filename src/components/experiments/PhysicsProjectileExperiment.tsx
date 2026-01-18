import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target } from 'lucide-react'; // RotateCcw және Play алынып тасталды

const PhysicsProjectileExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [height, setHeight] = useState(20); // метр (h)
  const [velocity, setVelocity] = useState(10); // м/с (v0)
  const [isLaunched, setIsLaunched] = useState(false);
  const [showPath, setShowPath] = useState(false);
  const [hit, setHit] = useState(false);

  // g = 9.8
  const timeToFall = Math.sqrt((2 * height) / 9.8);
  const distance = velocity * timeToFall; // L = v0 * t

  // Нысананың орны (рандом болуы мүмкін, қазір бекітілген 40м)
  const targetDistance = 40; 

  const handleLaunch = () => {
    setIsLaunched(true);
    setShowPath(true);
    
    // Тигенін тексеру (+/- 2 метр қателік)
    if (Math.abs(distance - targetDistance) < 3) {
      setTimeout(() => setHit(true), timeToFall * 1000); // Анимация біткен соң
    }
  };

  const reset = () => {
    setIsLaunched(false);
    setShowPath(false);
    setHit(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto min-h-[600px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Физика. №2 Зертханалық жұмыс</h2>
          <p className="text-slate-500">Горизонталь лақтырылған дененің қозғалысы</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="flex-grow bg-sky-100 rounded-3xl border-4 border-slate-300 relative overflow-hidden mb-8 shadow-inner">
         {/* Аспан */}
         <div className="absolute top-10 right-20 text-sky-900/10 text-9xl font-bold select-none">g = 9.8</div>

         {/* Жартас (Биіктік) */}
         <div className="absolute bottom-0 left-0 w-32 bg-stone-600 border-r-4 border-stone-700 transition-all duration-300" style={{ height: `${height * 10}px` }}>
            <div className="absolute top-2 right-2 text-white font-bold text-xs">{height}м</div>
         </div>

         {/* Зеңбірек / Доп */}
         <motion.div 
           className="absolute w-6 h-6 bg-red-600 rounded-full z-20 shadow-md"
           style={{ bottom: `${height * 10}px`, left: '120px' }}
           animate={isLaunched ? { 
             x: distance * 10, // Масштаб 1м = 10px
             y: height * 10 // Төмен түсу
           } : { x: 0, y: 0 }}
           transition={{ duration: timeToFall, ease: "linear" }}
         >
         </motion.div>

         {/* Траектория сызығы (Launch басқанда шығады) */}
         {showPath && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
               <path 
                 d={`M 130 ${500 - height * 10} Q ${130 + (distance * 10) / 2} ${500 - height * 10} ${130 + distance * 10} 500`}
                 fill="none" 
                 stroke="gray" 
                 strokeDasharray="5,5" 
                 strokeWidth="2" 
                 opacity="0.5"
               />
            </svg>
         )}

         {/* Нысана */}
         <div className="absolute bottom-0 w-16 h-4 bg-red-200 border-2 border-red-500 rounded-full flex items-center justify-center" style={{ left: `${120 + targetDistance * 10}px` }}>
            <Target size={16} className="text-red-600"/>
         </div>
         <div className="absolute bottom-6 text-xs font-bold text-red-600" style={{ left: `${120 + targetDistance * 10}px` }}>{targetDistance}м</div>

         {/* Жер */}
         <div className="absolute bottom-0 w-full h-2 bg-green-600"></div>

         {/* Нәтиже хабарламасы */}
         {isLaunched && (
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ delay: timeToFall }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-3xl shadow-2xl border-4 ${hit ? 'bg-green-500 border-green-700 text-white' : 'bg-white border-red-500 text-red-600'}`}
            >
               <h3 className="text-2xl font-bold text-center mb-2">{hit ? '🎯 ТИДІ!' : '❌ ҚИЫС КЕТТІ!'}</h3>
               <p className="text-center font-mono">Ұшу қашықтығы: {distance.toFixed(2)} м</p>
               <button onClick={reset} className="mt-4 bg-white text-slate-800 px-6 py-2 rounded-full font-bold shadow hover:scale-105 transition-transform mx-auto block">
                  Қайта ату
               </button>
            </motion.div>
         )}
      </div>

      {/* Басқару панелі */}
      <div className="grid grid-cols-2 gap-8 bg-slate-100 p-6 rounded-2xl">
         <div>
            <label className="font-bold text-slate-700 flex justify-between mb-2">
               Биіктік (h): <span>{height} м</span>
            </label>
            <input 
              type="range" min="10" max="50" 
              value={height} onChange={(e) => { setHeight(Number(e.target.value)); reset(); }}
              className="w-full h-2 bg-stone-400 rounded-lg cursor-pointer"
            />
         </div>
         <div>
            <label className="font-bold text-slate-700 flex justify-between mb-2">
               Бастапқы жылдамдық (v0): <span>{velocity} м/с</span>
            </label>
            <input 
              type="range" min="5" max="30" 
              value={velocity} onChange={(e) => { setVelocity(Number(e.target.value)); reset(); }}
              className="w-full h-2 bg-red-400 rounded-lg cursor-pointer"
            />
         </div>
         
         <div className="col-span-2">
            <button 
              onClick={handleLaunch} 
              disabled={isLaunched}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
               <Rocket /> АТУ (LAUNCH)
            </button>
         </div>
      </div>
    </div>
  );
};

export default PhysicsProjectileExperiment;