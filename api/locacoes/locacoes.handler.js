const crud = require("../../crud");

async function buscarLocacoes() {
    const dados = await crud.get("locacoes");

    const clientes = await crud.get("clientes");
    const livros = await crud.get("livros");
    const livrosLocacoes = await crud.get("locacoes_livros");

    dados.forEach((e) => {
        clientes.forEach((a) => {
            if(e.idCliente == a.id) {
                e.nomeCliente = a.nome
                delete e.idCliente
            }
        })
    })

    dados.forEach((e) => {
        let nomesLivros = [];
        livrosLocacoes.forEach((a) => {
            if(e.id == a.idLocacao) {
                livros.forEach((b) => {
                    if(a.idLivro == b.id) {
                        nomesLivros.push(b.nome);
                    }
                })
            }
        })
        e.livros = nomesLivros;
    })
    return dados;
}

async function buscarPorCliente(id) {
    const dados = await crud.get("locacoes");
    let dadosNovos = [];

    dados.forEach((e) => {
        if(e.idCliente == id) {
            dadosNovos.push(e);
        }
    })

    const clientes = await crud.get("clientes");
    const livros = await crud.get("livros");
    const livrosLocacoes = await crud.get("locacoes_livros");

    dadosNovos.forEach((e) => {
        clientes.forEach((a) => {
            if(e.idCliente == a.id) {
                e.nomeCliente = a.nome
                delete e.idCliente
            }
        })
    })

    dadosNovos.forEach((e) => {
        let nomesLivros = [];
        livrosLocacoes.forEach((a) => {
            if(e.id == a.idLocacao) {
                livros.forEach((b) => {
                    if(a.idLivro == b.id) {
                        nomesLivros.push(b.nome);
                    }
                })
            }
        })
        e.livros = nomesLivros;
    })

    return dadosNovos;
}

async function criarLocacao(id, dado) {

    const clientes = await crud.get("clientes");
    let clienteExiste = false;

    const livros = await crud.get("livros");
    let livrosExistentes = 0;

    clientes.forEach((e) => {
        if(e.id == dado.idCliente) {
            clienteExiste = true;
        }
    })

    livros.forEach((e) => {
        const c = dado.livros.some(a => a == e.id);
        if(c) {
            livrosExistentes++;
        }
    })

    if(clienteExiste) {
        if(livrosExistentes == dado.livros.length) {
            if(verificarDisponibilidadeCliente(dado.idCliente)) {
                let livrosLocacao = dado.livros;

                delete dado.livros;
                const dados = await crud.save("locacoes", id, dado);
    
                criarRelacionamentoLivro(dados, id, livrosLocacao);
                return dado;
            } else {
                return {"erro": "Cliente já possui locação"}
            }
        } else {
            return {"erro": (dado.livros.length - livrosExistentes) + " livros inválidos"}
        }
    } else {
        return {"erro: ": "Cliente Inválido"}
    }
}

async function baixarLocacao(id) {
    const dados = await crud.remove("locacoes", id);
    return dados;
}

async function criarRelacionamentoLivro(dado, id, livros) {
    livros.forEach(async function(e) {
        const dadosLivro = {
            idLivro: e,
            idLocacao: dado.id
        }
        const livro = await crud.save("locacoes_livros", id, dadosLivro);
        return livro;
    })
}

async function verificarDisponibilidadeCliente(id) {
    const locacoes = await crud.get("locacoes");
    locacoes.forEach(async (e) => {
        if(e.idCliente == id) {
            return false;
        }
    })
    return true;
}

module.exports = {
    buscarLocacoes,
    buscarPorCliente,
    criarLocacao,
    baixarLocacao
}