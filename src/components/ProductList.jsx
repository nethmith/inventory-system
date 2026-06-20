import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import toast from 'react-hot-toast';

const ProductList = () => {
    const { products, categories, deleteProduct, updateStock, updateProduct } = useInventory();

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');

    const [editProductId, setEditProductId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
        const matchesStock = stockFilter === 'in' ? product.stockQuantity > 0
            : stockFilter === 'out' ? product.stockQuantity === 0 : true;
        return matchesSearch && matchesCategory && matchesStock;
    });

    const handleEditClick = (product) => {
        setEditProductId(product.id);
        setEditFormData(product);
    };

    const handleSaveEdit = () => {
        updateProduct(editProductId, editFormData);
        setEditProductId(null);
        toast.success('Product updated successfully! ✏️');
    };

    const exportToCSV = () => {
        if (products.length === 0) {
            toast.error('No products to export!');
            return;
        }
        const headers = ['SKU', 'Product Name', 'Category', 'Price', 'Stock Quantity'];
        const csvRows = [
            headers.join(','),
            ...products.map(p => `${p.sku},"${p.productName}","${p.category}",${p.price},${p.stockQuantity}`)
        ];
        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "inventory_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Exported to CSV successfully! 📥');
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Inventory List</h2>
                <button
                    onClick={exportToCSV}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold text-sm transition"
                >
                    Export to CSV
                </button>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by Name or SKU..."
                    className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:ring-blue-500 outline-none w-full bg-white dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:ring-blue-500 outline-none w-full bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                    ))}
                </select>
                <select
                    className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:ring-blue-500 outline-none w-full bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                >
                    <option value="">All Stock Status</option>
                    <option value="in">In Stock</option>
                    <option value="out">Out of Stock</option>
                </select>
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider transition-colors duration-200">
                            <th className="p-3 border-b dark:border-gray-700">SKU</th>
                            <th className="p-3 border-b dark:border-gray-700">Product Name</th>
                            <th className="p-3 border-b dark:border-gray-700">Category</th>
                            <th className="p-3 border-b dark:border-gray-700">Price</th>
                            <th className="p-3 border-b dark:border-gray-700">Stock</th>
                            <th className="p-3 border-b dark:border-gray-700 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 dark:text-gray-300">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b dark:border-gray-700 transition-colors duration-200">
                                    {editProductId === product.id ? (
                                        <>
                                            <td className="p-3 text-sm text-gray-500 dark:text-gray-400">{product.sku}</td>
                                            <td className="p-3">
                                                <input type="text" value={editFormData.productName} onChange={(e) => setEditFormData({ ...editFormData, productName: e.target.value })} className="border dark:border-gray-600 bg-white dark:bg-gray-800 p-1 w-full rounded" />
                                            </td>
                                            <td className="p-3 text-sm text-gray-500 dark:text-gray-400">{product.category}</td>
                                            <td className="p-3">
                                                <input type="number" value={editFormData.price} onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })} className="border dark:border-gray-600 bg-white dark:bg-gray-800 p-1 w-full rounded" />
                                            </td>
                                            <td className="p-3 text-sm text-gray-500 dark:text-gray-400">{product.stockQuantity}</td>
                                            <td className="p-3 flex justify-center space-x-2">
                                                <button onClick={handleSaveEdit} className="px-3 py-1 bg-green-500 text-white rounded font-bold text-sm">Save</button>
                                                <button onClick={() => setEditProductId(null)} className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded font-bold text-sm">Cancel</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="p-3 text-sm text-gray-500 dark:text-gray-400">{product.sku}</td>
                                            <td className="p-3 font-medium text-gray-800 dark:text-gray-100">{product.productName}</td>
                                            <td className="p-3">{product.category}</td>
                                            <td className="p-3">${Number(product.price).toFixed(2)}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${product.stockQuantity > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                                                    {product.stockQuantity > 0 ? `${product.stockQuantity} In Stock` : 'Out of Stock'}
                                                </span>
                                            </td>
                                            <td className="p-3 flex justify-center space-x-2">
                                                <button onClick={() => handleEditClick(product)} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 rounded text-sm font-bold">Edit</button>
                                                <button onClick={() => updateStock(product.id, 1)} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded font-bold">+</button>
                                                <button onClick={() => updateStock(product.id, -1)} disabled={product.stockQuantity <= 0} className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 rounded font-bold disabled:opacity-50">-</button>
                                                <button onClick={() => deleteProduct(product.id)} className="px-2 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 rounded text-sm">Delete</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center p-6 text-gray-500 dark:text-gray-400">
                                    No products found. Add a product to get started!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;