import React from "react";
import "../App.css";
import { Link } from "react-router-dom";
function Navbar({ Search, SetSearch, Function, Isopen }) {
  return (
    <div
      className="navbar"
      style={{
        width: "100vw",
        height: "200px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="container-input" style={{filter: Isopen === true ? "brightness(50%)" : ""}}>
        <input
          class="pesquisa"
          type="text"
          placeholder="Pesquise algo..."
          value={Search}
          onChange={(e) => SetSearch(e.target.value)}
        ></input>
        <span className="titulo">News</span>
      </div>

      <div className="nav">
        <button
          style={{ width: "205px", background: "rgb(202, 21, 21)" }}
          onClick={() => Function()}
        >
          <i className="fa-solid fa-bars fa-2x iconemenu"></i>
        </button>
        <div className="links" style={{filter: Isopen === true ? "brightness(50%)" : ""}} >
          <Link to="/home">Home</Link>
          <Link to="/sport">Sport</Link>
          <Link to="/tecnology">Tecnology</Link>
          <Link to="/science">Science</Link>
          <Link to="/war">War</Link>
        </div>
      </div>
    </div>
  );
}
export default Navbar;
