'use strict'
// Pegando os itens do form e o form
let form = document.querySelector("form")
let inputDiaDaTarefa = document.getElementById("diaDaTarefa")
let inputTituloDaTarefa = document.getElementById("tituloDaTarefa")
let selectSelecaoHorario = document.getElementById("selecaoHorario")
let textAreaDetalhesDaTarefa = document.getElementById("detalhesDaTarefa")
let botaoSubmit = document.getElementById("botaoSubmit")

// Pegando o main e os seus elementos
let listaDasTarefas = document.getElementById("listaDasTarefas")
let paginas = document.getElementById("paginas")
let abasNoMenu = []

let btnLimparTodasAsTarefas = document.getElementById("limparTodasAsTarefas")

// Anulando o submit do form
form.addEventListener("submit", function criarTarefa(event) {
    event.preventDefault()
    let tarefa = {
        dia: verificarZeroNaFrenteDodia(),
        titulo: inputTituloDaTarefa.value,
        horario: selectSelecaoHorario.value,
        detalhes: textAreaDetalhesDaTarefa.value,
        id: novoId()
    }

    adicionarTarefa(tarefa)
    adicionarDiasAoMenu()
    mostrar(tarefa.dia)
    limparForm()
})
// Função para verificar se o dia tem 0 na frente

function verificarZeroNaFrenteDodia(){
    let separarDiaValue = Number(inputDiaDaTarefa.value)
    let valorReal = separarDiaValue * 1
    
    return valorReal
}

// Criar id para cada tarefa
function criarId(index){
    return localStorage.setItem("id",JSON.stringify(index))
}

function novoId(){
    let ids =  JSON.parse(localStorage.getItem('id')) ?? []
    ids++
    // console.log(ids)
    criarId(ids)
    return ids - 1
}



// Função para limpar o form
function limparForm(){
        inputDiaDaTarefa.value  = ''
        inputTituloDaTarefa.value  = ''
        selectSelecaoHorario.value  = ''
        textAreaDetalhesDaTarefa.value  = ''
}

// Funções para adicionar a tarefa
function adicionarTarefa(tarefa) {
    let tarefas = pegarTarefasLocalStorage();
    tarefas.push(tarefa)
    adicionarClienteLocalStorage(tarefas)
}

function adicionarClienteLocalStorage(tarefas) {
    return localStorage.setItem("tarefas", JSON.stringify(tarefas))
}

// Função para mostrar a lista
function pegarTarefasLocalStorage() {
    return JSON.parse(localStorage.getItem('tarefas')) ?? []
}

async function mostrar(valor) {
    let verTarefas = await pegarTarefasLocalStorage()

    let tarefasFiltradasPorDia = verTarefas.filter(tarefa => tarefa.dia == valor)
    paginas.innerHTML = ``
    tarefasFiltradasPorDia.forEach(tarefa => {
        paginas.innerHTML += `
        <div class="tarefas">
            <h2>Dia:${tarefa.dia}</h2>
            <h3>${tarefa.titulo}</h3>
            <p>Horario:${tarefa.horario}</p>
            <p>Sobre:${tarefa.detalhes}</p>
            <button type="button" data-acao="editar-${tarefa.id}">Editar</button>
            <button type="button" data-acao="deletar-${tarefa.id}">Excluir</button>
        </div>`
    });
}


// filtro por dia

async function filtrarDias() {
    let verTarefas = await pegarTarefasLocalStorage()
    let diasAdicionados = []
    verTarefas.forEach(tarefa => {
        diasAdicionados.push(tarefa.dia)
    })
    let diasFiltrados = [...new Set(diasAdicionados)]
    return await diasFiltrados.sort((a, b) => a - b)
}

let listaDeDias = document.getElementById("listaDeDias")


async function adicionarDiasAoMenu() {
    let diasCriados = await filtrarDias()

    listaDeDias.innerHTML = ``

    await diasCriados.forEach(dia => {listaDeDias.innerHTML += `
    <menuitem class="diaNoMenu" data-diaNoMenu="${dia}">Dia ${dia}</menuitem>`
    })
    abasNoMenu = await document.querySelectorAll("[data-diaNoMenu]")
    abasNoMenu.forEach(diaNoMenu=>{
        diaNoMenu.addEventListener("click",()=>{
            let valor = diaNoMenu.getAttribute("data-diaNoMenu")
            mostrar(valor)
        })
    })
}

adicionarDiasAoMenu()

// editar a tarefa e excluir


document.querySelector("#listaDasTarefas>div")
    .addEventListener("click", editarExcluir)

function editarExcluir(event){
    if(event.target.type == "button"){
        
        let [acao,index] = event.target.dataset.acao.split("-")
        let idTarefa = pegarIndexDaTarefa(index)

        if(acao == "editar"){
            editarTarefa(idTarefa)
        }else{
            let tarefa = pegarTarefasLocalStorage()[idTarefa]
            let resposta = confirm(`Tem certaza que deseja excluir a tarefa ${tarefa.titulo}`)
            if(resposta){
                excluirTarefa(idTarefa)
            }
        }
    }
}

function editarTarefa(index){
    let tarefa = pegarTarefasLocalStorage()[index]
    tarefa.id = index
    console.log(`isso aqui ${tarefa.id}`)
    completarForm(tarefa)
}

function completarForm(tarefa){
        inputDiaDaTarefa.value  = tarefa.dia
        inputTituloDaTarefa.value  = tarefa.titulo
        selectSelecaoHorario.value  = tarefa.horario
        textAreaDetalhesDaTarefa.value  = tarefa.detalhes
}

function excluirTarefa(index){
    let tarefa = pegarTarefasLocalStorage()
    tarefa.splice(index,1)
    adicionarClienteLocalStorage(tarefa)
    location.reload()
}

function pegarIndexDaTarefa(codigo){
    let verTarefas = pegarTarefasLocalStorage()
    return verTarefas.findIndex(tarefa => tarefa.id == codigo)
}

// limpar Todas As Tarefas

btnLimparTodasAsTarefas.addEventListener("click",()=>{
    let resposta = confirm(`Tem certaza que deseja excluir todas as tarefas?`)
    if(resposta){
        localStorage.clear()
        location.reload()
    }
})