import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Signin from "./signin/Signin";
import Signup from "./signup/Signup";
import Profile from "./profile/Profile";
import Chat from "./chat/Chat";
import "./App.css";

export const AppContext = React.createContext();

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Profile />} />

          <Route path="/login" element={<Signin />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
