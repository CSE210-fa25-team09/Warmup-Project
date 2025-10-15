const input = document.querySelector("#emoji-input");
const outputPanel = document.querySelector("#translation-output");
const speakButton = document.querySelector("#speak-button");
const copyButton = document.querySelector("#copy-button");
const emojiToggle = document.querySelector("#emoji-toggle");
const emojiPicker = document.querySelector("#emoji-picker");
const synth = window.speechSynthesis;

/* ================================
   Emoji name lookup (cached)
   ================================ */
const _emojiCache = new Map();

async function getEmojiName(emojiChar) {
  if (!emojiChar) return "";
  if (_emojiCache.has(emojiChar)) return _emojiCache.get(emojiChar);

  const apiKey = "6477cadc3994ded39b79915704aa924596dd695b"; 
  const url = `https://emoji-api.com/emojis?search=${encodeURIComponent(emojiChar)}&access_key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const name =
      (Array.isArray(data) && data[0] && data[0].unicodeName) ||
      `No name found for "${emojiChar}"`;

    _emojiCache.set(emojiChar, name);
    const cleanName = name.replace(/^E\d+(\.\d+)?\s*/, "").trim();
    return cleanName;
  } catch (error) {
    console.error("Error fetching emoji name:", error);
    return "Failed to fetch emoji name.";
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

  const renderedText = await getEmojiNames(value);

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

input.addEventListener("input", () => {
  // debounce lightly if desired; for now just call
  updateTranslation();
});
updateTranslation();
