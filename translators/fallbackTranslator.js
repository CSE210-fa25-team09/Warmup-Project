const fallbackCache = new Map();

const translateEmoji = value => {
  const cached = checkCache(value);
  if (cached) {
    return cached;
  }
  const result = value ? value.trimStart() : "";
  fallbackCache.set(value, result);
  return result;
};

const checkCache = (value) => {
  if (fallbackCache.has(value)) {
    return fallbackCache.get(value);
  }
  return null;
}

const fallbackTranslator = { translateEmoji };

export { fallbackTranslator };