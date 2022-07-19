const crud = require("../../crud");

async function buscarClientes() {
    const dados = await crud.get("clientes");
    return dados;
}

async function buscarPorId(id) {
    const dados = await crud.getById("clientes", id);
    return dados;
}

async function criarCliente(id, dado) {
    const clientes = await buscarClientes();
    clientes.forEach((e) => {
        if (e.cpf == dado.cpf) {
            return { "erro": "CPF já está sendo usado" }
        }
    })
    const dados = await crud.save("clientes", id, dado);
    return dado;
}

async function excluirCliente(id) {
    const dados = await crud.remove("clientes", id);
    return dados;
}

module.exports = {
    buscarClientes,
    buscarPorId,
    criarCliente,
    excluirCliente
}