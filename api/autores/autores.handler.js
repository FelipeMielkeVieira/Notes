const crud = require("../../crud");

async function buscarAutores() {
    const dados = await crud.get("autores");
    return dados;
}

async function buscarPorId(id) {
    const dados = await crud.getById("autores", id);
    return dados;
}

async function criarAutor(id, dado) {
    const autorExistente = await crud.selectEditado("autores", "cpf", dado.cpf);
    if(!autorExistente[0]) {
        const dados = await crud.save("autores", id, dado);
        return dado;
    } else {
        return {erro: "CPF Inválido!"}
    }
}

async function excluirAutor(id) {
    const dados = await crud.remove("autores", id);
    return dados;
}

module.exports = {
    buscarAutores,
    buscarPorId,
    criarAutor,
    excluirAutor
}