// Pegando os itens do form e o form
let form = document.querySelector("form")
let inputDiaDaTarefa = document.getElementById("diaDaTarefa")
let inputTituloDaTarefa = document.getElementById("tituloDaTarefa")
let selectSelecaoHorario = document.getElementById("selecaoHorario")
let textAreaDetalhesDaTarefa = document.getElementById("detalhesDaTarefa")
let botaoSubmit = document.getElementById("botaoSubmit")

// Pegando o main e os seus elementos
let listaDasTarefas = document.getElementById("listaDasTarefas")

// Anulando o submit do form
form.addEventListener("submit",function criarTarefa(event){
    event.preventDefault()
    let tarefa ={
        dia:inputDiaDaTarefa.value,
        titulo:inputTituloDaTarefa.value,
        horario:selectSelecaoHorario.value,
        detalhes:textAreaDetalhesDaTarefa.value,
    }

    adicionarTarefa(tarefa)
    mostrar()
})

// Funções para adicionar a tarefa
function adicionarTarefa(tarefa){
    let tarefas = pegarTarefasLocalStorage();
    tarefas.push(tarefa)
    adicionarClienteLocalStorage(tarefas)
}

function adicionarClienteLocalStorage(tarefas){
    return localStorage.setItem("tarefas",JSON.stringify(tarefas))
}

// Função para mostrar a lista
function pegarTarefasLocalStorage(){
    return JSON.parse(localStorage.getItem('tarefas')) ?? []
}

async function mostrar(){
    let verTarefas = await pegarTarefasLocalStorage()
    console.log(verTarefas)
    verTarefas.forEach(tarefa => {
        listaDasTarefas.innerHTML += `
        <div>
            <h2>Dia:${tarefa.dia}</h2>
            <h3>${tarefa.titulo}</h3>
            <p>Horario:${tarefa.horario}</p>
            <p>Sobre:${tarefa.detalhes}</p>
        </div>`
    });
}

mostrar()