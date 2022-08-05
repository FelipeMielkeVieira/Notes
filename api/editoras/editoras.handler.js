const crud = require("../../crud");

async function buscarEditoras() {
    const dados = await crud.pegar("editoras");
    return dados;
}

async function buscarPorId(id) {
    const dados = await crud.pegarPorID("editoras", id);
    return dados;
}

async function criarEditora(id, dado) {

    if (!dado.nome) {
        return { erro: "Digite o nome!" }
    }

    const dados = await crud.salvar("editoras", id, dado);
    return dado;
}

async function excluirEditora(id) {
    const dados = await crud.remover("editoras", id);
    return dados;
}

module.exports = {
    buscarEditoras,
    buscarPorId,
    criarEditora,
    excluirEditora
}