import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Lightbulb } from 'lucide-react';

const PhysicsOhmsLawExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [voltage, setVoltage] = useState(0); // В (Вольт)
  const [resistance, setResistance] = useState(10); // Ом
  
  // I = U / R
  const current = resistance > 0 ? (voltage / resistance).toFixed(2) : '∞';
  const glowOpacity = Math.min((voltage / resistance) * 0.5, 1); // Шам жарығы

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Физика. №4 Зертханалық жұмыс</h2>
          <p className="text-slate-500">Тізбек бөлігі үшін Ом заңы (I = U / R)</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Схема Визуализациясы */}
        <div className="relative bg-slate-900 rounded-3xl p-8 h-[400px] flex items-center justify-center border-4 border-slate-700 shadow-inner">
           {/* Сымдар */}
           <div className="absolute inset-10 border-4 border-yellow-500 rounded-xl opacity-80"></div>
           
           {/* Ток көзі (Батарейка) */}
           <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-32 h-16 bg-slate-800 border-2 border-yellow-500 flex items-center justify-center gap-2 rounded-lg z-10 text-white font-bold text-xl">
              <Zap className="text-yellow-400" /> {voltage}V
           </div>

           {/* Резистор (Кедергі) */}
           <div className="absolute top-1/2 left-[-20px] -translate-y-1/2 w-16 h-32 bg-slate-700 border-2 border-yellow-500 flex flex-col items-center justify-center rounded-lg z-10 text-white font-bold">
              <div className="h-2 w-full bg-stripes-white opacity-20 mb-2"></div>
              {resistance}Ω
           </div>

           {/* Шам */}
           <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
              <motion.div 
                animate={{ boxShadow: `0 0 ${glowOpacity * 60}px ${glowOpacity * 20}px rgba(253, 224, 71, ${glowOpacity})` }}
                className="bg-yellow-100 rounded-full p-4 border-4 border-slate-400 relative transition-all duration-300"
              >
                 <Lightbulb size={48} className={voltage > 0 ? "text-yellow-500" : "text-slate-400"} fill={voltage > 0 ? `rgba(234, 179, 8, ${glowOpacity})` : "none"} />
              </motion.div>
           </div>

           {/* Амперметр */}
           <div className="absolute top-1/2 right-[-30px] -translate-y-1/2 w-24 h-24 bg-white rounded-full border-4 border-slate-600 flex items-center justify-center shadow-lg z-10">
              <div className="text-center">
                 <span className="block text-xs font-bold text-slate-400">Амперметр</span>
                 <span className="block text-2xl font-mono font-bold text-slate-800">{current}A</span>
              </div>
           </div>
        </div>

        {/* Басқару панелі */}
        <div className="space-y-8 bg-slate-50 p-8 rounded-2xl border border-slate-200">
           
           {/* Кернеу слайдері */}
           <div>
              <div className="flex justify-between items-center mb-2">
                 <label className="font-bold text-slate-700">Кернеу (U):</label>
                 <span className="text-2xl font-bold text-blue-600">{voltage} В</span>
              </div>
              <input 
                type="range" min="0" max="24" step="1" 
                value={voltage} 
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
           </div>

           {/* Кедергі слайдері */}
           <div>
              <div className="flex justify-between items-center mb-2">
                 <label className="font-bold text-slate-700">Кедергі (R):</label>
                 <span className="text-2xl font-bold text-orange-600">{resistance} Ом</span>
              </div>
              <input 
                type="range" min="1" max="50" step="1" 
                value={resistance} 
                onChange={(e) => setResistance(Number(e.target.value))}
                className="w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
           </div>

           {/* Формула және График */}
           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mt-4">
              <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Activity size={16}/> Тәуелділік графигі</h4>
              <div className="relative h-32 w-full border-l-2 border-b-2 border-slate-300 flex items-end">
                 {/* График нүктесі */}
                 <motion.div 
                   className="w-4 h-4 bg-red-500 rounded-full absolute"
                   animate={{ 
                     bottom: `${Math.min((Number(current) / 5) * 100, 95)}%`, // I
                     left: `${(voltage / 24) * 95}%` // U
                   }}
                 />
                 <div className="absolute top-0 right-0 text-xs text-slate-400 font-bold">U (Кернеу)</div>
                 <div className="absolute top-0 left-2 text-xs text-slate-400 font-bold">I (Ток)</div>
              </div>
              <p className="text-center font-mono font-bold text-lg mt-4 text-indigo-700 bg-indigo-50 py-2 rounded">
                 I = {voltage}В / {resistance}Ом = {current}А
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default PhysicsOhmsLawExperiment;