import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors()); // Enable CORS for all routes

app.get('/api/exchange-rate', async (req, res) => {
    const baseCurrency = req.query.baseCurrency || 'BGN';
  
    try {
      const response = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.VITE_EXCHANGE_RATE_API_KEY}/latest/${baseCurrency}`);
      const data = await response.json();
  
      if (data.result === 'error') {
        return res.status(500).json({ error: 'Failed to fetch exchange rates' });
      }

      const rates = data.conversion_rates;
      res.json({ rates });
    } catch (error) {
      res.status(500).send('Error fetching exchange rates.');
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });