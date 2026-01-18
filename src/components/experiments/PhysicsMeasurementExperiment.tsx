import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, RotateCcw, ZoomIn, Target, Activity } from 'lucide-react';

const PhysicsMeasurementExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [targetLength, setTargetLength] = useState(12.5);
  const [objectType, setObjectType] = useState<'pencil' | 'nail' | 'wire'>('pencil');
  // rulerX state жойылды, себебі ол рендерлеуде қолданылмады
  const [measurement, setMeasurement] = useState('');
  const [result, setResult] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const randomize = () => {
    const types: any[] = ['pencil', 'nail', 'wire'];
    setObjectType(types[Math.floor(Math.random() * 3)]);
    const randomLen = Math.floor((Math.random() * 10 + 5) * 10) / 10;
    setTargetLength(randomLen);
    setMeasurement('');
    setResult('idle');
  };

  useEffect(() => { randomize(); }, []);

  const checkAnswer = () => {
    const val = parseFloat(measurement);
    if (Math.abs(val - targetLength) <= 0.2) {
      setResult('correct');
    } else {
      setResult('wrong');
    }
  };

  const getObjectStyle = () => {
    switch(objectType) {
        case 'nail': return { color: '#94a3b8', height: '10px', endShape: 'rounded-full' };
        case 'wire': return { color: '#f87171', height: '4px', endShape: 'rounded' };
        default: return { color: '#facc15', height: '20px', endShape: 'rounded-sm' };
    }
  };
  const style = getObjectStyle();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Зертханалық жұмыс №1</h2>
          <p className="text-slate-500">Физикалық шамаларды өлшеу және қателікті анықтау</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8 text-sm text-orange-800 flex items-start gap-3">
         <Target size={20} className="mt-1 flex-shrink-0"/>
         <div>
            <strong>Тапсырма:</strong> Сызғышты жылжытып, заттың ұзындығын өлшеңіз. <br/>
            <span className="text-xs opacity-75">Құрал қателігі: аспап бөлігінің жартысы (0.5 мм). Жауапты см-мен енгізіңіз.</span>
         </div>
      </div>

      <div className="flex flex-col items-center gap-12 select-none">
        
        {/* Өлшеу аймағы */}
        <div className="relative w-full h-80 bg-slate-100 rounded-2xl border border-slate-300 overflow-hidden shadow-inner group">
           
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

           {/* Өлшенетін зат */}
           <div className="absolute top-1/3 left-20 flex items-center drop-shadow-md">
              <div className={`w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] ${objectType === 'nail' ? 'border-r-slate-500' : 'border-r-transparent'} border-b-[10px] border-b-transparent`}></div>
              <div style={{ width: `${targetLength * 37.8}px`, height: style.height, backgroundColor: style.color }} className="shadow-sm"></div>
              {objectType === 'pencil' && <div className="w-0 h-0 border-l-[20px] border-l-[#facc15] border-y-[10px] border-y-transparent"></div>}
           </div>

           {/* Сызғыш (Draggable) */}
           <motion.div 
             drag="x" 
             dragConstraints={{ left: -50, right: 400 }}
             dragMomentum={false}
             className="absolute top-1/2 left-0 cursor-grab active:cursor-grabbing z-20"
           >
              <div className="w-[600px] h-20 bg-yellow-100/90 backdrop-blur-sm border border-yellow-600 shadow-xl flex items-end px-4 rounded-lg relative">
                 <svg width="600" height="50" className="absolute bottom-0 left-0">
                    {[...Array(16)].map((_, cm) => (
                        <g key={cm} transform={`translate(${cm * 37.8 + 10}, 0)`}>
                            <line y1="20" y2="50" stroke="black" strokeWidth="2"/>
                            <text x="2" y="15" fontSize="12" textAnchor="middle" fontWeight="bold">{cm}</text>
                            {[...Array(10)].map((_, mm) => (
                                <line key={mm} x1={mm * 3.78} y1={mm === 5 ? 30 : 40} x2={mm * 3.78} y2="50" stroke="black" strokeWidth="1"/>
                            ))}
                        </g>
                    ))}
                 </svg>
              </div>
           </motion.div>

           {/* Лупа */}
           <div className="absolute top-4 right-4 pointer-events-none bg-white border-4 border-slate-800 rounded-full w-32 h-32 flex items-center justify-center overflow-hidden shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity z-30">
               <div className="absolute text-xs font-bold text-slate-400 top-2"><ZoomIn size={12}/> 2x</div>
               <span className="text-slate-300 text-xs text-center px-2">Сызғышты дәлдеп қойыңыз</span>
           </div>
        </div>

        {/* Басқару */}
        <div className="flex gap-4 items-end bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Өлшем нәтижесі (L):</label>
              <div className="flex items-center gap-2">
                 <input 
                   type="number" 
                   value={measurement}
                   onChange={(e) => setMeasurement(e.target.value)}
                   className="w-32 p-3 rounded-xl border-2 border-indigo-100 focus:border-indigo-500 outline-none text-center font-bold text-xl"
                   placeholder="0.0"
                 />
                 <span className="text-slate-500 font-bold">см</span>
              </div>
           </div>
           
           <button onClick={checkAnswer} className="py-3 px-6 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
              Тексеру
           </button>

           <button onClick={randomize} className="py-3 px-4 text-slate-500 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-xl transition-colors ml-4" title="Жаңа зат">
              <RotateCcw size={20} />
           </button>
        </div>

        {/* Нәтиже */}
        {result !== 'idle' && (
           <motion.div 
             initial={{ opacity: 0, y: 10 }} 
             animate={{ opacity: 1, y: 0 }}
             className={`flex items-center gap-4 px-6 py-4 rounded-xl border-2 ${result === 'correct' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}
           >
              {result === 'correct' ? <CheckCircle2 size={32} /> : <Activity size={32} className="rotate-45"/>}
              <div>
                 <h4 className="font-bold text-lg">{result === 'correct' ? 'Тамаша!' : 'Қате.'}</h4>
                 <p className="text-sm opacity-90">
                    {result === 'correct' 
                      ? `Дәлдік керемет. Нақты ұзындық: ${targetLength} см.` 
                      : `Дұрыс жауап ${targetLength} см болуы керек еді. Қайталап көріңіз.`}
                 </p>
              </div>
           </motion.div>
        )}

      </div>
    </div>
  );
};

export default PhysicsMeasurementExperiment;