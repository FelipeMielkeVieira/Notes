const crud = require("../../crud");

async function buscarLivros() {
    const dados = await crud.get("livros");

    const editoras = await crud.get("editoras");
    const autores = await crud.get("autores");
    const autoresLivros = await crud.get("livros_autores");

    dados.forEach((e) => {
        editoras.forEach((a) => {
            if(e.idEditora == a.id) {
                e.nomeEditora = a.nome
                delete e.idEditora
            }
        })
    })

    dados.forEach((e) => {
        let nomesAutores = [];
        autoresLivros.forEach((a) => {
            if(e.id == a.idLivro) {
                autores.forEach((b) => {
                    if(a.idAutor == b.id) {
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
    const autores = await crud.get("autores");
    const autoresLivros = await crud.get("livros_autores");
    
    dados.forEach((e) => {
        editoras.forEach((a) => {
            if(e.idEditora == a.id) {
                e.nomeEditora = a.nome
                delete e.idEditora
            }
        })
    })

    dados.forEach((e) => {
        let nomesAutores = [];
        autoresLivros.forEach((a) => {
            if(e.id == a.idLivro) {
                autores.forEach((b) => {
                    if(a.idAutor == b.id) {
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

    const editoras = await crud.get("editoras");
    let editoraExiste = false;

    const autores = await crud.get("autores");
    let autoresExistentes = 0;

    const livros = await buscarLivros();

    livros.forEach((e) => {
        if(e.isbn == dado.isbn) {
            return {"erro": "ISBN Inválido"}
        }
    })

    editoras.forEach((e) => {
        if(e.id == dado.idEditora) {
            editoraExiste = true;
        }
    })

    autores.forEach((e) => {
        const c = dado.autores.some(a => a == e.id);
        if(c) {
            autoresExistentes++;
        }
    })

    if(editoraExiste) {
        if(autoresExistentes == dado.autores.length) {
            let autoresLivro = dado.autores;

            delete dado.autores;
            const dados = await crud.save("livros", id, dado);

            criarRelacionamentoAutor(dados, id, autoresLivro);
            return dado;
        } else {
            return {"erro": (dado.autores.length - autoresExistentes) + " autores inválidos"}
        }
    } else {
        return {"erro: ": "Editora Inválida"}
    }
}

async function excluirLivro(id) {
    const dados = await crud.remove("livros", id);
    return dados;
}

async function criarRelacionamentoAutor(dado, id, autores) {
    autores.forEach(async function(e) {
        const dadosAutor = {
            idAutor: e,
            idLivro: dado.id
        }
        const autor = await crud.save("livros_autores", id, dadosAutor);
        return autor;
    })
}

module.exports = {
    buscarLivros,
    buscarPorId,
    criarLivro,
    excluirLivro
}