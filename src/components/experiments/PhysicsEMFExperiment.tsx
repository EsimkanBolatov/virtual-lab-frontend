import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity } from 'lucide-react';

const PhysicsEMFExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [resistance, setResistance] = useState(5); // Сыртқы кедергі R
  const emf = 9; // ЭҚК (E) = 9V
  const internalR = 1; // Ішкі кедергі (r) = 1 Ом

  // I = E / (R + r)
  const current = emf / (resistance + internalR);
  // U = I * R = E - I*r
  const voltage = current * resistance;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Физика. №3 Зертханалық жұмыс (10-сынып)</h2>
          <p className="text-slate-500">Ток көзінің ЭҚК және ішкі кедергісін анықтау</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Схема */}
        <div className="bg-slate-900 rounded-3xl p-8 relative flex items-center justify-center border-4 border-slate-700 shadow-inner h-[300px]">
           <div className="absolute inset-12 border-4 border-yellow-500 rounded opacity-80"></div>
           
           {/* Батарейка */}
           <div className="absolute bottom-[-20px] bg-slate-800 border-2 border-yellow-500 px-4 py-2 rounded text-white font-bold flex items-center gap-2">
              <Zap className="text-yellow-400" size={16}/> E=?, r=?
           </div>

           {/* Реостат */}
           <div className="absolute top-[-25px] bg-slate-700 border-2 border-yellow-500 px-4 py-2 rounded text-white font-bold">
              R = {resistance} Ω
           </div>

           {/* Вольтметр */}
           <div className="absolute right-[-30px] top-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full border-4 border-slate-600 flex flex-col items-center justify-center shadow-lg">
              <span className="text-xs font-bold text-slate-400">V</span>
              <span className="text-xl font-bold">{voltage.toFixed(2)}</span>
           </div>

           {/* Амперметр */}
           <div className="absolute left-[-30px] top-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full border-4 border-slate-600 flex flex-col items-center justify-center shadow-lg">
              <span className="text-xs font-bold text-slate-400">A</span>
              <span className="text-xl font-bold">{current.toFixed(2)}</span>
           </div>
        </div>

        {/* Басқару және График */}
        <div className="space-y-6">
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <label className="font-bold text-slate-700 mb-2 block">Реостат кедергісін өзгерту:</label>
              <input 
                type="range" min="0.5" max="20" step="0.5" 
                value={resistance} 
                onChange={(e) => setResistance(Number(e.target.value))}
                className="w-full h-3 bg-indigo-200 rounded-lg cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2 font-bold">
                 <span>0.5 Ом</span>
                 <span>20 Ом</span>
              </div>
           </div>

           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative h-48">
              <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm"><Activity size={16}/> U = f(I) Графигі</h4>
              <div className="w-full h-full border-l-2 border-b-2 border-slate-300 relative">
                 {/* Теориялық сызық (U = E - Ir) => E=9, r=1.  U = 9 - I */}
                 <svg className="absolute inset-0 w-full h-full overflow-visible">
                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="#e2e8f0" strokeDasharray="4"/>
                    {/* Нүкте */}
                    <motion.circle 
                       cx={`${(current / 9) * 100}%`} // Max current = 9A (when R=0)
                       cy={`${100 - (voltage / 9) * 100}%`} // Max voltage = 9V
                       r="6" fill="#ef4444" 
                    />
                 </svg>
                 <div className="absolute bottom-[-20px] right-0 text-xs font-bold">I (A)</div>
                 <div className="absolute top-0 left-[-20px] text-xs font-bold">U (V)</div>
              </div>
           </div>

           <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800 border border-yellow-200">
              <p><strong>Формула:</strong> U = E - I⋅r</p>
              <p>Графиктің көлбеуі ішкі кедергіні (r), ал қиылысу нүктесі ЭҚК-ні (E) береді.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicsEMFExperiment;