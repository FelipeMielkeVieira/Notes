const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, addDoc, query, where, getDocs, getDoc, deleteDoc
} = require('firebase/firestore/lite');

const firebaseConfig = {
    apiKey: "AIzaSyAh2_FOgKil-_-0qnpxsCNIvMzjX2NZtO0",
    authDomain: "atividade-biblioteca-felipemv.firebaseapp.com",
    projectId: "atividade-biblioteca-felipemv",
    storageBucket: "atividade-biblioteca-felipemv.appspot.com",
    messagingSenderId: "673571470870",
    appId: "1:673571470870:web:88f184204fec0d137a7f37"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore();

async function save(nomeTabela, id, dado) {
    if (id) {
        const entidadeReferenciada = await setDoc(doc(db, nomeTabela, id), dado);
        const dadosSalvos = {
            ...dado,
            id: id
        }
        return dadosSalvos;
    } else {
        const entidadeReferenciada = await addDoc(collection(db, nomeTabela), dado);
        const dadosSalvos = {
            ...dado,
            id: entidadeReferenciada.id
        }
        return dadosSalvos;
    }
}

async function get(nomeTabela) {
    const tableRef = collection(db, nomeTabela);

    const q = query(tableRef);

    const querySnapshot = await getDocs(q);

    const lista = [];

    querySnapshot.forEach((doc) => {
        const data = {
            ...doc.data(),
            id: doc.id
        }
        lista.push(data);
    });
    return lista;
}

async function getById(nomeTabela, id) {
    const tableRef = collection(db, nomeTabela);

    const q = query(tableRef);

    const querySnapshot = await getDocs(q);

    const lista = [];

    querySnapshot.forEach((doc) => {
        if (id == doc.id) {
            const data = {
                ...doc.data(),
                id: doc.id
            }
            lista.push(data);
        }
    });
    return lista;
}

async function remove(nomeTabela, id) {
    const dado = await deleteDoc(doc(db, nomeTabela, id));
    return {
        message: `${id} deleted`
    }
}

async function returnSelect(nomeTabela, nomeDado, dado) {
    const tableRef = collection(db, nomeTabela);
    const q = query(tableRef, where(nomeDado, "==", dado));
    const data = await getDocs(q)

    const lista = [];

    data.forEach((doc) => {
        const data = {
            ...doc.data(),
            id: doc.id
        }
        lista.push(data);
    })

    return lista;
}

module.exports = {
    save,
    get,
    getById,
    remove,
    returnSelect
}