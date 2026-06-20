import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import DashboardStats from './components/DashboardStats.jsx';
import ProductForm from './components/ProductForm.jsx';
import ProductList from './components/ProductList.jsx';
import AnalyticsChart from './components/AnalyticsChart.jsx';

function App() {
  // Init theme from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  // Toggle theme class on body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-10 transition-colors duration-200">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b dark:border-gray-800 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Inventory Management System
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your products and stock easily</p>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg font-medium text-sm transition hover:opacity-80"
          >
            {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </header>

        <main>
          <DashboardStats />
          <AnalyticsChart />
          <ProductForm />
          <ProductList />
        </main>
      </div>
    </div>
  );
}

export default App;