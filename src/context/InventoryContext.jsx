import { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('products');
        return saved ? JSON.parse(saved) : [];
    });

    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem('categories');
        return saved ? JSON.parse(saved) : ['Electronics', 'Clothing', 'Food', 'Other'];
    });

    // --- New State for Stock History Logs ---
    const [logs, setLogs] = useState(() => {
        const saved = localStorage.getItem('inventoryLogs');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        localStorage.setItem('categories', JSON.stringify(categories));
    }, [categories]);

    useEffect(() => {
        localStorage.setItem('inventoryLogs', JSON.stringify(logs));
    }, [logs]);

    // Add Log Helper Function
    const addLog = (productName, action, amount) => {
        const newLog = {
            id: uuidv4(),
            productName,
            action,
            amount,
            date: new Date().toLocaleString()
        };
        setLogs((prev) => [newLog, ...prev].slice(0, 50)); // Keep only the latest 50 logs
    };

    const addProduct = (product) => {
        setProducts([...products, { ...product, id: uuidv4() }]);
    };

    const updateProduct = (id, updatedProduct) => {
        setProducts(products.map(p => p.id === id ? { ...updatedProduct, id } : p));
    };

    const deleteProduct = (id) => {
        setProducts(products.filter(p => p.id !== id));
    };

    const updateStock = (id, amount) => {
        setProducts(products.map(p => {
            if (p.id === id) {
                const newStock = Math.max(0, Number(p.stockQuantity) + amount);
                if (newStock !== p.stockQuantity) {
                    addLog(p.productName, amount > 0 ? 'Stock Added' : 'Stock Reduced', Math.abs(amount));
                }
                return { ...p, stockQuantity: newStock };
            }
            return p;
        }));
    };

    const addCategory = (category) => {
        if (category && !categories.includes(category)) {
            setCategories([...categories, category]);
        }
    };

    const bulkDelete = (ids) => {
        setProducts(products.filter(p => !ids.includes(p.id)));
    };

    const bulkUpdateStock = (ids, amount) => {
        setProducts(products.map(p => {
            if (ids.includes(p.id)) {
                addLog(p.productName, 'Bulk Stock Added', amount);
                return { ...p, stockQuantity: Math.max(0, Number(p.stockQuantity) + amount) };
            }
            return p;
        }));
    };

    return (
        <InventoryContext.Provider value={{
            products, categories, logs, addProduct, updateProduct, deleteProduct, updateStock, addCategory,
            bulkDelete, bulkUpdateStock
        }}>
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventory = () => useContext(InventoryContext);