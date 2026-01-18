// frontend/src/pages/HomePage.tsx
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Header from '../components/layout/Header';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const subjects = [
    {
      id: 'chemistry',
      name: 'Химия',
      icon: '⚗️',
      color: 'from-blue-400 to-blue-600',
      experiments: 15
    },
    {
      id: 'biology',
      name: 'Биология',
      icon: '🧬',
      color: 'from-green-400 to-green-600',
      experiments: 12
    },
    {
      id: 'physics',
      name: 'Физика',
      icon: '⚛️',
      color: 'from-purple-400 to-purple-600',
      experiments: 10
    },
    {
      id: 'science',
      name: 'Жаратылыстану',
      icon: '🌍',
      color: 'from-orange-400 to-orange-600',
      experiments: 8
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Қош келдіңіз, {user?.full_name}! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Виртуалды лабораторияда тәжірибелерді қауіпсіз жасаңыз
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Аяқталған</p>
                <p className="text-3xl font-bold text-blue-600">12</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Орташа ұпай</p>
                <p className="text-3xl font-bold text-green-600">85%</p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Қолжетімді</p>
                <p className="text-3xl font-bold text-purple-600">45</p>
              </div>
              <div className="text-4xl">🔬</div>
            </div>
          </motion.div>
        </div>

        {/* Subjects Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Пәндер</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => navigate(`/experiments?subject=${subject.id}`)}
                className={`bg-gradient-to-br ${subject.color} rounded-xl shadow-lg p-6 cursor-pointer text-white`}
              >
                <div className="text-5xl mb-4">{subject.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{subject.name}</h3>
                <p className="text-sm opacity-90">
                  {subject.experiments} тәжірибе
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">
            Жаңа тәжірибе бастауға дайынсыз ба?
          </h3>
          <p className="mb-6 text-lg opacity-90">
            Қызықты тәжірибелерді бастаңыз және білім алыңыз
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/experiments')}
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold text-lg shadow-lg"
          >
            Тәжірибелерді қарау →
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;