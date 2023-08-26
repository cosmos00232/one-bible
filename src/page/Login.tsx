import styled from "styled-components";

import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { useState } from "react";

const LoginForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
`;

function Login() {
  const [email, setEmail] = useState("");
  return (
    <LoginForm className="pure-form">
      <Row style={{ marginBottom: "8px" }}>
        <label htmlFor="email" style={{ marginBottom: "4px" }}>
          email
        </label>
        <input
          id="email"
          style={{ padding: "8px" }}
          onChange={(e) => {
            setEmail((e.target as HTMLInputElement).value);
          }}
        />
      </Row>
      <Row>
        <button
          className="pure-button pure-button-primary"
          style={{ width: "196px" }}
          onClick={() => {
            const actionCodeSettings = {
              handleCodeInApp: true,
              // url: "https://one-bible-pwa.web.app",
              url: "http://localhost:5173",
            };

            const auth = getAuth();
            sendSignInLinkToEmail(auth, email, actionCodeSettings).then(() => {
              window.localStorage.setItem("emailForSignIn", email);
            });
          }}
        >
          login
        </button>
      </Row>
    </LoginForm>
  );
}

export default Login;
