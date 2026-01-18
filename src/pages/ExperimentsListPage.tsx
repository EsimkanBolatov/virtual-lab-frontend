// frontend/src/pages/ExperimentsListPage.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import { useAuthStore } from '../store/authStore';

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

const ExperimentsListPage = () => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const navigate = useNavigate();
  const { token, user } = useAuthStore();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const subject = searchParams.get('subject');
    if (subject) {
      setSelectedSubject(subject);
    }
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    try {
      const response = await fetch('http://localhost:8000/experiments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setExperiments(data);
    } catch (error) {
      console.error('Error fetching experiments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExperiments = experiments.filter(exp => {
    if (selectedGrade && exp.grade !== selectedGrade) return false;
    if (selectedSubject && exp.subject !== selectedSubject) return false;
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Оңай';
      case 'medium': return 'Орташа';
      case 'hard': return 'Қиын';
      default: return difficulty;
    }
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'chemistry': return '⚗️';
      case 'biology': return '🧬';
      case 'physics': return '⚛️';
      case 'science': return '🌍';
      default: return '🔬';
    }
  };

  const getSubjectName = (subject: string) => {
    switch (subject) {
      case 'chemistry': return 'Химия';
      case 'biology': return 'Биология';
      case 'physics': return 'Физика';
      case 'science': return 'Жаратылыстану';
      default: return subject;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🧪</div>
          <p className="text-xl text-gray-600">Жүктелуде...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Тәжірибелер тізімі
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/home')}
            className="bg-white px-6 py-2 rounded-lg shadow-lg text-gray-700 font-semibold hover:bg-gray-50"
          >
            ← Артқа
          </motion.button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Сүзгі</h3>
          <div className="flex gap-4 flex-wrap">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Сынып
              </label>
              <select
                value={selectedGrade || ''}
                onChange={(e) => setSelectedGrade(e.target.value ? Number(e.target.value) : null)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="">Барлығы</option>
                <option value="5">5-сынып</option>
                <option value="6">6-сынып</option>
                <option value="7">7-сынып</option>
                <option value="8">8-сынып</option>
                <option value="9">9-сынып</option>
                <option value="10">10-сынып</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Пән
              </label>
              <select
                value={selectedSubject || ''}
                onChange={(e) => setSelectedSubject(e.target.value || null)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="">Барлығы</option>
                <option value="chemistry">Химия</option>
                <option value="biology">Биология</option>
                <option value="physics">Физика</option>
                <option value="science">Жаратылыстану</option>
              </select>
            </div>
          </div>
        </div>

        {/* Experiments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiments.map((experiment, index) => (
            <motion.div
              key={experiment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
              onClick={() => navigate(`/experiment/${experiment.id}`)}
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                <div className="text-5xl mb-3">{getSubjectIcon(experiment.subject)}</div>
                <h3 className="text-xl font-bold mb-2">{experiment.title}</h3>
                <p className="text-sm opacity-90">{getSubjectName(experiment.subject)}</p>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                  {experiment.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(experiment.difficulty)}`}>
                    {getDifficultyText(experiment.difficulty)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {experiment.grade}-сынып
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="mr-1">⏱</span>
                    {experiment.duration_minutes} мин
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">📋</span>
                    {experiment.type === 'lab' ? 'Зертхана' : 'Практика'}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg"
                >
                  Бастау →
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredExperiments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-600">Тәжірибелер табылмады</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperimentsListPage;