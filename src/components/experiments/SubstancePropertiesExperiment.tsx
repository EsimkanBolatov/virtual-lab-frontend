import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hammer, Droplets, Hand, RefreshCw } from 'lucide-react';

const SubstancePropertiesExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const items = [
    { id: 'iron', name: 'Темір шеге', color: '#64748b', type: 'metal' },
    { id: 'rubber', name: 'Резеңке доп', color: '#ef4444', type: 'elastic' },
    { id: 'sugar', name: 'Қант текшесі', color: '#ffffff', type: 'soluble' },
    { id: 'wood', name: 'Ағаш кесіндісі', color: '#d97706', type: 'solid' },
  ];

  const tools = [
    { id: 'hammer', name: 'Қаттылық (Балға)', icon: <Hammer /> },
    { id: 'water', name: 'Ерігіштік (Су)', icon: <Droplets /> },
    { id: 'force', name: 'Серпімділік (Күш)', icon: <Hand /> },
  ];

  const handleTest = () => {
    if (!selectedItem || !selectedTool) return;

    if (selectedTool === 'hammer') {
      if (selectedItem === 'iron') setResult('Өте қатты. Пішінін өзгертпеді.');
      else if (selectedItem === 'sugar') setResult('Морт сынғыш. Уатылып қалды.');
      else if (selectedItem === 'wood') setResult('Қатты, бірақ із қалды.');
      else if (selectedItem === 'rubber') setResult('Пішіні өзгеріп, қайта қалпына келді.');
    } else if (selectedTool === 'water') {
      if (selectedItem === 'sugar') setResult('Суда толық еріп кетті.');
      else setResult('Суда ерімейді.');
    } else if (selectedTool === 'force') {
      if (selectedItem === 'rubber') setResult('Серпімді. Созылады және жиырылады.');
      else setResult('Серпімді емес.');
    }
  };

  const reset = () => {
    setSelectedItem(null);
    setSelectedTool(null);
    setResult(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto min-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">№2 Сарамандық жұмыс</h2>
          <p className="text-slate-500">Әртүрлі заттардың қасиеттері (Қаттылық, Еру, Серпімділік)</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Таңдау панелі */}
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-slate-700 mb-3">1. Затты таңдаңыз:</h3>
            <div className="grid grid-cols-2 gap-3">
              {items.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setSelectedItem(item.id); setResult(null); }}
                  className={`p-4 border-2 rounded-xl transition-all font-medium ${selectedItem === item.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-700 mb-3">2. Құралды таңдаңыз:</h3>
            <div className="flex gap-2">
              {tools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => { setSelectedTool(tool.id); setResult(null); }}
                  className={`flex-1 flex flex-col items-center gap-2 p-3 border-2 rounded-xl transition-all ${selectedTool === tool.id ? 'border-purple-500 bg-purple-50' : 'border-slate-200 hover:border-purple-300'}`}
                >
                  <span className="text-2xl">{tool.icon}</span>
                  <span className="text-xs text-center font-bold">{tool.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleTest}
            disabled={!selectedItem || !selectedTool || !!result}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all ${!selectedItem || !selectedTool || !!result ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            Тексеру
          </button>
        </div>

        {/* Нәтиже алаңы */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center relative overflow-hidden">
           
           {!selectedItem ? (
             <p className="text-slate-400">Затты таңдаңыз...</p>
           ) : (
             <div className="relative w-full h-full flex items-center justify-center">
                {/* Заттың анимациясы */}
                <motion.div
                  key={selectedItem}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`w-32 h-32 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-xl`}
                  style={{ backgroundColor: items.find(i => i.id === selectedItem)?.color }}
                >
                   {/* Суда еру анимациясы */}
                   {result && selectedTool === 'water' && selectedItem === 'sugar' && (
                      <motion.div 
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 1.5 }}
                        className="w-full h-full bg-white absolute"
                      />
                   )}
                   {/* Қирау анимациясы */}
                   {result && selectedTool === 'hammer' && selectedItem === 'sugar' && (
                      <motion.div 
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 0.8, 1.2, 0], rotate: [0, 10, -10, 20] }}
                        transition={{ duration: 0.5 }}
                      />
                   )}
                </motion.div>

                {/* Құрал анимациясы */}
                <AnimatePresence>
                   {selectedTool && !result && (
                      <motion.div 
                        initial={{ x: 50, y: -50, opacity: 0 }}
                        animate={{ x: 0, y: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-10 right-10 text-slate-600"
                      >
                         {tools.find(t => t.id === selectedTool)?.icon}
                      </motion.div>
                   )}
                </AnimatePresence>
             </div>
           )}

           {result && (
             <motion.div 
               initial={{ y: 20, opacity: 0 }} 
               animate={{ y: 0, opacity: 1 }} 
               className="absolute bottom-6 inset-x-6 bg-white p-4 rounded-xl shadow-lg text-center border-l-4 border-indigo-500"
             >
                <h4 className="font-bold text-slate-800 mb-1">Нәтиже:</h4>
                <p className="text-slate-600">{result}</p>
                <button onClick={reset} className="mt-2 text-sm text-indigo-600 hover:underline flex items-center justify-center gap-1 w-full">
                   <RefreshCw size={12}/> Қайталау
                </button>
             </motion.div>
           )}
        </div>

      </div>
    </div>
  );
};

export default SubstancePropertiesExperiment;