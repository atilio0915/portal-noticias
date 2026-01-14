import React from "react";
import { Link } from "react-router-dom";
import "./Menu.css";
function Menu({ Isopen, onClose }) {
  return (
    <>
      <div
        className={`menu-backdrop ${Isopen ? "open" : ""}`}
        onClick={onClose}
      ></div>
      <div className={`container ${Isopen ? "open" : ""}`}>
        <button className="menu-voltar" onClick={onClose} type="button">
          Voltar
        </button>
        <Link to="/home">Home</Link>
        <Link to="/sport">Sport</Link>
        <Link to="/tecnology">Tecnology</Link>
        <Link to="/science">Science</Link>
        <Link to="/war">War</Link>
        <Link to="/">Cadastro</Link>
        <Link to="/entrar">Entrar</Link>
        <Link to="/perfil">Perfil</Link>
      </div>
    </>
  );
}

export default Menu;
