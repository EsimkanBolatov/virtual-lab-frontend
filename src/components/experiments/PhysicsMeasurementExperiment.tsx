import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ruler, CheckCircle2, RotateCcw } from 'lucide-react'; // Pencil алынып тасталды

const PhysicsMeasurementExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [measurement, setMeasurement] = useState<number>(0);
  const [showResult, setShowResult] = useState(false);
  
  // Нақты ұзындық (жасырын)
  const actualLength = 12.5; 

  const checkMeasurement = () => {
    setShowResult(true);
  };

  const reset = () => {
    setMeasurement(0);
    setShowResult(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto min-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Физика. №1 Зертханалық жұмыс</h2>
          <p className="text-slate-500">Физикалық шамаларды өлшеу (Ұзындықты анықтау)</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="flex flex-col items-center gap-10">
        
        {/* Өлшенетін объект (Қарындаш) */}
        <div className="relative w-full h-64 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden">
           {/* Қарындаш */}
           <div className="absolute left-10 flex items-center">
              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-r-[20px] border-r-yellow-600 border-b-[10px] border-b-transparent"></div>
              <div className="h-5 bg-yellow-400 border border-yellow-600" style={{ width: `${actualLength * 40}px` }}></div>
              <div className="w-2 h-5 bg-pink-400 rounded-r"></div>
           </div>

           {/* Сызғыш (Drag & Drop) */}
           <motion.div 
             drag="x" 
             dragConstraints={{ left: -50, right: 300 }}
             className="absolute top-40 left-0 cursor-grab active:cursor-grabbing"
           >
              <div className="w-[600px] h-16 bg-white border border-slate-300 shadow-lg flex items-end px-2 select-none">
                 {[...Array(31)].map((_, i) => (
                   <div key={i} className="flex flex-col items-center w-[20px]">
                      <div className={`w-px bg-slate-800 ${i % 5 === 0 ? 'h-8' : 'h-4'}`}></div>
                      {i % 5 === 0 && <span className="text-xs text-slate-600 mt-1">{i / 2}</span>}
                   </div>
                 ))}
                 <span className="ml-2 text-sm font-bold text-slate-400">см</span>
              </div>
              <div className="text-center text-xs text-blue-500 font-bold mt-2">Сызғышты жылжытыңыз</div>
           </motion.div>
        </div>

        {/* Басқару панелі */}
        <div className="bg-slate-100 p-6 rounded-2xl w-full max-w-md text-center">
           <h3 className="font-bold text-slate-700 mb-4 flex items-center justify-center gap-2">
             <Ruler /> Өлшеу нәтижесін енгізіңіз
           </h3>
           
           <div className="flex gap-4 mb-6">
             <input 
               type="number" 
               step="0.1"
               value={measurement}
               onChange={(e) => setMeasurement(Number(e.target.value))}
               className="w-full p-3 rounded-lg border border-slate-300 text-center text-xl font-bold"
               placeholder="0.0"
             />
             <span className="self-center font-bold text-slate-600">см</span>
           </div>

           {!showResult ? (
             <button onClick={checkMeasurement} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">
               Тексеру
             </button>
           ) : (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
               <div className={`p-4 rounded-xl mb-4 ${Math.abs(measurement - 12.5) <= 0.2 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {Math.abs(measurement - 12.5) <= 0.2 ? (
                    <div className="flex items-center justify-center gap-2"><CheckCircle2 /> Дұрыс! Нақты ұзындық: 12.5 см</div>
                  ) : (
                    <div>Қате. Сызғышты дұрыстап қойып көріңіз.</div>
                  )}
               </div>
               <button onClick={reset} className="text-indigo-600 font-bold flex items-center justify-center gap-2 mx-auto">
                 <RotateCcw size={16}/> Қайта өлшеу
               </button>
             </motion.div>
           )}
        </div>

      </div>
    </div>
  );
};

export default PhysicsMeasurementExperiment;