// Pegando os itens do form e o form
let form = document.querySelector("form")
let inputDiaDaTarefa = document.getElementById("diaDaTarefa")
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
        horario:selectSelecaoHorario.value,
        detalhes:textAreaDetalhesDaTarefa.value,
    }

    localStorage.setItem("tarefas",JSON.stringify(tarefa))
    mostrar()
})

// Função para mostrar a lista
function pegarTarefasLocalStorage(){
    return JSON.parse(localStorage.getItem('tarefas')) ?? []
}

function mostrar(){
    let verTarefas = pegarTarefasLocalStorage()
    console.log(verTarefas)
}