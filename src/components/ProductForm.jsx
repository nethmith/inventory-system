import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useInventory } from '../context/InventoryContext';
import toast from 'react-hot-toast';

const ProductForm = () => {
    const { products, addProduct, categories, addCategory } = useInventory();

    const generateSKU = () => 'PRD-' + Math.floor(100000 + Math.random() * 900000);

    const formik = useFormik({
        initialValues: {
            productName: '',
            sku: generateSKU(),
            category: categories[0] || 'Other',
            newCategory: '',
            price: '',
            stockQuantity: '',
        },
        validationSchema: Yup.object({
            productName: Yup.string().required('Product Name is required'),
            sku: Yup.string().required('Product ID / SKU is required'),
            category: Yup.string().required('Category is required'),
            price: Yup.number().positive('Price must be greater than 0').required('Price is required'),
            stockQuantity: Yup.number().integer('Stock must be a whole number').min(0, 'Cannot be negative').required('Stock is required'),
        }),
        onSubmit: (values, { resetForm }) => {
            // Duplicate Name Check
            const isDuplicate = products.some(
                p => p.productName.toLowerCase().trim() === values.productName.toLowerCase().trim()
            );

            if (isDuplicate) {
                toast.error('A product with this name already exists! 🚫');
                return;
            }

            if (values.newCategory) {
                addCategory(values.newCategory);
                values.category = values.newCategory;
            }

            const productToSave = { ...values };
            delete productToSave.newCategory;

            addProduct(productToSave);
            resetForm();
            formik.setFieldValue('sku', generateSKU());
            toast.success('Product added successfully! 🎉');
        },
    });

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-8 transition-colors duration-200">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Add New Product</h2>

            <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                    <input type="text" name="productName" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.productName} className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200 ${formik.touched.productName && formik.errors.productName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
                    {formik.touched.productName && formik.errors.productName && <div className="text-red-500 text-xs mt-1">{formik.errors.productName}</div>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product ID (SKU)</label>
                    <input type="text" name="sku" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.sku} readOnly className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 cursor-not-allowed outline-none transition-colors duration-200" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select name="category" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.category} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200">
                        {categories.map((cat, index) => <option key={index} value={cat}>{cat}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Or Add Custom Category</label>
                    <input type="text" name="newCategory" placeholder="Type new category..." onChange={formik.handleChange} value={formik.values.newCategory} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200" />
                </div>

                <div className="grid grid-cols-2 gap-4 md:col-span-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price ($)</label>
                        <input type="number" name="price" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.price} className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200 ${formik.touched.price && formik.errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
                        {formik.touched.price && formik.errors.price && <div className="text-red-500 text-xs mt-1">{formik.errors.price}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial Stock</label>
                        <input type="number" name="stockQuantity" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.stockQuantity} className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200 ${formik.touched.stockQuantity && formik.errors.stockQuantity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
                        {formik.touched.stockQuantity && formik.errors.stockQuantity && <div className="text-red-500 text-xs mt-1">{formik.errors.stockQuantity}</div>}
                    </div>
                </div>

                <div className="md:col-span-2 mt-2">
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200">
                        Add Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;