import { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
    // Init products state
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('products');
        return saved ? JSON.parse(saved) : [];
    });

    // Init categories state
    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem('categories');
        return saved ? JSON.parse(saved) : ['Electronics', 'Clothing', 'Food', 'Other'];
    });

    // Sync products to local storage
    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);

    // Sync categories to local storage
    useEffect(() => {
        localStorage.setItem('categories', JSON.stringify(categories));
    }, [categories]);

    // Add new product
    const addProduct = (product) => {
        setProducts([...products, { ...product, id: uuidv4() }]);
    };

    // Update product details
    const updateProduct = (id, updatedProduct) => {
        setProducts(products.map(p => p.id === id ? { ...updatedProduct, id } : p));
    };

    // Remove product
    const deleteProduct = (id) => {
        setProducts(products.filter(p => p.id !== id));
    };

    // Update stock levels
    const updateStock = (id, amount) => {
        setProducts(products.map(p => {
            if (p.id === id) {
                const newStock = Math.max(0, Number(p.stockQuantity) + amount);
                return { ...p, stockQuantity: newStock };
            }
            return p;
        }));
    };

    // Add custom category
    const addCategory = (category) => {
        if (category && !categories.includes(category)) {
            setCategories([...categories, category]);
        }
    };

    return (
        <InventoryContext.Provider value={{
            products, categories, addProduct, updateProduct, deleteProduct, updateStock, addCategory,
        }}>
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventory = () => useContext(InventoryContext);