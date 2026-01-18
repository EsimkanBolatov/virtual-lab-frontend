import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, RotateCcw } from 'lucide-react';

const FoodAnalysisExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [step, setStep] = useState(1); // 1: Select, 2: Crush, 3: Filter, 4: Test
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  const foods = [
    { id: 'chips', name: 'Чипсы', contains: ['starch', 'fat'], color: '#fcd34d', icon: '🥔' },
    { id: 'egg', name: 'Жұмыртқа ағы', contains: ['protein'], color: '#ffffff', icon: '🥚' },
    { id: 'apple', name: 'Алма', contains: ['glucose'], color: '#fca5a5', icon: '🍎' },
  ];

  const reagents = [
    { id: 'iodine', name: 'Йод (Крахмалға)', detect: 'starch', resultColor: 'bg-indigo-900' },
    { id: 'biuret', name: 'Биурет (Нәруызға)', detect: 'protein', resultColor: 'bg-purple-600' },
    { id: 'paper', name: 'Қағаз (Майға)', detect: 'fat', resultColor: 'bg-transparent border-4 border-yellow-500 opacity-50' },
  ];

  const handleTest = (reagent: any) => {
    if (selectedFood.contains.includes(reagent.detect)) {
      setTestResult(reagent.resultColor);
    } else {
      setTestResult('bg-yellow-100'); // No change
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto min-h-[600px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">№3 Зертханалық жұмыс</h2>
          <p className="text-slate-500">Азық-түлік құрамындағы органикалық заттарды анықтау</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
         {[1, 2, 3, 4].map(s => (
           <div key={s} className={`h-2 flex-1 rounded-full transition-colors ${step >= s ? 'bg-green-500' : 'bg-slate-200'}`} />
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
         
         {/* Анимация алаңы */}
         <div className="bg-slate-50 rounded-3xl border border-slate-200 h-[400px] flex items-center justify-center relative overflow-hidden">
            
            {/* 1. Таңдау */}
            {step === 1 && (
               <div className="text-center">
                  <div className="text-6xl mb-4 animate-bounce">🍽️</div>
                  <p className="text-slate-500">Зерттеу объектісін оң жақтан таңдаңыз</p>
               </div>
            )}

            {/* 2. Ұсақтау (Келі мен келсап) */}
            {step === 2 && (
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }} 
                 animate={{ scale: 1, opacity: 1 }}
                 className="relative"
               >
                  <div className="w-32 h-24 bg-slate-300 rounded-b-full border-4 border-slate-400 relative overflow-hidden">
                     {/* Тамақ ішінде */}
                     <div className="absolute bottom-2 left-4 right-4 h-10 rounded-full" style={{ backgroundColor: selectedFood.color }}></div>
                  </div>
                  <motion.div 
                    animate={{ y: [0, 20, 0], rotate: [-10, 10, -10] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="w-8 h-32 bg-slate-400 absolute bottom-10 left-12 rounded-full border-2 border-slate-500"
                  />
               </motion.div>
            )}

            {/* 3. Ерітінді дайындау (Колба) */}
            {step === 3 && (
               <motion.div className="flex flex-col items-center">
                  <Filter size={48} className="text-slate-400 mb-2" />
                  <div className="w-24 h-32 border-x-2 border-b-4 border-blue-200 bg-blue-50 rounded-b-xl relative">
                     <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: "70%" }} 
                        className="absolute bottom-0 w-full bg-yellow-100 opacity-50"
                     />
                  </div>
                  <p className="mt-4 font-bold text-slate-600">Ерітінді сүзілуде...</p>
               </motion.div>
            )}

            {/* 4. Тестілеу */}
            {step === 4 && (
               <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-slate-300 bg-white shadow-inner flex items-center justify-center overflow-hidden">
                     {testResult && (
                        <motion.div 
                           initial={{ scale: 0 }} 
                           animate={{ scale: 1 }} 
                           className={`w-full h-full ${testResult}`} 
                        />
                     )}
                  </div>
                  {!testResult && <p className="mt-4 text-center text-slate-500">Реагент тамызыңыз</p>}
               </div>
            )}
         </div>

         {/* Басқару панелі */}
         <div className="space-y-6">
            {step === 1 && (
               <div className="grid grid-cols-1 gap-4">
                  {foods.map(food => (
                     <button key={food.id} onClick={() => { setSelectedFood(food); setStep(2); }} className="p-4 bg-white border-2 border-slate-200 rounded-xl flex items-center gap-4 hover:border-green-500 hover:shadow-lg transition-all">
                        <span className="text-4xl">{food.icon}</span>
                        <div className="text-left">
                           <h3 className="font-bold text-lg">{food.name}</h3>
                           <p className="text-xs text-slate-400">Зерттеуге дайын</p>
                        </div>
                     </button>
                  ))}
               </div>
            )}

            {step === 2 && (
               <div className="text-center">
                  <h3 className="text-xl font-bold mb-4">Үлгіні дайындау</h3>
                  <p className="text-slate-600 mb-6">Тағамды ұсақтап, оған су қосып езу қажет.</p>
                  <button onClick={() => setStep(3)} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">
                     Дайын! Келесі қадам →
                  </button>
               </div>
            )}

            {step === 3 && (
               <div className="text-center">
                  <h3 className="text-xl font-bold mb-4">Ерітінді алу</h3>
                  <p className="text-slate-600 mb-6">Қатты бөлшектерді сүзіп алып, таза ерітінді аламыз.</p>
                  <button onClick={() => setStep(4)} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">
                     Сүзіп алу →
                  </button>
               </div>
            )}

            {step === 4 && (
               <div>
                  <h3 className="text-xl font-bold mb-4 text-center">Сапалық реакция</h3>
                  <div className="space-y-3">
                     {reagents.map(r => (
                        <button key={r.id} onClick={() => handleTest(r)} className="w-full p-3 bg-white border border-slate-300 rounded-lg flex justify-between items-center hover:bg-slate-50">
                           <span className="font-bold text-slate-700">{r.name}</span>
                           <span className="text-xs bg-slate-100 px-2 py-1 rounded">Тексеру</span>
                        </button>
                     ))}
                  </div>
                  <button onClick={() => { setStep(1); setTestResult(null); setSelectedFood(null); }} className="mt-6 w-full text-indigo-600 font-bold flex items-center justify-center gap-2">
                     <RotateCcw size={18}/> Басқа үлгіні тексеру
                  </button>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default FoodAnalysisExperiment;