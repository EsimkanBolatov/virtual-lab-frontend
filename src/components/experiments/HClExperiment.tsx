// frontend/src/components/experiments/HClExperiment.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Типтерді анықтау
interface Chemical {
  id: string;
  name: string;
  label: string;
  color: string;
}

interface Indicator {
  id: string;
  name: string;
  neutral: string;
  acid: string;
  base: string;
}

const HClExperiment = () => {
  const [step, setStep] = useState(1);
  const [selectedAcid, setSelectedAcid] = useState<Chemical | null>(null);
  const [selectedBase, setSelectedBase] = useState<Chemical | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
  const [beakerColor, setBeakerColor] = useState('transparent');
  const [showReaction, setShowReaction] = useState(false);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [completed, setCompleted] = useState(false);

  const chemicals = {
    acids: [
      { id: 'hcl', name: 'HCl', label: 'Тұз қышқылы', color: '#ffcccc' },
      { id: 'h2so4', name: 'H₂SO₄', label: 'Күкірт қышқылы', color: '#ffe6cc' }
    ] as Chemical[],
    bases: [
      { id: 'naoh', name: 'NaOH', label: 'Натрий гидроксиді', color: '#ccf2ff' },
      { id: 'koh', name: 'KOH', label: 'Калий гидроксиді', color: '#e6ccff' }
    ] as Chemical[],
    indicators: [
      { id: 'litmus', name: 'Лакмус', neutral: '#e8d5f2', acid: '#ff6b6b', base: '#4dabf7' },
      { id: 'phenol', name: 'Фенолфталеин', neutral: 'transparent', acid: 'transparent', base: '#ff6b9d' }
    ] as Indicator[]
  };

  const handleChemicalSelect = (type: 'acid' | 'base' | 'indicator', chemical: Chemical | Indicator) => {
    if (type === 'acid') {
      setSelectedAcid(chemical as Chemical);
      showMessage('✓ Қышқыл таңдалды!');
    } else if (type === 'base') {
      setSelectedBase(chemical as Chemical);
      showMessage('✓ Сілті таңдалды!');
    } else if (type === 'indicator') {
      setSelectedIndicator(chemical as Indicator);
      showMessage('✓ Индикатор таңдалды!');
    }
  };

  const showMessage = (msg: string) => {
    setFeedbackMessage(msg);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const mixChemicals = () => {
    if (!selectedAcid || !selectedBase) {
      showMessage('⚠ Қышқыл мен сілтіді таңдаңыз!');
      return;
    }

    if (selectedAcid.id === 'hcl' && selectedBase.id === 'naoh') {
      setScore(prev => prev + 50);
      setBeakerColor('#b3d9ff');
      setShowReaction(true);
      showMessage('✓ Дұрыс! Бейтараптану реакциясы жүріп жатыр');
      setTimeout(() => setStep(2), 2000);
    } else {
      showMessage('✗ Тапсырма бойынша HCl және NaOH қажет');
    }
  };

  const addIndicator = () => {
    if (!selectedIndicator) {
      showMessage('⚠ Індикатор таңдаңыз!');
      return;
    }

    if (selectedIndicator.id === 'litmus' || selectedIndicator.id === 'phenol') {
      const color = selectedIndicator.neutral;
      setBeakerColor(color);
      setScore(prev => prev + 30);
      showMessage('✓ Индикатор қосылды!');
      setTimeout(() => setStep(3), 1500);
    }
  };

  const checkAnswer = (answer: string) => {
    if (answer === 'nacl_h2o') {
      setScore(prev => prev + 20);
      setCompleted(true);
      showMessage('🎉 Өте жақсы! Тест аяқталды!');
    } else {
      showMessage('✗ Қате жауап. Қайта көріңіз');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🧪 Тұз қышқылының бейтараптану реакциясы
          </h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">7-сынып Химия • Зертханалық тәжірибе №8</p>
            <div className="flex gap-4">
              <div className="bg-green-100 px-4 py-2 rounded-lg">
                <span className="text-green-800 font-semibold">Ұпай: {score}/100</span>
              </div>
              <div className="bg-blue-100 px-4 py-2 rounded-lg">
                <span className="text-blue-800 font-semibold">Қадам: {step}/3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Toast */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 bg-white shadow-xl rounded-lg p-4 z-50 border-l-4 border-blue-500"
            >
              <p className="text-gray-800 font-medium">{feedbackMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Panel - Chemicals */}
          <div className="col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Қышқылдар</h3>
              {chemicals.acids.map(acid => (
                <motion.button
                  key={acid.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChemicalSelect('acid', acid)}
                  className={`w-full p-4 mb-3 rounded-lg border-2 transition ${
                    selectedAcid?.id === acid.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{acid.name}</div>
                  <div className="text-sm text-gray-600">{acid.label}</div>
                </motion.button>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Сілтілер</h3>
              {chemicals.bases.map(base => (
                <motion.button
                  key={base.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChemicalSelect('base', base)}
                  className={`w-full p-4 mb-3 rounded-lg border-2 transition ${
                    selectedBase?.id === base.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{base.name}</div>
                  <div className="text-sm text-gray-600">{base.label}</div>
                </motion.button>
              ))}
            </div>

            {step >= 2 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Индикаторлар</h3>
                {chemicals.indicators.map(ind => (
                  <motion.button
                    key={ind.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChemicalSelect('indicator', ind)}
                    className={`w-full p-4 mb-3 rounded-lg border-2 transition ${
                      selectedIndicator?.id === ind.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-lg font-semibold">{ind.name}</div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Center Panel - Experiment */}
          <div className="col-span-2 bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Виртуалды зертхана</h3>
            
            <div className="flex justify-center items-end h-96 relative">
              {/* Beaker */}
              <motion.div
                className="relative"
                animate={{ scale: showReaction ? [1, 1.05, 1] : 1 }}
                transition={{ repeat: showReaction ? Infinity : 0, duration: 1 }}
              >
                <div className="w-48 h-64 border-4 border-gray-400 rounded-b-3xl bg-gradient-to-b from-transparent to-gray-50 relative overflow-hidden">
                  <motion.div
                    className="absolute bottom-0 w-full transition-all duration-1000"
                    style={{ 
                      height: selectedAcid && selectedBase ? '80%' : '0%',
                      backgroundColor: beakerColor 
                    }}
                    animate={{
                      opacity: showReaction ? [0.7, 1, 0.7] : 1
                    }}
                    transition={{ repeat: showReaction ? Infinity : 0, duration: 2 }}
                  />
                  
                  {/* Measurement lines */}
                  <div className="absolute left-0 top-1/4 w-8 h-0.5 bg-gray-400"></div>
                  <div className="absolute left-0 top-2/4 w-8 h-0.5 bg-gray-400"></div>
                  <div className="absolute left-0 top-3/4 w-8 h-0.5 bg-gray-400"></div>
                </div>
                <div className="text-center mt-2 text-gray-600 font-semibold">Стакан</div>
              </motion.div>

              {/* Bubbles animation */}
              {showReaction && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 bg-white rounded-full opacity-60"
                      initial={{ x: Math.random() * 200 + 200, y: 300 }}
                      animate={{ 
                        y: -50,
                        x: Math.random() * 200 + 200 + (Math.random() - 0.5) * 50
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-4">
              {step === 1 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={mixChemicals}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg text-lg shadow-lg"
                >
                  Қышқыл мен сілтіді араластыру
                </motion.button>
              )}

              {step === 2 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addIndicator}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-lg text-lg shadow-lg"
                >
                  Индикатор қосу
                </motion.button>
              )}

              {step === 3 && !completed && (
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-gray-800">Реакция теңдеуін таңдаңыз:</h4>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => checkAnswer('nacl_h2o')}
                    className="w-full bg-green-100 hover:bg-green-200 text-gray-800 font-semibold py-4 rounded-lg border-2 border-green-300"
                  >
                    HCl + NaOH → NaCl + H₂O
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => checkAnswer('wrong1')}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 rounded-lg border-2 border-gray-300"
                  >
                    HCl + NaOH → Na₂O + H₂
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => checkAnswer('wrong2')}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 rounded-lg border-2 border-gray-300"
                  >
                    HCl + NaOH → NaClO + H₂O
                  </motion.button>
                </div>
              )}

              {completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-xl text-center"
                >
                  <h3 className="text-2xl font-bold mb-2">🎉 Тамаша!</h3>
                  <p className="text-lg">Тәжірибе сәтті аяқталды!</p>
                  <p className="mt-2">Қорытынды ұпай: {score}/100</p>
                </motion.div>
              )}
            </div>

            {/* Reaction Equation Display */}
            {showReaction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg"
              >
                <p className="text-center text-lg font-mono text-gray-800">
                  HCl + NaOH → ?
                </p>
                <p className="text-center text-sm text-gray-600 mt-2">
                  Реакция жүріп жатыр...
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HClExperiment;