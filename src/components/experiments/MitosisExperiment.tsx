import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ScanEye, Microscope } from 'lucide-react';

const MitosisExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [magnification, setMagnification] = useState(10); // 10x, 40x, 100x
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  
  // Қарапайым SVG жасушалар симуляциясы
  const cells = [
    { id: 1, x: 80, y: 80, phase: 'Интерфаза', color: '#e2e8f0' },
    { id: 2, x: 150, y: 120, phase: 'Профаза', color: '#fca5a5' }, // Хромосомалар жиырылуы
    { id: 3, x: 220, y: 90, phase: 'Метафаза', color: '#fde047' }, // Ортаға тізілу
    { id: 4, x: 100, y: 200, phase: 'Анафаза', color: '#86efac' }, // Екі жаққа тартылу
    { id: 5, x: 200, y: 180, phase: 'Телофаза', color: '#93c5fd' }, // Екі ядро
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">№9 Зертханалық жұмыс</h2>
          <p className="text-slate-500">Пияз тамыр ұшындағы жасушалардан митозды зерттеу</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Микроскоп панелі */}
        <div className="col-span-2 relative">
          <div className="aspect-square bg-slate-900 rounded-full overflow-hidden border-8 border-slate-700 relative shadow-inner">
            <motion.div 
              className="w-full h-full relative bg-pink-50"
              animate={{ scale: magnification / 10 }}
              transition={{ duration: 0.5 }}
            >
              {/* Тор көздер (сетка) симуляциясы */}
              <div className="absolute inset-0 opacity-10" 
                   style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
              />
              
              {/* Жасушалар */}
              {cells.map(cell => (
                <motion.div
                  key={cell.id}
                  whileHover={{ scale: 1.1, border: "2px solid blue" }}
                  onClick={() => setSelectedPhase(cell.phase)}
                  className="absolute w-16 h-16 rounded-full border border-slate-300 flex items-center justify-center cursor-pointer shadow-sm"
                  style={{ left: cell.x, top: cell.y, backgroundColor: cell.color }}
                >
                  <div className="text-[8px] text-slate-600 opacity-50">Cell {cell.id}</div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Окуляр эффектісі */}
            <div className="absolute inset-0 pointer-events-none rounded-full shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>
          </div>
          
          <div className="mt-4 flex justify-center gap-4">
             {[10, 40, 100].map(zoom => (
               <button 
                 key={zoom}
                 onClick={() => setMagnification(zoom)}
                 className={`px-4 py-2 rounded-lg font-bold transition-all ${magnification === zoom ? 'bg-indigo-600 text-white' : 'bg-slate-200 hover:bg-slate-300'}`}
               >
                 {zoom}x
               </button>
             ))}
          </div>
        </div>

        {/* Ақпарат панелі */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ScanEye className="text-indigo-600"/> Бақылау
          </h3>
          <p className="text-sm text-slate-600 mb-6">
            Микроскопты қолданып, жасушаларды ұлғайтыңыз. Фазасын анықтау үшін жасушаны басыңыз.
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200 min-h-[100px] flex flex-col justify-center items-center text-center">
              {selectedPhase ? (
                <>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Анықталған фаза</span>
                  <span className="text-2xl font-bold text-indigo-600 mt-1">{selectedPhase}</span>
                </>
              ) : (
                <span className="text-slate-400">Жасушаны таңдаңыз...</span>
              )}
            </div>
            
            {selectedPhase === 'Метафаза' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-sm text-green-700 bg-green-50 p-3 rounded">
                ✅ Дұрыс! Хромосомалар экваторға тізілген.
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MitosisExperiment;