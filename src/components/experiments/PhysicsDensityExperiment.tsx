import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const PhysicsDensityExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [mode, setMode] = useState<'learn' | 'mystery'>('learn');
  const [selectedObj, setSelectedObj] = useState<any>(null);
  const [step, setStep] = useState(0); // 0: Select, 1: Weigh Air, 2: Weigh Water
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const materials = [
    { id: 'gold', name: 'Алтын', density: 19.3, color: '#fbbf24', mass: 193 },
    { id: 'iron', name: 'Темір', density: 7.8, color: '#94a3b8', mass: 78 },
    { id: 'alum', name: 'Алюминий', density: 2.7, color: '#cbd5e1', mass: 27 },
  ];

  const mysteryObj = { id: 'mystery', name: '?', density: 8.9, color: '#b45309', mass: 89, realName: 'Мыс (Copper)' };

  const handleSelect = (obj: any) => {
    setSelectedObj(obj);
    setStep(1);
    setFeedback(null);
    setUserGuess('');
  };

  const getWeightInWater = () => {
    if (!selectedObj) return 0;
    // Архимед күші: Fa = p_su * g * V. V = m / p_zat.
    // P_su = P_au - Fa.  (g=10 деп алайық қарапайымдылық үшін)
    const volume = selectedObj.mass / selectedObj.density;
    const buoyantForce = 1 * volume; // p_su = 1 g/cm3
    return (selectedObj.mass - buoyantForce).toFixed(1);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-5xl mx-auto min-h-[650px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Зертханалық жұмыс №3</h2>
          <p className="text-slate-500">Заттың тығыздығын анықтау: ρ = m / V</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setMode('learn')} className={`px-4 py-2 rounded-lg font-bold text-sm ${mode === 'learn' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>Оқу режимі</button>
           <button onClick={() => {setMode('mystery'); handleSelect(mysteryObj);}} className={`px-4 py-2 rounded-lg font-bold text-sm ${mode === 'mystery' ? 'bg-purple-100 text-purple-700' : 'text-slate-500 hover:bg-slate-50'}`}>Құпия зат</button>
           <button onClick={onBack} className="text-slate-400 hover:text-slate-600 ml-4">← Шығу</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
        
        {/* Анимация аймағы */}
        <div className="bg-slate-100 rounded-3xl p-8 relative flex flex-col items-center justify-end border border-slate-200 overflow-hidden h-[450px]">
           
           {/* Динамометр */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
              <div className="w-2 h-20 bg-slate-400"></div>
              <div className="w-16 h-32 bg-white border-2 border-slate-400 rounded-lg flex flex-col items-center justify-center shadow-lg relative">
                 <div className="text-xs text-slate-500 uppercase font-bold mb-1">Грамм</div>
                 <div className="text-2xl font-mono font-bold text-slate-800">
                    {step === 0 ? '0' : step === 1 ? selectedObj.mass : getWeightInWater()}
                 </div>
                 {/* Серіппе */}
                 <div className="absolute -bottom-16 w-1 h-16 bg-slate-400 transition-all duration-500 origin-top"
                      style={{ transform: `scaleY(${step > 0 ? 1.5 : 1})` }}></div>
              </div>
           </div>

           {/* Ілмек және зат */}
           {selectedObj && step > 0 && (
             <motion.div 
               className="absolute z-10 flex flex-col items-center"
               initial={{ top: '150px' }}
               animate={{ top: step === 2 ? '300px' : '220px' }}
               transition={{ type: "spring", stiffness: 60 }}
             >
                <div className="w-12 h-12 rounded-lg shadow-md border border-black/10 flex items-center justify-center text-[10px] font-bold text-white/50" 
                     style={{ backgroundColor: selectedObj.color }}>
                   {selectedObj.id === 'mystery' ? '?' : selectedObj.name}
                </div>
             </motion.div>
           )}

           {/* Мензурка (Су) */}
           <div className="w-40 h-48 border-x-4 border-b-4 border-blue-200 bg-white/50 backdrop-blur-sm rounded-b-xl relative overflow-hidden z-10">
              <motion.div 
                 className="absolute bottom-0 w-full bg-blue-400/30 border-t border-blue-400 transition-all duration-700"
                 style={{ height: step === 2 ? '80%' : '60%' }}
              >
                 <div className="absolute right-1 top-1 text-[10px] font-bold text-blue-800">
                    {step === 2 ? `${(50 + selectedObj.mass/selectedObj.density).toFixed(1)} мл` : '50 мл'}
                 </div>
              </motion.div>
              {/* Судың ішіндегі заттың көрінісі */}
           </div>
        </div>

        {/* Басқару және Есептеу */}
        <div className="space-y-6">
           {mode === 'learn' && step === 0 && (
             <div className="grid grid-cols-3 gap-4">
                {materials.map(m => (
                  <button key={m.id} onClick={() => handleSelect(m)} className="p-4 bg-slate-50 border hover:border-indigo-500 rounded-xl transition text-center group">
                     <div className="w-10 h-10 rounded mx-auto mb-2 shadow-sm group-hover:scale-110 transition" style={{ backgroundColor: m.color }}></div>
                     <span className="font-bold text-slate-700 text-sm">{m.name}</span>
                  </button>
                ))}
             </div>
           )}

           {step > 0 && (
             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                   <span className="text-slate-600">Ауадағы салмағы (m):</span>
                   <span className="font-bold text-lg">{selectedObj.mass} г</span>
                </div>
                
                {step === 2 && (
                  <>
                    <div className="flex justify-between items-center pb-2 border-b">
                       <span className="text-slate-600">Судағы салмағы (P'):</span>
                       <span className="font-bold text-lg">{getWeightInWater()} г</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b bg-blue-50 p-2 rounded">
                       <span className="text-blue-800 font-bold text-sm">Көлем (V = V2 - V1):</span>
                       <span className="font-bold text-lg text-blue-900">{(selectedObj.mass / selectedObj.density).toFixed(1)} мл</span>
                    </div>
                  </>
                )}

                <div className="flex gap-2 pt-4">
                   {step === 1 ? (
                     <button onClick={() => setStep(2)} className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl flex justify-center items-center gap-2">
                        <ArrowDown size={18}/> Суға батыру
                     </button>
                   ) : (
                     <div className="w-full space-y-4">
                        {mode === 'mystery' ? (
                          <div className="space-y-2">
                             <p className="text-sm font-bold text-purple-900">Бұл қандай зат? (Тығыздықты есептеңіз)</p>
                             <div className="flex gap-2">
                                <input 
                                  value={userGuess} 
                                  onChange={e => setUserGuess(e.target.value)}
                                  placeholder="ρ = m/V"
                                  className="flex-1 p-2 border rounded-lg text-center"
                                />
                                <button onClick={() => {
                                   if(Math.abs(Number(userGuess) - 8.9) < 0.5) setFeedback('correct');
                                   else setFeedback('wrong');
                                }} className="bg-purple-600 text-white px-4 rounded-lg font-bold">Тексеру</button>
                             </div>
                             {feedback && (
                                <p className={`text-sm font-bold ${feedback==='correct' ? 'text-green-600' : 'text-red-500'}`}>
                                   {feedback === 'correct' ? `Дұрыс! Бұл - ${mysteryObj.realName} (8.9 г/см³)` : 'Қате. Қайта есептеңіз (89 / 10).'}
                                </p>
                             )}
                          </div>
                        ) : (
                          <div className="text-center p-4 bg-green-100 rounded-xl text-green-800">
                             <p className="text-sm uppercase font-bold opacity-70">Есептелген тығыздық:</p>
                             <p className="text-3xl font-bold">{selectedObj.density} <span className="text-lg">г/см³</span></p>
                          </div>
                        )}
                        <button onClick={() => {setStep(0); setMode('learn'); setSelectedObj(null);}} className="w-full py-2 text-slate-400 hover:text-slate-600 font-bold">Басқа зат таңдау</button>
                     </div>
                   )}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default PhysicsDensityExperiment;