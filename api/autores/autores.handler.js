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
    const autores = await buscarAutores();
    autores.forEach((e) => {
        if(e.cpf == dado.cpf) {
            return {"erro": "CPF já está sendo usado"}
        }
    })

    const dados = await crud.save("autores", id, dado);
    return dado;
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