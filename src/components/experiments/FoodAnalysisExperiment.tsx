import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // AnimatePresence қосылды
import { Droplets, Search, CheckCircle2, RotateCcw } from 'lucide-react';

const FoodAnalysisExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [selectedReagent, setSelectedReagent] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const foods = [
    { id: 'potato', name: 'Картоп', type: 'starch', icon: '🥔' },
    { id: 'egg', name: 'Жұмыртка ақуызы', type: 'protein', icon: '🥚' },
    { id: 'oil', name: 'Күнбағыс майы', type: 'fat', icon: '🌻' },
  ];

  const reagents = [
    { id: 'iodine', name: 'Йод ерітіндісі', target: 'starch', color: '#3b0764', reactionColor: '#1e1b4b' }, // Көк
    { id: 'biuret', name: 'Биурет реактиві', target: 'protein', color: '#93c5fd', reactionColor: '#7e22ce' }, // Күлгін
    { id: 'paper', name: 'Сүзгі қағазы', target: 'fat', color: '#fff', reactionColor: 'transparent' }, // Май дағы
  ];

  const handleTest = () => {
    // Егер таңдау жоқ болса, функцияны тоқтатамыз
    if (!selectedFood || !selectedReagent) return;

    const foodItem = foods.find(f => f.id === selectedFood);
    const reagentItem = reagents.find(r => r.id === selectedReagent);

    // TypeScript үшін тексеру: егер элементтер табылмаса, шығып кетеміз
    if (!foodItem || !reagentItem) return;

    if (foodItem.type === reagentItem.target) {
      // Енді reagentItem нақты бар екеніне сенімдіміз
      if (reagentItem.id === 'iodine') setResult('Көк түс пайда болды (Крахмал бар)');
      else if (reagentItem.id === 'biuret') setResult('Күлгін түс пайда болды (Нәруыз бар)');
      else setResult('Майлы дақ қалды (Май бар)');
    } else {
      setResult('Өзгеріс жоқ (Бұл зат жоқ)');
    }
  };

  const reset = () => {
    setSelectedFood(null);
    setSelectedReagent(null);
    setResult(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto min-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">№3 Зертханалық жұмыс</h2>
          <p className="text-slate-500">Азық-түлік құрамындағы органикалық заттарды анықтау</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Таңдау панелі */}
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-slate-700 mb-3">1. Үлгіні таңдаңыз:</h3>
            <div className="flex gap-4">
              {foods.map(food => (
                <button
                  key={food.id}
                  onClick={() => { setSelectedFood(food.id); setResult(null); }}
                  className={`flex flex-col items-center p-4 border-2 rounded-xl transition-all ${selectedFood === food.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}
                >
                  <span className="text-4xl mb-2">{food.icon}</span>
                  <span className="text-sm font-medium">{food.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-700 mb-3">2. Реагентті таңдаңыз:</h3>
            <div className="space-y-2">
              {reagents.map(reagent => (
                <button
                  key={reagent.id}
                  onClick={() => { setSelectedReagent(reagent.id); setResult(null); }}
                  className={`w-full text-left p-3 border-2 rounded-lg transition-all flex items-center gap-3 ${selectedReagent === reagent.id ? 'border-purple-500 bg-purple-50' : 'border-slate-200 hover:border-purple-300'}`}
                >
                  <div className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: reagent.color }}></div>
                  {reagent.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleTest}
            disabled={!selectedFood || !selectedReagent || !!result}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${!selectedFood || !selectedReagent || !!result ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            <Search size={20} /> Тексеру
          </button>
        </div>

        {/* Нәтиже алаңы */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[300px] relative">
           {!selectedFood ? (
             <p className="text-slate-400 text-center">Тәжірибені бастау үшін үлгіні таңдаңыз</p>
           ) : (
             <div className="relative">
                {/* Петри табақшасы */}
                <div className="w-48 h-48 rounded-full border-4 border-slate-300 bg-white shadow-inner flex items-center justify-center relative overflow-hidden">
                   <span className="text-6xl z-10">{foods.find(f => f.id === selectedFood)?.icon}</span>
                   
                   {/* Реакция нәтижесі (дақ) */}
                   <AnimatePresence>
                     {result && (
                       <motion.div 
                         initial={{ opacity: 0, scale: 0 }}
                         animate={{ opacity: 0.8, scale: 1 }}
                         className="absolute inset-0 rounded-full mix-blend-multiply"
                         style={{ 
                           backgroundColor: result.includes('Өзгеріс жоқ') ? 'transparent' : 
                                            reagents.find(r => r.id === selectedReagent)?.reactionColor 
                         }}
                       />
                     )}
                   </AnimatePresence>
                </div>
                
                {/* Тамшы анимациясы */}
                <AnimatePresence>
                   {!result && selectedReagent && (
                     <motion.div 
                       initial={{ y: -100, opacity: 0 }}
                       animate={{ y: 0, opacity: 1 }}
                       exit={{ opacity: 0 }}
                       className="absolute top-0 left-1/2 -translate-x-1/2 -mt-10 text-slate-400"
                     >
                        <Droplets size={32} fill={reagents.find(r => r.id === selectedReagent)?.color} />
                     </motion.div>
                   )}
                </AnimatePresence>
             </div>
           )}

           {result && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${result.includes('Өзгеріс жоқ') ? 'bg-slate-200 text-slate-600' : 'bg-green-100 text-green-700'}`}>
                   {result.includes('Өзгеріс жоқ') ? '❌' : <CheckCircle2 size={16} />}
                   {result}
                </div>
                <button onClick={reset} className="block mx-auto mt-4 text-slate-500 hover:text-indigo-600">
                   <RotateCcw className="inline mr-1" size={16}/> Қайталау
                </button>
             </motion.div>
           )}
        </div>

      </div>
    </div>
  );
};

export default FoodAnalysisExperiment;