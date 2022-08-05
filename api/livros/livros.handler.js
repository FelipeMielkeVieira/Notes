const crud = require("../../crud");

async function buscarLivros() {
    const dados = await crud.pegar("livros");

    const editoras = await crud.pegar("editoras");
    dados.forEach((e) => {
        editoras.forEach((a) => {
            if (e.idEditora == a.id) {
                e.nomeEditora = a.nome
                delete e.idEditora
            }
        })
    })

    const autores = await crud.pegar("autores");
    const autoresLivros = await crud.pegar("livros_autores");
    dados.forEach((e) => {
        let nomesAutores = [];
        autoresLivros.forEach((a) => {
            if (e.id == a.idLivro) {
                autores.forEach((b) => {
                    if (a.idAutor == b.id) {
                        nomesAutores.push(b.nome);
                    }
                })
            }
        })
        e.autores = nomesAutores;
    })
    return dados;
}

async function buscarPorId(id) {
    const dados = await crud.pegarPorID("livros", id);

    const editoras = await crud.pegar("editoras");
    dados.forEach((e) => {
        editoras.forEach((a) => {
            if (e.idEditora == a.id) {
                e.nomeEditora = a.nome
                delete e.idEditora
            }
        })
    })

    const autores = await crud.pegar("autores");
    const autoresLivros = await crud.pegar("livros_autores");
    dados.forEach((e) => {
        let nomesAutores = [];
        autoresLivros.forEach((a) => {
            if (e.id == a.idLivro) {
                autores.forEach((b) => {
                    if (a.idAutor == b.id) {
                        nomesAutores.push(b.nome);
                    }
                })
            }
        })
        e.autores = nomesAutores;
    })
    return dados;
}

async function criarLivro(id, dado) {

    if (!dado.isbn) {
        return { erro: "Digite o ISBN!" }
    }
    if (!dado.nome) {
        return { erro: "Digite o nome do livro!" }
    }
    if (!dado.genero) {
        return { erro: "Digite o gênero do livro!" }
    }
    if (!dado.idEditora) {
        return { erro: "Digite o ID da Editora!" }
    }
    if (!dado.autores) {
        return { erro: "Digite os IDs dos autores!" }
    }

    livroExistente = await crud.selectEditado("livros", "isbn", dado.isbn);
    if (livroExistente[0]) {
        return { "erro": "ISBN Inválido" }
    }

    editoraExistente = await crud.pegarPorID("editoras", dado.idEditora);
    if (!editoraExistente) {
        return { erro: "Editora Inválida!" }
    }

    const autores = await crud.pegar("autores");
    if (!verificaAutores(autores, dado.autores)) {
        return { erro: "Há autores inválidos!" }
    }

    let autoresLivro = dado.autores;
    delete dado.autores;
    const dados = await crud.salvar("livros", id, dado);

    criarRelacionamentoAutor(dados, id, autoresLivro);
    return dado;
}

function verificaAutores(autoresTotais, listaAutores) {
    let autoresExistentes = 0;
    autoresTotais.forEach((e) => {
        const c = listaAutores.some(a => a == e.id);
        if (c) {
            autoresExistentes++;
        }
    })

    if (autoresExistentes != listaAutores.length) {
        return false
    } else {
        return true;
    }
}

async function criarRelacionamentoAutor(dado, id, autores) {
    autores.forEach(async function (e) {
        const dadosAutor = {
            idAutor: e,
            idLivro: dado.id
        }
        const autor = await crud.salvar("livros_autores", id, dadosAutor);
        return autor;
    })
}

async function excluirLivro(id) {
    const dados = await crud.remover("livros", id);
    return dados;
}

module.exports = {
    buscarLivros,
    buscarPorId,
    criarLivro,
    excluirLivro
}