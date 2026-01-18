import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react'; // Zap алынып тасталды

const PhysicsTransformerExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [n1, setN1] = useState(500); // Бірінші реттік орам
  const [n2, setN2] = useState(1000); // Екінші реттік орам
  const [u1, setU1] = useState(220); // Кіріс кернеуі

  // k = N1 / N2 = U1 / U2
  const u2 = u1 * (n2 / n1);
  const k = n1 / n2;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Физика. №1 Зертханалық жұмыс (11-сынып)</h2>
          <p className="text-slate-500">Трансформатордың жұмысын зерттеу</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* Визуализация */}
        <div className="bg-slate-100 rounded-3xl p-10 flex items-center justify-center relative">
           {/* Өзек (Сердечник) */}
           <div className="w-48 h-48 border-[20px] border-slate-400 rounded-xl bg-transparent relative"></div>
           
           {/* N1 Орамасы */}
           <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-16 h-24 bg-gradient-to-r from-red-600 to-red-400 rounded flex flex-col justify-between p-1 border border-red-800 shadow-lg">
                 {[...Array(5)].map((_,i) => <div key={i} className="w-full h-1 bg-red-900/30"></div>)}
              </div>
              <span className="font-bold text-red-700 mt-2">N1: {n1}</span>
              <div className="bg-white px-2 py-1 rounded border border-red-200 mt-1 shadow text-sm font-bold">{u1} V</div>
           </div>

           {/* N2 Орамасы */}
           <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-16 h-24 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex flex-col justify-between p-1 border border-blue-800 shadow-lg" style={{ height: `${(n2/n1) * 60 + 40}px`, maxHeight: '140px' }}>
                 {[...Array(Math.min(8, Math.ceil(n2/200)))].map((_,i) => <div key={i} className="w-full h-1 bg-blue-900/30"></div>)}
              </div>
              <span className="font-bold text-blue-700 mt-2">N2: {n2}</span>
              <div className="bg-white px-2 py-1 rounded border border-blue-200 mt-1 shadow text-lg font-bold text-blue-600">{u2.toFixed(1)} V</div>
           </div>

           {/* Индукция (Анимация) */}
           <motion.div 
             className="absolute w-40 h-40 border-[4px] border-yellow-400/50 rounded-lg pointer-events-none"
             animate={{ opacity: [0.2, 0.5, 0.2] }}
             transition={{ duration: 1, repeat: Infinity }}
           />
        </div>

        {/* Басқару */}
        <div className="space-y-6">
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Settings size={20}/> Параметрлер</h3>
              
              <div className="mb-4">
                 <label className="text-sm font-bold text-slate-500">Кіріс кернеуі (U1):</label>
                 <div className="flex items-center gap-4">
                    <input type="range" min="0" max="240" step="10" value={u1} onChange={(e) => setU1(Number(e.target.value))} className="flex-1 h-2 bg-red-200 rounded-lg cursor-pointer accent-red-600"/>
                    <span className="font-bold w-12 text-right">{u1}V</span>
                 </div>
              </div>

              <div className="mb-4">
                 <label className="text-sm font-bold text-slate-500">N1 Орам саны:</label>
                 <div className="flex items-center gap-4">
                    <input type="range" min="100" max="1000" step="100" value={n1} onChange={(e) => setN1(Number(e.target.value))} className="flex-1 h-2 bg-slate-300 rounded-lg cursor-pointer accent-slate-600"/>
                    <span className="font-bold w-12 text-right">{n1}</span>
                 </div>
              </div>

              <div className="mb-4">
                 <label className="text-sm font-bold text-slate-500">N2 Орам саны:</label>
                 <div className="flex items-center gap-4">
                    <input type="range" min="100" max="2000" step="100" value={n2} onChange={(e) => setN2(Number(e.target.value))} className="flex-1 h-2 bg-blue-300 rounded-lg cursor-pointer accent-blue-600"/>
                    <span className="font-bold w-12 text-right">{n2}</span>
                 </div>
              </div>
           </div>

           <div className="bg-indigo-50 p-4 rounded-xl text-center border border-indigo-100">
              <p className="text-indigo-800 font-bold mb-2">Трансформация коэффициенті (k):</p>
              <div className="text-3xl font-mono text-indigo-600 font-bold">{k.toFixed(2)}</div>
              <p className="text-xs text-indigo-400 mt-1">{k > 1 ? 'Төмендеткіш (Step-down)' : (k < 1 ? 'Жоғарылатқыш (Step-up)' : 'Өзгеріссіз')}</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default PhysicsTransformerExperiment;