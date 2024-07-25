import './App.css';
import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthContext from './context/AuthContext.tsx';
import Authenticated from './hoc/Authenticated.tsx';
import Home from './views/Home/Home.tsx';
import Login from './components/Login/Login.tsx';
import Transactions from './views/Transactions.tsx';
import AddTransaction from './components/AddTransaction/AddTransaction.tsx';
import Overview from './components/Overview/Overview.tsx';
import Header from './components/Header/Header.tsx';

function App() {
  const [authValue, setAuthValue] = useState({status: false, user: ''});

  return (
      <BrowserRouter>
        <AuthContext.Provider value={{ isLoggedIn: authValue, setLoginState: setAuthValue }}>
                <Routes>
                  <Route path="/" element={<Authenticated><Header from={"Home (Latest Transactions)"} /> <Home /></Authenticated>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/transactions" element={<Authenticated><Header from={"Transactions"} /> <Transactions /></Authenticated>} />
                  <Route path="/add-transaction" element={<Authenticated><Header from={"Add Transaction"} /> <AddTransaction mode="new" /></Authenticated>} />
                  <Route path="/edit-transaction/:id" element={<Authenticated><Header from={"Edit Transaction"} /> <AddTransaction mode="edit" /></Authenticated>} />
                  <Route path="/overview" element={<Authenticated><Header from={"Overview"} /> <Overview /></Authenticated>} />
                </Routes>
        </AuthContext.Provider>
      </BrowserRouter>
  )
}

export default App;
