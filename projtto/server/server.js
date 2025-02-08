const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const session = require("express-session");
const app = express();
let port = 3008;
const cors = require("cors");

app.use(cors());

// Middleware para entender JSON no corpo da requisição
app.use(express.json());

// configurando o middleware de session 
app.use(
  session({
    secret:"chave",
    resave:"true",
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 30, // 30 minutos
      httpOnly: false,
      secure: false,
      sameSite: "strict",
    },
  })
)
// Criando conexão com MySQL
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "58627094",
  database: "portal_db",
});

// Verificando se a conexão foi bem-sucedida
connection.connect((err) => {
  if (err) {
    console.error("Erro na conexão:", err);
    return;
  }
  console.log("Conexão bem-sucedida! Thread ID:", connection.threadId);
});

// Rota para receber dados do formulário e cadastrar
app.post("/formulario", (req, res) => {
  const { nome, senha } = req.body;
  //verificar a senha e o nome com a expressao regular
  const nomeregular = /^[a-zA-Z0-9_-]{3,20}$/;
  if (!nomeregular.test(nome)) {
    return res
      .status(500)
      .json({ mensagem: "nome minimo 3 caracteres, apenas numeros e letras" });
  }
  if (!nomeregular.test(senha)) {
    return res
      .status(500)
      .json({ mensagem: "senha minimo 3 caracteres, apenas numeros e letras" });
  }

  // realizar consulta se o usuario ja existe
  const query1 = "SELECT COUNT(nome) As count FROM cliente WHERE nome = ?";
  connection.query(query1, [nome], (err, results) => {
    if (err) {
      console.error("Erro ao fazer a consulta:", err);
      return res.status(500).json({ mensagem: "erro ao fazer a consulta" });
    }
    if (results[0].count > 0) {
      return res.status(400).json({ mensagem: "usuario ja existe" });
    } else {
      //gerando hash da senha
      bcrypt.hash(senha, 10, (err, hash) => {
        if (err) {
          console.error("erro ao gerar hash");
          return;
        }
        // Inserindo dados no banco
        const query = "INSERT INTO cliente (nome, senha) VALUES (?, ?)";
        connection.query(query, [nome, hash], (err, results) => {
          if (err) {
            console.error("Erro ao inserir os dados:", err);
            res.status(500).json({
              status: "erro",
              mensagem: "Erro ao salvar os dados",
            });
            return;
          }

          console.log("Dados inseridos com sucesso");

          res.status(200).json({
            status: "sucesso",
            mensagem: "Dados recebidos",
          });
        });
      });
    }
  });
});
//rota para entrar com o usuario e senha 
app.post("/entrar", (req,res)=>{
    const {nome, senha} = req.body
    const nomeregular = /^[a-zA-Z0-9_-]{3,20}$/;
    if(!nomeregular.test(nome)){
      return res.status(500).json({mensagem:'nome minimo 3 caracteres, apenas numeros e letras'})
    }
    if(!nomeregular.test(senha)){
      return res.status(500).json({mensagem:'nome minimo 3 caracteres, apenas numeros e letras'})
    }
    // realizar consulta se o usuario e senha é valido
    
    const query2 = "select id,senha from cliente where nome = ?"
    connection.query(query2,[nome],(err,response)=>{
      if(err){
        console.log('erro ao fazer a consulta de usuario')
        return res.status(404).json({mensagem:'erro ao encontrar usuario'})
      }
      if(response.length === 0){
        return res.status(404).json({mensagem: 'usuario errado ou não encontrado'})
      }

      const user = response[0] // pegando o usuario 
      // comparar senha do usuario com a senha do banco de dados que esta em hash
      bcrypt.compare(senha, user.senha,(err,response)=>{ // pegando a linha com user e a coluna senha user.senha
        if(err){
          return res.status(500).json({mensagem: 'erro ao verificar senha'})
        }
        if(response){
          console.log("pode entrar")
          // gerar uma sessao para o cliente 
          req.session.user = user
          return res.status(200).json({ 
            status: 'sucesso',
            mensagem: 'sessao criada'})
          }else{
          return res.status(401).json({mensagem: 'senha errada'})
        }
      }) 
    })


})
// rota para logout
app.post('/logout',(req,res) =>{
  req.session.destroy((err)=>{
    if(err){
      return res.status(500).json({mensagem:'erro ao encerrar sessao'})
    }
    res.clearCookie("connect.sid");
    res.status(200).json({mensagem:'logout realizado com sucesso'})
  })
})


// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
