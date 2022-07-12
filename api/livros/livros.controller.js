const express = require("express");
const router = express.Router();

const livrosHandler = require("./livros.handler");

router.get("/", (req, res) => {
    livrosHandler.buscarLivros().then((resposta) => res.json(resposta));
});

router.get("/:id", (req, res) => {
    livrosHandler.buscarPorId(req.params.id).then((resposta) => res.json(resposta));
});

router.post("/", (req, res) => {
    livrosHandler.criarLivro(undefined, req.body).then((resposta) => res.json(resposta));
});

router.delete("/:id", (req, res) => {
    livrosHandler.excluirLivro(req.params.id).then((resposta) => res.json(resposta));
})

module.exports = router;