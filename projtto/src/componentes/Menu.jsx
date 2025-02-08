import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Menu.css";
function Menu({Isopen}) {
  return (
    <div className={`container ${Isopen ? 'open' : '' }`}>
      <Link to="/home">Home</Link>
      <Link to="/sport">Sport</Link>
      <Link to="/tecnology">Tecnology</Link>
      <Link to="/science">Science</Link>
      <Link to="/war">War</Link>
      <Link to="/">Cadastro</Link>
      <Link to="/entrar">entrar</Link>
    </div>
  );
}

export default Menu;
