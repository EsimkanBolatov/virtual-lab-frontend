import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RefreshCw, FlaskConical, Droplets, CheckCircle2 } from 'lucide-react';

// Проптардың интерфейсін қосамыз
interface HClExperimentProps {
  onBack: () => void;
}

// Типы для состояния эксперимента
type Step = 'selection' | 'indicator' | 'titration' | 'result';
type Indicator = 'litmus' | 'phenolphthalein' | null;

// Компонентке { onBack } қабылдайтын мүмкіндік береміз
const HClExperiment: React.FC<HClExperimentProps> = ({ onBack }) => {
  const [step, setStep] = useState<Step>('selection');
  const [indicator, setIndicator] = useState<Indicator>(null);
  const [addedBaseVolume, setAddedBaseVolume] = useState(0); // 0 to 100
  const [isReactionComplete, setIsReactionComplete] = useState(false);
  const [liquidColor, setLiquidColor] = useState<string>('#e5e7eb'); // Default gray (water)

  // Константы для логики реакции
  const NEUTRALIZATION_POINT = 50; // Условный объем для нейтрализации

  // Сброс эксперимента
  const resetExperiment = () => {
    setStep('selection');
    setIndicator(null);
    setAddedBaseVolume(0);
    setIsReactionComplete(false);
    setLiquidColor('#e5e7eb');
  };

  // Логика изменения цвета
  useEffect(() => {
    if (step === 'selection') return;

    // 1. Исходный цвет кислоты (до титрования)
    if (addedBaseVolume === 0) {
      if (indicator === 'litmus') setLiquidColor('#ef4444'); // Красный (кислота)
      else if (indicator === 'phenolphthalein') setLiquidColor('#ffffff'); // Бесцветный
      else setLiquidColor('#e5e7eb'); // Прозрачный без индикатора
      return;
    }

    // 2. В процессе титрования
    if (addedBaseVolume < NEUTRALIZATION_POINT) {
      // Все еще кислая среда
      if (indicator === 'litmus') setLiquidColor('#ef4444');
      else if (indicator === 'phenolphthalein') setLiquidColor('#ffffff');
    } else {
      // 3. Точка эквивалентности и щелочная среда
      setIsReactionComplete(true);
      if (indicator === 'litmus') setLiquidColor('#3b82f6'); // Синий
      else if (indicator === 'phenolphthalein') setLiquidColor('#db2777'); // Малиновый
    }
  }, [addedBaseVolume, indicator, step]);

  // Функция добавления капли
  const addDrop = () => {
    if (addedBaseVolume >= 100) return;
    setAddedBaseVolume((prev) => Math.min(prev + 5, 100));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
      
      {/* HEADER: Заголовок и кнопка назад */}
      <div className="absolute top-4 left-6 z-10">
        <h2 className="text-xl font-bold text-slate-800">Лаб. №8: Нейтрализация кислоты</h2>
        <p className="text-sm text-slate-500">7 сынып • Химия</p>
      </div>
      
      {/* Кнопка АРТҚА (жоғарғы оң жақта) */}
      <button 
        onClick={onBack}
        className="absolute top-4 right-6 z-10 text-slate-400 hover:text-indigo-600 transition-colors font-bold text-sm flex items-center gap-1 bg-white/50 px-3 py-1 rounded-full border border-slate-200 hover:border-indigo-300"
      >
        ← Артқа
      </button>

      {/* Индикатор прогресса */}
      <div className="flex gap-2 mb-8 mt-12 relative z-0">
        {['Реагенттер', 'Индикатор', 'Тәжірибе', 'Нәтиже'].map((_, idx) => {
          const steps: Step[] = ['selection', 'indicator', 'titration', 'result'];
          const isActive = steps.indexOf(step) >= idx;
          return (
            <div key={idx} className={`h-2 w-16 rounded-full transition-colors ${isActive ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          );
        })}
      </div>

      {/* Основная сцена */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 min-h-[400px] flex items-center justify-center relative z-0">
        <AnimatePresence mode='wait'>
          
          {/* ШАГ 1: ВЫБОР РЕАГЕНТОВ */}
          {step === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center w-full"
            >
              <h3 className="text-2xl font-semibold mb-6">Реакцияға қажетті заттарды таңдаңыз</h3>
              <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
                <div 
                  className="p-6 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50 flex flex-col items-center cursor-pointer hover:border-indigo-500 transition-colors"
                >
                  <FlaskConical size={48} className="text-indigo-600 mb-2" />
                  <span className="font-bold text-lg">HCl</span>
                  <span className="text-sm text-slate-500">Тұз қышқылы</span>
                </div>
                <div 
                  className="p-6 border-2 border-dashed border-rose-200 rounded-xl bg-rose-50 flex flex-col items-center cursor-pointer hover:border-rose-500 transition-colors"
                >
                  <FlaskConical size={48} className="text-rose-600 mb-2" />
                  <span className="font-bold text-lg">NaOH</span>
                  <span className="text-sm text-slate-500">Натрий гидроксиді</span>
                </div>
              </div>
              <button
                onClick={() => setStep('indicator')}
                className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 mx-auto"
              >
                Келесі қадам <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {/* ШАГ 2: ВЫБОР ИНДИКАТОРА */}
          {step === 'indicator' && (
            <motion.div
              key="indicator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center w-full"
            >
              <h3 className="text-2xl font-semibold mb-6">Индикаторды таңдаңыз</h3>
              <div className="flex justify-center gap-6">
                <button
                  onClick={() => { setIndicator('litmus'); setStep('titration'); }}
                  className="group relative p-6 bg-white border-2 border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all w-48"
                >
                  <div className="h-16 w-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <div className="w-8 h-8 bg-red-500 rounded-full shadow-sm" />
                  </div>
                  <h4 className="font-bold text-slate-800">Лакмус</h4>
                  <p className="text-xs text-slate-500 mt-1">Қышқылда қызыл түске енеді</p>
                </button>

                <button
                  onClick={() => { setIndicator('phenolphthalein'); setStep('titration'); }}
                  className="group relative p-6 bg-white border-2 border-slate-200 rounded-xl hover:border-pink-500 hover:shadow-md transition-all w-48"
                >
                  <div className="h-16 w-16 bg-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                    <div className="w-8 h-8 bg-pink-500 rounded-full shadow-sm opacity-20 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="font-bold text-slate-800">Фенолфталеин</h4>
                  <p className="text-xs text-slate-500 mt-1">Сілтіде таңқурай түсіне енеді</p>
                </button>
              </div>
            </motion.div>
          )}

          {/* ШАГ 3 и 4: ТИТРОВАНИЕ (ОПЫТ) */}
          {(step === 'titration' || step === 'result') && (
            <motion.div
              key="titration"
              className="flex flex-col items-center w-full relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Бюретка (Верхняя часть) */}
              <div className="relative mb-0 z-10 flex flex-col items-center">
                <div className="w-4 h-32 bg-slate-200 border-x border-slate-300 relative rounded-t-sm">
                   {/* Жидкость в бюретке */}
                   <motion.div 
                     className="absolute bottom-0 left-0 right-0 bg-slate-400 opacity-50"
                     animate={{ height: `${100 - addedBaseVolume}%` }}
                   />
                </div>
                <div className="w-6 h-4 bg-slate-300 rounded-sm flex items-center justify-center relative">
                   {/* Краник */}
                   <div className="w-8 h-1 bg-slate-600 absolute rotate-90" />
                </div>
                
                {/* Анимация падающей капли */}
                <AnimatePresence>
                  {addedBaseVolume > 0 && !isReactionComplete && (
                    <motion.div
                      initial={{ y: -10, opacity: 1, scale: 0 }}
                      animate={{ y: 120, opacity: 0, scale: 1 }}
                      transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
                      className="absolute top-full w-3 h-4 bg-blue-200 rounded-full mt-1 drop-shadow-sm"
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Колба Эрленмейера (Нижняя часть) */}
              <div className="relative mt-2">
                <svg width="200" height="240" viewBox="0 0 200 240" className="drop-shadow-xl">
                  {/* Стекло колбы */}
                  <path 
                    d="M 70 0 L 70 80 L 10 240 L 190 240 L 130 80 L 130 0" 
                    fill="none" 
                    stroke="rgba(0,0,0,0.2)" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    className="z-20 relative"
                  />
                  {/* Жидкость внутри */}
                  <mask id="liquidMask">
                    <path d="M 72 0 L 72 80 L 12 238 L 188 238 L 128 80 L 128 0" fill="white" />
                  </mask>
                  
                  {/* Анимированный уровень и цвет жидкости */}
                  <g mask="url(#liquidMask)">
                     <motion.rect
                        x="0"
                        y={240 - (60 + addedBaseVolume * 1.2)} // Уровень растет
                        width="200"
                        height="300"
                        fill={liquidColor}
                        className="transition-colors duration-700 ease-in-out"
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                     />
                     {/* Пузырьки (декор) */}
                     {isReactionComplete && (
                        <>
                           <motion.circle cx="100" cy="220" r="4" fill="white" opacity="0.4" animate={{ y: -100, opacity: 0 }} transition={{ repeat: Infinity, duration: 2 }} />
                           <motion.circle cx="120" cy="230" r="3" fill="white" opacity="0.3" animate={{ y: -80, opacity: 0 }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }} />
                        </>
                     )}
                  </g>
                  
                  {/* Блики на стекле */}
                  <path d="M 150 220 Q 180 220 170 180" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
                  <path d="M 30 220 Q 10 220 20 180" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
                </svg>
                
                {/* Подпись вещества в колбе */}
                <div className="absolute top-[60%] left-1/2 -translate-x-1/2 text-center pointer-events-none opacity-60">
                    <span className="font-mono font-bold text-slate-700 mix-blend-multiply">HCl + Ind</span>
                </div>
              </div>

              {/* Панель управления */}
              <div className="mt-8 flex gap-4 z-20">
                <button
                  onClick={addDrop}
                  disabled={isReactionComplete}
                  className={`flex flex-col items-center gap-2 px-6 py-4 rounded-xl border-2 transition-all active:scale-95
                    ${isReactionComplete 
                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'bg-white border-indigo-100 hover:border-indigo-500 hover:shadow-lg hover:bg-indigo-50'}`}
                >
                  <Droplets className={isReactionComplete ? "text-slate-400" : "text-indigo-600"} />
                  <span className="font-semibold text-sm">NaOH қосу (тамшылап)</span>
                </button>
              </div>

              {/* РЕЗУЛЬТАТ / УРАВНЕНИЕ */}
              <AnimatePresence>
                {isReactionComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -right-6 top-10 bg-white p-6 rounded-xl shadow-xl border border-green-100 max-w-xs z-50"
                  >
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                        <CheckCircle2 size={20} />
                        <span className="font-bold">Реакция аяқталды!</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-3">
                        <p className="font-mono text-sm text-slate-800 text-center">
                            HCl + NaOH <ArrowRight size={12} className="inline mx-1"/> NaCl + H₂O
                        </p>
                    </div>
                    <p className="text-sm text-slate-600 leading-snug">
                       Тұз қышқылы толығымен бейтараптанды. Ерітінді ортасы өзгеріп, индикатор түсін өзгертті.
                    </p>
                    <button 
                       onClick={() => setStep('result')}
                       className="w-full mt-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                    >
                       Қорытынды жасау
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ШАГ 4: ИТОГОВЫЙ ТЕСТ */}
          {step === 'result' && (
            <motion.div
               key="result"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="text-center max-w-lg"
            >
                <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Тәжірибе сәтті аяқталды!</h3>
                <p className="text-slate-600 mb-8">
                    Сіз бейтараптану реакциясын орындап, қышқыл мен сілтінің өзара әрекеттесуін бақыладыңыз.
                </p>
                
                <div className="bg-white border border-slate-200 p-6 rounded-xl text-left mb-8 shadow-sm">
                    <h4 className="font-semibold mb-4 text-slate-800">Тексеру сұрағы:</h4>
                    <p className="text-sm text-slate-600 mb-4">Бейтараптану реакциясы нәтижесінде қандай заттар түзіледі?</p>
                    <div className="space-y-2">
                        {['Тұз және су', 'Қышқыл және оксид', 'Сілті және металл'].map((opt, i) => (
                            <label key={i} className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50">
                                <input type="radio" name="quiz" className="w-4 h-4 text-indigo-600" />
                                <span className="text-sm text-slate-700">{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button
                  onClick={resetExperiment}
                  className="px-8 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition flex items-center gap-2 mx-auto"
                >
                  <RefreshCw size={18} />
                  Қайтадан бастау
                </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default HClExperiment;