import React from 'react';
import { useInventory } from '../context/InventoryContext';

const StockHistoryLog = () => {
    const { logs } = useInventory();

    if (logs.length === 0) return null; // No logs to display, so we return null to avoid rendering an empty section

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-8 transition-colors duration-200">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Stock History Log</h2>

            <div className="overflow-y-auto max-h-60 border border-gray-200 dark:border-gray-700 rounded-md">
                <table className="min-w-full text-left border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 uppercase tracking-wider sticky top-0">
                            <th className="p-3 border-b dark:border-gray-700">Date & Time</th>
                            <th className="p-3 border-b dark:border-gray-700">Product Name</th>
                            <th className="p-3 border-b dark:border-gray-700">Action</th>
                            <th className="p-3 border-b dark:border-gray-700">Quantity</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 dark:text-gray-300">
                        {logs.map(log => (
                            <tr key={log.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="p-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{log.date}</td>
                                <td className="p-3 font-medium text-gray-800 dark:text-gray-100">{log.productName}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${log.action.includes('Added') ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400'}`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="p-3 font-bold">
                                    {log.action.includes('Reduced') ? <span className="text-red-500">-{log.amount}</span> : <span className="text-green-500">+{log.amount}</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockHistoryLog;