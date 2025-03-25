import React from "react";
import { useState,useEffect} from "react";
import Navbar from "./Navbar";
import ImgPerfil from "./ImgPerfil";
import "./Perfil.css";


function Perfil() {
    const [salvos,setSalvas] = useState([0])
       
    useEffect(() => {
        fetch("http://localhost:3008/noticiasSalvas",{
            method: "GET",
            headers:  {
                "Content-Type": "application/json",
              },
            credentials: "include",
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
            credentials: "include",  
        })
        .then((response) => response.json())
        .then(data => setSalvas(data))
    }
    
    const deletarNoticia = (url) => {
        
        fetch("http://localhost:3008/deletarnoticia",{
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({url})// entre chaves = ex:  "index" : "2"
        })
        .then((response) => response.json())
        .then( (data) => { console.log(data.mensagem)})
        .catch( (error) => {
          console.error("erro ao deletar", error)
        })
        setSalvas((prevArray)=> prevArray.filter((_,i) => i !== url )); // todos q forem diferente do index vai passar 
        atualizar();
    }



  return (
    <div className="pai">
      <Navbar></Navbar>
      <div className="container1">
        <div className="divimg">
          <ImgPerfil></ImgPerfil>
        </div>
        <div className="container2">
          <div className="container3">
            <div className="titulonoticias">Noticias salvas</div>
            <div className="divbutton">
                <button onClick={atualizar} className="buttonatualizar">Atualizar</button>
            </div>
          </div>
          <div className="noticias-salvos">
            {salvos.slice(0, 40).map((element, index) => {
                if (element.author !== null) {
                  return (
                    <div key={index} className="noticia2">
                      <a
                        href={element.url}
                        target="_blank"
                        style={{ textDecoration: "none" }}
                      >
                        <img src={element.img} style={{height: "70%",borderRadius:"10px"}}/>
                        <h1
                          className="h1articles"
                          style={{
                            height: "20%",
                            fontSize: "20px",
                            color: "black",
                          }}
                        >
                          {element.titulo}
                        </h1>
                      </a>
                      <div >
                        <button
                          id={index}
                          url={element.url}
                          style={{
                            height: "30px",
                            width: "100px",
                            fontSize: "18px",
                            padding: "0px",
                          }}
                          onClick={() => deletarNoticia(element.url)}
                        >
                          Remover
                        </button>
                      </div>
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
