import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Info } from 'lucide-react';

const MitosisExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const phases = [
    { name: 'Интерфаза', desc: 'ДНҚ екі еселенеді, жасуша өседі.', chromosomes: 1 },
    { name: 'Профаза', desc: 'Хромосомалар ширатылып, ядро қабығы жойылады.', chromosomes: 1, condense: true },
    { name: 'Метафаза', desc: 'Хромосомалар жасушаның ортасына (экваторға) тізіледі.', chromosomes: 1, align: true },
    { name: 'Анафаза', desc: 'Хроматидтер екі полюске ажырайды.', chromosomes: 2, split: true },
    { name: 'Телофаза', desc: 'Екі жаңа ядро түзіледі, цитоплазма бөлінеді.', chromosomes: 2, divide: true },
  ];

  // Автоматты ойнату
  React.useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setPhaseIndex((prev) => {
          if (prev >= phases.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentPhase = phases[phaseIndex];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">№9 Зертханалық жұмыс</h2>
          <p className="text-slate-500">Митоз процесінің интерактивті анимациясы</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Визуализация (Жасуша) */}
        <div className="col-span-2 bg-slate-900 rounded-3xl aspect-video relative overflow-hidden flex items-center justify-center border-4 border-slate-700 shadow-inner">
           {/* Микроскоп торы */}
           <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

           {/* Жасуша мембранасы */}
           <motion.div 
             className="relative bg-pink-100/10 border-4 border-pink-300 rounded-full flex items-center justify-center backdrop-blur-sm"
             animate={{ 
               width: currentPhase.divide ? 500 : 300, 
               height: 300,
               borderRadius: currentPhase.divide ? "100px" : "50%" 
             }}
             transition={{ duration: 1 }}
           >
              {/* Хромосомалар */}
              <div className="absolute inset-0 flex items-center justify-center">
                 {/* Сол жақ хромосомалар */}
                 <motion.div 
                   className="absolute flex flex-col gap-2"
                   animate={{ 
                     x: currentPhase.split ? -100 : (currentPhase.align ? 0 : -20),
                     rotate: currentPhase.condense ? 0 : 45,
                     opacity: currentPhase.divide ? 0.5 : 1
                   }}
                   transition={{ duration: 1.5, type: "spring" }}
                 >
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-4 h-12 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                    ))}
                 </motion.div>

                 {/* Оң жақ хромосомалар (Анафазада пайда болады) */}
                 {(currentPhase.split || currentPhase.align || currentPhase.condense) && (
                   <motion.div 
                     className="absolute flex flex-col gap-2"
                     animate={{ 
                       x: currentPhase.split ? 100 : (currentPhase.align ? 0 : 20),
                       rotate: currentPhase.condense ? 0 : -45,
                       opacity: currentPhase.divide ? 0.5 : 1
                     }}
                     transition={{ duration: 1.5, type: "spring" }}
                   >
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-4 h-12 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
                      ))}
                   </motion.div>
                 )}
              </div>

              {/* Бөліну сызығы (Телофаза) */}
              {currentPhase.divide && (
                <motion.div 
                  initial={{ height: 0 }} 
                  animate={{ height: "100%" }} 
                  className="w-2 bg-slate-700/50 absolute"
                />
              )}
           </motion.div>

           {/* Фаза атауы (overlay) */}
           <div className="absolute top-6 left-6 bg-black/60 px-4 py-2 rounded-lg text-white font-mono border-l-4 border-indigo-500">
              {currentPhase.name}
           </div>
        </div>

        {/* Басқару панелі */}
        <div className="flex flex-col justify-between h-full space-y-6">
           <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex-1">
              <div className="flex items-start gap-3 mb-4">
                 <Info className="text-indigo-600 mt-1" />
                 <div>
                    <h3 className="font-bold text-indigo-900 text-lg">{currentPhase.name}</h3>
                    <p className="text-indigo-700 leading-relaxed mt-2">{currentPhase.desc}</p>
                 </div>
              </div>
              <div className="mt-6 flex gap-2 flex-wrap">
                 <span className="bg-white px-3 py-1 rounded text-xs font-bold text-slate-500 border">ДНҚ</span>
                 <span className="bg-white px-3 py-1 rounded text-xs font-bold text-slate-500 border">Ядро</span>
                 <span className="bg-white px-3 py-1 rounded text-xs font-bold text-slate-500 border">Центриоль</span>
              </div>
           </div>

           <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-4 text-slate-600 font-medium">
                 <span>Уақыт шкаласы</span>
                 <span>{phaseIndex + 1} / {phases.length}</span>
              </div>
              
              {/* Прогресс бар */}
              <div className="w-full bg-slate-300 h-2 rounded-full mb-6 overflow-hidden">
                 <motion.div 
                   className="h-full bg-indigo-600"
                   animate={{ width: `${((phaseIndex + 1) / phases.length) * 100}%` }}
                 />
              </div>

              <div className="flex justify-center gap-4">
                 <button onClick={() => { setIsPlaying(false); setPhaseIndex(Math.max(0, phaseIndex - 1)); }} className="p-3 bg-white rounded-full shadow hover:bg-slate-50 text-slate-700"><SkipBack size={24}/></button>
                 <button onClick={() => setIsPlaying(!isPlaying)} className={`p-4 rounded-full shadow-lg text-white transition-all hover:scale-105 ${isPlaying ? 'bg-red-500' : 'bg-indigo-600'}`}>
                    {isPlaying ? <Pause size={28} fill="white"/> : <Play size={28} fill="white" className="ml-1"/>}
                 </button>
                 <button onClick={() => { setIsPlaying(false); setPhaseIndex(Math.min(phases.length - 1, phaseIndex + 1)); }} className="p-3 bg-white rounded-full shadow hover:bg-slate-50 text-slate-700"><SkipForward size={24}/></button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default MitosisExperiment;