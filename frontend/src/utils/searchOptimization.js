// Search optimization utilities for better query performance

// Debounce function for search input
export const debounce = (fn, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// Normalize search terms for better matching
export const normalizeSearchTerm = (term) => {
  return term
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

// Filter array with optimized search
export const optimizedSearch = (items, term, fields) => {
  if (!term || term.length < 2) return items;

  const normalized = normalizeSearchTerm(term);

  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      if (!value) return false;
      return normalizeSearchTerm(String(value)).includes(normalized);
    })
  );
};

// Highlight search results
export const highlightSearchTerm = (text, term) => {
  if (!term) return text;

  const regex = new RegExp(`(${term})`, 'gi');
  return String(text).replace(regex, '<mark style="background-color: #ffeb3b;">$1</mark>');
};

// Cache search results for performance
export const createSearchCache = (maxSize = 50) => {
  const cache = new Map();

  return {
    get: (key) => cache.get(key),
    set: (key, value) => {
      if (cache.size >= maxSize) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      cache.set(key, value);
    },
    clear: () => cache.clear(),
  };
};

// Batch API calls for search
export const batchSearch = (queries, batchSize = 5) => {
  const batches = [];
  for (let i = 0; i < queries.length; i += batchSize) {
    batches.push(queries.slice(i, i + batchSize));
  }
  return batches;
};
