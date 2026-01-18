import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Snowflake, Droplets, RefreshCw, ChevronRight, Activity, RotateCcw } from 'lucide-react';

const PhysicsCalorimetryExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [step, setStep] = useState(1); // 1: Setup, 2: Mixing, 3: Result
  const [waterTemp, setWaterTemp] = useState(60); 
  const [iceCount, setIceCount] = useState(0); 
  const [tempHistory, setTempHistory] = useState<number[]>([60]);
  
  const waterMass = 0.2; // kg
  const iceMassPerCube = 0.01; // kg
  const c = 4200;
  const lambda = 330000;

  // Есептеу логикасы
  const totalIceMass = iceCount * iceMassPerCube;
  const numerator = c * waterMass * waterTemp - lambda * totalIceMass;
  const denominator = c * (waterMass + totalIceMass);
  let equilibriumTemp = numerator / denominator;
  if (equilibriumTemp < 0) equilibriumTemp = 0;

  useEffect(() => {
    let interval: any;
    if (step === 2) {
      interval = setInterval(() => {
        setTempHistory(prev => {
          const current = prev[prev.length - 1];
          if (current - 0.5 <= equilibriumTemp) {
            setStep(3);
            return [...prev, equilibriumTemp];
          }
          return [...prev, current - 0.5];
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [step, equilibriumTemp]);

  const addIce = () => {
    if (iceCount < 10) setIceCount(prev => prev + 1);
  };

  const reset = () => {
    setStep(1);
    setWaterTemp(60);
    setIceCount(0);
    setTempHistory([60]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto min-h-[600px]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Зертханалық жұмыс №2 (Калориметр)</h2>
          <p className="text-slate-500">Жылу алмасу теңдеуі: Мұздың меншікті балқу жылуы</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Сол жақ: Құрал-жабдық */}
        <div className="flex flex-col items-center">
           <div className="relative w-64 h-80">
              {/* Калориметр сырты */}
              <div className="absolute inset-0 bg-slate-200 rounded-3xl border-4 border-slate-300 shadow-xl flex items-end justify-center overflow-hidden">
                 {/* Су */}
                 <motion.div 
                   className="w-full bg-blue-400/80 transition-all duration-500 relative"
                   style={{ height: `${50 + iceCount * 3}%` }}
                 >
                    {/* Мұз текшелері */}
                    {step < 3 && [...Array(iceCount)].map((_, i) => (
                      <motion.div 
                        key={i}
                        initial={{ y: -200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, rotate: Math.random() * 360 }}
                        className="absolute w-8 h-8 bg-white/80 border border-white rounded shadow-sm"
                        style={{ top: `${20 + Math.random() * 20}%`, left: `${10 + Math.random() * 60}%` }}
                      />
                    ))}
                    {/* Көпіршіктер */}
                    {step === 2 && (
                       <div className="absolute inset-0 flex justify-center items-center">
                          <Activity className="text-white/50 animate-pulse w-12 h-12"/>
                       </div>
                    )}
                 </motion.div>
              </div>
              
              {/* Термометр */}
              <div className="absolute -right-8 top-0 h-full flex flex-col items-center">
                 <div className="w-4 h-full bg-white border border-slate-300 rounded-full relative shadow-lg">
                    <motion.div 
                      className="absolute bottom-2 left-1 right-1 bg-red-500 rounded-full" 
                      style={{ height: `${(tempHistory[tempHistory.length-1] / 100) * 90}%` }}
                    />
                 </div>
                 <div className="bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded mt-2">
                    {tempHistory[tempHistory.length-1].toFixed(1)}°C
                 </div>
              </div>
           </div>

           {/* График */}
           <div className="w-full mt-6 bg-slate-50 p-4 rounded-xl border border-slate-200 h-32 flex items-end gap-1">
              {tempHistory.map((t, i) => (
                <div key={i} className="flex-1 bg-red-400 rounded-t-sm" style={{ height: `${(t/60)*100}%` }}></div>
              ))}
           </div>
           <p className="text-xs text-slate-400 mt-2 text-center w-full">Температура графигі T(t)</p>
        </div>

        {/* Оң жақ: Басқару және Нәтиже */}
        <div className="space-y-6">
           {/* Қадам индикаторы */}
           <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3].map(s => (
                <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                   {s}
                </div>
              ))}
              <div className="text-sm font-medium text-slate-600 ml-2">
                 {step === 1 ? 'Дайындық' : step === 2 ? 'Жылу алмасу' : 'Нәтиже'}
              </div>
           </div>

           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex justify-between">
                 <span className="flex items-center gap-2 text-slate-700"><Droplets size={18} className="text-blue-500"/> Су массасы:</span>
                 <span className="font-bold">200 г</span>
              </div>
              <div className="flex justify-between">
                 <span className="flex items-center gap-2 text-slate-700"><Thermometer size={18} className="text-red-500"/> Бастапқы темп:</span>
                 <span className="font-bold">{waterTemp}°C</span>
              </div>
              <div className="flex justify-between">
                 <span className="flex items-center gap-2 text-slate-700"><Snowflake size={18} className="text-cyan-500"/> Мұз кесектері:</span>
                 <span className="font-bold">{iceCount} дана ({iceCount * 10} г)</span>
              </div>
           </div>

           {step === 1 && (
             <div className="space-y-3">
               <p className="text-sm text-slate-600">Мұз текшелерін қосып, тәжірибені бастаңыз. Әр текше 10г.</p>
               <div className="flex gap-3">
                 <button onClick={addIce} disabled={iceCount >= 10} className="flex-1 py-3 bg-cyan-100 text-cyan-800 font-bold rounded-xl hover:bg-cyan-200 transition">
                    + Мұз қосу
                 </button>
                 <button onClick={() => setStep(2)} disabled={iceCount === 0} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2">
                    Бастау <ChevronRight size={18}/>
                 </button>
               </div>
             </div>
           )}

           {step === 2 && (
             <div className="text-center py-8">
                <RefreshCw className="animate-spin text-indigo-500 mx-auto mb-2" size={32}/>
                <p className="font-bold text-indigo-900">Жылу алмасу жүріп жатыр...</p>
             </div>
           )}

           {step === 3 && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-50 p-6 rounded-2xl border border-green-200 text-center">
                <h3 className="text-xl font-bold text-green-800 mb-2">Тепе-теңдік орнады!</h3>
                <p className="text-4xl font-bold text-slate-800 mb-4">{equilibriumTemp.toFixed(1)}°C</p>
                <div className="text-left text-sm text-slate-600 bg-white p-3 rounded-lg border border-green-100">
                   <p className="mb-1"><strong>Талдау:</strong></p>
                   <p>Су берген жылу: Q = cm(t₁ - t₂)</p>
                   <p>Мұз алған жылу: Q = λm + cm(t₂ - 0)</p>
                </div>
                <button onClick={reset} className="mt-4 text-indigo-600 font-bold hover:underline flex items-center justify-center gap-2 mx-auto">
                   <RotateCcw size={16}/> Жаңа тәжірибе
                </button>
             </motion.div>
           )}
        </div>
      </div>
    </div>
  );
};

export default PhysicsCalorimetryExperiment;