const crud = require("../../crud");

async function buscarLocacoes() {
    const dados = await crud.get("locacoes");

    const clientes = await crud.get("clientes");
    const livros = await crud.get("livros");
    const livrosLocacoes = await crud.get("locacoes_livros");

    dados.forEach((e) => {
        clientes.forEach((a) => {
            if (e.idCliente == a.id) {
                e.nomeCliente = a.nome
                delete e.idCliente
            }
        })
    })

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
    const dados = await crud.get("locacoes");
    let dadosNovos = [];

    dados.forEach((e) => {
        if (e.idCliente == id) {
            dadosNovos.push(e);
        }
    })

    const clientes = await crud.get("clientes");
    const livros = await crud.get("livros");
    const livrosLocacoes = await crud.get("locacoes_livros");

    dadosNovos.forEach((e) => {
        clientes.forEach((a) => {
            if (e.idCliente == a.id) {
                e.nomeCliente = a.nome
                delete e.idCliente
            }
        })
    })

    dadosNovos.forEach((e) => {
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
    return dadosNovos;
}

async function criarLocacao(id, dado) {

    const clientes = await crud.get("clientes");
    let clienteExiste = false;

    const livros = await crud.get("livros");
    let livrosExistentes = 0;

    const locacoesLivros = await crud.get("locacoes_livros");
    let locacoesLivrosIguais = 0;

    const locacoes = await crud.get("locacoes");

    clientes.forEach((e) => {
        if (e.id == dado.idCliente) {
            clienteExiste = true;
        }
    })

    livros.forEach((e) => {
        const c = dado.livros.some(a => a == e.id);
        if (c) {
            livrosExistentes++;
        }
    })

    locacoesLivros.forEach((e) => {
        locacoes.forEach((a) => {
            if (a.status == "Em Aberto" && a.id == e.idLocacao) {
                dado.livros.forEach((l) => {
                    if (l == e.idLivro) {
                        locacoesLivrosIguais++;
                    }
                })
            }
        })
    })

    if (clienteExiste) {
        if (livrosExistentes == dado.livros.length) {

            let locacaoDisponivel = true;
            const locacoes = await crud.get("locacoes");
            locacoes.forEach((e) => {
                if (e.idCliente == dado.idCliente && e.status == "Em Aberto") {
                    locacaoDisponivel = false;
                }
            })

            if (locacaoDisponivel) {
                if (locacoesLivrosIguais == 0) {
                    let livrosLocacao = dado.livros;

                    delete dado.livros;
                    const dados = await crud.save("locacoes", id, dado);

                    criarRelacionamentoLivro(dados, id, livrosLocacao);
                    return dado;
                } else {
                    return { "erro": "O livro já está sendo alugado" }
                }
            } else {
                return { "erro": "Cliente já possui locação" }
            }
        } else {
            return { "erro": (dado.livros.length - livrosExistentes) + " livros inválidos" }
        }
    } else {
        return { "erro: ": "Cliente Inválido" }
    }
}

async function baixarLocacao(id) {
    const dado = await crud.getById("locacoes", id);
    dado[0].status = "Finalizada";

    const dados = await crud.save("locacoes", id, dado[0]);
    return dados;
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

module.exports = {
    buscarLocacoes,
    buscarPorCliente,
    criarLocacao,
    baixarLocacao
}