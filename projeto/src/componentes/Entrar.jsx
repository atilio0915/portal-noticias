import React from "react";
import "../componentes/Cadastro.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";


function Entrar() {
  const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
  const [value, Setvalue] = useState({ nome: "", senha: "" });
  const navigate = useNavigate();
  const change = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    Setvalue((prevValue) => ({
      ...prevValue, // pega o valor atualizado do estado
      [name]: value,
    }));
  };

  const send = (e) => {
    e.preventDefault();
    fetch("http://localhost:3008/entrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    })
      // primeiro then resposta do servidor
      .then((response) => response.json())
      // segundo then manipulacao de dados
      .then((data) => {
        setCookie('user_id',data.userID);// pegando o userID e setando o cookie
        console.log("dados recebidos");
        alert(data.mensagem);
        if (data.status === "sucesso") {
          navigate("/home");
        }
      })
      // terceiro é o erro ao enviar a requisicao
      .catch((error) => {
        console.error("erro ao enviar a requisição");
        alert(error.mensagem)
      });
  };

  const voltar = (e) => {
    e.preventDefault();
    navigate("/");
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Entrar</h1>
        <form onSubmit={send} className="auth-form">
          <div className="auth-fields">
            <label htmlFor="nome" className="auth-label">
              Nome
            </label>
            <input
              className="auth-input"
              type="text"
              id="nome"
              name="nome"
              value={value.nome}
              onChange={change}
              placeholder="digite seu nome"
            />
            <label htmlFor="senha" className="auth-label">
              Senha
            </label>
            <input
              className="auth-input"
              type="password"
              id="senha"
              name="senha"
              value={value.senha}
              onChange={change}
              placeholder="digite sua senha"
            />
          </div>
          <button className="auth-button primary" type="submit">
            Entrar
          </button>
          <button className="auth-button ghost" onClick={voltar} type="button">
            Voltar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Entrar;
