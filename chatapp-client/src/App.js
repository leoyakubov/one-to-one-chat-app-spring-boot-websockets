import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import Chat from "./chat/Chat";
import Login from "./login/Login";
import Profile from "./profile/Profile";
import Signup from "./signup/Signup";

export const AppContext = React.createContext();

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Profile/>} />

          <Route path="/login" element={<Login/>} />

          <Route path="/signup" element={<Signup/>} />

          <Route path="/chat" exact element={<Chat/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
