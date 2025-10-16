import express from 'express';
import fs from 'fs'
import path from 'path'
import ollama from 'ollama'

const app = express();
const port = process.env.PORT || 3009;
const host = '0.0.0.0';

app.use(express.json());

app.get('/api/hello', (req, res) => {
    console.log("body:", req.body);
    res.send('Hello from the backend!');
});

app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
});

const llmCache = new Map();

const systemPrompt = fs.readFileSync(
  path.resolve('./emojiPrompt.md'),
  'utf-8'
);

const config = {
    temperature: 0.0,
    top_p: 0.01,
    top_k: 1,
    seed: 42,
};

const translateEmoji = async (value, model) => {
    const cached = checkCache(value);
    if (cached) {
        return cached;
    }



    const llmResponse = await ollama.chat({
        model: model,
        messages: [
            {role: 'system', content: systemPrompt},
            {role:'user', content: value}
        ],
        stream: false,
        options: {
            temperature: config.temperature,
            top_p: config.top_p,
            top_k: config.top_k,
            seed: config.seed,
        },
        format: {
            type: "object",
            properties: {
                translation: { type: "string" }
            }
        }
    });
    // const result = "LLM Translation for: " + (value ? value.trimStart() : "" + llmResponse);
    const result = llmResponse.message?.content?.trim() || "";
    const translation = JSON.parse(result).translation || "";
    llmCache.set(value, translation);
    return translation;
};

const checkCache = (value) => {
    if (llmCache.has(value)) {
        return llmCache.get(value);
    }
    return null;
}

app.post('/api/translate', async (req, res) => {
    console.log('Received translation request:', req.body);
    const text = req.body.text;
    const model = req.body.model || 'gemma3:1b';
    console.log('Text to translate:', text);
    if (!text) {
        return res.status(400).json({ error: 'No text provided' });
    }
    try {
        const translation = await translateEmoji(text, model);
        res.json({ translation });
    } catch (error) {
        console.error('Error during translation:', error);
        res.status(500).json({ error: 'Translation failed' });
    }
});

// console.log('test:'+await(translateEmoji('🥺👉👈')))

