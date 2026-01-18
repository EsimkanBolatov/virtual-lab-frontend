import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Beaker, Scale, Droplets, CheckCircle2, ArrowRight } from 'lucide-react';

const SolutionPreparationExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [saltMass, setSaltMass] = useState(0);
  const [waterVolume, setWaterVolume] = useState(0);
  const [mixed, setMixed] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Тапсырма: 200г 5% тұз ерітіндісін дайындау
  // m(тұз) = 10г, m(су) = 190г
  
  const checkCalculation = () => {
    if (Number(saltMass) === 10 && Number(waterVolume) === 190) {
      setStep(2);
    } else {
      alert("Есептеу қате! Қайтадан көріңіз. m(ерітінді) = 200г, w% = 5%");
    }
  };

  const mixSolution = () => {
    setMixed(true);
    setTimeout(() => setShowResult(true), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">№5 Практикалық жұмыс</h2>
          <p className="text-slate-500">Ерітінділер концентрациясын есептеу және дайындау</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      {/* 1-ҚАДАМ: Есептеу */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="font-bold text-lg mb-2">Тапсырма:</h3>
            <p>Массасы <strong>200 г</strong>, концентрациясы <strong>5%</strong> болатын ас тұзының ерітіндісін дайындау үшін қанша тұз және су қажет?</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Тұз массасы (г):</label>
              <input 
                type="number" 
                className="w-full p-3 border rounded-lg" 
                value={saltMass || ''} 
                onChange={(e) => setSaltMass(Number(e.target.value))}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Су көлемі (мл):</label>
              <input 
                type="number" 
                className="w-full p-3 border rounded-lg" 
                value={waterVolume || ''} 
                onChange={(e) => setWaterVolume(Number(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>
          <button 
            onClick={checkCalculation}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700"
          >
            Есептеуді тексеру
          </button>
        </motion.div>
      )}

      {/* 2-ҚАДАМ: Виртуалды тәжірибе */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
          <div className="relative h-64 w-48 mb-8">
            {/* Стакан */}
            <div className="absolute bottom-0 w-full h-48 border-4 border-slate-300 border-t-0 rounded-b-xl overflow-hidden bg-slate-50">
               {/* Су/Ерітінді */}
               <motion.div 
                 initial={{ height: 0 }}
                 animate={{ height: mixed ? "80%" : "0%" }}
                 transition={{ duration: 2 }}
                 className={`w-full absolute bottom-0 ${mixed ? 'bg-blue-200' : 'bg-transparent'}`}
               />
               {/* Тұз */}
               {!mixed && (
                 <motion.div 
                   initial={{ opacity: 0, y: -50 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-gray-200 rounded-full blur-sm"
                 />
               )}
            </div>
            {/* Араластырғыш таяқша */}
            {mixed && !showResult && (
               <motion.div 
                 animate={{ rotate: [0, 15, -15, 0] }}
                 transition={{ repeat: Infinity, duration: 0.5 }}
                 className="absolute top-10 left-1/2 w-2 h-48 bg-slate-400 origin-top"
               />
            )}
          </div>

          {!mixed ? (
            <div className="flex gap-4">
              <button onClick={mixSolution} className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600">
                <Droplets /> Су құю және араластыру
              </button>
            </div>
          ) : (
            showResult && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                  <CheckCircle2 className="text-green-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Ерітінді дайын!</h3>
                <p className="text-slate-600">Сіз 200г 5%-дық тұз ерітіндісін сәтті дайындадыңыз.</p>
                <button onClick={() => setStep(1)} className="mt-4 text-indigo-600 font-medium">Қайта бастау</button>
              </motion.div>
            )
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SolutionPreparationExperiment;