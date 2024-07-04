import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Transactions from './views/Transactions.tsx';
import AddTransaction from './components/AddTransaction/AddTransaction.tsx';
import UploadReceipt from './components/UploadReceipt/UploadReceipt.tsx';
import './App.css';

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/add-transaction" element={<AddTransaction />} />
      <Route path="/upload-receipt" element={<UploadReceipt/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App;
