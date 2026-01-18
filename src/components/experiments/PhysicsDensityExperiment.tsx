import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, Beaker, CheckCircle2, RefreshCw } from 'lucide-react';

const PhysicsDensityExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [inWater, setInWater] = useState(false);
  const [userDensity, setUserDensity] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const objects = [
    { id: 'gold', name: 'Алтын сақина', mass: 193, volume: 10, color: '#fbbf24', density: 19.3 },
    { id: 'iron', name: 'Темір бұранда', mass: 78, volume: 10, color: '#94a3b8', density: 7.8 },
    { id: 'wood', name: 'Ағаш текше', mass: 7, volume: 10, color: '#d97706', density: 0.7 }, // Жүзеді
  ];

  const handleWeigh = (obj: any) => {
    setSelectedObject(obj);
    setInWater(false);
    setResult(null);
    setUserDensity('');
  };

  const handleDrop = () => {
    if (selectedObject) setInWater(true);
  };

  const checkAnswer = () => {
    if (!selectedObject) return;
    const val = parseFloat(userDensity);
    if (Math.abs(val - selectedObject.density) < 0.5) {
      setResult('correct');
    } else {
      setResult('wrong');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Физика. №3 Зертханалық жұмыс</h2>
          <p className="text-slate-500">Сұйықтар мен қатты денелердің тығыздығын анықтау (ρ = m / V)</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="grid grid-cols-2 gap-10">
        
        {/* Сол жақ: Құралдар */}
        <div className="space-y-8">
           {/* Объектілер */}
           <div className="flex gap-4 justify-center bg-slate-50 p-4 rounded-xl">
              {objects.map(obj => (
                <button 
                  key={obj.id} 
                  onClick={() => handleWeigh(obj)}
                  className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${selectedObject?.id === obj.id ? 'border-indigo-500 bg-indigo-50' : 'border-transparent hover:bg-slate-200'}`}
                >
                   <div className="w-12 h-12 rounded-lg shadow-md mb-2" style={{ backgroundColor: obj.color }}></div>
                   <span className="text-xs font-bold">{obj.name}</span>
                </button>
              ))}
           </div>

           {/* Таразы */}
           <div className="relative h-40 bg-slate-100 rounded-xl flex items-end justify-center pb-4 border border-slate-200">
              <Scale size={100} className="text-slate-400 absolute bottom-4" />
              {selectedObject && !inWater && (
                 <motion.div 
                   initial={{ y: -50, opacity: 0 }} 
                   animate={{ y: 0, opacity: 1 }} 
                   className="z-10 text-center mb-8"
                 >
                    <div className="w-16 h-16 rounded-lg shadow-lg mx-auto mb-2" style={{ backgroundColor: selectedObject.color }}></div>
                    <div className="bg-white px-3 py-1 rounded shadow text-lg font-bold text-slate-800">{selectedObject.mass} г</div>
                 </motion.div>
              )}
           </div>

           {/* Мензурка (Су) */}
           <div className="relative h-64 bg-slate-100 rounded-xl flex items-end justify-center border border-slate-200 overflow-hidden">
              <div className="w-32 h-48 border-x-4 border-b-4 border-blue-300 bg-white relative rounded-b-xl">
                 {/* Су деңгейі */}
                 <motion.div 
                   className="absolute bottom-0 w-full bg-blue-400/50 border-t border-blue-500 transition-all duration-500"
                   style={{ height: inWater ? '80%' : '60%' }} // 60% = 50ml, 80% = 60ml
                 >
                    <div className="absolute top-1 right-2 text-xs font-bold text-blue-800">
                       {inWater ? '60 мл' : '50 мл'}
                    </div>
                 </motion.div>
                 
                 {/* Батырылған зат */}
                 {inWater && selectedObject && (
                    <motion.div 
                      initial={{ y: -100 }} 
                      animate={{ y: selectedObject.id === 'wood' ? -30 : 20 }} // Ағаш қалқиды
                      transition={{ type: 'spring' }}
                      className="absolute bottom-10 left-10 w-12 h-12 rounded-lg shadow-md border border-white/50" 
                      style={{ backgroundColor: selectedObject.color }}
                    />
                 )}
              </div>
              
              {!inWater && selectedObject && (
                 <button onClick={handleDrop} className="absolute top-4 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-blue-600">
                    Суға салу ↓
                 </button>
              )}
           </div>
        </div>

        {/* Оң жақ: Есептеу */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-fit">
           <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Beaker /> Нәтиже</h3>
           
           <div className="space-y-4 text-sm text-slate-600 mb-6">
              <div className="flex justify-between border-b pb-2">
                 <span>Масса (m):</span>
                 <span className="font-bold">{selectedObject ? `${selectedObject.mass} г` : '?'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                 <span>Бастапқы көлем (V1):</span>
                 <span className="font-bold">50 мл</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                 <span>Соңғы көлем (V2):</span>
                 <span className="font-bold">{inWater ? '60 мл' : '?'}</span>
              </div>
              <div className="flex justify-between border-b pb-2 bg-indigo-50 p-2 rounded">
                 <span>Дене көлемі (V = V2 - V1):</span>
                 <span className="font-bold">{inWater ? '10 мл' : '?'}</span>
              </div>
           </div>

           <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">Тығыздықты есептеңіз (ρ = m/V):</label>
              <div className="flex gap-2">
                 <input 
                   type="number" 
                   value={userDensity}
                   onChange={(e) => setUserDensity(e.target.value)}
                   className="w-full p-3 rounded-lg border border-slate-300"
                   placeholder="Мысалы: 2.5"
                 />
                 <span className="self-center font-bold text-slate-500">г/мл</span>
              </div>
           </div>

           {!result ? (
             <button onClick={checkAnswer} disabled={!inWater} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50">
               Тексеру
             </button>
           ) : (
             <div className={`p-4 rounded-xl text-center font-bold ${result === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {result === 'correct' ? (
                   <div className="flex flex-col items-center gap-2">
                      <CheckCircle2 size={32} />
                      Дұрыс! {selectedObject.name} тығыздығы: {selectedObject.density} г/мл
                   </div>
                ) : 'Қате. Формуланы тексеріңіз: m / 10'}
                
                <button onClick={() => { setSelectedObject(null); setInWater(false); setResult(null); setUserDensity(''); }} className="mt-4 text-sm underline flex items-center justify-center gap-1 mx-auto text-slate-600">
                   <RefreshCw size={14}/> Жаңасын таңдау
                </button>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default PhysicsDensityExperiment;