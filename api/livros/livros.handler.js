const crud = require("../../crud");

async function buscarLivros() {
    const dados = await crud.get("livros");

    const editoras = await crud.get("editoras");
    dados.forEach((e) => {
        editoras.forEach((a) => {
            if (e.idEditora == a.id) {
                e.nomeEditora = a.nome
                delete e.idEditora
            }
        })
    })

    const autores = await crud.get("autores");
    const autoresLivros = await crud.get("livros_autores");
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
    const dados = await crud.getById("livros", id);

    const editoras = await crud.get("editoras");
    dados.forEach((e) => {
        editoras.forEach((a) => {
            if (e.idEditora == a.id) {
                e.nomeEditora = a.nome
                delete e.idEditora
            }
        })
    })

    const autores = await crud.get("autores");
    const autoresLivros = await crud.get("livros_autores");
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

    livroExistente = await crud.selectEditado("livros", "isbn", dado.isbn);
    if (livroExistente) {
        return { "erro": "ISBN Inválido" }
    }

    editoraExistente = await crud.selectEditado("editoras", "id", dado.idEditora);
    if (!editoraExistente) {
        return { erro: "Editora Inválida!" }
    }

    const autores = await crud.get("autores");
    if(!verificaAutores(autores, dado.autores)) {
        return { erro: "Há autores inválidos!"}
    }

    let autoresLivro = dado.autores;
    delete dado.autores;
    const dados = await crud.save("livros", id, dado);

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
        const autor = await crud.save("livros_autores", id, dadosAutor);
        return autor;
    })
}

async function excluirLivro(id) {
    const dados = await crud.remove("livros", id);
    return dados;
}

module.exports = {
    buscarLivros,
    buscarPorId,
    criarLivro,
    excluirLivro
}