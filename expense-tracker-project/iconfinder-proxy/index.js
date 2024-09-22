import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors()); // Enable CORS for all routes

app.get('/api/icons', async (req, res) => {
  const query = req.query.query || 'default';
  const count = req.query.count || 20;

  console.log(`Fetching icons for query: ${query} and count: ${count}`);

  try {
    const response = await fetch(`https://api.iconfinder.com/v4/icons/search?query=${query}&count=${count}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer TFSDEF1JlpHXluuAhZvOxRijfrEGZRE3mVm61M6ZEusHxRhVxTXDphHKp8N1baVk`
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