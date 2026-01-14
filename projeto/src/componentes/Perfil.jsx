import React from "react";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Menu from "./Menu";
import "./Perfil.css";

function Perfil() {
  const [salvos, setSalvas] = useState([]);
  const [search, setSearch] = useState("");
  const [isopen, setOpen] = useState(false);

  const changeopen = () => {
    setOpen((prevState) => !prevState);
  };

  useEffect(() => {
    fetch("http://localhost:3008/noticiasSalvas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setSalvas(data));
  }, []);

  function atualizar() {
    fetch("http://localhost:3008/noticiasSalvas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setSalvas(data));
  }

  const deletarNoticia = (url) => {
    fetch("http://localhost:3008/deletarnoticia", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.mensagem);
      })
      .catch((error) => {
        console.error("erro ao deletar", error);
      });
    setSalvas((prevArray) => prevArray.filter((_, i) => i !== url));
    atualizar();
  };

  return (
    <div className="perfil-page">
      <Navbar
        Search={search}
        SetSearch={setSearch}
        Function={changeopen}
        Isopen={isopen}
      ></Navbar>
      <Menu Isopen={isopen} onClose={changeopen} />
      <section className="perfil-container">
        <header className="perfil-header">
          <h1 className="titulonoticias">Noticias salvas</h1>
          <button onClick={atualizar} className="buttonatualizar">
            Atualizar
          </button>
        </header>
        <div className="noticias-salvos">
          {salvos.slice(0, 40).map((element, index) => {
            if (!element) {
              return null;
            }

            const tituloBase =
              element.title ||
              element.titulo ||
              element.description ||
              element.descricao ||
              element.url ||
              "Sem titulo";
            const titulo =
              typeof tituloBase === "string" && tituloBase.trim() !== ""
                ? tituloBase
                : "Sem titulo";
            const imagem = element.urlToImage || element.img || "";

            return (
              <div key={index} className="noticia2">
                <a
                  href={element.url}
                  target="_blank"
                  rel="noreferrer"
                  className="noticia-link"
                >
                  <img src={imagem} alt={`Noticia salva ${index + 1}`} />
                  <h2 className="h1articles">{titulo}</h2>
                </a>
                <div className="noticia-actions">
                  <button
                    id={index}
                    url={element.url}
                    className="button-remover"
                    onClick={() => deletarNoticia(element.url)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
export default Perfil;
