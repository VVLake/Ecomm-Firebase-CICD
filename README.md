## React E-commerce App
A full-stack e-commerce web application built with React, Redux Toolkit, and Firebase (Authentication & Firestore).
This app allows users to browse products, manage their cart, register/login, place orders, and view order history. Admin users can manage products with full CRUD operations.
--
## Features
User Authentication (Email/Password) with Firebase Authentication
Firestore database to store users, products, and orders
Product Management (Create, Read, Update, Delete)
Cart functionality powered by Redux Toolkit
Order placement and viewing past orders
Responsive UI using React functional components and hooks
Secure user profile and order management
--
## Technologies Used
React
Redux Toolkit
Firebase Authentication & Firestore
React Router DOM
React Firebase Hooks
Vite (or Create React App)
--
## Getting Started

## Prerequisites
Node.js (v16 or newer recommended)
Firebase account
Installation and Setup
Clone the repository
git clone (https://github.com/VVLake/Ecomm-Firebase-CICD.git)
Install dependencies
    - npm install

Configure Firebase
Create a Firebase project at Firebase Console
Enable Email/Password authentication method
Create Firestore database with collections: users, products, orders
Obtain Firebase config and update src/firebaseConfig.js with your project credentials
Run the Development server
npm run dev

--

## Project Structure

src/
components/ – React components like CheckoutPage, ProductManager, etc.
features/ – Redux slices (cartSlice, userSlice, etc.)
utils/ – Firebase helper functions (productService.js, orderService.js)
firebaseConfig.js – Firebase app configuration and initialization
App.jsx – Root component containing route layout and logic
main.jsx – Application entry point
--

Available Scripts

npm run dev – Start development server
npm run build – Build for production
npm run preview – Preview production build locally
--

## Deployed Website

Thank you for checking out the project!

--

Author: Valeria Lake LinkedIn: (www.linkedin.com/in/valerialake95gi)