import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Timer, Activity } from 'lucide-react';

const PhysicsAccelerationExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [height, setHeight] = useState(20); // см
  const [length] = useState(100); // см (жол ұзындығы, өзгермейді)
  const [isRolling, setIsRolling] = useState(false);
  const [time, setTime] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Физика: a = g * sin(alpha) ≈ g * (h / L)
  const g = 980; // см/с^2
  const acceleration = g * (height / length);
  const calculatedTime = Math.sqrt((2 * length) / acceleration); // секунд

  useEffect(() => {
    let interval: any;
    if (isRolling) {
      const startTime = Date.now();
      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed >= calculatedTime) {
          setTime(calculatedTime);
          setIsRolling(false);
          setShowResult(true);
          clearInterval(interval);
        } else {
          setTime(elapsed);
        }
      }, 16);
    }
    return () => clearInterval(interval);
  }, [isRolling, calculatedTime]);

  const startExperiment = () => {
    setTime(0);
    setShowResult(false);
    setIsRolling(true);
  };

  const reset = () => {
    setIsRolling(false);
    setTime(0);
    setShowResult(false);
  };

  const measuredAcceleration = time > 0 ? (2 * length) / (time * time) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Физика. №1 Зертханалық жұмыс (9-сынып)</h2>
          <p className="text-slate-500">Теңүдемелі қозғалыс кезіндегі дененің үдеуін анықтау</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="flex flex-col gap-8">
        <div className="relative bg-slate-50 rounded-2xl border border-slate-200 h-[350px] flex items-end overflow-hidden p-10">
           <div className="absolute bottom-10 left-10 w-4 bg-slate-400 rounded-t-lg" style={{ height: `${height * 3}px` }}></div>
           <div className="absolute bottom-10 left-10 h-2 bg-yellow-600 origin-bottom-left rounded" 
                style={{ width: `${length * 5}px`, transform: `rotate(-${Math.asin(height/length) * (180/Math.PI)}deg)` }}>
           </div>
           <motion.div 
             className="absolute w-8 h-8 bg-slate-700 rounded-full shadow-lg z-10"
             initial={{ bottom: `${10 + height * 3}px`, left: '10px' }}
             animate={isRolling || showResult ? {
                bottom: '10px',
                left: `${10 + Math.sqrt(length**2 - height**2) * 5}px`
             } : { bottom: `${10 + height * 3}px`, left: '10px' }}
             transition={{ duration: calculatedTime, ease: [0.33, 1, 0.68, 1] }}
           />
           <div className="absolute bottom-10 w-1 h-10 bg-red-500" style={{ left: `${10 + Math.sqrt(length**2 - height**2) * 5}px` }}></div>
           <div className="absolute bottom-2 left-1/2 text-slate-400 font-mono text-sm">Жол ұзындығы: {length} см</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-slate-100 p-6 rounded-2xl space-y-4">
              <div>
                 <label className="font-bold text-slate-700 flex justify-between">Биіктік (h): <span>{height} см</span></label>
                 <input type="range" min="10" max="50" step="1" value={height} onChange={(e) => { setHeight(Number(e.target.value)); reset(); }} className="w-full h-2 bg-blue-300 rounded-lg cursor-pointer" />
              </div>
              <button onClick={startExperiment} disabled={isRolling} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2 disabled:opacity-50">
                 <Play size={20} /> Жіберу
              </button>
              <button onClick={reset} className="w-full py-2 text-slate-500 font-bold hover:text-slate-700 flex items-center justify-center gap-2">
                 <RotateCcw size={16} /> Қайтару
              </button>
           </div>

           <div className="bg-white border-2 border-slate-100 p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-green-400 font-mono text-xl shadow-inner border-4 border-slate-600">
                    {time.toFixed(2)}с
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><Timer size={18}/> Секундомер</h3>
                    <p className="text-xs text-slate-500">Шардың түсу уақыты</p>
                 </div>
              </div>
              {showResult && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-indigo-50 p-4 rounded-xl text-sm">
                    <p className="font-bold text-indigo-900 mb-2 flex items-center gap-2"><Activity size={16}/> Есептеулер:</p>
                    <p>Жол (S): <strong>{length/100} м</strong></p>
                    <p>Уақыт (t): <strong>{time.toFixed(2)} с</strong></p>
                    <div className="w-full h-px bg-indigo-200 my-2"></div>
                    <p className="text-lg">Үдеу a = 2S/t² = <span className="font-bold text-indigo-700">{(measuredAcceleration/100).toFixed(2)} м/с²</span></p>
                 </motion.div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicsAccelerationExperiment;