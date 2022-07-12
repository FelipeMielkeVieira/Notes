const crud = require("../../crud");

async function buscarEditoras() {
    const dados = await crud.get("editoras");
    return dados;
}

async function buscarPorId(id) {
    const dados = await crud.getById("editoras", id);
    return dados;
}

async function criarEditora(id, dado) {
    const dados = await crud.save("editoras", id, dado);
    return dado;
}

async function excluirEditora(id) {
    const dados = await crud.remove("editoras", id);
    return dados;
}

module.exports = {
    buscarEditoras,
    buscarPorId,
    criarEditora,
    excluirEditora
}