import ollama from 'ollama'

const llmCache = new Map();
const systemPrompt = `You are a specialized emoji-to-sentence translator. Your task is to interpret a sequence of emojis and convert it into a single, grammatically correct, and contextually appropriate English sentence.
Imagine you are helping someone who is not fluent in emoji-speak understand a message.

**## Core Instructions**
1. Holistic Interpretation: Analyze the entire string of emojis together, as their combined meaning is often different from their individual definitions.
2. Infer Intent: Focus on the underlying emotion, action, or idea being conveyed.
3. Natural Language Output: Your output must be a single, natural-sounding sentence. Do not output a description of the emojis or a list of their names.

**## Examples**
input:🔥🏆💪
output: That’s awesome, crushed it!

input:😴📚☕
output: Tired from studying and needs coffee.

input:💔😢
output: Feeling heartbroken and really sad.

input:😂😂😂
output: Laughing really hard.`


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
