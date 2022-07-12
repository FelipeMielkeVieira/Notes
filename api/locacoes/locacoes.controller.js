const express = require("express");
const router = express.Router();

const locacoesHandler = require("./locacoes.handler");

router.get("/", (req, res) => {
    locacoesHandler.buscarLocacoes().then((resposta) => res.json(resposta));
});

router.get("/:id", (req, res) => {
    locacoesHandler.buscarPorCliente(req.params.id).then((resposta) => res.json(resposta));
});

router.post("/", (req, res) => {
    locacoesHandler.criarLocacao(undefined, req.body).then((resposta) => res.json(resposta));
});

router.put("/:id", (req, res) => {
    locacoesHandler.baixarLocacao(req.params.id).then((resposta) => res.json(resposta));
})

module.exports = router;