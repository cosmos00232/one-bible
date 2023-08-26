import styled from "styled-components";

import Book from "../type/Book";
import {
  clearHistory,
  getHistoryByBook,
  getHistoryByKey,
  updateHistory,
} from "../store/history.store";
import History from "../type/History";
import { useState } from "react";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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
  const [historyArray, setHistoryArray] = useState(getHistoryByBook(book.id));
  return (
    <ChapterGridContainer>
      {range(book.length).map((index) => {
        const key = `${book.id}-${index + 1}`;
        return (
          <ChapterButton
            key={key}
            onClick={() => {
              const historyJson = getHistoryByKey(key);

              const history =
                historyJson === null
                  ? new History()
                  : History.plainToClass(JSON.parse(historyJson));

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
              }).then((result) => {
                if (result.isConfirmed) {
                  history.count++;
                  updateHistory(key, JSON.stringify(history));
                  setHistoryArray(getHistoryByBook(book.id));
                } else if (result.isDenied) {
                  clearHistory(key);
                  setHistoryArray(getHistoryByBook(book.id));
                }
              });
            }}
            $hasHistory={historyArray.includes(key)}
          >
            {index + 1}장
          </ChapterButton>
        );
      })}
    </ChapterGridContainer>
  );
}

export default ChapterSelector;
