const API_URL = "http://localhost:8080/backend-p2-1.0-SNAPSHOT/rest/clientes";
let clienteList = [];

// --- 1. COMUNICAÇÃO COM O SERVIDOR ---

async function apiCall(endpoint, method, body = null) {
    const username = sessionStorage.getItem("username");
    const options = {
        method: method,
        headers: { "Content-Type": "application/json", "username": username }
    };
    if (body) options.body = JSON.stringify(body);
    return fetch(endpoint, options);
}

// --- 2. GESTÃO DE DADOS (CRUD) ---

async function carregarClientes() {
    const response = await apiCall(API_URL, "GET");
    if (response.ok) {
        clienteList = await response.json();
        clienteList.sort((a, b) => a.nome.localeCompare(b.nome));
        listarClientes();
    }
}

async function guardarCliente(index = null) {
    const dados = {
        nome: document.getElementById("clienteNome").value,
        email: document.getElementById("clienteEmail").value,
        telefone: document.getElementById("clienteTelefone").value,
        empresa: document.getElementById("clienteEmpresa").value
    };

    // --- AS TUAS VALIDAÇÕES ORIGINAIS ---
    if (dados.nome.trim() === "" || dados.empresa.trim() === "" || (dados.email.trim() === "" && dados.telefone.trim() === "")) return;
    if (dados.telefone !== "" && !/^[29][0-9]{8}$/.test(dados.telefone)) { alert("Telefone inválido."); return; }
    if (dados.email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) { alert("Email inválido."); return; }

    let response;
    if (index === null) {
        response = await apiCall(API_URL, "POST", dados);
    } else {
        const idGlobal = clienteList[index].id;
        response = await apiCall(`${API_URL}/${idGlobal}`, "PUT", dados);
    }

    if (response.ok) {
        alert("Sucesso!");
        window.location.href = "dashboard.html#clientes";
    } else {
        alert("Erro: " + await response.text());
    }
}

async function removerCliente(index) {
    if (!confirm("Remover este cliente?")) return;
    const idGlobal = clienteList[index].id;
    const response = await apiCall(`${API_URL}/${idGlobal}`, "DELETE");
    
    if (response.ok) {
        alert("Removido!");
        window.location.href = "dashboard.html#clientes";
    }
}

// --- 3. INTERFACE (DOM) ---

function listarClientes() {
    const lista = document.getElementById("listaClientes");
    if (!lista) return;
    lista.innerHTML = clienteList.map((c, i) => `
        <li class="cliente-item">
            <button class="cliente-item-btn" onclick="abrirDetalhesCliente(${i})">
                <strong>${c.nome}</strong>
            </button>
        </li>`).join("");
}

function abrirDetalhesCliente(index) {
    sessionStorage.setItem("clienteSelecionadoIndex", index);
    sessionStorage.setItem("clientesData", JSON.stringify(clienteList));
    window.location.href = "detalhes.html";
}

function mostrarDetalhesCliente() {
    const index = sessionStorage.getItem("clienteSelecionadoIndex");
    const dados = JSON.parse(sessionStorage.getItem("clientesData") || "[]");
    const div = document.getElementById("detalhesContent");
    if (!div || index === null) return;

    const c = dados[index];
    div.innerHTML = `
        <p><strong>Nome:</strong> ${c.nome}</p>
        <p><strong>Email:</strong> ${c.email}</p>
        <p><strong>Telefone:</strong> ${c.telefone}</p> 
        <p><strong>Empresa:</strong> ${c.empresa}</p> 
        <br>
        <button class="btn" onclick="editarCliente(${index})"><img src="/imagens/editar.jpg" class="icon">Editar</button>
        <button class="btn" onclick="removerCliente(${index})"><img src="/imagens/remover.jpg" class="icon">Remover</button>
        <button class="btn" onclick="window.location.href='dashboard.html#clientes'"><img src="/imagens/voltar.jpg" class="icon">Voltar</button>`;
}

// função que ativa/desativa o botºao Guardar na página ao adicionar novo cliente, dependendo se os campos obrigatórios estão preenchidos ou não
function ativarValidacaoNovoCliente() {

    // vai buscar os elemntos de input, pelo id, do nome, email, telefone, empresa e o botão Guardar 
  const nome = document.getElementById("clienteNome");
  const email = document.getElementById("clienteEmail");
  const telefone = document.getElementById("clienteTelefone");
  const empresa = document.getElementById("clienteEmpresa");
  // vai buscar o botão para controlar o seu estado dinamicamente
  const btn = document.getElementById("btnGuardarCliente");

  if (!nome || !email || !telefone || !empresa || !btn) return;

  const validar = () => {
    // função verifica se os elemntos obrigatórios foram preenchidos ou um dos contactos. Se sim, ativa o botão Guardar.
    const nomeOk = nome.value.trim() !== "";
    const empresaOk = empresa.value.trim() !== "";
    const contactoOk =
      email.value.trim() !== "" || telefone.value.trim() !== "";

    // o botão ativa qd os 3 campos obrigatorios forem preenchidos
    btn.disabled = !(nomeOk && empresaOk && contactoOk);
  };

  // sempre que houver input nos campos, chama a função validar para verificar se o botão Guardar deve ser ativado ou desativado
  nome.addEventListener("input", validar);
  email.addEventListener("input", validar);
  telefone.addEventListener("input", validar);
  empresa.addEventListener("input", validar);

  validar();
}

// função que ativa/desativa o botão Guardar na página ao editar cliente, dependendo se os campos obrigatórios estão preenchidos e se houve alterações nos campos
function ativarValidacaoEdicaoCliente(clienteOriginal) {

  // vai buscar os inputs dos campos nome, email, telefone, empresa  
  const nome = document.getElementById("clienteNome");
  const email = document.getElementById("clienteEmail");
  const telefone = document.getElementById("clienteTelefone");
  const empresa = document.getElementById("clienteEmpresa");
  // vai buscar o input do botão Guardar para controlar o seu estado dinamicamente
  const btn = document.getElementById("btnGuardarClienteEdicao");

  if (!nome || !email || !telefone || !empresa || !btn) return;

  const validar = () => {

    const nomeVal = nome.value.trim();
    const emailVal = email.value.trim();
    const telefoneVal = telefone.value.trim();
    const empresaVal = empresa.value.trim();

    const preenchido = nomeVal !== "" && empresaVal !== "" && (emailVal !== "" || telefoneVal !== "");

    const mudou = nomeVal !== clienteOriginal.nome || emailVal !== clienteOriginal.email || telefoneVal !== clienteOriginal.telefone || empresaVal !== clienteOriginal.empresa;

    btn.disabled = !(preenchido && mudou);
  };

  nome.addEventListener("input", validar);
  email.addEventListener("input", validar);
  telefone.addEventListener("input", validar);
  empresa.addEventListener("input", validar);

  validar();
}

// Manter as funções de ativarValidacaoNovoCliente e ativarValidacaoEdicaoCliente aqui em baixo...
// (Elas permanecem exatamente como as tinhas, pois funcionam bem)

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("listaClientes")) carregarClientes();
    if (document.getElementById("detalhesContent")) mostrarDetalhesCliente();
});


