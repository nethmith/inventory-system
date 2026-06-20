# Inventory Management System

A simple, frontend-only Inventory Management System built with React and Tailwind CSS. This application allows users to manage products, track stock levels, and view inventory statistics, with all data persisting in the browser's `localStorage`.

## 🚀 Features Implemented

* **Dashboard Stats:** Quick overview of total products, total inventory value, out-of-stock items, and categories.
* **Product Management:** Add, delete, and view products.
* **Form Validation:** Integrated Formik and Yup for robust form validation (e.g., required fields, positive prices).
* **Stock Management:** Increase or decrease stock levels safely (prevents negative stock).
* **Search & Filtering:** Search by Product Name/SKU, and filter by Category or Stock Status.
* **Data Persistence:** Uses Context API + `localStorage` to save data without a backend.
* **Responsive UI:** Clean, modern layout built with Tailwind CSS.

## 🛠️ Tech Stack

* React.js (Vite)
* Tailwind CSS
* Formik + Yup
* Context API + LocalStorage
* UUID (for unique IDs)

## 🏃‍♂️ How to Run Locally

1. Clone the repository:
   ```bash
   git clone [https://github.com/nethmith/inventory-system.git](https://github.com/nethmith/inventory-system.git)

2. Navigate to the project directory:
    ```bash
    cd inventory-system
    
3. Install dependencies:
    ```bash
    npm install

4. Start the development server:
    ```bash
    npm run dev
    Open your browser and visit http://localhost:5173


