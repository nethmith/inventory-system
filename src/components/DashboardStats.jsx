import React from 'react';
import { useInventory } from '../context/InventoryContext';

const DashboardStats = () => {
    const { products, categories } = useInventory();

    const totalProducts = products.length;
    const totalInventoryValue = products.reduce((total, p) => total + (Number(p.price) * Number(p.stockQuantity)), 0);
    const outOfStockCount = products.filter(p => Number(p.stockQuantity) === 0).length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Total Products */}
            <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-lg border border-blue-100 dark:border-blue-900 shadow-sm">
                <h3 className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase">Total Products</h3>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-200 mt-2">{totalProducts}</p>
            </div>

            {/* Total Value */}
            <div className="bg-green-50 dark:bg-green-950/40 p-4 rounded-lg border border-green-100 dark:border-green-900 shadow-sm">
                <h3 className="text-green-600 dark:text-green-400 text-xs font-bold uppercase">Total Value</h3>
                <p className="text-3xl font-bold text-green-900 dark:text-green-200 mt-2">${totalInventoryValue.toFixed(2)}</p>
            </div>

            {/* Out of Stock */}
            <div className="bg-red-50 dark:bg-red-950/40 p-4 rounded-lg border border-red-100 dark:border-red-900 shadow-sm">
                <h3 className="text-red-600 dark:text-red-400 text-xs font-bold uppercase">Out of Stock</h3>
                <p className="text-3xl font-bold text-red-900 dark:text-red-200 mt-2">{outOfStockCount}</p>
            </div>

            {/* Categories */}
            <div className="bg-purple-50 dark:bg-purple-950/40 p-4 rounded-lg border border-purple-100 dark:border-purple-900 shadow-sm">
                <h3 className="text-purple-600 dark:text-purple-400 text-xs font-bold uppercase">Categories</h3>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-200 mt-2">{categories.length}</p>
            </div>
        </div>
    );
};

export default DashboardStats;