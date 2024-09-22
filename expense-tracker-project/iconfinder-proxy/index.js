import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/icons', async (req, res) => {
  const query = req.query.query || 'default';
  const count = req.query.count || 20;

  try {
    const response = await fetch(`https://api.iconfinder.com/v4/icons/search?query=${query}&count=${count}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer TFSDEF1JlpHXluuAhZvOxRijfrEGZRE3mVm61M6ZEusHxRhVxTXDphHKp8N1baVk`,        
        'Content-Type': 'application/json'
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