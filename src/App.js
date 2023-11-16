import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import routes from "./routes";

export default function App() {
  const navigate = useNavigate();
  return (
    <div className="app">
      <div className="header">
        <div className="header-container">
          <div className="header-title" onClick={(_e)=> navigate('..')}>
            <h1>Startled Cats</h1>
            <div className="header-subtitle">r/StartledCats</div>
          </div>
        </div>
      </div>
      <div className="app-container">
        <Routes>
            {routes.map((route, index) => (
              <Route key={index} {...route} />
            ))}
        </Routes>
      </div>
    </div>
  );
}
