import React from "react";
import { useState, useEffect } from "react";
import "../App.css";

function Main({ Search, categoria, Isopen }) {
  const [articles, setArticles] = useState([]);
  const keyapi = "943be490d5db491683e3943ec0500037";
  const searchQuery = Search !== "" ? Search : categoria ? categoria : "world";
  const url = `https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${keyapi}`;

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setArticles(data.articles);
      })
      .catch((error) => {
        console.error("error na requisição", error);
      });
  }, [Search]);




  function adicionarnoticia(noticia){
     fetch("http://localhost:3008/adicionarnoticias",{
      method: 'POST',
      headers:  {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noticia),
      credentials: 'include', // garante q o cokie seja enviado com a requisição 
     })
     .then(response => response.json())
     .then( (data) => {
      if(data.mensagem){
      alert(data.mensagem)
      console.log("Notícia salva:", data)
      }else {
        throw new Error(data.erro);
      }}
      )
     .catch((error) => {
      alert(error.menssage)
      console.error("Erro ao salvar notícia:", error)});
     
  }
  
  return (
    <div style={{ filter: Isopen === true ? "brightness(50%)" : "" }}>
      <div className="container-noticias">
        <div className="container-noticias-1">
          {Array.isArray(articles) &&
            articles.slice(0, 3).map((element, index) => {
              if (element.author !== null) {
                return (
                  <div key={index} className="noticia">
                    <a
                      href={element.url}
                      target="_blank"
                      style={{ textDecoration: "none" }}
                    >
                      <img
                        src={element.urlToImage}
                        alt={`Notícia ${index + 1}`}
                        className="noticia-image"
                        style={{ height: "70%", width: "100%" }}
                      />

                      <h1 className="h1articles" style={{ fontSize: "25px" }}>
                        {element.title}
                      </h1>
                      <div>
                        <button
                          onClick={() => adicionarnoticia(element)}
                          style={{
                            height: "30px",
                            width: "60px",
                            fontSize: "15px",
                          }}
                        >
                          salvar
                        </button>
                      </div>
                    </a>
                  </div>
                );
              }
            })}
        </div>

        <div className="container-noticias-2">
          {Array.isArray(articles) &&
            articles.slice(4, 40).map((element, index) => {
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
                          margin: '0px',
                          height: "15%",
                          fontSize: "20px",
                          color: "black",
                        }}
                      >
                        {element.title}
                      </h1>
                      <div style={{  margin: '0px', height: "20%", flexShrink: 1 }}>
                        <button
                        onClick={() => adicionarnoticia(element)}
                          style={{
                            textAlign: 'center',
                            height: "30px",
                            width: "70px",
                            fontSize: "17px",
                          }}
                        >
                          salvar
                        </button>
                        
                      </div>
                    </a>
                  </div>
                );
              }
            })}
        </div>
      </div>
    </div>
  );
}
export default Main;
