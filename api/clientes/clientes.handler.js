const crud = require("../../crud");

async function buscarClientes() {
    const dados = await crud.pegar("clientes");
    return dados;
}

async function buscarPorId(id) {
    const dados = await crud.pegarPorID("clientes", id);
    return dados;
}

async function criarCliente(id, dado) {

    if (!dado.cpf) {
        return { erro: "Digite o CPF!" }
    }
    if (!dado.nome) {
        return { erro: "Digite o nome!" }
    }

    const clienteExistente = await crud.selectEditado("clientes", "cpf", dado.cpf);
    if (!clienteExistente[0]) {
        const dados = await crud.salvar("clientes", id, dado);
        return dado;
    } else {
        return { erro: "CPF Inválido!" }
    }
}

async function excluirCliente(id) {
    const dados = await crud.remover("clientes", id);
    return dados;
}

module.exports = {
    buscarClientes,
    buscarPorId,
    criarCliente,
    excluirCliente
}