import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthContext from './context/AuthContext.tsx';
import Authenticated from './hoc/Authenticated.tsx';
import Navigation from './components/Navigation/Navigation.tsx';
import Home from './views/Home/Home.tsx';
import Login from './components/Login/Login.tsx';
import Transactions from './views/Transactions.tsx';
import AddTransaction from './components/AddTransaction/AddTransaction.tsx';
import Overview from './components/Overview/Overview.tsx';
import './App.css';

function App() {
  const [authValue, setAuthValue] = useState({status: false, user: ''});

  return (
      <BrowserRouter>
        <AuthContext.Provider value={{ isLoggedIn: authValue, setLoginState: setAuthValue }}>
          <div className="app-container">
              <Navigation />
              <div className="content">
                <Routes>
                  <Route path="/" element={<Authenticated><Home /></Authenticated>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/transactions" element={<Authenticated><Transactions /></Authenticated>} />
                  <Route path="/add-transaction" element={<Authenticated><AddTransaction mode="new" /></Authenticated>} />
                  <Route path="/edit-transaction/:id" element={<Authenticated><AddTransaction mode="edit" /></Authenticated>} />
                  <Route path="/overview" element={<Authenticated><Overview /></Authenticated>} />
                </Routes>
              </div>
          </div>
        </AuthContext.Provider>
      </BrowserRouter>
  )
}

export default App;
