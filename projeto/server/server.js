const path = require("path");
const express = require("express");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const port = 3008;

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const dbConfig = {
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT),
};

const pool = new Pool(dbConfig);

const sessionStore = new pgSession({
  pool,
  tableName: "session",
  createTableIfMissing: true,
});

app.use(
  session({
    secret: "chave",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 30,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  })
);

function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

pool.query("SELECT 1").then(() => {
  console.log("Conexao com Postgres OK");
}).catch((err) => {
  console.error("Erro na conexao:", err);
});

app.post("/formulario", async (req, res) => {
  const { nome, senha } = req.body;
  const nomeregular = /^[a-zA-Z0-9_-]{3,20}$/;
  if (!nomeregular.test(nome)) {
    return res
      .status(500)
      .json({ mensagem: "Nome minimo 3 caracteres, apenas numeros e letras" });
  }
  if (!nomeregular.test(senha)) {
    return res
      .status(500)
      .json({ mensagem: "Senha minima 3 caracteres, apenas numeros e letras" });
  }

  try {
    const query1 = "SELECT COUNT(nome) AS count FROM cliente WHERE nome = $1";
    const results = await pool.query(query1, [nome]);
    if (Number(results.rows[0].count) > 0) {
      return res.status(400).json({ mensagem: "Usuario ja existe" });
    }

    const hash = await bcrypt.hash(senha, 10);
    const query = "INSERT INTO cliente (nome, senha) VALUES ($1, $2)";
    await pool.query(query, [nome, hash]);

    console.log("Dados inseridos com sucesso");

    return res.status(200).json({
      status: "sucesso",
      mensagem: "Dados recebidos",
    });
  } catch (err) {
    console.error("Erro ao inserir os dados:", err);
    return res.status(500).json({
      status: "erro",
      mensagem: "Erro ao salvar os dados",
    });
  }
});

app.post("/entrar", async (req, res) => {
  const { nome, senha } = req.body;
  const nomeregular = /^[a-zA-Z0-9_-]{3,20}$/;
  if (!nomeregular.test(nome)) {
    return res.status(500).json({ mensagem: "Nome minimo 3 caracteres, apenas numeros e letras" });
  }
  if (!nomeregular.test(senha)) {
    return res.status(500).json({ mensagem: "Nome minimo 3 caracteres, apenas numeros e letras" });
  }

  try {
    const query2 = "SELECT id, senha FROM cliente WHERE nome = $1";
    const response = await pool.query(query2, [nome]);
    if (response.rows.length === 0) {
      return res.status(404).json({ mensagem: "Usuario errado ou nao encontrado" });
    }

    const user = response.rows[0];
    const result = await bcrypt.compare(senha, user.senha);
    if (!result) {
      return res.status(401).json({ mensagem: "Senha errada" });
    }

    req.session.user = { id: user.id, senha: user.senha };
    console.log(req.sessionID);

    console.log("cookie criado");
    console.log("Sessao antes do cookie:", req.session.user);
    console.log("passou");

    await saveSession(req);
    console.log("Sessao apos salvar:", req.session);

    return res.status(200).json({
      userID: req.session.user.id,
      status: "sucesso",
      mensagem: "Sessao criada",
    });
  } catch (err) {
    console.log("Erro ao fazer a consulta de usuario");
    return res.status(404).json({ mensagem: "Erro ao encontrar usuario" });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ mensagem: "Erro ao encerrar sessao" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ mensagem: "Logout realizado com sucesso" });
  });
});

function verificarAutenticacao(req, res, next) {
  if (!req.cookies.user_id) {
    console.log("Sessao invalida ou nao autenticada:");
    return res.status(401).json({ erro: "Usuario nao autenticado" });
  }

  console.log("Usuario autenticado:", req.cookies.user_id);
  next();
}

app.get("/noticiasSalvas", async (req, res) => {
  const userid = req.cookies.user_id;
  console.log("noticias salvas", userid);
  try {
    const results = await pool.query(
      "SELECT * FROM noticiassalvas WHERE user_id = $1",
      [req.cookies.user_id]
    );
    res.json(results.rows);
  } catch (err) {
    return res.status(500).json({ erro: "Erro ao achar tabela de noticias salvas" });
  }
});

app.delete("/deletarnoticia", async (req, res) => {
  const url = req.body.url;

  const query = "DELETE from noticiassalvas WHERE url = $1";
  try {
    await pool.query(query, [url]);
    console.log("deletada");
    res.json({ message: "noticia deletada " });
  } catch (err) {
    res.status(500).json({ error: "nao conseguir deletar" });
    console.log("nao deletada");
  }
});

app.post("/adicionarnoticias", verificarAutenticacao, async (req, res) => {
  console.log("passou2");
  const noticia = req.body;
  const titulo = noticia.title;
  const url = noticia.url;
  const img = noticia.urlToImage;
  const descricao = noticia.description;
  const userid = req.cookies.user_id;
  const query = "INSERT INTO noticiassalvas (user_id, titulo, descricao, url, img) VALUES ($1,$2,$3,$4,$5)";
  try {
    await pool.query(query, [userid, titulo, descricao, url, img]);
    res.status(200).json({ mensagem: "Sucesso ao salvar noticia" });
  } catch (err) {
    return res.status(500).json({ erro: "Erro ao inserir noticia" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
