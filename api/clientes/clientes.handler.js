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
    const clienteExistente = await crud.selectEditado("clientes", "cpf", dado.cpf);
    if(!clienteExistente) {
        const dados = await crud.save("cliente", id, dado);
        return dado;
    } else {
        return {erro: "CPF Inválido!"}
    }
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