import { useState } from "react";
import Login from "./page/Login";
import Main from "./page/Main";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailLink,
} from "firebase/auth";

function App() {
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  onAuthStateChanged(auth, (_user) => {
    console.log(_user);
    setCurrentUser(_user);
  });

  if (window.location.href.indexOf("mode=signIn") > -1) {
    window.history.replaceState({}, document.title, "/");
    let email = window.localStorage.getItem("emailForSignIn");
    if (!email) {
      email = window.prompt("로그인을 요청한 이메일을 다시 입력해주세요.");
    }

    if (email) {
      // The client SDK will parse the code from the link for you.
      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          window.localStorage.removeItem("emailForSignIn");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  return <>{currentUser === null ? <Login /> : <Main />}</>;
}

export default App;
