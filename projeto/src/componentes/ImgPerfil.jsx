import React from "react";
import "./ImgPerfil.css";
import { useState } from "react";

function ImgPerfil() {
  const [imagem, setImagem] = useState(null);

  const escolherimg = (event) => {
    const file = event.target.files[0]; // pega o arquivo no event
    if (file) {
      const urlImg = URL.createObjectURL(file); // gera um link temporario
      setImagem(urlImg); // imagem é uma URL
    }
  };

  return (
    <div className="containerIMG ">
      <div className="titulo-perfil">Nome</div>
      <div className="image-container">
        {imagem ? <img src={imagem} /> : <span></span>}
       </div>
      <label htmlFor="inputImagem" className="label">
        <span className="label-span">Escolher foto</span>
      </label>
      <input
        id="inputImagem"
        type="file"
        className="inputimage"
        accept="image/*"
        onChange={escolherimg}
        style={{ display: "none" }}
      />
      
    </div>
  );
}

export default ImgPerfil;
