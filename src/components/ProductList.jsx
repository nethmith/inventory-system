import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

const ProductList = () => {
    const { products, categories, deleteProduct, updateStock } = useInventory();

    // States for search and filters
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');

    // Filter logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
        const matchesStock = stockFilter === 'in' ? product.stockQuantity > 0
            : stockFilter === 'out' ? product.stockQuantity === 0
                : true;

        return matchesSearch && matchesCategory && matchesStock;
    });

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Inventory List</h2>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by Name or SKU..."
                    className="border border-gray-300 p-2 rounded-md focus:ring-blue-500 outline-none w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    className="border border-gray-300 p-2 rounded-md focus:ring-blue-500 outline-none w-full"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                    ))}
                </select>

                <select
                    className="border border-gray-300 p-2 rounded-md focus:ring-blue-500 outline-none w-full"
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
                        <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                            <th className="p-3 border-b">SKU</th>
                            <th className="p-3 border-b">Product Name</th>
                            <th className="p-3 border-b">Category</th>
                            <th className="p-3 border-b">Price</th>
                            <th className="p-3 border-b">Stock</th>
                            <th className="p-3 border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50 border-b">
                                    <td className="p-3 text-sm text-gray-500">{product.sku}</td>
                                    <td className="p-3 font-medium">{product.productName}</td>
                                    <td className="p-3">{product.category}</td>
                                    <td className="p-3">${Number(product.price).toFixed(2)}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${product.stockQuantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.stockQuantity > 0 ? `${product.stockQuantity} In Stock` : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td className="p-3 flex justify-center space-x-2">
                                        {/* Stock Actions */}
                                        <button onClick={() => updateStock(product.id, 1)} className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-bold" title="Add Stock">
                                            +
                                        </button>
                                        <button onClick={() => updateStock(product.id, -1)} disabled={product.stockQuantity <= 0} className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 font-bold disabled:opacity-50" title="Reduce Stock">
                                            -
                                        </button>
                                        {/* Delete Action */}
                                        <button onClick={() => deleteProduct(product.id)} className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center p-6 text-gray-500">
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