import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Snowflake, Droplets, RefreshCw } from 'lucide-react';

const PhysicsCalorimetryExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [waterTemp, setWaterTemp] = useState(60); // Бастапқы су температурасы
  const [iceMass, setIceMass] = useState(0); // Қосылған мұз
  const [isMixing, setIsMixing] = useState(false);
  const [finalTemp, setFinalTemp] = useState<number | null>(null);

  // Константалар: C_water = 4200, Lambda_ice = 330000
  // Жылу балансы теңдеуі: c*m_w*(t_w - t) = lambda*m_i + c*m_i*(t - 0)
  // t = (c*m_w*t_w - lambda*m_i) / (c*m_w + c*m_i)
  const waterMass = 0.2; // 200г су
  const c = 4200;
  const lambda = 330000;

  const addIceCube = () => {
    if (isMixing) return;
    setIceMass(prev => prev + 0.01); // +10г мұз
  };

  const startReaction = () => {
    setIsMixing(true);
    
    // Есептеу
    const numerator = c * waterMass * waterTemp - lambda * iceMass;
    const denominator = c * (waterMass + iceMass);
    let result = numerator / denominator;

    // Егер мұз тым көп болса, бәрі ерімейді, темп 0 болады
    if (result < 0) result = 0;

    // Анимациялық температура түсуі
    let current = waterTemp;
    const interval = setInterval(() => {
      current -= 1;
      if (current <= result) {
        setWaterTemp(result);
        setFinalTemp(result);
        clearInterval(interval);
      } else {
        setWaterTemp(current);
      }
    }, 50);
  };

  const reset = () => {
    setWaterTemp(60);
    setIceMass(0);
    setIsMixing(false);
    setFinalTemp(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Физика. №2 Зертханалық жұмыс (8-сынып)</h2>
          <p className="text-slate-500">Мұздың меншікті балқу жылуын анықтау (Калориметр)</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Калориметр */}
        <div className="relative bg-slate-100 rounded-3xl p-8 flex items-center justify-center border border-slate-200">
           {/* Ыдыс */}
           <div className="w-48 h-64 bg-slate-300 rounded-b-3xl border-4 border-slate-400 relative overflow-hidden shadow-inner">
              <div className="absolute inset-x-0 top-0 h-4 bg-slate-400"></div> {/* Қақпақ */}
              
              {/* Су */}
              <motion.div 
                className="absolute bottom-0 w-full bg-blue-300/80 transition-colors duration-1000"
                style={{ 
                   height: `${50 + (iceMass * 100)}%`, // Мұз қосқан сайын деңгей көтеріледі
                   backgroundColor: finalTemp !== null && finalTemp <= 0 ? '#93c5fd' : '#60a5fa' 
                }} 
              >
                 {/* Мұз кесектері */}
                 {iceMass > 0 && !finalTemp && (
                    <motion.div className="absolute top-4 left-1/2 -translate-x-1/2">
                       <Snowflake className="text-white animate-spin-slow" size={32}/>
                    </motion.div>
                 )}
              </motion.div>

              {/* Термометр */}
              <div className="absolute top-[-20px] right-4 w-4 h-full bg-white/50 border border-slate-500 rounded-full flex flex-col justify-end p-1">
                 <motion.div 
                   className="w-full bg-red-500 rounded-full"
                   animate={{ height: `${Math.max(10, waterTemp)}%` }}
                 />
              </div>
           </div>
        </div>

        {/* Басқару */}
        <div className="space-y-6">
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                 <span className="font-bold text-slate-700 flex items-center gap-2"><Thermometer className="text-red-500"/> Температура:</span>
                 <span className="text-3xl font-bold text-slate-800">{waterTemp.toFixed(1)}°C</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                 <span className="font-bold text-slate-700 flex items-center gap-2"><Droplets className="text-blue-500"/> Су массасы:</span>
                 <span className="text-xl text-slate-600">200 г</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="font-bold text-slate-700 flex items-center gap-2"><Snowflake className="text-cyan-500"/> Мұз массасы:</span>
                 <span className="text-xl text-slate-600">{(iceMass * 1000).toFixed(0)} г</span>
              </div>
           </div>

           {!isMixing ? (
             <div className="flex gap-4">
               <button onClick={addIceCube} className="flex-1 py-4 bg-cyan-100 text-cyan-700 rounded-xl font-bold hover:bg-cyan-200 transition">
                 + Мұз қосу (10г)
               </button>
               <button onClick={startReaction} disabled={iceMass === 0} className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50">
                 Бастау
               </button>
             </div>
           ) : (
             <div className="bg-green-50 p-6 rounded-2xl text-center border border-green-200">
                {finalTemp !== null ? (
                   <>
                     <h3 className="font-bold text-green-800 text-xl mb-2">Тепе-теңдік орнады!</h3>
                     <p className="text-slate-600 mb-4">Соңғы температура: <strong>{finalTemp.toFixed(1)}°C</strong></p>
                     <p className="text-xs text-slate-500 bg-white p-2 rounded border border-green-100">
                        Жылу балансы: Q(су берді) = Q(мұз алды + еріді)
                     </p>
                   </>
                ) : (
                   <p className="font-bold text-slate-500 animate-pulse">Жылу алмасу жүріп жатыр...</p>
                )}
                
                {finalTemp !== null && (
                   <button onClick={reset} className="mt-4 text-indigo-600 font-bold flex items-center justify-center gap-2 mx-auto">
                      <RefreshCw size={16}/> Қайта жасау
                   </button>
                )}
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default PhysicsCalorimetryExperiment;