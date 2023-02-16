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
form.addEventListener("submit", function criarTarefa(event) {
    event.preventDefault()
    let tarefa = {
        dia: inputDiaDaTarefa.value,
        titulo: inputTituloDaTarefa.value,
        horario: selectSelecaoHorario.value,
        detalhes: textAreaDetalhesDaTarefa.value,
    }

    adicionarTarefa(tarefa)
    mostrar()
})

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

async function mostrar(diaDaqui) {
    let verTarefas = await pegarTarefasLocalStorage()

    // verTarefas.forEach(tarefa => {
    //     listaDasTarefas.innerHTML += `
    //     <div>
    //         <h2>Dia:${tarefa.dia[0]}</h2>
    //         <h3>${tarefa.titulo[0]}</h3>
    //         <p>Horario:${tarefa.horario[0]}</p>
    //         <p>Sobre:${tarefa.detalhes[0]}</p>
    //     </div>`
    // });
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
let abasNoMenu = []
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
            esconderAbas()
            destivarAbas(valor)
            ativarSection(valor)
            ativarAba(diaNoMenu)
        })
    })
}

adicionarDiasAoMenu()

let paginas = document.getElementById("paginas")

async function criarSecaoPorDia(){
    let verTarefas = pegarTarefasLocalStorage()
    let diasCriados = await filtrarDias()
    paginas.innerHTML = ``
    diasCriados.forEach(dia =>{
        paginas.innerHTML+=`
        <section class="tarefa ativa" data-pagina="${dia}">${mostrar(dia)}</section>`
    })
}

criarSecaoPorDia()

// Mostrar tarefas por abas

function esconderAbas(){
    const paginas = document.querySelectorAll("[data-pagina]")

    paginas.forEach(pagina => pagina.classList.add('hide'))
}

function destivarAbas() {
    const paginas = document.querySelectorAll(`[data-pagina]`)
    paginas.forEach(secao => secao.classList.remove("ativa"))
}

const ativarSection = (valor) => {
    const pagina= document.querySelector(`[data-pagina="${valor}"]`)

    pagina.classList.remove("hide")
    pagina.classList.add("ativa")
}

function ativarAba(aba){
    aba.classList.add("ativa")
}