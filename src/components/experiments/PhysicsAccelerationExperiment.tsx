import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Activity, Plus, TrendingUp } from 'lucide-react';

const PhysicsAccelerationExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [height, setHeight] = useState(20);
  const [length] = useState(100);
  const [isRolling, setIsRolling] = useState(false);
  const [time, setTime] = useState(0);
  const [results, setResults] = useState<Array<{ h: number, t: number, a: number }>>([]);
  
  // Физикалық тұрақтылар
  const g = 980; // см/с^2
  const acceleration = g * (height / length);
  const theoreticalTime = Math.sqrt((2 * length) / acceleration);

  // Анимация және таймер
  useEffect(() => {
    let interval: any;
    if (isRolling) {
      const startTime = Date.now();
      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed >= theoreticalTime) {
          setTime(theoreticalTime);
          setIsRolling(false);
          clearInterval(interval);
        } else {
          setTime(elapsed);
        }
      }, 16);
    }
    return () => clearInterval(interval);
  }, [isRolling, theoreticalTime]);

  const startExperiment = () => {
    setTime(0);
    setIsRolling(true);
  };

  const saveResult = () => {
    const measuredA = (2 * length) / (time * time);
    setResults([...results, { h: height, t: time, a: measuredA }]);
  };

  const reset = () => {
    setIsRolling(false);
    setTime(0);
  };

  // График үшін деректер
  const currentVelocity = (acceleration * time) / 100; // м/с

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-6xl mx-auto min-h-[700px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Зертханалық жұмыс №1 (9-сынып)</h2>
          <p className="text-slate-500">Теңүдемелі қозғалыс: Үдеуді анықтау</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:bg-indigo-50 px-4 py-2 rounded-lg transition">← Артқа</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Сол жақ: Визуализация */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative bg-gradient-to-b from-slate-100 to-slate-200 rounded-3xl border border-slate-300 h-[400px] flex items-end overflow-hidden p-10 shadow-inner">
             {/* Көлбеу жазықтық */}
             <div className="absolute bottom-10 left-10 w-4 bg-slate-400 rounded-t-lg shadow-md" style={{ height: `${height * 5}px`, transition: 'height 0.3s' }}>
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600 bg-white px-1 rounded">h={height}</div>
             </div>
             <div className="absolute bottom-10 left-10 h-3 bg-yellow-600 origin-bottom-left rounded shadow-sm" 
                  style={{ width: `${length * 6}px`, transform: `rotate(-${Math.asin(height/length) * (180/Math.PI)}deg)`, transition: 'transform 0.3s' }}>
                  {/* Шкала белгілері */}
                  {[...Array(11)].map((_, i) => (
                    <div key={i} className="absolute h-full w-px bg-yellow-800/50" style={{ left: `${i * 10}%` }}></div>
                  ))}
             </div>
             
             {/* Шар */}
             <motion.div 
               className="absolute w-8 h-8 rounded-full shadow-lg z-10 bg-radial-gradient from-slate-600 to-slate-900"
               style={{ background: 'radial-gradient(circle at 30% 30%, #64748b, #1e293b)' }}
               initial={{ bottom: `${10 + height * 5}px`, left: '10px' }}
               animate={isRolling || time === theoreticalTime ? {
                  bottom: '10px',
                  left: `${10 + Math.sqrt(length**2 - height**2) * 6}px`,
                  rotate: 360 * 4
               } : { bottom: `${10 + height * 5}px`, left: '10px', rotate: 0 }}
               transition={{ duration: theoreticalTime, ease: [0.33, 1, 0.68, 1] }}
             />
          </div>

          {/* Басқару панелі */}
          <div className="bg-slate-50 p-6 rounded-2xl flex items-center gap-6 border border-slate-200">
             <div className="flex-1">
                 <label className="text-sm font-bold text-slate-600 mb-2 block">Көлбеу биіктігі (h): {height} см</label>
                 <input type="range" min="10" max="60" step="1" value={height} onChange={(e) => { setHeight(Number(e.target.value)); reset(); }} className="w-full accent-indigo-600 cursor-pointer" disabled={isRolling} />
             </div>
             <div className="flex gap-2">
                <button onClick={startExperiment} disabled={isRolling || time === theoreticalTime} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200">
                   <Play size={20} fill="currentColor" /> Жіберу
                </button>
                <button onClick={reset} className="px-4 py-3 bg-white text-slate-600 font-bold rounded-xl hover:bg-slate-100 border border-slate-200">
                   <RotateCcw size={20} />
                </button>
             </div>
          </div>
          
          {/* Жылдамдық графигі (SVG) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 h-48 relative overflow-hidden">
             <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2"><TrendingUp size={14}/> Жылдамдық графигі v(t)</h4>
             <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                <line x1="0" y1="100" x2="300" y2="100" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="0" y1="0" x2="0" y2="100" stroke="#cbd5e1" strokeWidth="2" />
                {/* Динамикалық сызық */}
                <motion.polyline 
                  points={`0,100 ${Math.min(300, (time/theoreticalTime)*300)},${100 - (time/theoreticalTime)*90}`}
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3"
                />
             </svg>
             <div className="absolute bottom-2 right-2 text-indigo-600 font-mono text-sm font-bold">v = {currentVelocity.toFixed(2)} м/с</div>
          </div>
        </div>

        {/* Оң жақ: Нәтижелер тақтасы */}
        <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col h-full">
           <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-900 text-green-400 font-mono text-3xl shadow-inner border-4 border-slate-700 mb-2">
                 {time.toFixed(2)}<span className="text-sm ml-1">с</span>
              </div>
              <p className="text-slate-500 text-sm">Уақыт</p>
           </div>

           {time === theoreticalTime && !isRolling && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
               <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-sm space-y-2">
                 <p className="flex justify-between"><span>Жол (S):</span> <strong>{length/100} м</strong></p>
                 <p className="flex justify-between"><span>Уақыт (t):</span> <strong>{time.toFixed(2)} с</strong></p>
                 <div className="h-px bg-indigo-200 my-1"></div>
                 <p className="flex justify-between text-indigo-900 font-bold"><span>Үдеу (a):</span> <span>{((2*length)/(time*time)/100).toFixed(2)} м/с²</span></p>
               </div>
               <button onClick={saveResult} className="w-full mt-2 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2">
                  <Plus size={16}/> Кестеге жазу
               </button>
             </motion.div>
           )}

           <div className="flex-1 overflow-auto">
              <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><Activity size={16}/> Тәжірибелер кестесі</h3>
              <table className="w-full text-xs text-left">
                <thead className="text-slate-500 border-b">
                  <tr>
                    <th className="pb-2">№</th>
                    <th className="pb-2">Биіктік</th>
                    <th className="pb-2">Уақыт</th>
                    <th className="pb-2">Үдеу</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {results.map((r, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                      <td className="py-2 font-bold">{i + 1}</td>
                      <td className="py-2">{r.h} см</td>
                      <td className="py-2">{r.t.toFixed(2)} с</td>
                      <td className="py-2 text-indigo-600 font-bold">{(r.a/100).toFixed(2)}</td>
                    </tr>
                  ))}
                  {results.length === 0 && (
                    <tr><td colSpan={4} className="py-4 text-center text-slate-400 italic">Деректер жоқ</td></tr>
                  )}
                </tbody>
              </table>
           </div>
           
           {results.length > 0 && (
             <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                   <span>Орташа үдеу:</span>
                   <span className="text-lg text-green-600">
                     {(results.reduce((acc, curr) => acc + curr.a, 0) / results.length / 100).toFixed(2)} м/с²
                   </span>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default PhysicsAccelerationExperiment;