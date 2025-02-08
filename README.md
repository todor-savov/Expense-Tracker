# Expense Tracker

## Overview
The **Expense Tracker** is a web application built with **React, TypeScript, and Firebase** that allows users to track their expenses efficiently. The application provides a user-friendly interface with expense categorization, detailed chart analytics and a seamless user experience.

## Features
- ✅ **User Authentication**: Secure login and signup using Firebase Authentication.
- ✅ **Expense Tracking**: Add, edit, and delete expense entries.
- ✅ **Categorization**: Assign categories to transactions for better organization.
- ✅ **Analytics**: Visual representation of financial data using charts.
- ✅ **Filter & Search**: Easily find specific transactions based on date, category, or amount.
- ✅ **Currency Support**: Select preferred currency for financial entries.
- ✅ **Responsive Design**: Works seamlessly on desktop and mobile devices.

## 🛠 Tech Stack
- **Frontend**: React, TypeScript, Material UI
- **Backend & Database**: Firebase (Realtime Database, Authentication, Storage)
- **Deployment**: Hosted on Vercel

## 🚀 Installation
To run the project locally, follow these steps:

1. **Clone the repository:**
   ```sh
   git clone https://github.com/todor-savov/expense-tracker.git
   ```
2. **Navigate to the project directory:**
   ```sh
   cd expense-tracker
   ```
3. **Install dependencies:**
   ```sh
   npm install
   ```
4. **Create a Firebase project:**
   - Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
   - Enable **Authentication**, **Firebase Realtime Database**, and **Storage** from the Firebase dashboard.
   - Generate Firebase credentials from **Project Settings > General > Your Apps > Config**.
5. **Set up Firebase environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following environment variables (the example below uses Vite for project setup):
     ```sh
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_DATABASE_URL=your_database_url
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
     ```
   - **Ensure `.env` is added to `.gitignore` to prevent exposing credentials.**
6. **Start the development server:**
   ```sh
   npm start
   ```
7. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🚢 Deployment
The application is deployed on **Vercel**. To deploy your own version:

1. **Push the latest changes to GitHub.**
2. **Connect your repository to Vercel.**
3. **Configure environment variables in Vercel.**
4. **Deploy the project.**

## 🤝 Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

## 📜 License
This project is licensed under the **MIT License**.

## 📬 Contact
For any inquiries, feel free to reach out:
- **GitHub**: [todor-savov](https://github.com/todor-savov)
- **Email**: [todor.s.savov@gmail.com](mailto:todor.s.savov@gmail.com)
