import { router } from "./translators/router.js";

const input = document.querySelector("#emoji-input");
const outputPanel = document.querySelector("#translation-output");
const speakButton = document.querySelector("#speak-button");
const copyButton = document.querySelector("#copy-button");
const emojiToggle = document.querySelector("#emoji-toggle");
const emojiPicker = document.querySelector("#emoji-picker");
const llmToggle = document.querySelector("#llm-toggle");
const synth = window.speechSynthesis;

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

const updateTranslation = () => {
  const value = input.value.trim();
  if (!value) {
    outputPanel.textContent = "Translation";
    outputPanel.classList.add("panel__output-placeholder");
    toggleActionButtons(false);
    return;
  }

  const translation = router.translateEmoji(value);
  const renderedText = translation || value;

  outputPanel.textContent = renderedText;
  outputPanel.classList.remove("panel__output-placeholder");
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
    const emoji = event.detail?.unicode;
    if (!emoji) return;

    insertEmojiAtCursor(emoji);
  });
}

const toggleLlmTranslator = () => {
  if (!llmToggle) return;
  
  const isUsingLlm = router.toggleTranslator();
  llmToggle.textContent = isUsingLlm ? "LLM: ON" : "LLM: OFF";
  llmToggle.setAttribute("aria-pressed", String(isUsingLlm));
  updateTranslation();
};

if (llmToggle) {
  llmToggle.addEventListener("click", toggleLlmTranslator);
}

input.addEventListener("input", updateTranslation);
updateTranslation();
