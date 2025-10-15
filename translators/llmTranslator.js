import fs from 'fs'
import path from 'path'
import ollama from 'ollama'

const llmCache = new Map();

const systemPrompt = fs.readFileSync(
  path.resolve('./translators/emojiPrompt.md'),
  'utf-8'
);

const config = {
    model: 'gemma3:1b',
    temperature: 0.0,
    top_p: 0.01,
    top_k: 1,
    seed: 42,
};

const translateEmoji = async (value) => {
    const cached = checkCache(value);
    if (cached) {
        return cached;
    }



    const llmResponse = await ollama.chat({
        model: config.model,
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
    });
    // const result = "LLM Translation for: " + (value ? value.trimStart() : "" + llmResponse);
    const result = llmResponse.message?.content?.trim() || "";
    llmCache.set(value, result);
    return result;
};

const checkCache = (value) => {
    if (llmCache.has(value)) {
        return llmCache.get(value);
    }
    return null;
}

const llmTranslator = { translateEmoji };

// console.log('test:'+await(translateEmoji('🥺👉👈')))

export { llmTranslator };
