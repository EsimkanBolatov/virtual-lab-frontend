import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Snowflake, Waves, CloudFog } from 'lucide-react';

const PhaseChangeExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [temperature, setTemperature] = useState(-20); // -50 to 150

  // Агрегаттық күйді анықтау
  const getState = (temp: number) => {
    if (temp <= 0) return { state: 'Қатты (Мұз)', icon: <Snowflake size={40} className="text-blue-500"/>, color: 'bg-blue-100' };
    if (temp > 0 && temp < 100) return { state: 'Сұйық (Су)', icon: <Waves size={40} className="text-blue-600"/>, color: 'bg-blue-300' };
    return { state: 'Газ (Бу)', icon: <CloudFog size={40} className="text-slate-400"/>, color: 'bg-slate-100' };
  };

  const currentState = getState(temperature);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Жаратылыстану. Фазалық өзгерістер</h2>
          <p className="text-slate-500">Заттардың балқу және қайнау температурасы</p>
        </div>
        <button onClick={onBack} className="text-indigo-600 font-medium hover:underline">← Артқа</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        
        {/* Визуализация (Бөлшектер моделі) */}
        <div className="col-span-2 bg-slate-50 rounded-2xl border border-slate-200 h-80 relative overflow-hidden flex items-center justify-center">
            {/* Стакан */}
            <div className="w-48 h-56 border-x-4 border-b-4 border-slate-400 rounded-b-xl relative bg-white/50 backdrop-blur-sm z-10">
               <motion.div 
                 className={`absolute bottom-0 w-full transition-all duration-500 ${currentState.color}`}
                 style={{ height: temperature >= 100 ? '0%' : (temperature > 0 ? '60%' : '50%') }}
               >
                 {/* Бөлшектер анимациясы */}
                 <div className="absolute inset-0 flex flex-wrap content-end justify-center gap-1 p-2">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-8 h-8 rounded-full bg-blue-500 border border-blue-400 shadow-sm"
                        animate={{ 
                          // Температураға байланысты қозғалыс
                          x: temperature > 100 ? Math.random() * 200 - 100 : (temperature > 0 ? Math.random() * 10 - 5 : 0),
                          y: temperature > 100 ? -200 - Math.random() * 100 : (temperature > 0 ? Math.random() * 10 - 5 : 0),
                          rotate: temperature * 2
                        }}
                        transition={{ 
                          duration: temperature > 100 ? 2 : (temperature > 0 ? 0.5 : 0), 
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      />
                    ))}
                 </div>
               </motion.div>
               
               {/* Бу (Газ) */}
               {temperature >= 100 && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6, y: -50 }} className="absolute -top-20 inset-x-0 flex justify-center">
                    <CloudFog size={100} className="text-slate-300" />
                 </motion.div>
               )}
            </div>
            
            {/* Оттық */}
            <div className="absolute bottom-4">
               <motion.div 
                 animate={{ scale: [1, 1.1, 1], opacity: temperature > 20 ? 1 : 0 }}
                 transition={{ repeat: Infinity, duration: 0.5 }}
                 className="w-32 h-8 bg-orange-500 blur-xl rounded-full"
               />
            </div>
        </div>

        {/* Басқару панелі */}
        <div className="bg-slate-100 p-6 rounded-2xl flex flex-col items-center">
           <div className="mb-6 text-center">
              <Thermometer size={48} className={`mx-auto mb-2 ${temperature > 100 ? 'text-red-500' : (temperature < 0 ? 'text-blue-500' : 'text-orange-500')}`} />
              <span className="text-4xl font-bold text-slate-800">{temperature}°C</span>
              <p className="text-slate-500 font-medium mt-2">{currentState.state}</p>
           </div>

           <input 
             type="range" 
             min="-50" 
             max="150" 
             value={temperature} 
             onChange={(e) => setTemperature(Number(e.target.value))}
             className="w-full h-2 bg-gradient-to-r from-blue-500 via-orange-400 to-red-500 rounded-lg appearance-none cursor-pointer mb-6"
           />
           
           <div className="w-full space-y-2">
             <div className="flex justify-between text-xs text-slate-500 font-bold">
                <span>Мұз (-20°C)</span>
                <span>Су (20°C)</span>
                <span>Бу (120°C)</span>
             </div>
             <div className="flex justify-between">
                <button onClick={() => setTemperature(-20)} className="w-8 h-8 rounded-full bg-blue-200 hover:bg-blue-300"></button>
                <button onClick={() => setTemperature(20)} className="w-8 h-8 rounded-full bg-orange-200 hover:bg-orange-300"></button>
                <button onClick={() => setTemperature(120)} className="w-8 h-8 rounded-full bg-red-200 hover:bg-red-300"></button>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default PhaseChangeExperiment;