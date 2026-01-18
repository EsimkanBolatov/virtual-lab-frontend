import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, Bone, ScanEye } from 'lucide-react';

const BoneStructureExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [view, setView] = useState<'macro' | 'micro'>('macro');

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">№9 Зертханалық жұмыс</h2>
          <p className="text-slate-500">Сүйектің макро және микроскопиялық құрылысы</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Басқару панелі */}
        <div className="space-y-4">
          <button 
            onClick={() => setView('macro')}
            className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${view === 'macro' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <Bone size={32} />
            <div className="text-left">
              <h3 className="font-bold">Макроқұрылым</h3>
              <p className="text-xs opacity-80">Сыртқы көрінісі және кемік</p>
            </div>
          </button>

          <button 
            onClick={() => setView('micro')}
            className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${view === 'micro' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <ScanEye size={32} />
            <div className="text-left">
              <h3 className="font-bold">Микроқұрылым</h3>
              <p className="text-xs opacity-80">Микроскоппен қарау (Остеон)</p>
            </div>
          </button>

          <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 border border-blue-100 mt-4">
            <p className="font-bold mb-2">Анықтама:</p>
            {view === 'macro' 
              ? "Сүйек сыртынан тығыз затпен қапталған, ал ішінде кеуекті зат (кемік) болады. Оның ішінде сүйек кемігі орналасады."
              : "Микроскоппен қарағанда сүйек «Остеондардан» тұрады. Бұл — бір-біріне кигізілген цилиндр тәрізді пластинкалар."}
          </div>
        </div>

        {/* Көрсету аймағы */}
        <div className="col-span-2 bg-slate-50 rounded-2xl border border-slate-200 h-[400px] relative overflow-hidden flex items-center justify-center">
           
           {view === 'macro' ? (
             <motion.div 
               initial={{ opacity: 0, scale: 0.8 }} 
               animate={{ opacity: 1, scale: 1 }}
               className="relative w-full h-full flex items-center justify-center"
             >
                {/* SVG Сүйек макро моделі */}
                <svg viewBox="0 0 400 200" className="w-full h-auto drop-shadow-xl">
                  {/* Сүйек контуры */}
                  <path d="M 20 100 Q 20 60 50 60 Q 70 60 90 90 L 310 90 Q 330 60 350 60 Q 380 60 380 100 Q 380 140 350 140 Q 330 140 310 110 L 90 110 Q 70 140 50 140 Q 20 140 20 100" fill="#fefce8" stroke="#d4d4d4" strokeWidth="4" />
                  {/* Кемік (Спонгиоз) */}
                  <ellipse cx="60" cy="100" rx="20" ry="25" fill="url(#spongyPattern)" opacity="0.6" />
                  <ellipse cx="340" cy="100" rx="20" ry="25" fill="url(#spongyPattern)" opacity="0.6" />
                  
                  {/* Pattern define */}
                  <defs>
                    <pattern id="spongyPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                      <circle cx="5" cy="5" r="2" fill="#ef4444" opacity="0.3"/>
                    </pattern>
                  </defs>

                  {/* Labels */}
                  <g className="text-sm font-sans">
                     <line x1="60" y1="100" x2="60" y2="40" stroke="#64748b" strokeWidth="2" />
                     <text x="60" y="30" textAnchor="middle" fill="#475569" fontWeight="bold">Кемік зат (басы)</text>

                     <line x1="200" y1="100" x2="200" y2="150" stroke="#64748b" strokeWidth="2" />
                     <text x="200" y="170" textAnchor="middle" fill="#475569" fontWeight="bold">Тығыз зат (денесі)</text>
                  </g>
                </svg>

                <motion.div 
                   className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                   whileHover={{ scale: 1.1 }}
                   onClick={() => setView('micro')}
                >
                   <div className="bg-white/80 p-2 rounded-full shadow-lg backdrop-blur-sm border border-indigo-200">
                      <ZoomIn className="text-indigo-600" />
                   </div>
                </motion.div>
             </motion.div>
           ) : (
             <motion.div 
               initial={{ opacity: 0, scale: 1.5 }} 
               animate={{ opacity: 1, scale: 1 }}
               className="relative w-full h-full flex items-center justify-center bg-pink-50"
             >
                {/* SVG Микроскоп көрінісі (Остеон) */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#9f1239 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                
                <svg viewBox="0 0 300 300" className="w-3/4 h-3/4">
                   <circle cx="150" cy="150" r="140" fill="none" stroke="#be123c" strokeWidth="2" opacity="0.2" />
                   
                   {/* Остеон (Гаверс жүйесі) */}
                   {[40, 70, 100, 130].map((r, i) => (
                      <circle key={i} cx="150" cy="150" r={r} fill="none" stroke="#be123c" strokeWidth="2" opacity="0.6" strokeDasharray="5,5" />
                   ))}
                   
                   {/* Орталық канал */}
                   <circle cx="150" cy="150" r="15" fill="#9f1239" />
                   
                   {/* Остеоциттер */}
                   {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                      <g key={i} transform={`rotate(${angle} 150 150)`}>
                         <circle cx="150" cy="80" r="4" fill="#4c0519" />
                         <circle cx="150" cy="110" r="4" fill="#4c0519" />
                      </g>
                   ))}

                   <text x="150" y="155" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Қан тамыры</text>
                </svg>
                
                <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded shadow text-xs font-bold text-pink-900">
                   Ұлғайту: 400x
                </div>
             </motion.div>
           )}
        </div>
      </div>
    </div>
  );
};

export default BoneStructureExperiment;