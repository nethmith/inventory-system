import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import toast from 'react-hot-toast';

const ProductList = () => {
    const { products, categories, deleteProduct, updateStock, updateProduct, bulkDelete, bulkUpdateStock } = useInventory();

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [editProductId, setEditProductId] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [selectedIds, setSelectedIds] = useState([]);

    // --- Delete Modal State ---
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: '', id: null });

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
        const matchesStock = stockFilter === 'in' ? product.stockQuantity > 0
            : stockFilter === 'out' ? product.stockQuantity === 0 : true;
        return matchesSearch && matchesCategory && matchesStock;
    });

    const handleSelectAll = (e) => {
        if (e.target.checked) setSelectedIds(filteredProducts.map(p => p.id));
        else setSelectedIds([]);
    };

    const handleSelectOne = (id) => {
        if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        else setSelectedIds([...selectedIds, id]);
    };

    // --- Modal Open Functions ---
    const handleBulkDelete = () => {
        setDeleteModal({ isOpen: true, type: 'bulk', id: null });
    };

    const confirmSingleDelete = (id) => {
        setDeleteModal({ isOpen: true, type: 'single', id });
    };

    // --- Execute Delete Action ---
    const executeDelete = () => {
        if (deleteModal.type === 'bulk') {
            bulkDelete(selectedIds);
            setSelectedIds([]);
            toast.success('Selected products deleted! 🗑️');
        } else if (deleteModal.type === 'single') {
            deleteProduct(deleteModal.id);
            toast.success('Product deleted! 🗑️');
        }
        setDeleteModal({ isOpen: false, type: '', id: null }); // Close modal
    };

    const handleBulkStock = (amount) => {
        bulkUpdateStock(selectedIds, amount);
        setSelectedIds([]);
        toast.success('Stock updated for selected products! 📦');
    };

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
        const csvRows = [headers.join(','), ...products.map(p => `${p.sku},"${p.productName}","${p.category}",${p.price},${p.stockQuantity}`)];
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
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200 relative">

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Inventory List</h2>
                <button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold text-sm transition">Export to CSV</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input type="text" placeholder="Search by Name or SKU..." className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:ring-blue-500 outline-none w-full bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <select className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:ring-blue-500 outline-none w-full bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map((cat, index) => <option key={index} value={cat}>{cat}</option>)}
                </select>
                <select className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:ring-blue-500 outline-none w-full bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
                    <option value="">All Stock Status</option>
                    <option value="in">In Stock</option>
                    <option value="out">Out of Stock</option>
                </select>
            </div>

            {selectedIds.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 p-3 mb-4 rounded-md flex justify-between items-center transition-colors duration-200">
                    <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">{selectedIds.length} items selected</span>
                    <div className="space-x-2 flex">
                        <button onClick={() => handleBulkStock(1)} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold">+1 Stock</button>
                        <button onClick={handleBulkDelete} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-semibold">Delete Selected</button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider">
                            <th className="p-3 border-b dark:border-gray-700 w-10">
                                <input type="checkbox" className="w-4 h-4 cursor-pointer" checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length} onChange={handleSelectAll} />
                            </th>
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
                                <tr key={product.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b dark:border-gray-700 transition-colors duration-200 ${selectedIds.includes(product.id) ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}>
                                    <td className="p-3">
                                        <input type="checkbox" className="w-4 h-4 cursor-pointer" checked={selectedIds.includes(product.id)} onChange={() => handleSelectOne(product.id)} />
                                    </td>
                                    {editProductId === product.id ? (
                                        <>
                                            <td className="p-3 text-sm text-gray-500 dark:text-gray-400">{product.sku}</td>
                                            <td className="p-3"><input type="text" value={editFormData.productName} onChange={(e) => setEditFormData({ ...editFormData, productName: e.target.value })} className="border dark:border-gray-600 bg-white dark:bg-gray-800 p-1 w-full rounded outline-none focus:ring-1 focus:ring-blue-500" /></td>
                                            <td className="p-3 text-sm text-gray-500 dark:text-gray-400">{product.category}</td>
                                            <td className="p-3"><input type="number" value={editFormData.price} onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })} className="border dark:border-gray-600 bg-white dark:bg-gray-800 p-1 w-full rounded outline-none focus:ring-1 focus:ring-blue-500" /></td>
                                            <td className="p-3 text-sm text-gray-500 dark:text-gray-400">{product.stockQuantity}</td>
                                            <td className="p-3 flex justify-center space-x-2">
                                                <button onClick={handleSaveEdit} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded font-bold text-sm">Save</button>
                                                <button onClick={() => setEditProductId(null)} className="px-3 py-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded font-bold text-sm">Cancel</button>
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
                                                <button onClick={() => handleEditClick(product)} className="px-2 py-1 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-400 rounded text-sm font-bold">Edit</button>
                                                <button onClick={() => updateStock(product.id, 1)} className="px-2 py-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-400 rounded font-bold">+</button>
                                                <button onClick={() => updateStock(product.id, -1)} disabled={product.stockQuantity <= 0} className="px-2 py-1 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/40 dark:hover:bg-yellow-900/60 text-yellow-700 dark:text-yellow-400 rounded font-bold disabled:opacity-50">-</button>
                                                <button onClick={() => confirmSingleDelete(product.id)} className="px-2 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-400 rounded text-sm font-bold">Delete</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" className="text-center p-6 text-gray-500 dark:text-gray-400">No products found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- Centered Blur Modal for Deletion --- */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-sm transform transition-all">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Confirm Deletion</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                            Are you sure you want to delete {deleteModal.type === 'bulk' ? `these ${selectedIds.length} items` : 'this item'}? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setDeleteModal({ isOpen: false, type: '', id: null })}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-md transition text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition text-sm shadow-sm"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ProductList;