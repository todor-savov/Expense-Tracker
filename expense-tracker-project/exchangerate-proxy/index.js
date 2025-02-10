import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors()); // Enable CORS for all routes

app.get('/api/exchange-rate', async (req, res) => {
    const base = req.query.base || 'USD'; // Default base currency
    const target = req.query.target || 'EUR'; // Default target currency
  
    try {
      const response = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.VITE_EXCHANGE_RATE_API_KEY}/latest/${base}`);
      const data = await response.json();
  
      if (data.result === 'error') {
        return res.status(500).json({ error: 'Failed to fetch exchange rates' });
      }
  
      const rate = data.conversion_rates[target];
      res.json({ base, target, rate });
    } catch (error) {
      res.status(500).send('Error fetching exchange rates.');
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });