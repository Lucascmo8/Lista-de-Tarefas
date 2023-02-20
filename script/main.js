'use strict'

// Pegando os itens do form e o form de criação

let formDeCriacao = document.getElementById("formDeCriacao")
let inputCriarDiaDaTarefa = document.getElementById("criarDiaDaTarefa")
let inputCriarTituloDaTarefa = document.getElementById("criarTituloDaTarefa")
let selectCriarSelecaoHorario = document.getElementById("criarSelecaoHorario")
let textAreaCriarDetalhesDaTarefa = document.getElementById("criarDetalhesDaTarefa")
let botaoCriarTarefa = document.getElementById("botaoCriarTarefa")

// Pegando o main e os seus elementos
let listaDasTarefas = document.getElementById("listaDasTarefas")
let paginas = document.getElementById("paginas")
let abasNoMenu = []

let btnLimparTodasAsTarefas = document.getElementById("limparTodasAsTarefas")

// Anulando o submit do form de criação

formDeCriacao.addEventListener("submit", function criarTarefa(event) {
    event.preventDefault()
    let tarefa = {
        dia: verificarZeroNaFrenteDodia(inputCriarDiaDaTarefa.value),
        titulo: inputCriarTituloDaTarefa.value,
        horario: selectCriarSelecaoHorario.value,
        detalhes: textAreaCriarDetalhesDaTarefa.value,
        id: novoId()
    }
    adicionarTarefa(tarefa)
    adicionarDiasAoMenu()
    mostrar(tarefa.dia)
    limparForm()
    formDeCriacao.classList.add("hide")
})

// Função para verificar se o dia tem 0 na frente

function verificarZeroNaFrenteDodia(dia){
    let separarDiaValue = Number(dia)
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
    criarId(ids)
    return ids - 1
}

// Função para limpar o form

function limparForm(){
        inputCriarDiaDaTarefa.value  = ''
        inputCriarTituloDaTarefa.value  = ''
        selectCriarSelecaoHorario.value  = ''
        textAreaCriarDetalhesDaTarefa.value  = ''
}

// Funções para adicionar a tarefa a lista

function adicionarTarefa(tarefa) {
    let tarefas = pegarTarefasLocalStorage();
    tarefas.push(tarefa)
    adicionarTarefaLocalStorage(tarefas)
}

function adicionarTarefaLocalStorage(tarefas) {
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
        <div class="tarefas" data-mostrar="detalhes-${tarefa.id}">
            <input type="checkbox" name="tarefa${tarefa.id}" id="tarefa${tarefa.id}">
            <label for="tarefa${tarefa.id}" data-mostrar="detalhes-${tarefa.id}">${tarefa.titulo}</label>
            <p data-mostrar="detalhes-${tarefa.id}">Horario: ${tarefa.horario}</p>
            <button type="button" data-acao="editar-${tarefa.id}" class="botaoDaLista botaoEditar">Editar</button>
            <button type="button" data-acao="deletar-${tarefa.id}" class="botaoDaLista botaoExcluir">Excluir</button>
        </div>
        <div id="detalhes${tarefa.id}" class="detalhesDasTarefas hide"><p>Detalhes: ${tarefa.detalhes}</p></div>`
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

let idTarefa = 0

document.querySelector("#listaDasTarefas>div").addEventListener("click", editarExcluir)

function editarExcluir(event){
    console.log(event.target)
    
    if(event.target.type == "button"){
        
        let [acao,index] = event.target.dataset.acao.split("-")
        idTarefa = pegarIndexDaTarefa(index)

        if(acao == "editar"){
            editarTarefa(idTarefa)
            formEditarTarefa.classList.remove("hide")
            formDeCriacao.classList.add("hide")
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
    completarForm(tarefa)
}


function excluirTarefa(index){
    let tarefa = pegarTarefasLocalStorage()
    tarefa.splice(index,1)
    adicionarTarefaLocalStorage(tarefa)
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

// Form de editar Tarefa

// Elementos do Form editar tarefas
let formEditarTarefa = document.getElementById("formEditarTarefa")
let inputEditarDiaDaTarefa = document.getElementById("editarDiaDaTarefa")
let inputEditarTituloDaTarefa = document.getElementById("editarTituloDaTarefa")
let selectEditarSelecaoHorario = document.getElementById("editarSelecaoHorario")
let textAreaEditarDetalhesDaTarefa = document.getElementById("editarDetalhesDaTarefa")
let botaoEditarTarefa = document.getElementById("botaoEditarTarefa")

// Completar form
let idDaTarefaEditada = undefined

function completarForm(tarefa){
        inputEditarDiaDaTarefa.value  = tarefa.dia
        inputEditarTituloDaTarefa.value  = tarefa.titulo
        selectEditarSelecaoHorario.value  = tarefa.horario
        textAreaEditarDetalhesDaTarefa.value  = tarefa.detalhes

}

// função para Editar tarefa

formEditarTarefa.addEventListener("submit",(event)=>{
    event.preventDefault()
    let verClientes = pegarTarefasLocalStorage()
    let tarefaEditada = {
        dia: verificarZeroNaFrenteDodia(inputEditarDiaDaTarefa.value),
        titulo: inputEditarTituloDaTarefa.value,
        horario: selectEditarSelecaoHorario.value,
        detalhes: textAreaEditarDetalhesDaTarefa.value,
        id: idTarefa
    }
    verClientes[idTarefa] = tarefaEditada
    adicionarTarefaLocalStorage(verClientes)

    location.reload()
})

// funções para abrir os form

let botaoAbrirCriarForm = document.getElementById("botaoAbrirCriarForm")

botaoAbrirCriarForm.addEventListener("click",()=>{
    formDeCriacao.classList.remove("hide")
    formEditarTarefa.classList.add("hide")
})

// Mostrar detalhes
document.querySelector("#listaDasTarefas>div").addEventListener("click", mostrarDetalhes)

function mostrarDetalhes(event){
    console.log(event.target.dataset)
    let [acao,index] = event.target.dataset.mostrar.split("-")
    console.log(acao)
    console.log(index)
    if(acao == "detalhes"){
        document.querySelector(`#listaDasTarefas>div>#detalhes${index}`).classList.toggle("hide")
    }
}

// Fechar forms

let botaoFecharFormCriarTarefa = document.getElementById("botaoFecharFormCriarTarefa")
let botaoFecharFormEditarTarefa = document.getElementById("botaoFecharFormEditarTarefa")

botaoFecharFormCriarTarefa.addEventListener("click",function(){
    formDeCriacao.classList.add("hide")
    limparForm()
})

botaoFecharFormEditarTarefa.addEventListener("click",function(){
    formEditarTarefa.classList.add("hide")
})