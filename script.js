const input = document.querySelector("#emoji-input");
const outputPanel = document.querySelector("#translation-output");
const speakButton = document.querySelector("#speak-button");
const copyButton = document.querySelector("#copy-button");
const emojiToggle = document.querySelector("#emoji-toggle");
const emojiPicker = document.querySelector("#emoji-picker");
const llmToggle = document.querySelector("#llm-toggle");
const synth = window.speechSynthesis;

// LLM translation state
let useLLMTranslation = false;

/* ================================
   Emoji name lookup (cached)
   ================================ */

/* ================================
   Local fallback: Top ~100 emojis
   ================================ */

let FALLBACK_EMOJI_MAP = new Map();

(async function loadFallback() {
  try {
    const res = await fetch('./fallback-emojis.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arr = await res.json();
    FALLBACK_EMOJI_MAP = new Map(arr);
    console.log(`Loaded ${FALLBACK_EMOJI_MAP.size} fallback emojis`);
  } catch (err) {
    console.warn('Could not load fallback-emojis.json; continuing without seeded list.', err);
  }
})();


const _emojiCache = new Map();

async function getEmojiName(emojiChar) {
  if (!emojiChar) return "";

  // 1) Cache check
  if (_emojiCache.has(emojiChar)) return _emojiCache.get(emojiChar);

  // 2) Try API first (fresher than seeded list)
  const apiKey = "6477cadc3994ded39b79915704aa924596dd695b"; // don't commit a real key
  const url = `https://emoji-api.com/emojis?search=${encodeURIComponent(emojiChar)}&access_key=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    let name = (Array.isArray(data) && data[0] && data[0].unicodeName) || "";

    // Strip "E14.0 " / "E0.6 " prefixes
    name = name.replace(/^E\d+(\.\d+)?\s*/, "").trim();

    if (name) {
      _emojiCache.set(emojiChar, name);
      return name;
    }

    // API returned nothing: fall back
    const fallback = FALLBACK_EMOJI_MAP.get(emojiChar) || emojiChar;
    _emojiCache.set(emojiChar, fallback);
    return fallback;
  } catch (err) {
    console.error('Emoji API failed; using fallback if available.', err);
    const fallback = FALLBACK_EMOJI_MAP.get(emojiChar) || emojiChar;
    _emojiCache.set(emojiChar, fallback);
    return fallback;
  }
}

/* ================================
   Hugging Face LLM Translation
   ================================ */

async function query(data) {
  const response = await fetch(
    "https://router.huggingface.co/v1/chat/completions",
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`, // Replace with your HF token
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

async function translateWithLLM(emojiText) {
  if (!emojiText) return "";

  try {
    const result = await query({ 
      messages: [
        {
          role: "user",
          content: `Briefly describe these emojis in one sentence: ${emojiText}`,
        },
      ],
      model: "google/gemma-2-2b-it:nebius",
    });

    // Extract the generated text from the response
    if (result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) {
      const translation = result.choices[0].message.content.trim();
      return translation || `Creative interpretation of: ${emojiText}`;
    }
    
    // Fallback if API doesn't return expected format
    return `Creative interpretation of: ${emojiText}`;
  } catch (error) {
    console.error('Hugging Face API error:', error);
    // Fallback to simple creative description
    return `Creative description: ${emojiText} (LLM temporarily unavailable)`;
  }
}

/* ================================
   UI helpers
   ================================ */

async function getEmojiNames(str) {
  const graphemes = Array.from(str).filter(g => g.trim() !== ""); // ignore spaces/newlines

  const results = await Promise.all(
    graphemes.map(async (g) => {
      const name = await getEmojiName(g);
      // if API misses it, fall back to the emoji itself
      const clean = String(name || "").replace(/^E\d+(\.\d+)?\s*/, "").trim();
      return clean && !/^No name found/i.test(clean) && !/^Failed/i.test(clean)
        ? clean
        : g;
    })
  );

  return results.join(" ");
}


const toggleActionButtons = (enabled, text = "") => {
  const safeText = enabled ? text : "";

  if (speakButton) {
    if (!synth) {
      speakButton.disabled = true;
      speakButton.dataset.text = ""; 
    } else {
      speakButton.disabled = !enabled;
      speakButton.dataset.text = safeText;
    }
  }

  if (copyButton) {
    copyButton.disabled = !enabled;
    copyButton.dataset.text = safeText;
  }
};

const updateTranslation = async () => {
  const value = input.value.trim();
  if (!value) {
    outputPanel.textContent = "Translation";
    outputPanel.classList.add("panel__output-placeholder");
    toggleActionButtons(false);
    return;
  }

  outputPanel.textContent = "Translating...";
  outputPanel.classList.remove("panel__output-placeholder");

  let renderedText;
  
  if (useLLMTranslation) {
    // Use LLM translation for creative interpretation
    renderedText = await translateWithLLM(value);
  } else {
    // Use regular emoji name lookup
    renderedText = await getEmojiNames(value);
  }

  outputPanel.textContent = renderedText;
  toggleActionButtons(true, renderedText);
};


const speakTranslation = () => {
  if (!synth) return;

  const text = speakButton.dataset.text;
  if (!text) return;

  if (synth.speaking) synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.lang = "en-US";
  synth.speak(utterance);
};

if (speakButton) {
  if (!synth) {
    speakButton.disabled = true;
    speakButton.title = "Speech synthesis not supported.";
  } else {
    speakButton.addEventListener("click", speakTranslation);
  }
}

const copyTranslation = async () => {
  if (!copyButton) return;
  const text = copyButton.dataset.text;
  if (!text) return;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      alert("Translation copied to clipboard!");
    }
  } catch (err) {
    console.error("Unable to copy translation:", err);
    alert("Unable to copy translation. Please try again.");
  }
};

if (copyButton) {
  copyButton.addEventListener("click", copyTranslation);
}

const setEmojiPickerVisibility = (isVisible) => {
  if (!emojiPicker || !emojiToggle) return;

  if (isVisible) {
    emojiPicker.removeAttribute("hidden");
  } else {
    emojiPicker.setAttribute("hidden", "");
  }

  emojiToggle.setAttribute("aria-expanded", String(isVisible));
  emojiToggle.innerHTML = isVisible ? "Pick Emoji ▲" : "Pick Emoji ▼";
};

if (emojiToggle && emojiPicker) {
  emojiToggle.addEventListener("click", () => {
    const isHidden = emojiPicker.hasAttribute("hidden");
    setEmojiPickerVisibility(isHidden);
    if (emojiPicker.focus && isHidden) {
      emojiPicker.focus();
    }
  });
  setEmojiPickerVisibility(!emojiPicker.hasAttribute("hidden"));
}

const insertEmojiAtCursor = (emoji) => {
  if (!input) return;

  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? start;
  const before = input.value.slice(0, start);
  const after = input.value.slice(end);
  input.value = `${before}${emoji}${after}`;

  const cursorPosition = start + emoji.length;
  input.focus();
  if (input.setSelectionRange) {
    input.setSelectionRange(cursorPosition, cursorPosition);
  }

  input.dispatchEvent(new Event("input", { bubbles: true }));
};

if (emojiPicker) {
  emojiPicker.addEventListener("emoji-click", (event) => {
    // The picker provides an object; we need the unicode string
    const emoji =
      event.detail?.unicode ||
      event.detail?.emoji?.unicode ||
      event.detail?.emoji ||
      "";
    if (!emoji) return;

    insertEmojiAtCursor(emoji);
  });
}

/* ================================
   LLM Toggle functionality
   ================================ */

if (llmToggle) {
  llmToggle.addEventListener("click", () => {
    useLLMTranslation = !useLLMTranslation;
    llmToggle.setAttribute("aria-pressed", String(useLLMTranslation));
    llmToggle.innerHTML = useLLMTranslation ? "Use LLM 🤖" : "Use LLM 🤖";
    
    // Re-translate current input with new mode
    if (input.value.trim()) {
      updateTranslation();
    }
  });
}

input.addEventListener("input", () => {
  // debounce lightly if desired; for now just call
  updateTranslation();
});
updateTranslation();
