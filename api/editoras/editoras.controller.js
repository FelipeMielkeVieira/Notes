const express = require("express");
const router = express.Router();

const editorasHandler = require("./editoras.handler");

router.get("/", (req, res) => {
    editorasHandler.buscarEditoras().then((resposta) => res.json(resposta));
});

router.get("/:id", (req, res) => {
    editorasHandler.buscarPorId(req.params.id).then((resposta) => res.json(resposta));
});

router.post("/", (req, res) => {
    editorasHandler.criarEditora(undefined, req.body).then((resposta) => res.json(resposta));
});

router.delete("/:id", (req, res) => {
    editorasHandler.excluirEditora(req.params.id).then((resposta) => res.json(resposta));
})

module.exports = router;