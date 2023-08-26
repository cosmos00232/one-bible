import styled from "styled-components";

const broadcast = new BroadcastChannel("one-bible");

import Book from "../type/Book";
import { useEffect, useState } from "react";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import History from "../type/History";

const ReactSwal = withReactContent(Swal);

const ChapterGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding: 1rem;
  row-gap: 0.5rem;
  column-gap: 0.5rem;
`;

const ChapterButton = styled.div<{ $hasHistory: boolean }>`
  border: 1px solid #767676;
  display: flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  cursor: pointer;
  ${(props) => props.$hasHistory && "background-color: #84cc16;"}
`;

function ChapterSelector({ book }: { book: Book }) {
  const range = (n: number) => [...Array(n).keys()];
  const [historyKeyArray, setHistoryKeyArray] = useState([] as string[]);
  const [key, setKey] = useState("");

  useEffect(() => {
    broadcast.postMessage({
      payload: {
        bookId: book.id,
        method: "getHistoryKeyByBookId",
        type: "request",
      },
    });
  }, [book]);

  broadcast.onmessage = (event) => {
    if (
      !event.data &&
      !event.data.payload.type &&
      event.data.payload.type !== "response"
    ) {
      return;
    }

    const data = event.data;
    const method = data.payload.method;
    console.log(data);
    if (method === "getHistoryKeyByBookId") {
      setHistoryKeyArray(JSON.parse(event.data.payload.historyKeyArray));
    } else if (method === "getHistoryByKey") {
      const history =
        data.payload.history === undefined
          ? new History()
          : JSON.parse(data.payload.history);
      const readDT = history.read_at.split("T");

      ReactSwal.fire({
        title: "기록 하시겠습니까?",
        html:
          history.count === 0
            ? "첫 기록입니다."
            : `<div>읽은 횟수</div><div style="margin-top: 0.25rem;"><strong>${
                history.count
              }회</strong></div><div style="margin-top: 1rem;">기록 일자</div><div style="margin-top: 0.25rem;"><strong>${
                readDT[0]
              } ${readDT[1].substring(0, 8)}</strong></div>`,
        showDenyButton: history.count !== 0,
        confirmButtonColor: "#3085d6",
        denyButtonColor: "#d33",
        denyButtonText: "기록 삭제",
        confirmButtonText: "새로 기록하기",
      }).then(async (result) => {
        if (result.isConfirmed) {
          history.count++;
          history.read_at = new Date().toISOString();
          broadcast.postMessage({
            payload: {
              method: "updateHistory",
              key: key,
              value: JSON.stringify(history),
              type: "request",
            },
          });
        } else if (result.isDenied) {
          broadcast.postMessage({
            payload: {
              method: "clearHistory",
              key: key,
              type: "request",
            },
          });
        }
      });
    }
  };

  return (
    <ChapterGridContainer>
      {range(book.length).map((index) => {
        const key = `${book.id}-${index + 1}`;
        return (
          <ChapterButton
            key={key}
            onClick={() => {
              setKey(key);
              broadcast.postMessage({
                payload: {
                  key: key,
                  method: "getHistoryByKey",
                  type: "request",
                },
              });
            }}
            $hasHistory={historyKeyArray.includes(key)}
          >
            {index + 1}장
          </ChapterButton>
        );
      })}
    </ChapterGridContainer>
  );
}

export default ChapterSelector;
