import React from "react";
import "../componentes/Cadastro.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Entrar() {
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
        console.log("dados recebidos");
        alert(data.mensagem);
        if (data.status === "sucesso") {
          navigate("/home");
        }
      })
      // terceiro é o erro ao enviar a requisicao
      .catch((error) => {
        console.error("erro ao enviar a requisição");
      });
  };

  const voltar = (e) => {
    e.preventDefault();
    navigate("/");
  };
  return (
    <div>
      <div className="form">
        <h1>Entrar</h1>
        <form onSubmit={send} className="form-input">
          <div>
            <label htmlFor="">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={value.nome}
              onChange={change}
              placeholder="digite seu nome"
            />
            <label htmlFor="">Senha</label>
            <input
              type="text"
              id="senha"
              name="senha"
              value={value.senha}
              onChange={change}
              placeholder="digite sua senha"
            />
          </div>
          <button type="submit">ENTRAR</button>
          <button onClick={voltar}>VOLTAR</button>
        </form>
      </div>
    </div>
  );
}

export default Entrar;
