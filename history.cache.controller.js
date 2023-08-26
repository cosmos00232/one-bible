const broadcast = new BroadcastChannel("one-bible");

const CACHE_VERSION = 1;

// Shorthand identifier mapped to specific versioned cache.
const CURRENT_CACHES = {
  history: "font-cache-v" + CACHE_VERSION,
};

broadcast.onmessage = event => {
  if (!event.data) {
    return;
  }

  const data = event.data
  const method = data.payload.method;
  console.log("[sw] data: ", JSON.stringify(data))
  if (method === 'getHistoryKeyByBookId') {
    const bookId = data.payload.bookId
    getHistoryKeyByBookId(bookId);
  } else if (method === 'getHistoryByKey') {
    caches.open(CURRENT_CACHES["history"]).then(cache => {
      cache.match("/history.json").then(response => {
        if (response) {
          response.text().then(_data => {
            broadcast.postMessage({
              payload: {
                method: 'getHistoryByKey',
                history: JSON.stringify(JSON.parse(_data)[data.payload.key]),
                type: "response"
              }
            })
          })
        } else {
          broadcast.postMessage({
            payload: {
              method: 'getHistoryByKey',
              history: undefined,
              type: "response"
            }
          })
        }
      })
    });
  } else if (method === 'updateHistory') {
    const key = data.payload.key;
    const value = data.payload.value;
    caches.open(CURRENT_CACHES["history"]).then(cache => {
      cache.match("/history.json").then(response => {
        if (response) {
          response.text().then(_data => {
            const historyArray = JSON.parse(_data);
            historyArray[key] = JSON.parse(value);
            cache.put("/history.json", new Response(JSON.stringify(historyArray))).then(() => {
              getHistoryKeyByBookId(key.substring(0, key.indexOf("-")));
            });
          });
        } else {
          const historyArray = {}
          historyArray[key] = JSON.parse(value)
          cache.put("/history.json", new Response(JSON.stringify(historyArray))).then(() => {
            getHistoryKeyByBookId(key.substring(0, key.indexOf("-")));
          });
        }
      })
    });
  } else if (method === 'clearHistory') {
    const key = data.payload.key;
    caches.open(CURRENT_CACHES["history"]).then(cache => {
      cache.match("/history.json").then(response => {
        if (response) {
          response.text().then(_data => {
            const historyArray = JSON.parse(_data);
            delete historyArray[key];
            cache.put("/history.json", new Response(JSON.stringify(historyArray))).then(() => {
              getHistoryKeyByBookId(key.substring(0, key.indexOf("-")));
            });
          })
        }
      });
    })
  }
}

function getHistoryKeyByBookId(bookId) {
  caches.open(CURRENT_CACHES["history"]).then(cache => {
    cache.match("/history.json").then(response => {
      if (response) {
        response.text().then(_data => {
          const historyKeyArray = Object.keys(JSON.parse(_data)).filter((key) => {
            return key.startsWith(bookId + "-")
          })

          broadcast.postMessage({
            payload: {
              method: 'getHistoryKeyByBookId',
              historyKeyArray: JSON.stringify(historyKeyArray),
              type: "response"
            }
          })
        })
      } else {
        broadcast.postMessage({
          payload: {
            method: 'getHistoryKeyByBookId',
            historyKeyArray: JSON.stringify([]),
            type: "response"
          }
        })
      }
    })
  });
}