const express = require("express");
const router = express.Router();

const autoresHandler = require("./autores.handler");

router.get("/", (req, res) => {
    autoresHandler.buscarAutores().then((resposta) => res.json(resposta));
});

router.get("/:id", (req, res) => {
    autoresHandler.buscarPorId(req.params.id).then((resposta) => res.json(resposta));
});

router.post("/", (req, res) => {
    autoresHandler.criarAutor(undefined, req.body).then((resposta) => res.json(resposta));
});

router.delete("/:id", (req, res) => {
    autoresHandler.excluirAutor(req.params.id).then((resposta) => res.json(resposta));
})

module.exports = router;