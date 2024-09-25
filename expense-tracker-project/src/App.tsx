import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthContext from './context/AuthContext.tsx';
import Authenticated from './hoc/Authenticated.tsx';
import Home from './views/Home/Home.tsx';
import Transactions from './views/Transactions.tsx';
import AddTransaction from './components/AddTransaction/AddTransaction.tsx';
import Header from './components/Header/Header.tsx';
import HomePublic from './views/Home/HomePublic.tsx';
import ProfileView from './views/ProfileView/ProfileView.tsx';
import './App.css';
import CategoriesView from './views/CategoriesView/CategoriesView.tsx';
import OverviewView from './views/OverviewView/OverviewView.tsx';
import EditTransactionView from './views/EditTransactionView/EditTransactionView.tsx';
import LoginView from './views/LoginView/LoginView.tsx';
import RegisterView from './views/RegisterView/RegisterView.tsx';

function App() {
  const [authValue, setAuthValue] = useState({status: false, user: ''});

  return (
      <BrowserRouter>
        <AuthContext.Provider value={{ isLoggedIn: authValue, setLoginState: setAuthValue }}>
                <Routes>
                  <Route path="/" element={
                    <>
                      <div className="header-container"> <Header from={"Home"} /> </div>
                      <HomePublic />
                    </>                  
                  } />
                  <Route path="/login" element={<LoginView />} />
                  <Route path="/register" element={<RegisterView />} />
                  <Route path="/home" element={
                    <Authenticated>
                        <div className="header-container"> <Header from={"Recent Transactions"} /> </div>
                        <Home />
                    </Authenticated>
                  } />
                  <Route path="/transactions" element={
                    <Authenticated>
                      <div className="header-container"> <Header from={"Transactions"} /> </div>
                      <Transactions />
                    </Authenticated>
                  } />
                  <Route path="/add-transaction" element={
                    <Authenticated>
                      <div className="header-container"> <Header from={"Add Transaction"} /> </div>
                      <AddTransaction mode="new" />
                    </Authenticated>
                  } />
                  <Route path="/edit-transaction/:id" element={<Authenticated> <EditTransactionView /> </Authenticated> } />
                  <Route path="/overview" element={<Authenticated> <OverviewView /> </Authenticated> } />
                  <Route path="/categories" element={<Authenticated> <CategoriesView /> </Authenticated>} />
                  <Route path="/profile" element={<Authenticated> <ProfileView /> </Authenticated>} />
                </Routes>
        </AuthContext.Provider>
      </BrowserRouter>
  )
}

export default App;
