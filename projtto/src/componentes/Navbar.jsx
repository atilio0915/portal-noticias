import React from "react";
import "../App.css";
import { Link } from "react-router-dom";
import "./Navbar.css";
function Navbar({ Search, SetSearch, Function, Isopen }) {
  return (
    <div className="navbar">
      <div className={`container-input ${Isopen ? "open" : ""}`}>
        <div className="nav">
          <div className="divbutton">
            <button className="menu-button" onClick={() => Function()}>
              <i className="fa-solid fa-bars fa-2x iconemenu"></i>
            </button>
          </div>
          <div className={`links ${Isopen ? "open" : ""}`}>
            <Link className="nav-link" to="/home">
              Home
            </Link>
            <Link className="nav-link" to="/sport">
              Sport
            </Link>
            <Link className="nav-link" to="/tecnology">
              Tecnology
            </Link>
            <Link className="nav-link" to="/science">
              Science
            </Link>
            <Link className="nav-link" to="/war">
              War
            </Link>
          </div>
        </div>
        <input
          className="pesquisa"
          type="text"
          placeholder="Pesquise..."
          value={Search}
          onChange={(e) => SetSearch(e.target.value)}
        />
        <i  className="fa-solid fa-magnifying-glass iconepesquisa"></i>
        <div className="titulo">News </div>
      </div>
    </div>
  );
}

export default Navbar;
