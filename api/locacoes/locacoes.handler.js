const crud = require("../../crud");

async function buscarLocacoes() {
    const dados = await crud.get("locacoes");

    const clientes = await crud.get("clientes");
    dados.forEach((e) => {
        clientes.forEach((a) => {
            if (e.idCliente == a.id) {
                e.nomeCliente = a.nome
                delete e.idCliente
            }
        })
    })

    const livros = await crud.get("livros");
    const livrosLocacoes = await crud.get("locacoes_livros");
    dados.forEach((e) => {
        let nomesLivros = [];
        livrosLocacoes.forEach((a) => {
            if (e.id == a.idLocacao) {
                livros.forEach((b) => {
                    if (a.idLivro == b.id) {
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
    const dados = await crud.selectEditado("locacoes", "idCliente", id)

    const clientes = await crud.get("clientes");
    dados.forEach((e) => {
        clientes.forEach((a) => {
            if (e.idCliente == a.id) {
                e.nomeCliente = a.nome
                delete e.idCliente
            }
        })
    })

    const livros = await crud.get("livros");
    const livrosLocacoes = await crud.get("locacoes_livros");
    dados.forEach((e) => {
        let nomesLivros = [];
        livrosLocacoes.forEach((a) => {
            if (e.id == a.idLocacao) {
                livros.forEach((b) => {
                    if (a.idLivro == b.id) {
                        nomesLivros.push(b.nome);
                    }
                })
            }
        })
        e.livros = nomesLivros;
    })
    return dados;
}

async function criarLocacao(id, dado) {

    const clienteExistente = await crud.selectEditado("clientes", "id", dado.idCliente);
    if (!clienteExistente) {
        return { erro: "Cliente Inválido!" }
    }

    const livros = await crud.get("livros");
    if (!verificarLivros(livros, dado.livros)) {
        return { erro: "Há livros inválidos!" }
    }

    const locacoesLivros = await crud.get("locacoes_livros");
    const locacoes = await crud.get("locacoes");
    if(!verificarLivrosLocados(locacoesLivros, locacoes, dado.livros)) {
        return { erro: "Há livros já locados!"}
    }

    if(!verificarLivrosCliente(locacoes, dado.idCliente)) {
        return { erro: "O cliente já possui locações abertas!"}
    }

    let livrosLocacao = dado.livros;
    delete dado.livros;
    const dados = await crud.save("locacoes", id, dado);

    criarRelacionamentoLivro(dados, id, livrosLocacao);
    return dado;
}

function verificarLivros(livrosTotais, listaLivros) {
    let livrosExistentes = 0;
    livrosTotais.forEach((e) => {
        const c = listaLivros.some(a => a == e.id);
        if (c) {
            livrosExistentes++;
        }
    })
    if (livrosExistentes != listaLivros) {
        return false;
    } else {
        return true;
    }
}

function verificarLivrosLocados(locacoesLivros, locacoes, listaLivros) {
    let locacoesLivrosIguais = 0;

    locacoesLivros.forEach((e) => {
        locacoes.forEach((a) => {
            if (a.status == "Em Aberto" && a.id == e.idLocacao) {
                listaLivros.forEach((l) => {
                    if (l == e.idLivro) {
                        locacoesLivrosIguais++;
                    }
                })
            }
        })
    })

    if (locacoesLivrosIguais != 0) {
        return false;
    } else {
        return true;
    }
}

function verificarLivrosCliente(locacoes, idCliente) {
    let locacaoDisponivel = true;
    locacoes.forEach((e) => {
        if (e.idCliente == idCliente && e.status == "Em Aberto") {
            locacaoDisponivel = false;
        }
    })
    return locacaoDisponivel;
}

async function criarRelacionamentoLivro(dado, id, livros) {
    livros.forEach(async function (e) {
        const dadosLivro = {
            idLivro: e,
            idLocacao: dado.id
        }
        const livro = await crud.save("locacoes_livros", id, dadosLivro);
        return livro;
    })
}

async function baixarLocacao(id) {
    const dado = await crud.getById("locacoes", id);
    dado[0].status = "Finalizada";

    const dados = await crud.save("locacoes", id, dado[0]);
    return dados;
}

module.exports = {
    buscarLocacoes,
    buscarPorCliente,
    criarLocacao,
    baixarLocacao
}