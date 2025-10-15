const input = document.querySelector("#emoji-input");
const outputPanel = document.querySelector("#translation-output");
const speakButton = document.querySelector("#speak-button");
const copyButton = document.querySelector("#copy-button");
const synth = window.speechSynthesis;

// Dummy translation function; replace with actual logic
const translateEmoji = value => (value ? value.trimStart() : "");

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

  const translation = translateEmoji(value);
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

input.addEventListener("input", updateTranslation);
updateTranslation();
