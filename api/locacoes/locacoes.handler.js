const crud = require("../../crud");

async function buscarLocacoes() {
    const dados = await crud.get("locacoes");

    dados.forEach((e) => {
        const cliente = await crud.selectEditado("clientes", "id", e.idCliente)
        e.nomeCliente = cliente[0].nome;
        delete idCliente;
    })

    dados.forEach((e) => {
        const idsLivros = await crud.selectEditado("locacoes_livros", "idLocacao", e.id);
        const listaLivros = [];
        idsLivros.forEach((a) => {
            const nomeLivro = await crud.selectEditado("livros", "id", a);
            listaLivros.push(nomeLivro);
        })
        e.livros = listaLivros;
    })

    return dados;
}

async function buscarPorCliente(id) {
    const dados = await crud.selectEditado("locacoes", "idCliente", id);

    dados.forEach((e) => {
        const cliente = await crud.selectEditado("clientes", "id", e.idCliente)
        e.nomeCliente = cliente[0].nome;
        delete idCliente;
    })

    dados.forEach((e) => {
        const idsLivros = await crud.selectEditado("locacoes_livros", "idLocacao", e.id);
        const listaLivros = [];
        idsLivros.forEach((a) => {
            const nomeLivro = await crud.selectEditado("livros", "id", a);
            listaLivros.push(nomeLivro);
        })
        e.livros = listaLivros;
    })

    return dados;
}

async function criarLocacao(id, dado) {

    const locacoes = await crud.get("locacoes");

    const clienteExistente = await crud.selectEditado("cliente", "id", dado.idCliente);
    if (!clienteExistente) {
        return { erro: "Cliente Inválido!" }
    }

    const livros = await crud.get("livros");
    if(!verificarLivrosInvalidos(livros, dado.livros)) {
        return { erro: "Há livros inválidos na locação!"}
    }

    const locacoesLivros = await crud.get("locacoes_livros");
    if (!verificarLivrosLocados(locacoes, locacoesLivros, dado.livros)) {
        return { erro: "Há livros já locados!" }
    }

    if (!clienteDisponivel(locacoes, dado.idCliente)) {
        return { erro: "Cliente já possui locação aberta!" }
    }

    let livrosLocacao = dado.livros;
    delete dado.livros;
    const dados = await crud.save("locacoes", id, dado);

    criarRelacionamentoLivro(dados, id, livrosLocacao);
    return dado;
}

function verificarLivrosInvalidos(livrosTotais, listaLivros) {
    let livrosExistentes = 0;
    livrosTotais.forEach((e) => {
        const c = listaLivros.some(a => a == e.id);
        if (c) {
            livrosExistentes++;
        }
    })
    if (livrosTotais < listaLivros.length) {
        return false;
    } else {
        return true;
    }
}

function verificarLivrosLocados(locacoes, locacoesLivros, listaLivros) {
    let locacoesLivrosIguais = 0;
    locacoesLivros.forEach((e) => {
        locacoes.forEach((a) => {
            if (a.status == "Em Aberto" && a.id == e.idLocacao) {
                listaLivros.forEach((b) => {
                    if (b == e.idLivro) {
                        locacoesLivrosIguais++;
                    }
                })
            }
        })
    })
    if(locacoesLivrosIguais > 0) {
        return false;
    } else {
        return true;
    }
}

function clienteDisponivel(locacoes, idCliente) {
    let locacaoDisponivel = true;
    locacoes.forEach((e) => {
        if (e.idCliente == idCliente && e.status == "Em Aberto") {
            locacaoDisponivel = false;
        }
    })
    return locacaoDisponivel;
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