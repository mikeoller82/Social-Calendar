export function parseRequestBody(rawBody) {
  if (!rawBody || !rawBody.trim()) return {};

  try {
    return JSON.parse(rawBody);
  } catch {
    throw new Error('Invalid JSON request body.');
  }
}

function findJsonBoundary(text, openChar, closeChar, startIndex) {
  let depth = 0;
  let inString = false;
  let escaping = false;

  for (let i = startIndex; i < text.length; i += 1) {
    const char = text[i];

    if (inString) {
      if (escaping) {
        escaping = false;
        continue;
      }

      if (char === '\\') {
        escaping = true;
        continue;
      }

      if (char === '"') {
        inString = false;
      }

      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === openChar) {
      depth += 1;
      continue;
    }

    if (char === closeChar) {
      depth -= 1;
      if (depth === 0) {
        return i;
      }
    }
  }

  return -1;
}

export function extractJson(text) {
  if (!text || !text.trim()) {
    throw new Error('Model response was empty.');
  }

  const startIndex = text.search(/[\[{]/);
  if (startIndex === -1) {
    throw new Error('No JSON object or array found in model response.');
  }

  const openChar = text[startIndex];
  const closeChar = openChar === '{' ? '}' : ']';
  const endIndex = findJsonBoundary(text, openChar, closeChar, startIndex);

  if (endIndex === -1) {
    throw new Error('Found JSON start but could not determine JSON boundary.');
  }

  const candidate = text.slice(startIndex, endIndex + 1).trim();

  try {
    return JSON.parse(candidate);
  } catch {
    throw new Error('Failed to parse JSON from model response.');
  }
}
