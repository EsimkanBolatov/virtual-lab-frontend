import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const IonRecognitionExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  // 1 = Cu, 2 = Zn
  const [tubes, setTubes] = useState([
    { id: 1, type: 'Cu', reagentCount: 0, precipitate: 'none', dissolved: false },
    { id: 2, type: 'Zn', reagentCount: 0, precipitate: 'none', dissolved: false }
  ]);
  
  const [selectedTubeId, setSelectedTubeId] = useState<number | null>(null);
  const [guessResult, setGuessResult] = useState<'correct' | 'wrong' | null>(null);

  const addReagent = (id: number) => {
    setTubes(prev => prev.map(tube => {
      if (tube.id !== id) return tube;
      
      const newCount = tube.reagentCount + 1;
      let newPrecipitate = tube.precipitate;
      let newDissolved = tube.dissolved;

      // 1-ші тамшы: Тұнба түзіледі
      if (newCount === 1) {
        newPrecipitate = tube.type === 'Cu' ? 'blue' : 'white';
      }
      // 3-ші тамшы (Артық мөлшер): Zn ериді, Cu ерімейді
      if (newCount >= 3) {
        if (tube.type === 'Zn') {
           newDissolved = true;
           newPrecipitate = 'none'; // Тұнба жойылады
        }
      }

      return { ...tube, reagentCount: newCount, precipitate: newPrecipitate, dissolved: newDissolved };
    }));
  };

  const makeGuess = (ion: 'Cu' | 'Zn') => {
    if (!selectedTubeId) return;
    const tube = tubes.find(t => t.id === selectedTubeId);
    if (tube?.type === ion) setGuessResult('correct');
    else setGuessResult('wrong');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">№6 Зертханалық тәжірибе</h2>
          <p className="text-slate-500">Белгісіз иондарды анықтау (Cu²⁺ vs Zn²⁺)</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mb-8 text-yellow-800 text-sm">
         <strong>Кеңес:</strong> NaOH қосқанда екеуінде де тұнба түзіледі. Бірақ NaOH <strong>артық мөлшерде</strong> қосқанда, біреуінің тұнбасы еріп кетеді (Амфотерлік қасиет).
      </div>

      <div className="flex justify-center gap-16 mb-12">
        {tubes.map(tube => (
          <div key={tube.id} className="flex flex-col items-center">
             {/* Сынауық */}
             <div 
               className={`relative w-20 h-56 border-x-4 border-b-4 border-slate-300 rounded-b-3xl overflow-hidden cursor-pointer transition-all ${selectedTubeId === tube.id ? 'ring-4 ring-indigo-300 shadow-xl scale-105' : 'hover:scale-105'}`}
               onClick={() => { setSelectedTubeId(tube.id); setGuessResult(null); }}
             >
                {/* Сұйықтық фон */}
                <div className="absolute bottom-0 w-full h-1/3 bg-blue-50/30"></div>
                
                {/* Тұнба визуализациясы */}
                <motion.div 
                  className="absolute bottom-0 w-full flex items-end justify-center"
                  initial={{ height: 0 }}
                  animate={{ height: tube.precipitate !== 'none' ? '40%' : '0%' }}
                >
                   {tube.precipitate === 'blue' && (
                     <div className="w-full h-full bg-blue-500 opacity-80 blur-sm"></div>
                   )}
                   {tube.precipitate === 'white' && (
                     <div className="w-full h-full bg-white opacity-90 blur-sm"></div>
                   )}
                </motion.div>

                {/* Еріп кету эффектісі */}
                {tube.dissolved && (
                   <motion.div 
                     initial={{ opacity: 0 }} 
                     animate={{ opacity: 1 }} 
                     className="absolute inset-0 flex items-center justify-center text-xs text-slate-500 font-bold"
                   >
                     Еріп кетті
                   </motion.div>
                )}
             </div>
             
             {/* Батырмалар */}
             <div className="mt-4 space-y-2 w-full">
                <button 
                  onClick={() => addReagent(tube.id)}
                  className="w-full py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-200 active:scale-95 transition"
                >
                  + NaOH қосу ({tube.reagentCount})
                </button>
                <div className="text-center font-bold text-slate-700">№{tube.id} Сынауық</div>
             </div>
          </div>
        ))}
      </div>

      {/* Жауап беру панелі */}
      {selectedTubeId && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
           <h3 className="text-lg font-bold text-slate-800 mb-4">№{selectedTubeId} сынауықта қандай ион бар деп ойлайсыз?</h3>
           
           {!guessResult ? (
             <div className="flex justify-center gap-6">
                <button onClick={() => makeGuess('Cu')} className="px-8 py-3 bg-white border-2 border-blue-500 text-blue-600 rounded-xl font-bold hover:bg-blue-50">
                   Cu²⁺ (Мыс)
                </button>
                <button onClick={() => makeGuess('Zn')} className="px-8 py-3 bg-white border-2 border-slate-400 text-slate-600 rounded-xl font-bold hover:bg-slate-50">
                   Zn²⁺ (Мырыш)
                </button>
             </div>
           ) : (
             <div className={`text-xl font-bold flex items-center justify-center gap-2 ${guessResult === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                {guessResult === 'correct' ? <CheckCircle2 size={32}/> : <X size={32}/>}
                {guessResult === 'correct' ? 'Дұрыс! Жарайсыз!' : 'Қате! Тәжірибені мұқият қайталаңыз.'}
             </div>
           )}
        </motion.div>
      )}
    </div>
  );
};

const CheckCircle2 = Check; 

export default IonRecognitionExperiment;