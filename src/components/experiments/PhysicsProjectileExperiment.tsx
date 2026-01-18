import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, RefreshCw, Video, Sliders } from 'lucide-react';

const PhysicsProjectileExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [height, setHeight] = useState(40);
  const [velocity, setVelocity] = useState(15);
  const [isLaunched, setIsLaunched] = useState(false);
  const [time, setTime] = useState(0);
  const [targetX, setTargetX] = useState(80); 
  
  const [slowMo, setSlowMo] = useState(false);
  const [showVectors, setShowVectors] = useState(true);
  const [cameraFollow, setCameraFollow] = useState(true);
  
  const [hit, setHit] = useState<'idle' | 'hit' | 'miss'>('idle');
  
  // Түзетілді: Бастапқы мән 0 берілді
  const animationRef = useRef<number>(0);

  const g = 9.8;
  const scale = 5; 
  
  const x = velocity * time;
  const y = 0.5 * g * time * time;
  
  const totalTime = Math.sqrt((2 * height) / g);
  const maxDistance = velocity * totalTime;

  const update = (prevTime: number) => {
    const now = performance.now();
    const dt = ((now - prevTime) / 1000) * (slowMo ? 0.2 : 1);

    if (time < totalTime) {
       setTime(t => Math.min(t + dt, totalTime));
       animationRef.current = requestAnimationFrame(() => update(now));
    } else {
       const finalX = velocity * totalTime;
       if (Math.abs(finalX - targetX) < 5) {
         setHit('hit');
       } else {
         setHit('miss');
       }
       setIsLaunched(false);
    }
  };

  const launch = () => {
    setIsLaunched(true);
    setHit('idle');
    setTime(0);
    const start = performance.now();
    animationRef.current = requestAnimationFrame(() => update(start));
  };

  const reset = () => {
    setIsLaunched(false);
    setTime(0);
    setHit('idle');
    cancelAnimationFrame(animationRef.current);
  };

  useEffect(() => {
     setTargetX(Math.floor(Math.random() * 80) + 40);
  }, []);

  const cameraX = cameraFollow ? Math.max(0, (x * scale) - 300) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-6xl mx-auto min-h-[650px] flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Көкжиекке бұрыш жасай лақтырылған дене (№2)</h2>
          <p className="text-slate-500">Траектория, жылдамдық проекциялары және нысана</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:bg-slate-50 px-4 py-2 rounded">← Артқа</button>
      </div>

      <div className="relative w-full h-[400px] bg-sky-200 rounded-3xl overflow-hidden border-4 border-slate-300 shadow-inner mb-6 cursor-crosshair">
         
         <motion.div 
           className="absolute inset-0 h-full"
           animate={{ x: -cameraX }}
           transition={{ type: "tween", ease: "linear", duration: 0 }}
           style={{ width: '2000px' }}
         >
            <div className="absolute top-10 left-20 opacity-50"><Cloud/></div>
            <div className="absolute top-20 left-80 opacity-60"><Cloud/></div>
            <div className="absolute top-5 left-[600px] opacity-40"><Cloud/></div>

            <div className="absolute bottom-0 left-0 w-20 bg-stone-700 border-r-4 border-stone-800" style={{ height: `${height * scale}px` }}>
               <div className="absolute top-0 right-0 p-1 text-xs text-white bg-stone-900">h={height}м</div>
            </div>

            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
               <path 
                 d={`M 80 ${400 - height * scale} Q ${80 + (maxDistance * scale)/2} ${400 - height * scale} ${80 + maxDistance * scale} 400`}
                 fill="none"
                 stroke="white"
                 strokeWidth="2"
                 strokeDasharray="5,5"
                 opacity="0.5"
               />
               {isLaunched && (
                 <path 
                   d={`M 80 ${400 - height * scale} Q ${80 + (x * scale)/2} ${400 - height * scale + (y*scale*0.1)} ${80 + x * scale} ${400 - height * scale + y * scale}`}
                   fill="none"
                   stroke="#ef4444"
                   strokeWidth="3"
                 />
               )}
            </svg>

            <div 
               className="absolute w-6 h-6 bg-red-600 rounded-full shadow-lg z-20"
               style={{ 
                  left: `${80 + x * scale}px`, 
                  bottom: `${height * scale - y * scale}px`,
                  transform: 'translate(-50%, 50%)'
               }}
            >
               {showVectors && (
                  <>
                     <div className="absolute top-1/2 left-1/2 h-0.5 bg-blue-600 origin-left" style={{ width: `${velocity * 2}px` }}>
                        <span className="absolute right-0 -top-4 text-[10px] text-blue-700 font-bold">vx</span>
                     </div>
                     <div className="absolute top-1/2 left-1/2 w-0.5 bg-green-600 origin-top" style={{ height: `${(g * time) * 2}px` }}>
                        <span className="absolute -left-4 bottom-0 text-[10px] text-green-700 font-bold">vy</span>
                     </div>
                  </>
               )}
            </div>

            <div 
              className="absolute bottom-0 flex flex-col items-center"
              style={{ left: `${80 + targetX * scale}px`, transform: 'translateX(-50%)' }}
            >
               <motion.div 
                 animate={{ y: [0, -10, 0] }} 
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="mb-2"
               >
                  <Target className="text-red-600" size={32}/>
               </motion.div>
               <div className="w-16 h-2 bg-red-400 rounded-full"></div>
               <span className="text-xs font-bold text-slate-500">{targetX}м</span>
            </div>

            <div className="absolute bottom-0 w-full h-1 bg-green-600"></div>

            {hit === 'hit' && (
               <motion.div 
                 initial={{ scale: 0, opacity: 1 }} 
                 animate={{ scale: 3, opacity: 0 }} 
                 className="absolute w-20 h-20 bg-yellow-400 rounded-full z-30 mix-blend-screen"
                 style={{ left: `${80 + maxDistance * scale - 40}px`, bottom: '-40px' }}
               />
            )}
         </motion.div>

         <div className="absolute top-4 right-4 bg-black/50 backdrop-blur text-white p-3 rounded-xl text-xs font-mono space-y-1">
            <div>t: {time.toFixed(2)} с</div>
            <div>x: {x.toFixed(1)} м</div>
            <div>y: {y.toFixed(1)} м</div>
            <div className="text-yellow-300">v: {Math.sqrt(velocity**2 + (g*time)**2).toFixed(1)} м/с</div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         
         <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 md:col-span-2 space-y-4">
            <h3 className="font-bold text-slate-700 flex items-center gap-2"><Sliders size={18}/> Параметрлер</h3>
            <div className="grid grid-cols-2 gap-8">
               <div>
                  <label className="flex justify-between text-sm font-bold text-slate-600 mb-2">Биіктік (h): <span className="text-indigo-600">{height} м</span></label>
                  <input type="range" min="10" max="80" value={height} onChange={(e) => {setHeight(+e.target.value); reset();}} className="w-full accent-indigo-600"/>
               </div>
               <div>
                  <label className="flex justify-between text-sm font-bold text-slate-600 mb-2">Жылдамдық (v0): <span className="text-red-600">{velocity} м/с</span></label>
                  <input type="range" min="5" max="40" value={velocity} onChange={(e) => {setVelocity(+e.target.value); reset();}} className="w-full accent-red-600"/>
               </div>
            </div>
            <div className="flex gap-4 mt-2">
               <button onClick={() => setSlowMo(!slowMo)} className={`px-3 py-1 rounded text-xs font-bold border ${slowMo ? 'bg-yellow-100 border-yellow-400 text-yellow-800' : 'bg-white text-slate-500'}`}>🐢 Slow Mo</button>
               <button onClick={() => setShowVectors(!showVectors)} className={`px-3 py-1 rounded text-xs font-bold border ${showVectors ? 'bg-blue-100 border-blue-400 text-blue-800' : 'bg-white text-slate-500'}`}>↗ Векторлар</button>
               <button onClick={() => setCameraFollow(!cameraFollow)} className={`px-3 py-1 rounded text-xs font-bold border ${cameraFollow ? 'bg-green-100 border-green-400 text-green-800' : 'bg-white text-slate-500'}`}><Video size={12} className="inline"/> Камера</button>
            </div>
         </div>

         <div className="flex flex-col gap-3">
            {!isLaunched ? (
               <button onClick={launch} className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-orange-200 hover:scale-[1.02] transition flex items-center justify-center gap-2">
                  <Rocket size={24}/> АТУ
               </button>
            ) : (
               <button onClick={reset} className="flex-1 bg-slate-200 text-slate-700 font-bold text-xl rounded-2xl hover:bg-slate-300 transition flex items-center justify-center gap-2">
                  <RefreshCw size={24}/> Қайтару
               </button>
            )}
            
            {hit !== 'idle' && (
               <div className={`p-4 rounded-xl text-center font-bold border-2 ${hit === 'hit' ? 'bg-green-100 border-green-400 text-green-800' : 'bg-red-100 border-red-400 text-red-800'}`}>
                  {hit === 'hit' ? '🎯 НЫСАНАҒА ТИДІ!' : '❌ ҚИЫС КЕТТІ'}
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

const Cloud = () => (
  <svg width="60" height="40" viewBox="0 0 100 60" fill="white">
    <path d="M10 40 Q20 10 40 30 T 70 30 T 90 40 Z" />
    <circle cx="30" cy="40" r="15" />
    <circle cx="50" cy="30" r="20" />
    <circle cx="70" cy="40" r="15" />
  </svg>
);

export default PhysicsProjectileExperiment;