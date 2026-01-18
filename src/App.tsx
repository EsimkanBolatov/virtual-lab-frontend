import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============= TYPES =============
interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'student' | 'teacher';
  grade?: number;
}

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

interface Experiment {
  id: number;
  title: string;
  subject: string;
  grade: number;
  description: string;
  type: string;
  difficulty: string;
  duration_minutes: number;
}

type Page = 'auth' | 'home' | 'experiments' | 'experiment-detail';

// ============= AUTH STORE =============
const useAuthStore = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('vlab_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('vlab_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('vlab_user');
  };

  return { user, isAuthenticated, login, logout };
};

// ============= HEADER COMPONENT =============
const Header: React.FC<{ onLogout: () => void; user: User | null; onNavigate: (page: Page) => void }> = ({ onLogout, user, onNavigate }) => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onNavigate('home')}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl"
            >
              🧪
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Виртуалды Лаборатория
              </h1>
              <p className="text-xs text-blue-100">Интерактивті оқыту платформасы</p>
            </div>
          </motion.div>

          {user && (
            <div className="flex items-center space-x-4">
              <motion.div 
                className="text-right bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl"
                whileHover={{ scale: 1.05 }}
              >
                <p className="font-semibold text-white">{user.full_name}</p>
                <p className="text-xs text-blue-100">
                  {user.role === 'student' ? '👨‍🎓 Оқушы' : '👨‍🏫 Мұғалім'}
                  {user.grade && ` • ${user.grade}-сынып`}
                </p>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className="bg-white text-red-600 px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl"
              >
                🚪 Шығу
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

// ============= AUTH PAGE =============
const AuthPage: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    grade: '7',
    role: 'student'
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Барлық өрістерді толтырыңыз!');
      return;
    }

    if (!isLogin && !formData.full_name) {
      setError('Толық аты-жөніңізді енгізіңіз!');
      return;
    }

    // Симуляция - реалды жүйеде backend-пен байланыс болады
    const user: User = {
      id: Date.now(),
      email: formData.email,
      full_name: isLogin ? 'Тест Пайдаланушы' : formData.full_name,
      role: formData.role as 'student' | 'teacher',
      grade: formData.role === 'student' ? parseInt(formData.grade) : undefined
    };

    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-6xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {['🧪', '🔬', '⚗️', '🧬'][i % 4]}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl mb-4"
            >
              🧪
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Виртуалды Лаборатория
            </h1>
            <p className="text-gray-600 text-lg">
              {isLogin ? 'Жүйеге кіріңіз' : 'Жаңа аккаунт жасаңыз'}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600'
              }`}
            >
              🔓 Кіру
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600'
              }`}
            >
              ✨ Тіркелу
            </button>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4 font-semibold"
              >
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  👤 Толық аты-жөні
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg"
                  placeholder="Мысалы: Айдос Сериков"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📧 Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg"
                placeholder="example@mail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🔒 Құпия сөз
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    📚 Сынып
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg"
                  >
                    {[5,6,7,8,9,10].map(g => (
                      <option key={g} value={g}>{g}-сынып</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    🎭 Рөл
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg"
                  >
                    <option value="student">👨‍🎓 Оқушы</option>
                    <option value="teacher">👨‍🏫 Мұғалім</option>
                  </select>
                </div>
              </>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-2xl transition text-lg"
            >
              {isLogin ? '🚀 Кіру' : '✨ Тіркелу'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// ============= HOME PAGE =============
const HomePage: React.FC<{ user: User; onNavigate: (page: Page, subject?: string) => void }> = ({ user, onNavigate }) => {
  const subjects = [
    { id: 'chemistry', name: 'Химия', icon: '⚗️', color: 'from-blue-400 to-blue-600', experiments: 15 },
    { id: 'biology', name: 'Биология', icon: '🧬', color: 'from-green-400 to-green-600', experiments: 12 },
    { id: 'physics', name: 'Физика', icon: '⚛️', color: 'from-purple-400 to-purple-600', experiments: 10 },
    { id: 'science', name: 'Жаратылыстану', icon: '🌍', color: 'from-orange-400 to-orange-600', experiments: 8 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-6 py-12"
      >
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            Қош келдіңіз, {user.full_name}! 👋
          </h1>
          <p className="text-2xl text-gray-600">
            Виртуалды лабораторияда тәжірибелерді қауіпсіз жасаңыз
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Аяқталған', value: '12', icon: '✅', color: 'from-blue-500 to-blue-600' },
            { label: 'Орташа ұпай', value: '85%', icon: '🎯', color: 'from-green-500 to-green-600' },
            { label: 'Қолжетімді', value: '45', icon: '🔬', color: 'from-purple-500 to-purple-600' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl shadow-2xl p-8 text-white`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-lg mb-2">{stat.label}</p>
                  <p className="text-5xl font-bold">{stat.value}</p>
                </div>
                <div className="text-7xl opacity-50">{stat.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Subjects */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">📚 Пәндер</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject, i) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.08, rotate: 2 }}
                onClick={() => onNavigate('experiments', subject.id)}
                className={`bg-gradient-to-br ${subject.color} rounded-2xl shadow-2xl p-8 cursor-pointer text-white relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 text-9xl opacity-10 -mr-8 -mt-4">
                  {subject.icon}
                </div>
                <div className="relative z-10">
                  <div className="text-6xl mb-4">{subject.icon}</div>
                  <h3 className="text-3xl font-bold mb-2">{subject.name}</h3>
                  <p className="text-lg opacity-90">
                    {subject.experiments} тәжірибе
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl p-12 text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-6xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              >
                {['🧪', '🔬', '⚗️'][i % 3]}
              </motion.div>
            ))}
          </div>
          <div className="relative z-10">
            <h3 className="text-4xl font-bold mb-4">
              🚀 Жаңа тәжірибе бастауға дайынсыз ба?
            </h3>
            <p className="mb-8 text-2xl opacity-90">
              Қызықты тәжірибелерді бастаңыз және білім алыңыз
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('experiments')}
              className="bg-white text-purple-600 px-12 py-4 rounded-2xl font-bold text-xl shadow-lg hover:shadow-2xl"
            >
              Тәжірибелерді қарау →
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// ============= EXPERIMENTS LIST =============
const ExperimentsListPage: React.FC<{ onNavigate: (page: Page, id?: number) => void; onBack: () => void; selectedSubject?: string }> = ({ onNavigate, onBack, selectedSubject }) => {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [filter, setFilter] = useState(selectedSubject || '');

  const experiments: Experiment[] = [
    { id: 1, title: 'Тұз қышқылының бейтараптану реакциясы', subject: 'chemistry', grade: 7, description: 'HCl және NaOH бейтараптану реакциясы', type: 'lab', difficulty: 'easy', duration_minutes: 20 },
    { id: 2, title: 'Ерітінділер концентрациясын есептеу', subject: 'chemistry', grade: 8, description: 'Пайыздық және молярлық концентрацияларды дайындау', type: 'practical', difficulty: 'medium', duration_minutes: 30 },
    { id: 3, title: 'Мыс пен мырыш иондарын тану', subject: 'chemistry', grade: 10, description: 'Cu²⁺, Zn²⁺ иондарына сапалық реакциялар', type: 'lab', difficulty: 'medium', duration_minutes: 25 },
    { id: 4, title: 'Митозды микроскопта зерттеу', subject: 'biology', grade: 9, description: 'Пияз тамыр ұшындағы митоз фазалары', type: 'lab', difficulty: 'hard', duration_minutes: 40 }
  ];

  const filtered = experiments.filter(exp => {
    if (selectedGrade && exp.grade !== selectedGrade) return false;
    if (filter && exp.subject !== filter) return false;
    return true;
  });

  const getDifficultyColor = (d: string) => {
    if (d === 'easy') return 'bg-green-100 text-green-800 border-green-300';
    if (d === 'medium') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getSubjectIcon = (s: string) => {
    if (s === 'chemistry') return '⚗️';
    if (s === 'biology') return '🧬';
    if (s === 'physics') return '⚛️';
    return '🌍';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            🔬 Тәжірибелер тізімі
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg"
          >
            ← Артқа
          </motion.button>
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-6 mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">🔍 Сүзгі</h3>
          <div className="flex gap-4 flex-wrap">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Сынып</label>
              <select
                value={selectedGrade || ''}
                onChange={(e) => setSelectedGrade(e.target.value ? Number(e.target.value) : null)}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg font-semibold"
              >
                <option value="">Барлығы</option>
                {[5,6,7,8,9,10].map(g => (
                  <option key={g} value={g}>{g}-сынып</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Пән</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg font-semibold"
              >
                <option value="">Барлығы</option>
                <option value="chemistry">⚗️ Химия</option>
                <option value="biology">🧬 Биология</option>
                <option value="physics">⚛️ Физика</option>
                <option value="science">🌍 Жаратылыстану</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              onClick={() => onNavigate('experiment-detail', exp.id)}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden cursor-pointer"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 text-white">
                <div className="text-7xl mb-4">{getSubjectIcon(exp.subject)}</div>
                <h3 className="text-2xl font-bold mb-2">{exp.title}</h3>
                <p className="text-lg opacity-90">{exp.subject === 'chemistry' ? 'Химия' : 'Биология'}</p>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-4 text-lg">{exp.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <span className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${getDifficultyColor(exp.difficulty)}`}>
                    {exp.difficulty === 'easy' ? '🟢 Оңай' : exp.difficulty === 'medium' ? '🟡 Орташа' : '🔴 Қиын'}
                  </span>
                  <span className="text-lg font-bold text-gray-600">
                    📚 {exp.grade}-сынып
                  </span>
                </div>

                <div className="flex items-center justify-between text-lg text-gray-500 mb-4">
                  <div>⏱ {exp.duration_minutes} мин</div>
                  <div>📋 {exp.type === 'lab' ? 'Зертхана' : 'Практика'}</div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg"
                >
                  Бастау →
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============= HCL EXPERIMENT =============
const HClExperiment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [selectedAcid, setSelectedAcid] = useState<Chemical | null>(null);
  const [selectedBase, setSelectedBase] = useState<Chemical | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
  const [beakerColor, setBeakerColor] = useState('transparent');
  const [showReaction, setShowReaction] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [completed, setCompleted] = useState(false);

  const chemicals = {
    acids: [
      { id: 'hcl', name: 'HCl', label: 'Тұз қышқылы', color: '#ffcccc' },
      { id: 'h2so4', name: 'H₂SO₄', label: 'Күкірт қышқылы', color: '#ffe6cc' }
    ],
    bases: [
      { id: 'naoh', name: 'NaOH', label: 'Натрий гидроксиді', color: '#ccf2ff' },
      { id: 'koh', name: 'KOH', label: 'Калий гидроксиді', color: '#e6ccff' }
    ],
    indicators: [
      { id: 'litmus', name: 'Лакмус', neutral: '#e8d5f2', acid: '#ff6b6b', base: '#4dabf7' },
      { id: 'phenol', name: 'Фенолфталеин', neutral: 'transparent', acid: 'transparent', base: '#ff6b9d' }
    ]
  };

  const showMessage = (msg: string) => {
    setFeedback(msg);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const mixChemicals = () => {
    if (!selectedAcid || !selectedBase) {
      showMessage('⚠️ Қышқыл мен сілтіді таңдаңыз!');
      return;
    }

    if (selectedAcid.id === 'hcl' && selectedBase.id === 'naoh') {
      setScore(prev => prev + 50);
      setBeakerColor('#b3d9ff');
      setShowReaction(true);
      showMessage('✅ Дұрыс! Бейтараптану жүріп жатыр');
      setTimeout(() => setStep(2), 2000);
    } else {
      showMessage('❌ HCl және NaOH қажет');
    }
  };

  const addIndicator = () => {
    if (!selectedIndicator) {
      showMessage('⚠️ Індикатор таңдаңыз!');
      return;
    }

    setBeakerColor(selectedIndicator.neutral);
    setScore(prev => prev + 30);
    showMessage('✅ Индикатор қосылды!');
    setTimeout(() => setStep(3), 1500);
  };

  const checkAnswer = (answer: string) => {
    if (answer === 'correct') {
      setScore(prev => prev + 20);
      setCompleted(true);
      showMessage('🎉 Керемет! Дұрыс жауап!');
    } else {
      showMessage('❌ Қате жауап');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                🧪 Тұз қышқылының бейтараптану реакциясы
              </h1>
              <p className="text-gray-600 text-xl">7-сынып Химия • Зертханалық тәжірібе №8</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg"
            >
              ← Артқа
            </motion.button>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-gradient-to-r from-green-400 to-green-600 px-6 py-3 rounded-xl text-white font-bold text-xl shadow-lg">
              💎 Ұпай: {score}/100
            </div>
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 px-6 py-3 rounded-xl text-white font-bold text-xl shadow-lg">
              📍 Қадам: {step}/3
            </div>
          </div>
        </div>

        {/* Feedback Toast */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              className="fixed top-24 right-8 bg-white shadow-2xl rounded-2xl p-6 z-50 border-l-4 border-blue-500"
            >
              <p className="text-gray-800 font-bold text-xl">{feedback}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Panel */}
          <div className="col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6"
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                🔴 Қышқылдар
              </h3>
              {chemicals.acids.map(acid => (
                <motion.button
                  key={acid.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedAcid(acid);
                    showMessage('✓ Қышқыл таңдалды!');
                  }}
                  className={`w-full p-6 mb-4 rounded-xl border-4 transition ${
                    selectedAcid?.id === acid.id
                      ? 'border-blue-500 bg-blue-50 shadow-xl'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-4xl mb-2">{acid.name}</div>
                  <div className="text-lg text-gray-600 font-semibold">{acid.label}</div>
                </motion.button>
              ))}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-2xl p-6"
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                🔵 Сілтілер
              </h3>
              {chemicals.bases.map(base => (
                <motion.button
                  key={base.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedBase(base);
                    showMessage('✓ Сілті таңдалды!');
                  }}
                  className={`w-full p-6 mb-4 rounded-xl border-4 transition ${
                    selectedBase?.id === base.id
                      ? 'border-green-500 bg-green-50 shadow-xl'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="text-4xl mb-2">{base.name}</div>
                  <div className="text-lg text-gray-600 font-semibold">{base.label}</div>
                </motion.button>
              ))}
            </motion.div>

            {step >= 2 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl p-6"
              >
                <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  🟣 Индикаторлар
                </h3>
                {chemicals.indicators.map(ind => (
                  <motion.button
                    key={ind.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedIndicator(ind);
                      showMessage('✓ Индикатор таңдалды!');
                    }}
                    className={`w-full p-6 mb-4 rounded-xl border-4 transition ${
                      selectedIndicator?.id === ind.id
                        ? 'border-purple-500 bg-purple-50 shadow-xl'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl font-bold">{ind.name}</div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Center Panel - Lab */}
          <div className="col-span-2 bg-white rounded-2xl shadow-2xl p-8">
            <h3 className="text-3xl font-bold mb-8 text-gray-800">🔬 Виртуалды зертхана</h3>
            
            <div className="flex justify-center items-end h-96 relative bg-gradient-to-b from-blue-50 to-transparent rounded-2xl p-8">
              {/* Beaker */}
              <motion.div
                className="relative"
                animate={{ scale: showReaction ? [1, 1.05, 1] : 1 }}
                transition={{ repeat: showReaction ? Infinity : 0, duration: 1 }}
              >
                <div className="w-64 h-80 border-8 border-gray-400 rounded-b-[3rem] bg-gradient-to-b from-transparent to-gray-50 relative overflow-hidden shadow-2xl">
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
                  {[25, 50, 75].map((pos) => (
                    <div key={pos} className={`absolute left-0 w-12 h-1 bg-gray-400`} style={{top: `${pos}%`}}></div>
                  ))}
                </div>
                <div className="text-center mt-4 text-gray-600 font-bold text-xl">🧪 Стакан</div>
              </motion.div>

              {/* Bubbles */}
              {showReaction && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-4 h-4 bg-white rounded-full opacity-60 shadow-lg"
                      initial={{ x: 320 + Math.random() * 100, y: 350 }}
                      animate={{ 
                        y: -100,
                        x: 320 + Math.random() * 100 + (Math.random() - 0.5) * 100
                      }}
                      transition={{
                        duration: 2 + Math.random(),
                        repeat: Infinity,
                        delay: i * 0.15
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
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-6 rounded-2xl text-2xl shadow-2xl hover:shadow-3xl"
                >
                  ⚗️ Қышқыл мен сілтіді араластыру
                </motion.button>
              )}

              {step === 2 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addIndicator}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-6 rounded-2xl text-2xl shadow-2xl"
                >
                  💧 Индикатор қосу
                </motion.button>
              )}

              {step === 3 && !completed && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h4 className="text-2xl font-bold text-gray-800 mb-4">📝 Реакция теңдеуін таңдаңыз:</h4>
                  {[
                    { text: 'HCl + NaOH → NaCl + H₂O', correct: true },
                    { text: 'HCl + NaOH → Na₂O + H₂', correct: false },
                    { text: 'HCl + NaOH → NaClO + H₂O', correct: false }
                  ].map((option, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                      onClick={() => checkAnswer(option.correct ? 'correct' : 'wrong')}
                      className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-green-100 hover:to-green-200 text-gray-800 font-bold py-5 rounded-2xl border-4 border-gray-300 hover:border-green-400 text-xl"
                    >
                      {option.text}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white p-10 rounded-3xl text-center shadow-2xl"
                >
                  <div className="text-8xl mb-4">🎉</div>
                  <h3 className="text-4xl font-bold mb-4">Тамаша!</h3>
                  <p className="text-2xl mb-2">Тәжірибе сәтті аяқталды!</p>
                  <p className="text-3xl font-bold mt-4">Қорытынды ұпай: {score}/100</p>
                </motion.div>
              )}
            </div>

            {/* Reaction Equation */}
            {showReaction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-4 border-yellow-300 rounded-2xl"
              >
                <p className="text-center text-2xl font-mono text-gray-800 font-bold">
                  HCl + NaOH → ?
                </p>
                <p className="text-center text-lg text-gray-600 mt-2">
                  ⚗️ Реакция жүріп жатыр...
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============= MAIN APP =============
const App: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const [currentPage, setCurrentPage] = useState<Page>('auth');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  useEffect(() => {
    if (isAuthenticated) {
      setCurrentPage('home');
    } else {
      setCurrentPage('auth');
    }
  }, [isAuthenticated]);

  const handleNavigate = (page: Page, param?: string | number) => {
    if (page === 'experiments') {
      setSelectedSubject(typeof param === 'string' ? param : '');
      setCurrentPage('experiments');
    } else if (page === 'experiment-detail') {
      // Болашақта experiment ID бойынша динамикалық контент көрсету үшін
      // Қазір барлық experiments HCl экспериментін көрсетеді
      setCurrentPage('experiment-detail');
    } else {
      setCurrentPage(page);
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('auth');
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AuthPage onLogin={login} />
          </motion.div>
        ) : (
          <>
            <Header onLogout={handleLogout} user={user} onNavigate={handleNavigate} />
            <AnimatePresence mode="wait">
              {currentPage === 'home' && user && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                >
                  <HomePage user={user} onNavigate={handleNavigate} />
                </motion.div>
              )}
              
              {currentPage === 'experiments' && (
                <motion.div
                  key="experiments"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  <ExperimentsListPage 
                    onNavigate={handleNavigate} 
                    onBack={() => handleNavigate('home')}
                    selectedSubject={selectedSubject}
                  />
                </motion.div>
              )}
              
              {currentPage === 'experiment-detail' && (
                <motion.div
                  key="experiment-detail"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <HClExperiment onBack={() => handleNavigate('experiments')} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;