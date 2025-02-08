import React from "react";
import { useState, useEffect } from "react";
import "../App.css";

function Main({ Search, categoria,Isopen }) {
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

  return (
    <div style={{filter: Isopen === true? "brightness(50%)" : "" }}>
      <div className="container-noticias">
        <div className="container-noticias-1">
          {Array.isArray(articles) &&
            articles.slice(0,3).map((element, index) => {
              if(element.author !== null){
                return(
                <div key={index} className="noticia">
                  <a href={element.url} target="_blank" style={{textDecoration:"none"}}>
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
                     salvar
                    </div>
                  </a>
                </div>)
               }
            })}
        </div>

        <div className="container-noticias-2">
          {Array.isArray(articles) &&
            articles.slice(4, 40).map((element, index) => {
              if(element.author !== null){
                return (
                  <div key={index} className="noticia2">
                <a href={element.url} target="_blank" style={{textDecoration:"none"}}>
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
                  <div style={{  height: "10%",flexShrink: 1 }}>Salvar</div>
                </a>
              </div>
                )
              }
            }
              
            )}
        </div>
      </div>
    </div>
  );
}
export default Main;
