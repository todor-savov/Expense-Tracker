import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthContext from './context/AuthContext.tsx';
import Authenticated from './hoc/Authenticated.tsx';
import HomePublicView from './views/HomePublicView/HomePublicView.tsx';
import HomePrivateView from './views/HomePrivateView/HomePrivateView.tsx';
import RegisterView from './views/RegisterView/RegisterView.tsx';
import LoginView from './views/LoginView/LoginView.tsx';
import ProfileView from './views/ProfileView/ProfileView.tsx';
import TransactionsView from './views/TransactionsView/TransactionsView.tsx';
import EditTransactionView from './views/EditTransactionView/EditTransactionView.tsx';
import AddTransactionView from './views/AddTransactionView/AddTransactionView.tsx';
import CategoriesView from './views/CategoriesView/CategoriesView.tsx';
import OverviewView from './views/OverviewView/OverviewView.tsx';
import ForgotPasswordView from './views/ForgotPasswordView/ForgotPasswordView.tsx';
import ResetPasswordView from './views/ResetPasswordView/ResetPasswordView.tsx';
import SettingsView from './views/SettingsView/SettingsView.tsx';
import AboutView from './views/AboutView/AboutView.tsx';
import FaqView from './views/FaqView/FaqView.tsx';
import BudgetGoalsView from './views/BudgetGoalsView/BudgetGoalsView.tsx';
import './App.css';

interface UserSettings {
  activityNotifications: string;
  activityNotificationLimit: number;
  budgetNotifications: string;
  budgetNotificationLimit: number;
  currency: string;
}

function App() {
  const [authValue, setAuthValue] = useState({status: false, user: ''});
  const [userSettings, setUserSettings] = useState<UserSettings|null>(null);

  return (
      <BrowserRouter>
        <AuthContext.Provider value={{  isLoggedIn: authValue, setLoginState: setAuthValue, 
                                        settings: userSettings, setSettings: setUserSettings
                                    }}>
            <div className="main-layout">
                <Routes>
                  <Route path="/" element={<HomePublicView />} />
                  <Route path="/register" element={<RegisterView />} />
                  <Route path="/login" element={<LoginView />} />
                  <Route path="/forgot-password" element={<ForgotPasswordView />} />
                  <Route path="/reset-password" element={<ResetPasswordView />} />
                  <Route path="/about" element={<AboutView />} />
                  <Route path="/faq" element={<FaqView />} />
                  <Route path="/home" element={<Authenticated> <HomePrivateView /> </Authenticated>} />
                  <Route path="/profile" element={<Authenticated> <ProfileView /> </Authenticated>} />
                  <Route path="/transactions" element={<Authenticated> <TransactionsView /> </Authenticated>} />
                  <Route path="/add-transaction" element={<Authenticated> <AddTransactionView /> </Authenticated>} />
                  <Route path="/edit-transaction/:id" element={<Authenticated> <EditTransactionView /> </Authenticated>} />
                  <Route path="/categories" element={<Authenticated> <CategoriesView /> </Authenticated>} />
                  <Route path="/overview" element={<Authenticated> <OverviewView /> </Authenticated>} />
                  <Route path="/settings" element={<Authenticated> <SettingsView /> </Authenticated>} />
                  <Route path='/budget-goals' element={<Authenticated> <BudgetGoalsView /> </Authenticated>} />
                </Routes>
            </div>
        </AuthContext.Provider>
      </BrowserRouter>
  )
}

export default App;
