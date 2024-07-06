import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthContext from './context/AuthContext.tsx';
import Transactions from './views/Transactions.tsx';
import AddTransaction from './components/AddTransaction/AddTransaction.tsx';
import Login from './components/Login/Login.tsx';
import './App.css';

function App() {
  const [authValue, setAuthValue] = useState({status: false, user: ''});

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ isLoggedIn: authValue, setLoginState: setAuthValue }}>
        <Routes>
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/add-transaction" element={<AddTransaction />} />
          <Route path="/login" element={<Login />} />
          <Route path="/edit-transaction/:id" element={<AddTransaction mode={"edit"} />} />
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

export default App;
