import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useInventory } from '../context/InventoryContext';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const AnalyticsChart = () => {
    const { products, categories } = useInventory();

    // Prepare data: Count products per category
    const categoryData = categories.map(category => {
        const count = products.filter(p => p.category === category).length;
        return { name: category, value: count };
    }).filter(item => item.value > 0); // Only show categories that have products

    // Don't show chart if no products exist
    if (products.length === 0) return null;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-8 transition-colors duration-200">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Category Distribution</h2>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            label
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalyticsChart;