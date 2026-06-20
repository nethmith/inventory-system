import React from 'react';
import { useInventory } from '../context/InventoryContext';

const DashboardStats = () => {
    const { products, categories } = useInventory();

    // Calculate statistics
    const totalProducts = products.length;

    const totalInventoryValue = products.reduce((total, product) => {
        return total + (Number(product.price) * Number(product.stockQuantity));
    }, 0);

    const outOfStockCount = products.filter(p => Number(p.stockQuantity) === 0).length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Total Products */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm">
                <h3 className="text-blue-600 text-xs font-bold uppercase tracking-wider">Total Products</h3>
                <p className="text-3xl font-bold text-blue-900 mt-2">{totalProducts}</p>
            </div>

            {/* Total Value */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-100 shadow-sm">
                <h3 className="text-green-600 text-xs font-bold uppercase tracking-wider">Total Inventory Value</h3>
                <p className="text-3xl font-bold text-green-900 mt-2">${totalInventoryValue.toFixed(2)}</p>
            </div>

            {/* Out of Stock */}
            <div className="bg-red-50 p-4 rounded-lg border border-red-100 shadow-sm">
                <h3 className="text-red-600 text-xs font-bold uppercase tracking-wider">Out of Stock Items</h3>
                <p className="text-3xl font-bold text-red-900 mt-2">{outOfStockCount}</p>
            </div>

            {/* Categories */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 shadow-sm">
                <h3 className="text-purple-600 text-xs font-bold uppercase tracking-wider">Total Categories</h3>
                <p className="text-3xl font-bold text-purple-900 mt-2">{categories.length}</p>
            </div>
        </div>
    );
};

export default DashboardStats;