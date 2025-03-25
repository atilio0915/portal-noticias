const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);
const cookieParser = require('cookie-parser');


const app = express();
let port = 3008;
const cors = require("cors");

app.use(cookieParser()); 

app.use(
  cors({
    origin: "http://localhost:3000", // Permitir apenas o frontend específico
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    credentials: true,
  })
);

// Middleware para entender JSON no corpo da requisição
app.use(express.json());

// Criar mysql da sessão
const sessionStore = new mysqlStore({
  host: "127.0.0.1",
  user: "root",
  password: "58627094",
  database: "portal_db",
  clearExpired: true,
  checkExpirationInterval: 900000, // Verifica sessões expiradas a cada 15 min
  expiration: 1000 * 60 * 30, // Expira em 30 min
});

// Configurando o middleware de session
app.use(
  session({
    secret: "chave",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 30, // 30 minutos
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  })
);

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
  const nomeregular = /^[a-zA-Z0-9_-]{3,20}$/;
  if (!nomeregular.test(nome)) {
    return res
      .status(500)
      .json({ mensagem: "Nome mínimo 3 caracteres, apenas números e letras" });
  }
  if (!nomeregular.test(senha)) {
    return res
      .status(500)
      .json({ mensagem: "Senha mínima 3 caracteres, apenas números e letras" });
  }

  // Realizar consulta se o usuário já existe
  const query1 = "SELECT COUNT(nome) AS count FROM cliente WHERE nome = ?";
  connection.query(query1, [nome], (err, results) => {
    if (err) {
      console.error("Erro ao fazer a consulta:", err);
      return res.status(500).json({ mensagem: "Erro ao fazer a consulta" });
    }
    if (results[0].count > 0) {
      return res.status(400).json({ mensagem: "Usuário já existe" });
    } else {
      // Gerando hash da senha
      bcrypt.hash(senha, 10, (err, hash) => {
        if (err) {
          console.error("Erro ao gerar hash");
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

// Rota para entrar com o usuário e senha
app.post("/entrar", (req, res) => {
  const { nome, senha } = req.body;
  const nomeregular = /^[a-zA-Z0-9_-]{3,20}$/;
  if (!nomeregular.test(nome)) {
    return res.status(500).json({ mensagem: "Nome mínimo 3 caracteres, apenas números e letras" });
  }
  if (!nomeregular.test(senha)) {
    return res.status(500).json({ mensagem: "Nome mínimo 3 caracteres, apenas números e letras" });
  }

  // Realizar consulta se o usuário e senha são válidos
  const query2 = "SELECT id, senha FROM cliente WHERE nome = ?";
  connection.query(query2, [nome], (err, response) => {
    if (err) {
      console.log("Erro ao fazer a consulta de usuário");
      return res.status(404).json({ mensagem: "Erro ao encontrar usuário" });
    }
    if (response.length === 0) {
      return res.status(404).json({ mensagem: "Usuário errado ou não encontrado" });
    }

    const user = response[0]; // Pegando o usuário
    // Comparar senha do usuário com a senha do banco de dados que está em hash
    bcrypt.compare(senha, user.senha, (err, result) => {
      if (err) {
        return res.status(500).json({ mensagem: "Erro ao verificar senha" });
      }
      if (result) {
        // Gerar uma sessão para o cliente
        req.session.user = { id: user.id, senha: user.senha };
        console.log(req.sessionID)
        
       // res.json({userID: req.session.user.id});
        console.log('cookie criado')
        
        console.log('Sessão antes do cookie:', req.session.user);
        
        //res.cookie("user_id", req.session.user.id, {
        //  maxAge: 1000 * 60 * 30, // 30 minutos
        //httpOnly: true,
        //  secure: false,
        // });
        console.log('passou')
 
        // Salvar a sessão de forma assíncrona
        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ 
              status: "erro", // é necessario colocar o status erro para o catch capturar
              mensagem: "Erro ao salvar sessão" });
          }
          console.log("Sessão após salvar:", req.session); // Aqui já deve estar disponível

          return res.status(200).json({
            userID: req.session.user.id,
            status: "sucesso",
            mensagem: "Sessão criada",
          });
        });
      } else {
        return res.status(401).json({ mensagem: "Senha errada" });
      }
    });
  });
});

// Rota para logout
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ mensagem: "Erro ao encerrar sessão" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ mensagem: "Logout realizado com sucesso" });
  });
});

// Middleware para verificar autenticação
function verificarAutenticacao(req, res, next) {
  
  if ( !req.cookies.user_id) {
   console.log("Sessão inválida ou não autenticada:");
  return res.status(401).json({ erro: "Usuário não autenticado" });
 }

  console.log("Usuário autenticado:",req.cookies.user_id);
  next(); // Se o usuário estiver autenticado, segue para a próxima função
}

// Rota para pegar notícias salvas no banco
app.get('/noticiasSalvas', (req, res) => {
  const query = "SELECT * FROM noticiassalvas WHERE user_id = ?";
  const userid =  req.cookies.user_id
  console.log("noticias salvas",userid)
  connection.query(query,[req.cookies.user_id] ,(err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao achar tabela de notícias salvas" });
    res.json(results);
  });
});

// remover noticias salvas 
app.delete("/deletarnoticia", (req,res) => {
  const url = req.body.url;

  const query = " DELETE from noticiassalvas WHERE url = ?"
  connection.query(query, [url], (err, results) => {
     if(err){
      res.status(500).json({error : "nao conseguir deletar"})
      console.log("nao deletada")
     }
     console.log("deletada")
     res.json({message: "noticia deletada "})
  })
})  




// Rota para adicionar notícias salvas
app.post('/adicionarnoticias', verificarAutenticacao, (req, res) => {
  console.log('passou2');
  const noticia = req.body;
  const titulo = noticia.title;
  const url = noticia.url;
  const img = noticia.urlToImage;
  const descricao = noticia.description;
  const userid =  req.cookies.user_id // Acessando diretamente o cookie para obter o ID do usuário
  const query = 'INSERT INTO noticiassalvas (user_id, titulo, descricao, url, img) VALUES (?,?,?,?,?)';
  connection.query(query, [userid, titulo, descricao, url, img], (err, results) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao inserir notícia" });
    }
    res.status(200).json({ mensagem: "Sucesso ao salvar notícia" });
  });
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
