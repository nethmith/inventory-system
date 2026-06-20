import React from 'react';
import DashboardStats from './components/DashboardStats.jsx';
import ProductForm from './components/ProductForm.jsx';
import ProductList from './components/ProductList.jsx';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Inventory Management System
          </h1>
          <p className="text-gray-500 mt-1">Manage your products and stock easily</p>
        </header>

        <main>
          {/* 1. Dashboard Stats */}
          <DashboardStats />

          {/* 2. Add Product Form */}
          <ProductForm />

          {/* 3. Product Table and Filters */}
          <ProductList />
        </main>
      </div>
    </div>
  );
}

export default App;