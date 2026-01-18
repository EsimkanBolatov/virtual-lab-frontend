import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hammer, Droplets, Hand, RefreshCw, Box } from 'lucide-react';

const SubstancePropertiesExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);

  const items = [
    { id: 'iron', name: 'Темір шеге', color: '#64748b', type: 'hard' },
    { id: 'rubber', name: 'Резеңке доп', color: '#ef4444', type: 'elastic' },
    { id: 'sugar', name: 'Қант текшесі', color: '#f8fafc', border: '#e2e8f0', type: 'soluble' },
    { id: 'wood', name: 'Ағаш', color: '#d97706', type: 'solid' },
  ];

  const tools = [
    { id: 'hammer', name: 'Қаттылық (Балға)', icon: <Hammer size={24} /> },
    { id: 'water', name: 'Ерігіштік (Су)', icon: <Droplets size={24} /> },
    { id: 'force', name: 'Серпімділік (Күш)', icon: <Hand size={24} /> },
  ];

  const runExperiment = () => {
    if (!selectedItem || !selectedTool) return;
    setIsAnimating(true);
    setResultText(null);

    // Анимация уақыты
    setTimeout(() => {
      setIsAnimating(false);
      // Нәтиже логикасы
      if (selectedTool === 'hammer') {
        if (selectedItem === 'sugar') setResultText('💥 Қант үгітіліп, сынып қалды (Морт сынғыш).');
        else if (selectedItem === 'iron') setResultText('🛡️ Темір пішінін сақтады (Өте қатты).');
        else if (selectedItem === 'rubber') setResultText('🎾 Резеңке майысып, қайта қалпына келді.');
        else setResultText('🪵 Ағашта із қалды (Қатты).');
      } else if (selectedTool === 'water') {
        if (selectedItem === 'sugar') setResultText('✨ Қант суда толық еріп кетті.');
        else setResultText('💧 Бұл зат суда ерімейді.');
      } else if (selectedTool === 'force') {
        if (selectedItem === 'rubber') setResultText('↔️ Резеңке созылды (Серпімді).');
        else setResultText('🚫 Бұл зат созылмайды (Серпімді емес).');
      }
    }, 2000);
  };

  const reset = () => {
    setSelectedItem(null);
    setSelectedTool(null);
    setResultText(null);
    setIsAnimating(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto min-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">№2 Сарамандық жұмыс</h2>
          <p className="text-slate-500">Заттардың физикалық қасиеттерін зерттеу</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Сол жақ: Басқару */}
        <div className="space-y-8">
          <div>
            <h3 className="font-bold text-slate-700 mb-4 uppercase text-sm tracking-wider">1. Объектіні таңдаңыз</h3>
            <div className="grid grid-cols-2 gap-4">
              {items.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setSelectedItem(item.id); setResultText(null); }}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${selectedItem === item.id ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-slate-100 hover:border-indigo-200'}`}
                >
                  <div className="w-8 h-8 rounded shadow-sm" style={{ backgroundColor: item.color, border: item.border ? `1px solid ${item.border}` : 'none' }}></div>
                  <span className="font-medium text-slate-700">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-700 mb-4 uppercase text-sm tracking-wider">2. Құралды таңдаңыз</h3>
            <div className="flex gap-4">
              {tools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => { setSelectedTool(tool.id); setResultText(null); }}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${selectedTool === tool.id ? 'border-purple-500 bg-purple-50 shadow-md' : 'border-slate-100 hover:border-purple-200'}`}
                >
                  <div className={`p-2 rounded-full ${selectedTool === tool.id ? 'bg-purple-200 text-purple-700' : 'bg-slate-100 text-slate-500'}`}>{tool.icon}</div>
                  <span className="text-xs font-bold text-slate-700">{tool.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={runExperiment}
            disabled={!selectedItem || !selectedTool || isAnimating || !!resultText}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${!selectedItem || !selectedTool ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'}`}
          >
            {isAnimating ? 'Зерттелуде...' : 'Тәжірибе жасау'}
          </button>
        </div>

        {/* Оң жақ: Нәтиже және Анимация */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px]">
           {/* Су контейнері (тек "Су" таңдалса көрінеді) */}
           {selectedTool === 'water' && (
             <div className="absolute bottom-0 w-full h-1/2 bg-blue-300/30 border-t border-blue-300"></div>
           )}

           {/* Зат анимациясы */}
           <AnimatePresence>
             {selectedItem && (
               <motion.div
                 key={selectedItem}
                 initial={{ scale: 0 }}
                 animate={{ 
                   scale: 1,
                   y: selectedTool === 'water' && isAnimating ? 100 : 0, // Суға бату
                   opacity: selectedTool === 'water' && isAnimating && selectedItem === 'sugar' ? 0 : 1, // Еру
                   rotate: selectedTool === 'hammer' && isAnimating ? [0, -5, 5, 0] : 0 // Дірілдеу
                 }}
                 transition={{ duration: 1 }}
                 className="relative z-10 w-32 h-32 rounded-lg shadow-2xl flex items-center justify-center text-white font-bold text-4xl"
                 style={{ backgroundColor: items.find(i => i.id === selectedItem)?.color, border: '4px solid white' }}
               >
                 <Box />
                 
                 {/* Балға эффектісі */}
                 {selectedTool === 'hammer' && isAnimating && (
                   <motion.div 
                     initial={{ rotate: 45, x: 50, y: -50 }}
                     animate={{ rotate: 0, x: 0, y: 0 }}
                     transition={{ repeat: 3, repeatType: "reverse", duration: 0.3 }}
                     className="absolute -top-10 -right-10 text-slate-700"
                   >
                     <Hammer size={64} />
                   </motion.div>
                 )}

                 {/* Күш эффектісі (Қысу/Созу) */}
                 {selectedTool === 'force' && isAnimating && (
                   <motion.div 
                     className="absolute inset-0 bg-black/10 rounded-lg"
                     animate={{ scaleX: [1, 1.2, 0.8, 1], scaleY: [1, 0.8, 1.2, 1] }}
                     transition={{ repeat: Infinity, duration: 0.5 }}
                   />
                 )}
               </motion.div>
             )}
           </AnimatePresence>

           {/* Нәтиже мәтіні */}
           {resultText && (
             <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute bottom-6 left-6 right-6 bg-white p-4 rounded-xl shadow-xl border-l-4 border-green-500 z-20">
               <h4 className="font-bold text-slate-800 mb-1">Зерттеу нәтижесі:</h4>
               <p className="text-slate-600 font-medium">{resultText}</p>
               <button onClick={reset} className="mt-3 text-indigo-600 text-sm font-bold flex items-center gap-1 hover:underline">
                 <RefreshCw size={14}/> Басынан бастау
               </button>
             </motion.div>
           )}

           {!selectedItem && <p className="text-slate-400 font-medium">Зат пен құралды таңдап, "Тәжірибе жасау" түймесін басыңыз</p>}
        </div>

      </div>
    </div>
  );
};

export default SubstancePropertiesExperiment;