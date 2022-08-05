const crud = require("../../crud");

async function buscarAutores() {
    const dados = await crud.pegar("autores");
    return dados;
}

async function buscarPorId(id) {
    const dados = await crud.pegarPorID("autores", id);
    return dados;
}

async function criarAutor(id, dado) {

    if (!dado.cpf) {
        return { erro: "Digite o CPF!" }
    }
    if (!dado.nome) {
        return { erro: "Digite o nome!" }
    }

    const autorExistente = await crud.selectEditado("autores", "cpf", dado.cpf);
    if (!autorExistente[0]) {
        const dados = await crud.salvar("autores", id, dado);
        return dado;
    } else {
        return { erro: "CPF Inválido!" }
    }
}

async function excluirAutor(id) {
    const dados = await crud.remover("autores", id);
    return dados;
}

module.exports = {
    buscarAutores,
    buscarPorId,
    criarAutor,
    excluirAutor
}