import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, ZoomIn, ArrowDown, ArrowUp, Activity } from 'lucide-react';

const PhysicsStokesExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [liquidType, setLiquidType] = useState<'water' | 'oil' | 'glycerin'>('oil');
  const [isDropping, setIsDropping] = useState(false);
  const [ballY, setBallY] = useState(0); // 0-100%
  const [time, setTime] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [graphData, setGraphData] = useState<{t: number, v: number}[]>([]);
  
  // Түзетілді: Бастапқы мән 0 берілді
  const requestRef = useRef<number>(0);

  // Физикалық параметрлер
  const liquids = {
    water: { name: 'Су', eta: 0.001, rho: 1000, color: 'bg-blue-200/40', bubbleColor: 'bg-blue-100' },
    oil: { name: 'Май', eta: 0.1, rho: 900, color: 'bg-yellow-200/60', bubbleColor: 'bg-yellow-100' },
    glycerin: { name: 'Глицерин', eta: 1.5, rho: 1260, color: 'bg-slate-200/80', bubbleColor: 'bg-white' },
  };

  const ballRadius = 0.005; // 5mm
  const ballRho = 7800; // Steel
  const g = 9.8;
  const cylinderHeight = 0.5; // 50cm

  // Анимация циклі
  const animate = (prevTime: number) => {
    const now = performance.now();
    const dt = (now - prevTime) / 1000; // seconds

    if (dt > 0) {
      const currentLiquid = liquids[liquidType];
      
      const V_ball = (4/3) * Math.PI * Math.pow(ballRadius, 3);
      const m = ballRho * V_ball;
      
      const F_gravity = m * g;
      const F_buoyancy = currentLiquid.rho * g * V_ball;
      
      // Түзетілді: v_prev алынып тасталды, өйткені төменде prevV қолданылады
      
      setVelocity(prevV => {
        const F_drag = 6 * Math.PI * currentLiquid.eta * ballRadius * prevV;
        const a = (F_gravity - F_buoyancy - F_drag) / m;
        const newV = prevV + a * dt;
        
        setBallY(prevY => {
           const dy = newV * dt; // meters
           const newY = prevY + (dy / cylinderHeight) * 100; // percent
           if (newY >= 100) {
             setIsDropping(false);
             return 100;
           }
           return newY;
        });

        setTime(prevT => {
           const newT = prevT + dt;
           if (prevT * 1000 % 100 < 20) { // Графикті тым жиі жаңартпау үшін
              setGraphData(prevG => [...prevG, { t: newT, v: newV }]);
           }
           return newT;
        });

        return newV;
      });
    }

    if (ballY < 100) {
       requestRef.current = requestAnimationFrame(() => animate(now));
    }
  };

  useEffect(() => {
    if (isDropping) {
      const startTime = performance.now();
      requestRef.current = requestAnimationFrame(() => animate(startTime));
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isDropping]);

  const reset = () => {
    setIsDropping(false);
    setBallY(0);
    setTime(0);
    setVelocity(0);
    setGraphData([]);
  };

  const currentL = liquids[liquidType];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-6xl mx-auto min-h-[650px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Стокс заңы: Тұтқырлықты анықтау</h2>
           <p className="text-slate-500">Күштер теңгерімі және шектік жылдамдық</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:bg-indigo-50 px-4 py-2 rounded-lg">← Артқа</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Сол жақ: Цилиндр және Күштер */}
        <div className="lg:col-span-4 flex justify-center gap-8">
           {/* Цилиндр */}
           <div className="relative w-40 h-[500px]">
              <div className={`absolute inset-0 border-x-4 border-b-4 border-slate-300 rounded-b-3xl overflow-hidden backdrop-blur-sm ${currentL.color}`}>
                 {/* Көпіршіктер анимациясы */}
                 <div className="absolute inset-0 opacity-30">
                    {[...Array(5)].map((_,i) => (
                       <motion.div 
                         key={i}
                         className={`absolute w-2 h-2 rounded-full ${currentL.bubbleColor}`}
                         animate={{ y: [500, 0], opacity: [0, 1, 0] }}
                         transition={{ duration: 2 + i, repeat: Infinity, ease: "linear" }}
                         style={{ left: `${20 + i * 15}%` }}
                       />
                    ))}
                 </div>

                 {/* Шар */}
                 <div 
                   className="absolute left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-900 rounded-full shadow-xl z-20 flex items-center justify-center"
                   style={{ top: `${ballY}%`, transform: 'translate(-50%, -50%)' }}
                 >
                    {/* Векторлар */}
                    {isDropping && (
                       <>
                          <div className="absolute top-full w-0.5 h-12 bg-red-500 origin-top">
                             <ArrowDown size={12} className="absolute -bottom-3 -left-[5px] text-red-500"/>
                             <span className="absolute left-2 top-4 text-[10px] font-bold text-red-600">mg</span>
                          </div>
                          <div className="absolute bottom-full w-0.5 bg-blue-500 origin-bottom" style={{ height: '20px' }}>
                             <ArrowUp size={12} className="absolute -top-3 -left-[5px] text-blue-500"/>
                          </div>
                          <div className="absolute bottom-full w-0.5 bg-green-500 origin-bottom" style={{ height: `${Math.min(60, velocity * 40)}px` }}>
                             <ArrowUp size={12} className="absolute -top-3 -left-[5px] text-green-500"/>
                             <span className="absolute right-2 bottom-4 text-[10px] font-bold text-green-600">Fc</span>
                          </div>
                       </>
                    )}
                 </div>
                 
                 {[...Array(6)].map((_, i) => (
                    <div key={i} className="absolute right-0 w-4 h-px bg-slate-500/50" style={{ top: `${i * 20}%` }}>
                       <span className="absolute right-5 -top-2 text-[10px] text-slate-500">{i * 10}см</span>
                    </div>
                 ))}
              </div>
           </div>

           {/* Микроскоп */}
           <div className="hidden md:flex flex-col items-center justify-center gap-2">
              <div className="w-32 h-32 rounded-full border-4 border-slate-800 overflow-hidden relative shadow-2xl bg-white">
                 <div className={`absolute inset-0 ${currentL.color} opacity-50`}></div>
                 <div className="absolute inset-0 flex flex-col justify-center items-center gap-2">
                    {[...Array(5)].map((_,i) => (
                       <motion.div 
                         key={i}
                         className="w-full h-px bg-slate-600/30"
                         animate={isDropping ? { y: [0, 10] } : {}}
                         transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                       />
                    ))}
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-slate-800 rounded-full z-10"></div>
                 </div>
                 <div className="absolute bottom-2 right-2 text-xs font-bold text-slate-600 bg-white/80 px-1 rounded"><ZoomIn size={10} className="inline"/> 10x</div>
              </div>
              <span className="text-xs font-bold text-slate-500">Ламинарлық ағын</span>
           </div>
        </div>

        {/* Оң жақ: Басқару және График */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           
           <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-2">
                 {Object.entries(liquids).map(([k, v]) => (
                    <button 
                       key={k} 
                       onClick={() => { setLiquidType(k as any); reset(); }}
                       className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${liquidType === k ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                    >
                       {v.name}
                    </button>
                 ))}
              </div>
              <div className="flex gap-2">
                 <button onClick={() => setIsDropping(true)} disabled={isDropping || ballY >= 100} className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg shadow hover:bg-green-600 disabled:opacity-50 flex items-center gap-2">
                    <Play size={18}/> Жіберу
                 </button>
                 <button onClick={reset} className="px-4 py-2 bg-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-300">
                    <RotateCcw size={18}/>
                 </button>
              </div>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-3 rounded-xl border shadow-sm">
                 <span className="text-xs text-slate-400 font-bold uppercase">Уақыт</span>
                 <div className="text-2xl font-mono text-slate-800">{time.toFixed(2)} с</div>
              </div>
              <div className="bg-white p-3 rounded-xl border shadow-sm">
                 <span className="text-xs text-slate-400 font-bold uppercase">Жылдамдық</span>
                 <div className="text-2xl font-mono text-indigo-600">{velocity.toFixed(3)} м/с</div>
              </div>
              <div className="bg-white p-3 rounded-xl border shadow-sm">
                 <span className="text-xs text-slate-400 font-bold uppercase">Тұтқырлық (η)</span>
                 <div className="text-xl font-bold text-slate-700">{currentL.eta} Па·с</div>
              </div>
              <div className="bg-white p-3 rounded-xl border shadow-sm">
                 <span className="text-xs text-slate-400 font-bold uppercase">Тығыздық (ρ)</span>
                 <div className="text-xl font-bold text-slate-700">{currentL.rho} кг/м³</div>
              </div>
           </div>

           <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-inner flex-1 min-h-[250px] relative">
              <h4 className="text-sm font-bold text-slate-500 mb-2 flex items-center gap-2"><Activity size={16}/> Жылдамдық графигі v(t)</h4>
              <svg className="w-full h-full absolute inset-0 pt-10 px-4 pb-4" viewBox="0 0 100 50" preserveAspectRatio="none">
                 <line x1="0" y1="50" x2="100" y2="50" stroke="#cbd5e1" strokeWidth="0.5"/>
                 <line x1="0" y1="0" x2="0" y2="50" stroke="#cbd5e1" strokeWidth="0.5"/>
                 <polyline 
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="1"
                    points={graphData.map((d, i) => `${(i / (graphData.length || 1)) * 100},${50 - (d.v * 20)}`).join(' ')}
                 />
                 <line x1="0" y1={50 - 2.5 * 20} x2="100" y2={50 - 2.5 * 20} strokeDasharray="2" stroke="red" strokeWidth="0.2" opacity={0.5} />
              </svg>
           </div>

        </div>
      </div>
    </div>
  );
};

export default PhysicsStokesExperiment;