import React from "react";
import { useState,useEffect} from "react";
import Navbar from "./Navbar";
import "./Perfil.css";


function Perfil() {
    const [salvos,setSalvas] = useState([0])
       
    useEffect(() => {
        fetch("http://localhost:3008/noticiasSalvas",{
            method: "GET",
            headers:  {
                "Content-Type": "application/json",
              },
        })
        .then((response) => response.json())
        .then(data => setSalvas(data))
    },[]);

    function atualizar(){
        fetch("http://localhost:3008/noticiasSalvas",{
            method: "GET",
            headers:  {
                "Content-Type": "application/json",
              },
        })
        .then((response) => response.json())
        .then(data => setSalvas(data))
    }

  return (
    <div className="pai">
      <Navbar></Navbar>
      <div className="container1">
        <div className="divimg">
          <h1 className="titulo">PERFIL</h1>
          <div>
            <img src="../../public/logo512.png" alt="" />
          </div> 
        </div>
        <div className="container2">
          <div className="container3">
            <div className="titulonoticias">Noticias salvas</div>
            <div className="divbutton">
                <button onClick={atualizar} className="buttonatualizar">Atualizar</button>
            </div>
          </div>
          <div className="noticias-salvos">
            {salvos.slice(4, 40).map((element, index) => {
                if (element.author !== null) {
                  return (
                    <div key={index} className="noticia2">
                      <a
                        href={element.url}
                        target="_blank"
                        style={{ textDecoration: "none" }}
                      >
                        <img
                          src={element.urlToImage}
                          alt={`Notícia ${index + 1}`}
                          style={{ height: "60%", width: "100%" }}
                        />
                        <h1
                          className="h1articles"
                          style={{
                            height: "20%",
                            fontSize: "20px",
                            color: "black",
                          }}
                        >
                          {element.title}
                        </h1>
                      </a>
                    </div>
                  );
                }
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Perfil;
