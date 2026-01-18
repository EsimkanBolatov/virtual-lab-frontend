import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Ruler, Zap } from 'lucide-react';

const PhysicsDiffractionExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [wavelength, setWavelength] = useState(650); // нм (Қызыл)
  const [distance, setDistance] = useState(1); // м (Тордан экранға дейін)
  
  // d * sin(phi) = k * lambda
  // k=1 үшін x = (lambda * L) / d
  const d = 0.000002; // Тор периоды (2 мкм)
  
  // Экрандағы ауытқу (мм-мен есептеу визуалды түрде)
  // x = (lambda * L) / d
  const x_visual = (wavelength * 1e-9 * distance) / d * 1000 * 50; // 50 - масштабтау коэффициенті

  // Түс анықтау
  const getColor = (w: number) => {
    if (w >= 620) return '#ef4444'; // Red
    if (w >= 590) return '#f97316'; // Orange
    if (w >= 570) return '#eab308'; // Yellow
    if (w >= 495) return '#22c55e'; // Green
    if (w >= 450) return '#3b82f6'; // Blue
    return '#a855f7'; // Violet
  };

  const color = getColor(wavelength);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Физика. №3 Зертханалық жұмыс (11-сынып)</h2>
          <p className="text-slate-500">Дифракциялық тор көмегімен толқын ұзындығын анықтау</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="flex flex-col gap-10">
        
        {/* Оптикалық стенд (Төбесінен қарағандағы көрініс) */}
        <div className="relative bg-slate-900 rounded-2xl h-[300px] flex items-center px-10 overflow-hidden shadow-inner border-4 border-slate-700">
           
           {/* Лазер */}
           <div className="w-16 h-8 bg-slate-600 rounded flex items-center justify-center border border-slate-500 relative z-20">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}></div>
              <span className="text-[10px] text-white absolute -top-4">Лазер</span>
           </div>

           {/* Сәуле (Негізгі) */}
           <div className="flex-1 h-0.5 relative z-10" style={{ backgroundColor: color, opacity: 0.5 }}></div>

           {/* Дифракциялық тор */}
           <div className="w-2 h-24 bg-slate-500 border border-white/50 relative z-20 mx-10">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 w-20 text-center">Тор (d=2мкм)</div>
           </div>

           {/* Дифракциялық сәулелер (k=1, k=-1) */}
           <motion.div 
             className="absolute top-1/2 left-[180px] h-0.5 origin-left opacity-30" 
             style={{ width: `${distance * 400}px`, backgroundColor: color }}
             animate={{ rotate: x_visual / 10 }} // Визуалды бұрыш
           />
           <motion.div 
             className="absolute top-1/2 left-[180px] h-0.5 origin-left opacity-30" 
             style={{ width: `${distance * 400}px`, backgroundColor: color }}
             animate={{ rotate: -x_visual / 10 }}
           />

           {/* Экран */}
           <div className="w-4 h-48 bg-white/90 rounded relative z-20 ml-auto shadow-[0_0_20px_rgba(255,255,255,0.2)] flex flex-col items-center justify-center">
              {/* Орталық максимум */}
              <div className="w-3 h-3 rounded-full blur-sm absolute" style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}` }}></div>
              
              {/* 1-ші реттік максимумдар */}
              <motion.div 
                 className="w-2 h-2 rounded-full blur-sm absolute"
                 style={{ backgroundColor: color }}
                 animate={{ y: -x_visual }}
              />
              <motion.div 
                 className="w-2 h-2 rounded-full blur-sm absolute"
                 style={{ backgroundColor: color }}
                 animate={{ y: x_visual }}
              />
           </div>
        </div>

        {/* Басқару панелі */}
        <div className="grid grid-cols-2 gap-8">
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Zap size={20}/> Лазер түсі (Толқын ұзындығы)</h3>
              <input 
                type="range" min="400" max="700" step="10"
                value={wavelength} onChange={(e) => setWavelength(Number(e.target.value))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer mb-2"
                style={{ background: `linear-gradient(to right, #a855f7, #3b82f6, #22c55e, #eab308, #f97316, #ef4444)` }}
              />
              <div className="text-center font-mono font-bold text-xl" style={{ color: color }}>
                 λ = {wavelength} нм
              </div>
           </div>

           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Ruler size={20}/> Экранға дейінгі қашықтық</h3>
              <input 
                type="range" min="0.5" max="2" step="0.1"
                value={distance} onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full h-3 bg-slate-300 rounded-lg appearance-none cursor-pointer mb-2"
              />
              <div className="text-center font-mono font-bold text-xl text-slate-600">
                 L = {distance} м
              </div>
           </div>
        </div>

        {/* Есептеу нәтижесі */}
        <div className="bg-indigo-50 p-4 rounded-xl text-center border border-indigo-100 flex items-center justify-center gap-4">
           <Target className="text-indigo-600"/>
           <div>
              <p className="text-sm text-indigo-800 font-bold">1-ші максимумның орталықтан ауытқуы (x):</p>
              <p className="text-2xl font-bold text-indigo-600">{(x_visual * 2).toFixed(1)} мм (Визуалды масштаб)</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default PhysicsDiffractionExperiment;