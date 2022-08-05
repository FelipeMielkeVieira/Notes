const crud = require("../../crud");

async function buscarLivros() {
    const dados = await crud.get("livros");

    dados.forEach((e) => {
        const editoraLivro = await crud.selectEditado("editoras", "id", e.idEditora);
        e.nomeEditora = editoraLivro[0].nome;
        delete e.idEditora;
    })

    dados.forEach((e) => {
        const idsAutores = await crud.selectEditado("livros_autores", "idLivro", e.id);
        const listaAutores = [];
        idsAutores.forEach((a) => {
            const nomeAutor = await crud.selectEditado("autores", "id", a);
            listaAutores.push(nomeAutor);
        })
        e.autores = listaAutores;
    })
    return dados;
}

async function buscarPorId(id) {
    const dados = await crud.getById("livros", id);

    dados.forEach((e) => {
        const editoraLivro = await crud.selectEditado("editoras", "id", e.idEditora);
        e.nomeEditora = editoraLivro[0].nome;
        delete e.idEditora;
    })

    dados.forEach((e) => {
        const idsAutores = await crud.selectEditado("livros_autores", "idLivro", e.id);
        const listaAutores = [];
        idsAutores.forEach((a) => {
            const nomeAutor = await crud.selectEditado("autores", "id", a);
            listaAutores.push(nomeAutor);
        })
        e.autores = listaAutores;
    })
    return dados;
}

async function criarLivro(id, dado) {

    const livroExistente = await crud.selectEditado("livros", "isbn", dado.isbn);
    if (livroExistente) {
        return { erro: "ISBN Inválido!" }
    }

    const editoraExiste = await crud.selectEditado("editoras", "id", dado.idEditora);
    if (editoraExiste) {
        return { erro: "Editora Inválida!" }
    }

    let autoresExistentes = 0;
    dado.autores.forEach((e) => {
        const autorExistente = await crud.selectEditado("autores", "id", e);
        if (autorExistente) {
            autoresExistentes++;
        }
    })

    if (autoresExistentes != dado.autores.length) {
        return { erro: (dado.autores.length - autoresExistentes) + " autores inválidos!" }
    }

    let autoresLivro = dado.autores;
    delete dado.autores;
    const dados = await crud.save("livros", id, dado);

    criarRelacionamentoAutor(dados, id, autoresLivro);
    return dado;
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