// frontend/src/components/auth/AuthPage.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:8000';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    grade: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const formBody = new URLSearchParams();
        formBody.append('username', formData.email);
        formBody.append('password', formData.password);

        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formBody
        });

        if (!response.ok) throw new Error('Кіру сәтсіз аяқталды');

        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        alert(`✅ Сәттілік! Token сақталды`);
        
        // Redirect to experiments page
        window.location.href = '/experiment';
      } else {
        // Register
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            full_name: formData.full_name,
            role: formData.role,
            grade: formData.grade ? parseInt(formData.grade) : null
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || 'Тіркелу сәтсіз аяқталды');
        }

        alert('✅ Тіркелу сәтті! Енді кіре аласыз');
        setIsLogin(true);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Белгісіз қате орын алды');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-6xl mb-4"
          >
            🧪
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Виртуалды Лаборатория
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Жүйеге кіріңіз' : 'Тіркелу'}
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              isLogin
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-600'
            }`}
          >
            Кіру
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              !isLogin
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-600'
            }`}
          >
            Тіркелу
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
          >
            {error}
          </motion.div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Толық аты-жөні
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                placeholder="Мысалы: Айдос Сериков"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
              placeholder="example@mail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Құпия сөз
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Сынып
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                >
                  <option value="">Таңдаңыз</option>
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
                  Рөл
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                >
                  <option value="student">Оқушы</option>
                  <option value="teacher">Мұғалім</option>
                </select>
              </div>
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition disabled:opacity-50"
          >
            {loading ? 'Күте тұрыңыз...' : isLogin ? 'Кіру' : 'Тіркелу'}
          </motion.button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? (
            <p>
              Аккаунт жоқ па?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-600 font-semibold hover:underline"
              >
                Тіркелу
              </button>
            </p>
          ) : (
            <p>
              Аккаунт бар ма?{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-600 font-semibold hover:underline"
              >
                Кіру
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;