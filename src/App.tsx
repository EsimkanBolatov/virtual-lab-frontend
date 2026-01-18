import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Компоненттер
import HClExperiment from './components/experiments/HClExperiment';
import SolutionPreparationExperiment from './components/experiments/SolutionPreparationExperiment';
import MitosisExperiment from './components/experiments/MitosisExperiment';
import IonRecognitionExperiment from './components/experiments/IonRecognitionExperiment'; // ЖАҢА

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
      className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-xl sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="text-4xl">🧪</div>
            <div>
              <h1 className="text-xl font-bold text-white">Virtual Lab</h1>
              <p className="text-xs text-blue-100">Интерактивті оқыту</p>
            </div>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="text-right text-white">
                <p className="font-semibold">{user.full_name}</p>
                <p className="text-xs opacity-80">{user.grade}-сынып</p>
              </div>
              <button
                onClick={onLogout}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm transition"
              >
                Шығу
              </button>
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
  const [formData, setFormData] = useState({ email: '', password: '', full_name: '', grade: '7', role: 'student' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      onLogin({
        id: Date.now(),
        email: formData.email,
        full_name: isLogin ? 'Оқушы' : formData.full_name,
        role: formData.role as any,
        grade: Number(formData.grade)
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">Виртуалды Лаборатория</h1>
        <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
          <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 rounded-md ${isLogin ? 'bg-white shadow' : ''}`}>Кіру</button>
          <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 rounded-md ${!isLogin ? 'bg-white shadow' : ''}`}>Тіркелу</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && <input type="text" placeholder="Аты-жөні" className="w-full p-3 border rounded-lg" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />}
          <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Құпия сөз" className="w-full p-3 border rounded-lg" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700">Бастау</button>
        </form>
      </div>
    </div>
  );
};

// ============= EXPERIMENTS LIST =============
const ExperimentsListPage: React.FC<{ onNavigate: (page: Page, id?: number) => void; onBack: () => void; selectedSubject?: string }> = ({ onNavigate, onBack, selectedSubject }) => {
  const experiments: Experiment[] = [
    { id: 1, title: 'Тұз қышқылының бейтараптану реакциясы', subject: 'chemistry', grade: 7, description: 'HCl және NaOH бейтараптану реакциясы', type: 'lab', difficulty: 'easy', duration_minutes: 20 },
    { id: 2, title: 'Ерітінділер дайындау', subject: 'chemistry', grade: 8, description: 'Пайыздық концентрациясы берілген ерітіндіні дайындау', type: 'practical', difficulty: 'medium', duration_minutes: 30 },
    { id: 3, title: 'Митозды зерттеу', subject: 'biology', grade: 9, description: 'Пияз тамыры жасушаларындағы митоз фазаларын микроскоппен қарау', type: 'lab', difficulty: 'hard', duration_minutes: 40 },
    { id: 4, title: 'Мыс пен мырыш иондарын тану', subject: 'chemistry', grade: 10, description: 'Cu²⁺, Zn²⁺ иондарына сапалық реакциялар', type: 'lab', difficulty: 'medium', duration_minutes: 25 },
  ];

  const filtered = selectedSubject ? experiments.filter(e => e.subject === selectedSubject) : experiments;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <button onClick={onBack} className="mb-6 text-slate-500 hover:text-indigo-600 font-medium">← Басты бетке</button>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Зертханалық жұмыстар</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((exp) => (
          <motion.div 
            key={exp.id} 
            whileHover={{ y: -5 }}
            onClick={() => onNavigate('experiment-detail', exp.id)} 
            className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 cursor-pointer hover:border-indigo-300 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${exp.subject === 'chemistry' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                {exp.subject === 'chemistry' ? 'Химия' : 'Биология'}
              </span>
              <span className="text-slate-400 text-sm">⏱ {exp.duration_minutes} мин</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{exp.title}</h3>
            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{exp.description}</p>
            <div className="flex gap-2 text-xs font-semibold text-slate-600">
              <span className="bg-slate-100 px-2 py-1 rounded">{exp.grade}-сынып</span>
              <span className="bg-slate-100 px-2 py-1 rounded capitalize">{exp.difficulty}</span>
            </div>
          </motion.div>
        ))}
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
    setCurrentPage(isAuthenticated ? 'home' : 'auth');
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

  const renderExperiment = () => {
    switch (selectedExperimentId) {
      case 1: return <HClExperiment onBack={() => handleNavigate('experiments')} />;
      case 2: return <SolutionPreparationExperiment onBack={() => handleNavigate('experiments')} />;
      case 3: return <MitosisExperiment onBack={() => handleNavigate('experiments')} />;
      case 4: return <IonRecognitionExperiment onBack={() => handleNavigate('experiments')} />;
      default: return <div className="text-center p-10">Тәжірибе әзірленуде...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AuthPage onLogin={login} />
          </motion.div>
        ) : (
          <>
            <Header onLogout={() => { logout(); setCurrentPage('auth'); }} user={user} onNavigate={handleNavigate} />
            <main>
              {currentPage === 'home' && (
                <div className="max-w-7xl mx-auto px-6 py-12">
                   <h1 className="text-4xl font-bold mb-8">Қош келдіңіз, {user?.full_name}! 👋</h1>
                   <div className="grid grid-cols-3 gap-6">
                      <div onClick={() => handleNavigate('experiments', 'chemistry')} className="bg-white p-8 rounded-2xl shadow hover:shadow-lg cursor-pointer transition">
                        <div className="text-5xl mb-4">⚗️</div>
                        <h2 className="text-2xl font-bold">Химия</h2>
                      </div>
                      <div onClick={() => handleNavigate('experiments', 'biology')} className="bg-white p-8 rounded-2xl shadow hover:shadow-lg cursor-pointer transition">
                        <div className="text-5xl mb-4">🧬</div>
                        <h2 className="text-2xl font-bold">Биология</h2>
                      </div>
                   </div>
                </div>
              )}
              
              {currentPage === 'experiments' && (
                <ExperimentsListPage 
                  onNavigate={handleNavigate} 
                  onBack={() => handleNavigate('home')} 
                  selectedSubject={selectedSubject} 
                />
              )}
              
              {currentPage === 'experiment-detail' && (
                 <div className="max-w-7xl mx-auto px-6 py-8">
                    {renderExperiment()}
                 </div>
              )}
            </main>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;