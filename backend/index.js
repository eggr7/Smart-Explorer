require('dotenv').config();
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/api/openai', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a tourism expert. Make concise, friendly suggestions for places to visit based on the user's question. Speak briefly and clearly (to save tokens). Ask follow-up questions about preferences if their request is vague, e.g. 'What kind of places do you like? History, food, nature, or art?'. Always give specific recommendations when possible."
          },
          { role: "user", content: prompt }
        ],
        max_tokens: 64,
        temperature: 0.6
      })
    });
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "I'm sorry, I couldn't generate a response.";
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Error with OpenAI API', info: error.message });
  }
});

app.get('/', (req, res) => res.send('OpenAI backend running!'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`Server listening on port ${PORT}`));
