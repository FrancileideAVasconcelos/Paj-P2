// ficheiro responsável pela gestão de leads (adicionar, listar por estado, editar e remover) com persistência em localStorage

// const { act } = require("react");

// objeto lead
var lead = {titulo : "", descricao : "", estado : ""};


// Array de leads
let leadsList = new Array();

// opções de estado para as leads

const statusOptions = [ "Novo","Em análise","Proposta","Ganho","Perdido"];


// Função para gerar ID único para cada lead de forma incremental


// Função para criar uma lead
function criarLead(titulo, descricao) {
    return{
        titulo: titulo,
        descricao: descricao,
        estado: statusOptions[0]  // define o status inicial como "Novo"

    }

}

// Função para adicionar uma lead

async function adicionarLead() {
    const titulo = document.getElementById("leadTitulo").value;
    const descricao = document.getElementById("leadDescricao").value;

    if (!titulo.trim() || !descricao.trim()) {
        alert("Por favor, preencha os campos de título e descrição.");
        return;
    }

    const novaLead = {
        titulo: titulo,
        descricao: descricao,
        estado: 0 // Corresponde ao primeiro estado no teu LeadPojo
    };

    try {
        const resposta = await fetch("http://localhost:8080/backend-p2-1.0-SNAPSHOT/rest/leads", {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                // Necessário se o teu backend exigir autenticação (R4)
                'Authorization': 'Basic ' + btoa(localStorage.getItem("currentUser") + ":" + sessionStorage.getItem("currentPass"))
            },
            body: JSON.stringify(novaLead)
        });

        if (resposta.ok) {
            alert("Lead adicionada com sucesso no servidor!");
            loadLeads();
        } else {
            alert("Erro ao guardar no servidor.");
        }
    } catch (erro) {
        console.error("Erro na ligação:", erro);
    }
}


// Função para guardar leads no localStorage

function guardarLeads() {
    localStorage.setItem("leadsList", JSON.stringify(leadsList));
}

// Função para editar uma lead

function guardarEdicao(id) {
    const lead = leadsList.find(l => l.id == id);
    if (!lead) return;

    const titulo = document.getElementById("editTitulo").value;
    const descricao = document.getElementById("editDescricao").value;
    const estado = document.getElementById("editEstado").value;

    if (!titulo || !descricao || !estado) return;

    lead.titulo = titulo;
    lead.descricao = descricao;
    lead.estado = estado;

    guardarLeads();

    alert("Lead atualizada com sucesso");

    mostrarDetalhesLead();
}

// Função para preencher preencher os filtros com as opções disponivéis

function preencherFiltroEstados() {
    const select = document.getElementById("filtroEstado");
    select.innerHTML = `<option value="">Todos</option>`;

    statusOptions.forEach(estado => {
        select.innerHTML += `<option value="${estado}">${estado}</option>`;
    });
}

// Função para listar as leads por estado

function listarLeadsPorEstado(estado) {
    const listaLeads = document.getElementById("listaLeads");
    listaLeads.innerHTML = "";

    const filtradas = leadsList.filter(l => l.estado === estado);

    if (filtradas.length === 0) {
        listaLeads.innerHTML = "<p>Sem leads neste estado</p>";
        return;
    }

    filtradas.forEach(lead => {
        listaLeads.innerHTML += `
            <div class="lead-item">
                <button class="btn" onclick="abrirDetalhesLead(${lead.id})">
                    <strong>${lead.titulo}</strong>
                </button>
            </div>
        `;
    });
}


// Função para listar as leads

async function listarLeads() {
    const listaLeads = document.getElementById("listaLeads");
    listaLeads.innerHTML = "Carregando...";

    try {
        const resposta = await fetch("http://localhost:8080/backend-p2-1.0-SNAPSHOT/rest/leads");
        const leadsFromServer = await resposta.json();
        
        // Atualiza a variável global para manter as funções de filtro a funcionar
        leadsList = leadsFromServer;

        listaLeads.innerHTML = "";
        leadsList.forEach(lead => {
            // Mapeia o int do Java para a tua string de statusOptions
            const nomeEstado = statusOptions[lead.estado] || "Desconhecido";
            
            listaLeads.innerHTML += `
                <div class="lead-item">
                    <button class="lead-btn" onclick="abrirDetalhesLead(${lead.id})">
                        <span class="lead-titulo">${lead.titulo}</span>
                        <span class="lead-estado">Estado: ${nomeEstado}</span>
                    </button>
                </div>
            `;
        });
    } catch (erro) {
        listaLeads.innerHTML = "Erro ao carregar leads do servidor.";
        console.error(erro);
    }
}



// Função para abrir os detalhes de um Lead na página de detalhes

function abrirDetalhesLead(id) {
    window.location.href="detalhesLeads.html?id="+id;    
}

// Função para remover uma lead

function removerLead(id) {
    if (!confirm("Tem a certeza que deseja remover esta lead?")) return;

    leadsList = leadsList.filter(l => l.id != id);
    guardarLeads();
    alert("Lead removida com sucesso!");

    window.location.href = "dashboard.html#leads";
}

// Função para carregar leads do localStorage

function carregarLeads() {
    const dados = getLeads();
    if (dados) {
        leadsList = dados;
        
    }

}

// Função para extrair as Leads da local storage

function getLeads(){
    return JSON.parse(localStorage.getItem("leadsList"));
}

function mostrarDetalhesLead(){

    carregarLeads();

    const id = Number(getQueryParam("id"));
    const lead = leadsList.find(l => l.id == id);

    console.log(id);
    console.log(getLeads());


    const detalhesDiv = document.getElementById("detalhesLead");
    if (!detalhesDiv) return;

    if (!lead) {
        alert("Lead não encontrada");
        return;
    }

    detalhesDiv.innerHTML = `

        <p><strong>ID:</strong> ${lead.id}</p>
        <p><strong>Título:</strong> ${lead.titulo}</p>
        <p><strong>Descrição:</strong> ${lead.descricao}</p>
        <p><strong>Estado:</strong> ${lead.estado}</p>

        <br>

        <button class="btn" type="button" onclick="editarLead(${lead.id})">
        <img src="/imagens/editar.jpg" alt="icon" class="icon">Editar
        </button>
        <button class="btn" type="button" onclick="removerLead(${lead.id})">
        <img src="/imagens/remover.jpg" alt="icon" class="icon">Remover
        </button>
        <button class="btn" type="button" onclick="window.location.href='dashboard.html#leads'">
        <img src="/imagens/voltar.jpg" alt="icon" class="icon">Voltar
        </button>
    `;
}

function editarLead(id) {
  const lead = leadsList.find(l => l.id === id);
  const detalhesDiv = document.getElementById("detalhesLead");
  if (!detalhesDiv || !lead) return;

  detalhesDiv.innerHTML = `
    <label>Título</label><br>
    <input required type="text" id="editTitulo" value="${lead.titulo}"><br><br>

    <label>Descrição</label><br>
    <textarea required id="editDescricao">${lead.descricao}</textarea><br><br>

    <label>Estado</label><br>
    <select required id="editEstado">
      ${statusOptions.map(s =>
        `<option value="${s}" ${s === lead.estado ? "selected" : ""}>${s}</option>`
      ).join("")}
    </select>

    <br><br>

    <button id="btnGuardarEdicaoLead" class="btn" disabled type="button" onclick="guardarEdicao(${lead.id})">
      <img src="/imagens/guardar.jpg" alt="icon" class="icon">Guardar
    </button>

    <button class="btn" type="button" onclick="mostrarDetalhesLead()">
      <img src="/imagens/cancelar.jpg" alt="icon" class="icon">Cancelar
    </button>
  `;

  ativarValidacaoEdicaoLead(lead);

}


// Função para que desativa o botão Guardar enquanto os campos de título e descrição não estão preenchidos
function ativarValidacaoNovaLead() {

  // Vai buscar o input do título, a descrição e o botão Guardarpelo id
  const titulo = document.getElementById("leadTitulo");
  const descricao = document.getElementById("leadDescricao");
  const btnGuardar = document.getElementById("btnGuardarLead");

  // Se algum dos elementos não existir no DOM, sai da função
  if (!titulo || !descricao || !btnGuardar) return;

  // Função que verifica se os campos estão preenchidos
  const validar = () => {

    // Verifica se os dois campos têm texto; trim() - ignora espaços em branco, devolve true ou false
    const camposNaoVazios = titulo.value.trim() !== "" && descricao.value.trim() !== "";

    // se camposNaoVazios o botão fica ativo; senão, o botão fica desativo
    btnGuardar.disabled = !camposNaoVazios;
  };

  // Sempre que o utilizador escreve no campo título e no campo descrição, executa a função validar()
  titulo.addEventListener("input", validar);
  descricao.addEventListener("input", validar);

  validar();
}

function ativarValidacaoEdicaoLead(leadOriginal) {

  const titulo = document.getElementById("editTitulo");
  const descricao = document.getElementById("editDescricao");
  const estado = document.getElementById("editEstado");
  const btn = document.getElementById("btnGuardarEdicaoLead");

  if (!titulo || !descricao || !estado || !btn) return;

  const validar = () => {

    const t = titulo.value.trim();
    const d = descricao.value.trim();
    const e = estado.value;

    // Todos os campos têm de estar preenchidos
    const preenchido = t !== "" && d !== "" && e !== "";

    // Verifica se houve alterações
    const mudou =
      t !== leadOriginal.titulo ||
      d !== leadOriginal.descricao ||
      e !== leadOriginal.estado;

    // Botão só ativa se ambas forem verdade
    btn.disabled = !(preenchido && mudou);
  };

  titulo.addEventListener("input", validar);
  descricao.addEventListener("input", validar);
  estado.addEventListener("change", validar);

  validar(); // estado inicial
}


function getQueryParam(name, url = window.location.href) {
  const params = new URL(url).searchParams;
  return params.has(name) ? params.get(name) : null;
}
