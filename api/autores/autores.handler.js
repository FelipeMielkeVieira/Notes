const crud = require("../../crud");

async function buscarAutores() {
    const dados = await crud.get("autores");
    return dados;
}

async function buscarPorCpf(id) {
    const dados = await crud.getById("autores", id);
    return dados;
}

async function criarAutor(id, dado) {
    const dados = await crud.save("autores", id, dado);
    return dados;
}

module.exports = {
    buscarAutores,
    buscarPorCpf,
    criarAutor
}