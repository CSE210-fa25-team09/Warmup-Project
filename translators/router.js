import { fallbackTranslator } from "./fallbackTranslator.js";
import { llmTranslator } from "./llmTranslator.js";

let translator = llmTranslator;
let useLlm = true;

const getTranslator = () => {
    return translator;
}

const translatorFallback = () => {
    translator = fallbackTranslator;
}

const toggleTranslator = () => {
    useLlm = !useLlm;
    translator = useLlm ? llmTranslator : fallbackTranslator;
    return useLlm;
}

const translateEmoji = (value) => {
    try {
        return getTranslator().translateEmoji(value);
    } catch (error) {
        console.error("Error translating emoji:", error);
        translatorFallback();
        return getTranslator().translateEmoji(value);
    }
}

const router = { getTranslator, translateEmoji, toggleTranslator, isUsingLlm: () => useLlm };

export { router };