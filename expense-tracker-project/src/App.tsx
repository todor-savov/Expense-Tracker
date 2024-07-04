import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Transactions from './views/Transactions';
import './App.css';

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/transactions" element={<Transactions />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App;
