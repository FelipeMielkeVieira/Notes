const express = require("express");
const router = express.Router();

const autoresHandler = require("./autores.handler");

router.get("/", (req, res) => {
    autoresHandler.buscarAutores().then((resposta) => res.json(resposta));
});

router.get("/:cpf", (req, res) => {
    res.json(autoresHandler.buscarPorCpf(req.params.cpf));
});

router.post("/", (req, res) => {
    res.json(autoresHandler.criarAutor(undefined, req.body));
});

router.put("/:id", (req, res) => {
    res.json(autoresHandler.criarAutor(req.params.id, req.body));
})

module.exports = router;