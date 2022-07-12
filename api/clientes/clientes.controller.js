const express = require("express");
const router = express.Router();

const clientesHandler = require("./clientes.handler");

router.get("/", (req, res) => {
    clientesHandler.buscarClientes().then((resposta) => res.json(resposta));
});

router.get("/:id", (req, res) => {
    clientesHandler.buscarPorId(req.params.id).then((resposta) => res.json(resposta));
});

router.post("/", (req, res) => {
    clientesHandler.criarCliente(undefined, req.body).then((resposta) => res.json(resposta));
});

router.delete("/:id", (req, res) => {
    clientesHandler.excluirCliente(req.params.id).then((resposta) => res.json(resposta));
})

module.exports = router;