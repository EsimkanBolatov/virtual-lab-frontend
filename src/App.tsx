import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============= ИМПОРТТАР (БАРЛЫҚ ЭКСПЕРИМЕНТТЕР) =============
import HClExperiment from './components/experiments/HClExperiment';
import SolutionPreparationExperiment from './components/experiments/SolutionPreparationExperiment';
import MitosisExperiment from './components/experiments/MitosisExperiment';
import IonRecognitionExperiment from './components/experiments/IonRecognitionExperiment';
import FoodAnalysisExperiment from './components/experiments/FoodAnalysisExperiment';
import PhaseChangeExperiment from './components/experiments/PhaseChangeExperiment';
import ProteinDenaturationExperiment from './components/experiments/ProteinDenaturationExperiment';
import SubstancePropertiesExperiment from './components/experiments/SubstancePropertiesExperiment';
import BoneStructureExperiment from './components/experiments/BoneStructureExperiment';
// Жаңа Физика компоненттері
import PhysicsMeasurementExperiment from './components/experiments/PhysicsMeasurementExperiment';
import PhysicsDensityExperiment from './components/experiments/PhysicsDensityExperiment';
import PhysicsOhmsLawExperiment from './components/experiments/PhysicsOhmsLawExperiment';
import PhysicsProjectileExperiment from './components/experiments/PhysicsProjectileExperiment';
import PhysicsAccelerationExperiment from './components/experiments/PhysicsAccelerationExperiment';
import PhysicsCalorimetryExperiment from './components/experiments/PhysicsCalorimetryExperiment';
import PhysicsDiffractionExperiment from './components/experiments/PhysicsDiffractionExperiment';

// ============= TYPES =============
interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'student' | 'teacher';
  grade?: number;
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

// ============= DATA: МҰҒАЛІМДЕР МЕН АВТОРЛАР =============
const teachers = [
  { name: 'Дубанова Нұрханым', subject: 'Химия', exp: 34, icon: '⚗️', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Парменкулова Динара', subject: 'Физика', exp: 13, icon: '⚛️', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { name: 'Таттимбетова Ляззат', subject: 'География', exp: 21, icon: '🌍', color: 'bg-green-50 text-green-700 border-green-200' },
  { name: 'Алдатаева Жанара', subject: 'Биология', exp: 20, icon: '🧬', color: 'bg-pink-50 text-pink-700 border-pink-200' },
];

const students = [
  { name: 'Ауғанбай Байсал', role: 'Дизайнер 🎨' },
  { name: 'Ерлан Алижан', role: 'Разработчик 💻' },
];

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
                Virtual Lab
              </h1>
              <p className="text-xs text-blue-100">Интерактивті оқыту платформасы</p>
            </div>
          </motion.div>

          {user && (
            <div className="flex items-center space-x-4">
              <motion.div 
                className="text-right text-white opacity-90"
              >
                <p className="font-semibold text-sm">{user.full_name}</p>
                <p className="text-xs opacity-80">
                  {user.role === 'student' ? '👨‍🎓 Оқушы' : '👨‍🏫 Мұғалім'}
                  {user.grade && ` • ${user.grade}-сынып`}
                </p>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm transition"
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

          <div className="flex mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-1">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 rounded-xl font-bold transition-all ${isLogin ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-gray-600'}`}>🔓 Кіру</button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 rounded-xl font-bold transition-all ${!isLogin ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-gray-600'}`}>✨ Тіркелу</button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4 font-semibold">⚠️ {error}</motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">👤 Толық аты-жөні</label>
                <input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg" placeholder="Мысалы: Айдос Сериков" />
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">📧 Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg" placeholder="example@mail.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">🔒 Құпия сөз</label>
              <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg" placeholder="••••••••" />
            </div>
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">📚 Сынып</label>
                  <select value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg">
                    {[5,6,7,8,9,10,11].map(g => (<option key={g} value={g}>{g}-сынып</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">🎭 Рөл</label>
                  <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg">
                    <option value="student">👨‍🎓 Оқушы</option>
                    <option value="teacher">👨‍🏫 Мұғалім</option>
                  </select>
                </div>
              </>
            )}
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-2xl transition text-lg">{isLogin ? '🚀 Кіру' : '✨ Тіркелу'}</motion.button>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 pb-20">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-6 py-12">
        
        {/* HERO */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-slate-800 mb-4">Қош келдіңіз, {user.full_name}! 👋</h1>
          <p className="text-2xl text-slate-500">Виртуалды зертханада ғылым әлемін ашыңыз</p>
        </div>

        {/* ПӘНДЕР */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 pl-4 border-l-8 border-indigo-500">📚 Пәндер</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject, i) => (
              <motion.div 
                key={subject.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1 }} 
                whileHover={{ scale: 1.05, y: -5 }} 
                onClick={() => onNavigate('experiments', subject.id)} 
                className={`bg-gradient-to-br ${subject.color} rounded-3xl shadow-xl p-8 cursor-pointer text-white relative overflow-hidden group`}
              >
                <div className="absolute top-0 right-0 text-9xl opacity-10 group-hover:opacity-20 transition-opacity rotate-12 -mr-8 -mt-4">{subject.icon}</div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4 bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">{subject.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{subject.name}</h3>
                  <p className="opacity-90 font-medium">{subject.experiments} зертханалық жұмыс</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ҰСТАЗДАР (ЖАҢА) */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 pl-4 border-l-8 border-blue-500">👨‍🏫 Біздің ұстаздар</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachers.map((teacher, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className={`bg-white p-6 rounded-2xl shadow-lg border-2 ${teacher.color.split(' ')[2]} hover:shadow-xl transition-all`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 ${teacher.color.replace('border-', '').replace('text-', 'bg-').replace('200', '100')} text-slate-700`}>
                   {teacher.icon}
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-1">{teacher.name}</h3>
                <p className="text-sm font-semibold text-slate-500 mb-3">{teacher.subject} пәні мұғалімі</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${teacher.color}`}>
                  ⭐ {teacher.exp} жыл тәжірибе
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* АВТОРЛАР (ЖАҢА) */}
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-8 pl-4 border-l-8 border-pink-500">🚀 Жоба авторлары</h2>
          <div className="flex gap-6 flex-wrap">
            {students.map((student, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05 }} className="bg-white px-8 py-6 rounded-2xl shadow-md border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-800">{student.name}</h4>
                  <p className="text-indigo-600 font-medium text-sm">{student.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </motion.div>
    </div>
  );
};

// ============= EXPERIMENTS LIST =============
const ExperimentsListPage: React.FC<{ onNavigate: (page: Page, id?: number) => void; onBack: () => void; selectedSubject?: string }> = ({ onNavigate, onBack, selectedSubject }) => {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [filter, setFilter] = useState(selectedSubject || '');

  // БАРЛЫҚ ЭКСПЕРИМЕНТТЕР ТІЗІМІ
  const experiments: Experiment[] = [
    // ХИМИЯ
    { id: 1, title: 'Тұз қышқылының бейтараптану реакциясы', subject: 'chemistry', grade: 7, description: 'HCl және NaOH бейтараптану реакциясы', type: 'lab', difficulty: 'easy', duration_minutes: 20 },
    { id: 2, title: 'Ерітінділер дайындау', subject: 'chemistry', grade: 8, description: 'Пайыздық концентрациясы берілген ерітіндіні дайындау', type: 'practical', difficulty: 'medium', duration_minutes: 30 },
    { id: 4, title: 'Мыс пен мырыш иондарын тану', subject: 'chemistry', grade: 10, description: 'Cu²⁺, Zn²⁺ иондарына сапалық реакциялар', type: 'lab', difficulty: 'medium', duration_minutes: 25 },
    { id: 5, title: 'Азық-түлік құрамын анықтау', subject: 'chemistry', grade: 7, description: 'Нәруыз, май және көмірсуларды анықтау', type: 'lab', difficulty: 'easy', duration_minutes: 25 },
    
    // БИОЛОГИЯ
    { id: 3, title: 'Митозды зерттеу', subject: 'biology', grade: 9, description: 'Пияз тамыры жасушаларындағы митоз фазаларын микроскоппен қарау', type: 'lab', difficulty: 'hard', duration_minutes: 40 },
    { id: 7, title: 'Нәруыздар денатурациясы', subject: 'biology', grade: 10, description: 'Температура мен pH-тың нәруыз құрылымына әсері', type: 'lab', difficulty: 'hard', duration_minutes: 35 },
    { id: 9, title: 'Сүйек құрылысы', subject: 'biology', grade: 8, description: 'Сүйектің макро және микроскопиялық құрылымын зерттеу', type: 'lab', difficulty: 'medium', duration_minutes: 25 },
    
    // ЖАРАТЫЛЫСТАНУ
    { id: 6, title: 'Фазалық өзгерістер', subject: 'science', grade: 6, description: 'Судың агрегаттық күйлерінің өзгеруі (мұз, су, бу)', type: 'lab', difficulty: 'easy', duration_minutes: 15 },
    { id: 8, title: 'Заттардың қасиеттері', subject: 'science', grade: 5, description: 'Қаттылық, ерігіштік және серпімділік қасиеттерін зерттеу', type: 'practical', difficulty: 'easy', duration_minutes: 15 },

    // ФИЗИКА (ЖАҢА)
    { id: 10, title: 'Физикалық шамаларды өлшеу', subject: 'physics', grade: 7, description: 'Ұзындықты, көлемді және температураны өлшеу құралдарымен танысу', type: 'lab', difficulty: 'easy', duration_minutes: 20 },
    { id: 11, title: 'Сұйықтар мен қатты денелердің тығыздығы', subject: 'physics', grade: 7, description: 'Масса мен көлемді өлшеу арқылы тығыздықты анықтау', type: 'lab', difficulty: 'medium', duration_minutes: 25 },
    { id: 12, title: 'Мұздың меншікті балқу жылуы', subject: 'physics', grade: 8, description: 'Калориметр көмегімен жылу мөлшерін есептеу', type: 'lab', difficulty: 'medium', duration_minutes: 30 },
    { id: 13, title: 'Ом заңы (Тізбек бөлігі)', subject: 'physics', grade: 8, description: 'Ток күшінің кернеу мен кедергіге тәуелділігі', type: 'lab', difficulty: 'hard', duration_minutes: 35 },
    { id: 14, title: 'Дененің үдеуін анықтау', subject: 'physics', grade: 9, description: 'Теңүдемелі қозғалыс кезіндегі жылдамдық пен уақыт', type: 'lab', difficulty: 'medium', duration_minutes: 30 },
    { id: 15, title: 'Горизонталь лақтырылған дене', subject: 'physics', grade: 9, description: 'Траектория мен ұшу қашықтығын зерттеу', type: 'lab', difficulty: 'hard', duration_minutes: 35 },
    { id: 16, title: 'Стокс заңы (Тұтқырлық)', subject: 'physics', grade: 10, description: 'Сұйықтағы шардың қозғалысын зерттеу', type: 'lab', difficulty: 'hard', duration_minutes: 40 },
    { id: 17, title: 'ЭҚК және ішкі кедергі', subject: 'physics', grade: 10, description: 'Ток көзінің сипаттамаларын анықтау', type: 'lab', difficulty: 'medium', duration_minutes: 30 },
    { id: 18, title: 'Трансформатор', subject: 'physics', grade: 11, description: 'Орама санын және трансформация коэффициентін анықтау', type: 'lab', difficulty: 'medium', duration_minutes: 25 },
    { id: 19, title: 'Толқын ұзындығын анықтау', subject: 'physics', grade: 11, description: 'Дифракциялық тормен жұмыс', type: 'lab', difficulty: 'hard', duration_minutes: 35 },
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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800">
            🔬 Зертханалық жұмыстар
          </h1>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onBack} className="bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded-xl font-bold shadow-sm hover:shadow-md">← Артқа</motion.button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Сүзгі (Фильтр)</h3>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-bold text-slate-500 mb-2">Сынып</label>
              <select value={selectedGrade || ''} onChange={(e) => setSelectedGrade(e.target.value ? Number(e.target.value) : null)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-semibold">
                <option value="">Барлығы</option>
                {[5,6,7,8,9,10,11].map(g => (<option key={g} value={g}>{g}-сынып</option>))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-bold text-slate-500 mb-2">Пән</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-semibold">
                <option value="">Барлығы</option>
                <option value="chemistry">⚗️ Химия</option>
                <option value="biology">🧬 Биология</option>
                <option value="physics">⚛️ Физика</option>
                <option value="science">🌍 Жаратылыстану</option>
              </select>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((exp, i) => (
            <motion.div key={exp.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -5 }} onClick={() => onNavigate('experiment-detail', exp.id)} className="bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-xl hover:border-indigo-300 transition-all group">
              <div className={`h-2 bg-gradient-to-r ${exp.subject === 'chemistry' ? 'from-blue-400 to-blue-600' : exp.subject === 'biology' ? 'from-green-400 to-green-600' : exp.subject === 'physics' ? 'from-purple-400 to-purple-600' : 'from-orange-400 to-orange-600'}`}></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                   <div className="text-4xl">{getSubjectIcon(exp.subject)}</div>
                   <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">{exp.duration_minutes} мин</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{exp.title}</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{exp.description}</p>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getDifficultyColor(exp.difficulty)}`}>
                    {exp.difficulty === 'easy' ? 'Оңай' : exp.difficulty === 'medium' ? 'Орташа' : 'Қиын'}
                  </span>
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    {exp.grade}-сынып
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
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
  const [selectedExperimentId, setSelectedExperimentId] = useState<number | null>(null);

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
      setSelectedExperimentId(typeof param === 'number' ? param : null);
      setCurrentPage('experiment-detail');
    } else {
      setCurrentPage(page);
    }
  };

  // ЭКСПЕРИМЕНТТІ ТАҢДАУ ЛОГИКАСЫ
  const renderExperiment = () => {
    switch (selectedExperimentId) {
      case 1: return <HClExperiment onBack={() => handleNavigate('experiments')} />;
      case 2: return <SolutionPreparationExperiment onBack={() => handleNavigate('experiments')} />;
      case 3: return <MitosisExperiment onBack={() => handleNavigate('experiments')} />;
      case 4: return <IonRecognitionExperiment onBack={() => handleNavigate('experiments')} />;
      case 5: return <FoodAnalysisExperiment onBack={() => handleNavigate('experiments')} />;
      case 6: return <PhaseChangeExperiment onBack={() => handleNavigate('experiments')} />;
      case 7: return <ProteinDenaturationExperiment onBack={() => handleNavigate('experiments')} />;
      case 8: return <SubstancePropertiesExperiment onBack={() => handleNavigate('experiments')} />;
      case 9: return <BoneStructureExperiment onBack={() => handleNavigate('experiments')} />;
      case 10: return <PhysicsMeasurementExperiment onBack={() => handleNavigate('experiments')} />;
      case 11: return <PhysicsDensityExperiment onBack={() => handleNavigate('experiments')} />;
      case 13: return <PhysicsOhmsLawExperiment onBack={() => handleNavigate('experiments')} />;
      case 15: return <PhysicsProjectileExperiment onBack={() => handleNavigate('experiments')} />;
      case 12: return <PhysicsCalorimetryExperiment onBack={() => handleNavigate('experiments')} />; // Мұз
      case 14: return <PhysicsAccelerationExperiment onBack={() => handleNavigate('experiments')} />; // Үдеу
      case 19: return <PhysicsDiffractionExperiment onBack={() => handleNavigate('experiments')} />; // Дифракция
      default: return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
           <div className="text-6xl mb-4">🚧</div>
           <h2 className="text-2xl font-bold text-slate-800">Бұл жұмыс әзірлену үстінде</h2>
           <p className="text-slate-500 mt-2">Жақын арада іске қосылады!</p>
           <button onClick={() => handleNavigate('experiments')} className="mt-6 text-indigo-600 font-bold hover:underline">Тізімге оралу</button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AuthPage onLogin={login} />
          </motion.div>
        ) : (
          <>
            <Header onLogout={() => { logout(); setCurrentPage('auth'); }} user={user} onNavigate={handleNavigate} />
            <AnimatePresence mode="wait">
              {currentPage === 'home' && user && (
                <motion.div key="home" initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}>
                  <HomePage user={user} onNavigate={handleNavigate} />
                </motion.div>
              )}
              
              {currentPage === 'experiments' && (
                <motion.div key="experiments" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}>
                  <ExperimentsListPage onNavigate={handleNavigate} onBack={() => handleNavigate('home')} selectedSubject={selectedSubject} />
                </motion.div>
              )}
              
              {currentPage === 'experiment-detail' && (
                <motion.div key="experiment-detail" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                  <div className="max-w-7xl mx-auto px-6 py-8">
                    {renderExperiment()}
                  </div>
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