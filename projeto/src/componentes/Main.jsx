import React from "react";
import { useState, useEffect } from "react";
import "../App.css";

function Main({ Search, categoria, Isopen }) {
  const [articles, setArticles] = useState([]);
  const [indexArray, setindexArray] = useState(0);
  const keyapi = process.env.REACT_APP_NEWS_API_KEY;
  const searchQuery = Search !== "" ? Search : categoria ? categoria : "world";
  const url = `https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${keyapi}`;
  const validArticles = Array.isArray(articles)
    ? articles.filter(
        (item) => item && item.title && item.url && item.urlToImage
      )
    : [];
  const sliderArticles = validArticles.slice(0, 3);
  const sliderCount = sliderArticles.length;

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setArticles(data.articles);
      })
      .catch((error) => {
        console.error("error na requisiÇõÇœo", error);
      });
  }, [Search]);

  // useEffect do slider
  useEffect(() => {
    if (sliderCount === 0) {
      return;
    }
    const interval = setInterval(() => {
      setindexArray((previndex) => (previndex + 1) % sliderCount);
    }, 5000);

    return () => clearInterval(interval);
  }, [sliderCount]); // sempre q o indexArray mudar ele executa

  useEffect(() => {
    setindexArray(0);
  }, [sliderCount]);

  //proximo slider button
  const proximoSlider = () => {
    if (sliderCount === 0) {
      return;
    }
    setindexArray((previndex) => (previndex + 1) % sliderCount);
  };
  //slider anterior
  const anteriorSlider = () => {
    if (sliderCount === 0) {
      return;
    }
    setindexArray(
      (previndex) => (previndex === 0 ? sliderCount - 1 : previndex - 1) % sliderCount
    );
  };

  function adicionarnoticia(noticia) {
    fetch("http://localhost:3008/adicionarnoticias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noticia),
      credentials: "include", // garante q o cokie seja enviado com a requisiÇõÇœo
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.mensagem) {
          alert(data.mensagem);
          console.log("NotÇðcia salva:", data);
        } else {
          throw new Error(data.erro);
        }
      })
      .catch((error) => {
        alert(error.menssage);
        console.error("Erro ao salvar notÇðcia:", error);
      });
  }
  const element = sliderArticles[indexArray]; // pegando o primeiro artigo

  return (
    <div style={{ filter: Isopen === true ? "brightness(50%)" : "" }}>
      <div className="container-noticias mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-8">
        <div className="container-noticias-1 overflow-hidden rounded-2xl bg-white shadow">
          {element && (
            <div
              className="noticiaSlider"
              style={{ backgroundImage: `url(${element.urlToImage})` }}
            >
              <button className="buttonSlider" onClick={anteriorSlider}>
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <a
                className="linkSlider"
                href={element.url}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "none" }}
              ></a>
              <div className="overlay">
                <h1 className="sliderh1">{element.title}</h1>
              </div>
              <button className="buttonSlider" onClick={proximoSlider}>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          )}
        </div>

        {Search ? (
          <div className="w-full">
            <h1 className="border-b border-slate-200 pb-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {Search}
            </h1>
          </div>
        ) : (
          <div className="w-full">
            <h1 className="border-b border-slate-200 pb-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {categoria}
            </h1>
          </div>
        )}

        <div className="container-noticias-2 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {validArticles.slice(3, 8).map((element, index) => {
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
                className={`${gridClasses[index]} flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm`}
              >
                <a
                  href={element.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col gap-3 no-underline"
                >
                  <img
                    className="h-48 w-full rounded-xl object-cover"
                    src={element.urlToImage}
                    alt={`NotÇðcia ${index + 1}`}
                  />
                  <h1 className="truncate text-2xl font-semibold text-slate-900">
                    {element.title}
                  </h1>
                </a>
                <p className="max-h-[3rem] overflow-hidden text-base leading-6 text-slate-600">
                  {element.description || ""}
                </p>
                <div className="mt-auto pt-2">
                  <button
                    className="w-fit rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 hover:shadow-md"
                    onClick={() => adicionarnoticia(element)}
                  >
                    salvar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="container-noticias-3 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {validArticles.slice(8, 15).map((element, index) => {
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
                className={`${gridClasses[index]} flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm`}
              >
                <a
                  href={element.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col gap-3 no-underline"
                >
                  <img
                    className="h-48 w-full rounded-xl object-cover"
                    src={element.urlToImage}
                    alt={`NotÇðcia ${index + 1}`}
                  />
                  <h1 className="truncate text-2xl font-semibold text-slate-900">
                    {element.title}
                  </h1>
                </a>
                <p className="max-h-[3rem] overflow-hidden text-base leading-6 text-slate-600">
                  {element.description || ""}
                </p>
                <div className="mt-auto pt-2">
                  <button
                    className="w-fit rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 hover:shadow-md"
                    onClick={() => adicionarnoticia(element)}
                  >
                    salvar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default Main;
