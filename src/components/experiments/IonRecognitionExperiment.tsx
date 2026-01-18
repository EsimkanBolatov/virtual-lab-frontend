import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Plus, RefreshCw, CheckCircle2 } from 'lucide-react';

type IonType = 'Cu' | 'Zn';

const IonRecognitionExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedTube, setSelectedTube] = useState<IonType | null>(null);
  const [reagentAdded, setReagentAdded] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Сброс
  const resetExperiment = () => {
    setSelectedTube(null);
    setReagentAdded(false);
    setShowResult(false);
  };

  // Реакция нәтижесінің түсі
  const getPrecipitateColor = () => {
    if (!reagentAdded) return 'transparent';
    if (selectedTube === 'Cu') return '#3b82f6'; // Көк (Cu(OH)2)
    if (selectedTube === 'Zn') return '#ffffff'; // Ақ (Zn(OH)2)
    return 'transparent';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto min-h-[500px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">№6 Зертханалық тәжірибе</h2>
          <p className="text-slate-500">Cu²⁺ және Zn²⁺ иондарын тану (Сапалық реакция)</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="flex flex-col items-center">
        
        {/* Сынауықтарды таңдау */}
        {!selectedTube ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center w-full">
            <h3 className="text-xl font-semibold mb-6">Зерттеу үшін ерітіндіні таңдаңыз:</h3>
            <div className="flex justify-center gap-10">
              {['Cu', 'Zn'].map((ion, idx) => (
                <button
                  key={ion}
                  onClick={() => setSelectedTube(ion as IonType)}
                  className="group flex flex-col items-center p-6 bg-slate-50 border-2 border-slate-200 rounded-xl hover:border-indigo-500 transition-all"
                >
                  <div className="relative w-16 h-40 border-x-2 border-b-2 border-slate-300 rounded-b-full mb-4 bg-white overflow-hidden">
                     {/* Бастапқы мөлдір сұйықтық */}
                     <div className="absolute bottom-0 w-full h-1/3 bg-blue-50 opacity-50" />
                  </div>
                  <span className="font-bold text-slate-700">Сынауық №{idx + 1}</span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center w-full">
            
            {/* Тәжірибе аймағы */}
            <div className="relative flex items-end justify-center h-64 w-full mb-8">
              
              {/* Негізгі Сынауық */}
              <div className="relative w-24 h-64 border-x-4 border-b-4 border-slate-300 rounded-b-[3rem] bg-slate-50/50 overflow-hidden shadow-lg backdrop-blur-sm">
                 {/* Сұйықтық */}
                 <motion.div 
                   className="absolute bottom-0 w-full"
                   initial={{ height: "30%", backgroundColor: "#eff6ff" }}
                   animate={{ 
                     height: reagentAdded ? "60%" : "30%",
                     backgroundColor: reagentAdded ? "#eff6ff" : "#eff6ff" 
                   }}
                   transition={{ duration: 1 }}
                 />
                 
                 {/* Тұнба (Precipitate) */}
                 {reagentAdded && (
                   <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 1 }}
                      className="absolute bottom-0 w-full h-1/2 flex items-end justify-center pb-4"
                   >
                      {/* Тұнба бөлшектері */}
                      <div className={`w-full h-full opacity-80 blur-sm flex flex-col-reverse items-center`} style={{ backgroundColor: getPrecipitateColor() }}>
                        <div className="w-full h-4 bg-black/10 blur-md"></div>
                      </div>
                   </motion.div>
                 )}
              </div>

              {/* NaOH қосу анимациясы */}
              {!reagentAdded && (
                 <motion.div 
                   initial={{ opacity: 0, y: -50 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="absolute top-0 right-1/4"
                 >
                    <div className="flex flex-col items-center">
                       <FlaskConical className="rotate-45 text-slate-600 mb-2" size={40} />
                       <span className="font-bold text-slate-700">NaOH</span>
                    </div>
                 </motion.div>
              )}
            </div>

            {/* Басқару */}
            {!reagentAdded ? (
              <button 
                onClick={() => { setReagentAdded(true); setTimeout(() => setShowResult(true), 2500); }}
                className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all"
              >
                <Plus size={24} /> NaOH қосу
              </button>
            ) : (
               <div className="text-center">
                  {showResult && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-200 p-6 rounded-xl shadow-md max-w-md">
                       <div className="flex items-center justify-center text-green-600 mb-2 gap-2">
                          <CheckCircle2 /> <span className="font-bold text-lg">Нәтиже:</span>
                       </div>
                       <p className="text-slate-700 mb-2">
                         Тұнба түсі: <strong>{selectedTube === 'Cu' ? 'Көк (Blue)' : 'Ақ (White)'}</strong>
                       </p>
                       <p className="text-sm text-slate-500 mb-4 font-mono bg-slate-100 p-2 rounded">
                          {selectedTube === 'Cu' 
                            ? 'Cu²⁺ + 2OH⁻ → Cu(OH)₂↓ (Көк тұнба)' 
                            : 'Zn²⁺ + 2OH⁻ → Zn(OH)₂↓ (Ақ тұнба)'}
                       </p>
                       <button onClick={resetExperiment} className="flex items-center justify-center gap-2 w-full py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200">
                          <RefreshCw size={16} /> Қайтадан көру
                       </button>
                    </motion.div>
                  )}
               </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default IonRecognitionExperiment;