import React from "react";
import "../componentes/Cadastro.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Cadastro() {
  const [form, setForm] = useState({ nome: "", senha: "" });
  const navigate = useNavigate();
  const change = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const send = (e) => {
    e.preventDefault();
      // fecth pra enviar os dados ao servidor 
      fetch('http://localhost:3008/formulario',{
        method: 'POST', // metodo post pois é pra enviar
        headers:{ // qual tipo de dados é 
          'Content-Type' : 'application/json',

        },
        body: JSON.stringify(form),// transforma os dados em uma string json para facilitar a leitura do servidor 
      })
      .then(response => response.json()) // recebe a resposta e transforma em json 
      .then(data => { 
        console.log('dados recebidos')
        alert(data.mensagem)
        if(data.status === "sucesso"){
          navigate("/entrar")
        }
      })
      .catch(error => { // se der error no servidor ele retornara uma msg de error
        console.error('erro',error)
      })
    };

    const entrar = (e) => {
      e.preventDefault();
      navigate("/entrar")
    };

  return (
    <div className="">
      <div className="form">
        <h1>Cadastro</h1>
        <form onSubmit={send} className="form-input">
          <div>
            <label htmlFor="name" style={{color: 'black',fontSize:'2rem'}}>Nome</label>
            <input
              type="text"
              placeholder="digite seu nome "
              id="name"
              name="nome"
              value={form.nome}
              onChange={change}
            />
            <label htmlFor="senha" style={{color: 'black',fontSize:'2rem'}}>Senha</label>
            <input
              type="text"
              placeholder="digite sua senha "
              id="senha"
              name="senha"
              value={form.senha}
              onChange={change}
            />
          </div>
          <button type="submit"> CADASTRAR</button>
          <button onClick={entrar}> ENTRAR </button>
        </form>
        
       
      </div>
    </div>
  );
}
export default Cadastro;
