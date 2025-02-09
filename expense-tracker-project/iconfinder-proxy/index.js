import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors()); // Enable CORS for all routes

app.get('/api/icons', async (req, res) => {
  const query = req.query.query || 'default';
  const count = req.query.count || 20;

  try {
    const response = await fetch(`https://api.iconfinder.com/v4/icons/search?query=${query}&count=${count}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_ICON_FINDER_API_KEY}`
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).send('Error fetching icons from IconFinder API.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});