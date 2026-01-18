import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Play, RotateCcw } from 'lucide-react'; // Timer алынып тасталды

const PhysicsStokesExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [liquid, setLiquid] = useState('water');
  const [isDropping, setIsDropping] = useState(false);
  const [time, setTime] = useState(0);
  const [finished, setFinished] = useState(false);

  // Тұтқырлық коэффициенттері (шартты бірлік)
  const liquids = {
    water: { name: 'Су', viscosity: 1, color: 'bg-blue-200/50', speed: 2 }, // Жылдам
    oil: { name: 'Өсімдік майы', viscosity: 50, color: 'bg-yellow-200/60', speed: 4 }, // Орташа
    glycerin: { name: 'Глицерин', viscosity: 1000, color: 'bg-slate-200/70', speed: 8 }, // Баяу
  };

  const currentLiquid = liquids[liquid as keyof typeof liquids];

  useEffect(() => {
    let interval: any;
    if (isDropping && !finished) {
      const startTime = Date.now();
      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setTime(elapsed);
      }, 50);
      
      // Анимация ұзақтығы сұйықтыққа байланысты
      setTimeout(() => {
        setFinished(true);
        clearInterval(interval);
      }, currentLiquid.speed * 1000);
    }
    return () => clearInterval(interval);
  }, [isDropping, currentLiquid]);

  const reset = () => {
    setIsDropping(false);
    setFinished(false);
    setTime(0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Физика. №1 Зертханалық жұмыс (10-сынып)</h2>
          <p className="text-slate-500">Стокс заңы: Тұтқырлықты анықтау</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="grid grid-cols-2 gap-12">
        <div className="flex justify-center">
           {/* Цилиндр */}
           <div className={`w-32 h-[400px] border-4 border-slate-300 rounded-b-3xl relative overflow-hidden ${currentLiquid.color}`}>
              {/* Шар */}
              <motion.div 
                className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-800 rounded-full shadow-lg"
                initial={{ top: '10px' }}
                animate={isDropping ? { top: '380px' } : { top: '10px' }}
                transition={{ duration: currentLiquid.speed, ease: "linear" }}
              />
              {/* Белгілер */}
              <div className="absolute top-10 w-full h-px bg-slate-400/50"></div>
              <div className="absolute bottom-10 w-full h-px bg-slate-400/50"></div>
              <div className="absolute right-2 top-1/2 -rotate-90 text-xs text-slate-500">S = 50 см</div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Droplets size={20}/> Сұйықтықты таңдаңыз:</h3>
              <div className="flex gap-2">
                 {Object.entries(liquids).map(([key, val]) => (
                    <button 
                      key={key} 
                      onClick={() => { setLiquid(key); reset(); }}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition ${liquid === key ? 'bg-indigo-600 text-white' : 'bg-white border hover:bg-slate-100'}`}
                    >
                       {val.name}
                    </button>
                 ))}
              </div>
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-800 text-green-400 font-mono text-xl flex items-center justify-center rounded-full border-4 border-slate-600">
                 {time.toFixed(2)}с
              </div>
              <div>
                 <h4 className="font-bold text-slate-800">Уақыт өлшеу</h4>
                 <p className="text-xs text-slate-500">{finished ? 'Аяқталды' : 'Өлшенуде...'}</p>
              </div>
           </div>

           <div className="flex gap-4">
              <button onClick={() => setIsDropping(true)} disabled={isDropping} className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50">
                 <Play size={20}/> Жіберу
              </button>
              <button onClick={reset} className="px-6 py-4 bg-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-300">
                 <RotateCcw size={20}/>
              </button>
           </div>

           {finished && (
              <div className="p-4 bg-blue-50 text-blue-800 rounded-xl text-sm border border-blue-200">
                 <strong>Нәтиже:</strong> {currentLiquid.name} ішінде шар <strong>{time.toFixed(2)} секундта</strong> түсті. 
                 {liquid === 'glycerin' ? ' Тұтқырлық өте жоғары.' : (liquid === 'water' ? ' Тұтқырлық төмен.' : ' Тұтқырлық орташа.')}
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default PhysicsStokesExperiment;