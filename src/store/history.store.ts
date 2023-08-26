import "../firebase/database";
import {
  getDatabase,
  ref,
  get,
  set,
  query,
  orderByKey,
  startAt,
  endAt,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import History from "../type/History";

export async function getHistoryKeyArrayByBookId(bookId: string) {
  console.log("bookId", bookId);
  const db = getDatabase();
  const currentUser = getAuth().currentUser;
  if (currentUser) {
    const uid = currentUser.uid;
    const q = query(
      ref(db, uid),
      orderByKey(),
      startAt(`${bookId}-`),
      endAt(`${bookId}-\\uf8ff`)
    );
    const snapshot = await get(q);
    const historyArray = snapshot.val();
    console.log(historyArray);
    return historyArray == null ? [] : Object.keys(historyArray);
  }
  return [];
}

export async function getHistoryByKey(key: string) {
  const db = getDatabase();
  const currentUser = getAuth().currentUser;
  if (currentUser) {
    const uid = currentUser.uid;
    const snapshot = await get(ref(db, `${uid}/${key}`));
    const history = snapshot.val();
    return history === null ? new History() : history;
  }
  return new History();
}

export async function updateHistory(key: string, value: string | null) {
  const db = getDatabase();
  const currentUser = getAuth().currentUser;
  if (currentUser) {
    const uid = currentUser.uid;
    await set(
      ref(db, `${uid}/${key}`),
      value === null ? null : JSON.parse(value)
    );
  }
}

export async function clearHistory(key: string) {
  await updateHistory(key, null);
}
