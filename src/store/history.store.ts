export function getHistoryByBook(bookId: string) {
  return Object.keys(localStorage).filter((_key) =>
    _key.startsWith(bookId + "-")
  );
}

export function getHistoryByKey(key: string) {
  return localStorage.getItem(key);
}

export function updateHistory(key: string, value: string) {
  localStorage.setItem(key, value);
}

export function clearHistory(key: string) {
  localStorage.removeItem(key);
}
