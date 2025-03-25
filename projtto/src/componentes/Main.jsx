import React from "react";
import { useState, useEffect } from "react";
import "../App.css";

function Main({ Search, categoria, Isopen }) {
  const [articles, setArticles] = useState([]);
  const [indexArray, setindexArray] = useState(0);
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

  // useEffect do slider
  useEffect(() => {
    const interval = setInterval(() => {
      setindexArray((previndex) => (previndex + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, [indexArray]); // sempre q o indexArray mudar ele executa

  //proximo slider button
  const proximoSlider = () => {
    setindexArray((previndex) => (previndex + 1) % 3);
  };
  //slider anterior
  const anteriorSlider = () => {
    setindexArray((previndex) => (previndex === 0 ? 2 : previndex - 1) % 3);
  };

  function adicionarnoticia(noticia) {
    fetch("http://localhost:3008/adicionarnoticias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noticia),
      credentials: "include", // garante q o cokie seja enviado com a requisição
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.mensagem) {
          alert(data.mensagem);
          console.log("Notícia salva:", data);
        } else {
          throw new Error(data.erro);
        }
      })
      .catch((error) => {
        alert(error.menssage);
        console.error("Erro ao salvar notícia:", error);
      });
  }
  const element = articles[indexArray]; // pegando o primeiro artigo

  return (
    <div style={{ filter: Isopen === true ? "brightness(50%)" : "" }}>
      <div className="container-noticias">
        <div className="container-noticias-1">
          {element?.author && (
            <div
              className="noticiaSlider"
              style={{ backgroundImage: `url(${element.urlToImage})` }}
            >
              <button className="buttonSlider" onClick={anteriorSlider}>
                <i class="fa-solid fa-arrow-left"></i>
              </button>
              <a
                className="linkSlider"
                href={element.url}
                target="_blank"
                style={{ textDecoration: "none" }}
              ></a>
              <div className="overlay">
                <h1 className="sliderh1">{element.title}</h1>
              </div>
              <button className="buttonSlider" onClick={proximoSlider}>
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          )}
        </div>

        {Search ? (
          <div className="pai-subtitulo">
            <h1 className="subtitulo">{Search}</h1>
          </div>
        ) : (
          <div className="pai-subtitulo">
            <h1 className="subtitulo">{categoria}</h1>
          </div>
        )}

        <div className="container-noticias-2">
          {Array.isArray(articles) &&
            articles.slice(4, 9).map((element, index) => {
              if (element.author !== null) {
                const gridClasses = [
                  "item1",
                  "item2",
                  "item3",
                  "item4",
                  "item5",
                ]; // editar grid no css
                return (
                  <div
                    key={index}
                    className={` ${
                      gridClasses[index] === "item1"
                        ? `noticia22-item1 ${gridClasses[index]} `
                        : "noticia22"
                    }`}
                  >
                    <a
                      href={element.url}
                      target="_blank"
                      style={{ textDecoration: "none", height: "80%" }}
                    >
                      <img
                        className={`${gridClasses[index]}img`}
                        src={element.urlToImage}
                        alt={`Notícia ${index + 1}`}
                       
                      />
                      <h1
                        className="h1articless"
                        
                      >
                        {element.title}
                      </h1>
                    </a>
                    {gridClasses[index] === "item1" ? (
                      <h1
                        className="descricao"
                        style={{
                          color: "black",
                        }}
                      >
                        {element.description}
                      </h1>
                    ) : null}
                    <div style={{ margin: "6% 0px 2% 0px", flexShrink: 1 }}>
                      <button
                      className="button-salvar"
                        onClick={() => adicionarnoticia(element)}
                        
                      >
                        salvar
                      </button>
                    </div>
                  </div>
                );
              }
            })}
        </div>

        <div className="container-noticias-3">
          {Array.isArray(articles) &&
            articles.slice(10, 17).map((element, index) => {
              if (element.author !== null) {
                const gridClasses = [
                  "item11",
                  "item12",
                  "item13",
                  "item14",
                  "item15",
                  "item16",
                  "item17",
                  
                ]; // editar grid no css
                return (
                  <div
                    key={index}
                    className={` ${
                      gridClasses[index] === "item12" ||
                      gridClasses[index] === "item11"
                        ? `noticia22-item11 ${gridClasses[index]}`
                        : "noticia22"
                    }    `}
                  >
                    <a
                      href={element.url}
                      target="_blank"
                      style={{ textDecoration: "none", height: "85%" }}
                    >
                      <img
                        className={`${gridClasses[index]}img`}
                        src={element.urlToImage}
                        alt={`Notícia ${index + 1}`}
                        
                      />
                      <h1
                        className="h1articless"
                       
                      >
                        {element.title}
                      </h1>
                    </a>
                    {gridClasses[index] === "item11" || gridClasses[index] === "item12" ? (
                      <h1
                        className="descricao"
                        style={{
                          color: "black",
                        }}
                      >
                        {element.description}
                      </h1>
                    ) : null}
                    <div style={{ margin: "6% 0px 2% 0px", flexShrink: 1 }}>
                      <button
                        className="button-salvar"
                        onClick={() => adicionarnoticia(element)}
                        
                      >
                        salvar
                      </button>
                    </div>
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
