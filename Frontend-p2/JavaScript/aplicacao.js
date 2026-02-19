// aplicacao.js - ficheiro principal da aplicação

// para apagar mais tarde
console.log("Aplicação iniciada.")

const content = document.getElementById("content");

document.addEventListener("DOMContentLoaded", () => {
    
    const form = document.getElementById("loginForm");

    const regForm = document.getElementById("registerForm");
    
    if (form) {
        form.addEventListener("submit", login);
    }
    if (regForm) {
    regForm.addEventListener("submit", registar);
}


});


function loadHeader(page) {
    const headerDiv = document.getElementById("header");
    const currentPage = window.location.pathname;

    // Se for Login OU Registo, mostra o header simples
    if (currentPage.includes("login.html") || currentPage.includes("register.html")) {
        headerDiv.innerHTML = `
            <header id="header">
                <img src="/imagens/favicon1.png" class="logo">
                <h1>Customer Relationship Management</h1>
            </header>
        `;
    } else {

        const firstName = localStorage.getItem("userFirstName") || "Utilizador";
        headerDiv.innerHTML = `
        
            <header class="header-app">
                <div class="header-container">
                    <div class="header-left">
                        <img src="/imagens/favicon1.png" class="logo">
                        <h1>Customer Relationship Management</h1>
                    </div>
                
                    <div class="header-right">
                        <button class="btn" onclick="logout()"><i class="fa-solid fa-arrow-right-from-bracket"></i>Logout</button>
                    </div>
                </div>

                <div class="header-welcome">
                    <strong><span class="Welcome">Bem-vindo ${firstName}</span></strong>
                </div>
            </header>
        `;
    }
}

function loadFooter() {
    const footerDiv = document.getElementById("footer");

    footerDiv.innerHTML = new Date().getFullYear() + ` © all right reserved`
    footerDiv.style.textAlign = "left";
}

// Funções para carregar as Leads

function loadLeads() {
    content.innerHTML = `
    <h2>Leads</h2>
    <br>
    <label for="filtroEstado">Filtrar por estado:</label>
    <select id="filtroEstado">
    <option value="">Todos</option>
    </select>

    <ul id="listaLeads"></ul>
    <br>
    <button class="btn" type="button" onclick="loadNovoLead()"><img src="/imagens/adicionar.jpg" alt="icon" class="icon">Adicionar Lead</button>
    `;

    preencherFiltroEstados();
    listarLeads();

    const filtro = document.getElementById("filtroEstado");
    filtro.addEventListener("change", () => {
        const estadoSelecionado = filtro.value;

        if (estadoSelecionado === "") {
            listarLeads();
        } else {
            listarLeadsPorEstado(estadoSelecionado);
        }
    });
    
}

function loadNovoLead() {
    content.innerHTML = `
    <h2>Nova Lead</h2>

    <label>Título</label>
    <input id="leadTitulo" type="text" required>
    <br><br>

    <label>Descrição</label>
    <textarea id="leadDescricao" required></textarea>
    <br><br>

    <button id="btnGuardarLead" class="btn" disabled type="button" onclick="adicionarLead()"><img src="/imagens/guardar.jpg" alt="icon" class="icon">Guardar</button>

    <button class="btn" type="button" onclick="loadLeads()"><img src="/imagens/cancelar.jpg" alt="icon" class="icon">Cancelar</button>

    `;
    // Ativa a função para validar os campos de título e descrição e desativar o botão Guardar enquanto os campos não estão preenchidos
    ativarValidacaoNovaLead();
}

// Funções para carregar os Clientes

function loadClientes() {
    content.innerHTML = `
    <h2>Clientes</h2>
    <br>
    <!-- lista não ordenada de clientes -->
    <ul id="listaClientes"></ul> 
    <br>
    <button class="btn" type="button"onclick="loadNovoCliente()"><img src="/imagens/adicionar.jpg" alt="icon" class="icon">Adicionar Cliente</button>
    `;
    
    listarClientes();
}

function loadNovoCliente() {
  content.innerHTML = `
    <h2>Novo Cliente</h2>

    <!-- required indica que o campo é obrigatório (em Nome e Empresa) -->
    <label>Nome</label>
    <input id="clienteNome" type="text" required>
    <br><br>

    <label>Email</label>
    <input id="clienteEmail" type="email">
    <br><br>

    <label>Telefone</label>
    <input id="clienteTelefone" type="text">
    <br><br>

    <label>Empresa</label>
    <input id="clienteEmpresa" type="text" required>
    <br><br>

    <!-- O botão Guardar só é ativado quando os campos obrigatórios estão preenchidos, por defeito está disabled -->
    <button id="btnGuardarCliente" class="btn" disabled type="button" onclick="guardarCliente()"><img src="/imagens/guardar.jpg" alt="icon" class="icon">Guardar</button>

    <button class="btn" type="button" onclick="loadClientes()"><img src="/imagens/remover.jpg" alt="icon" class="icon">Cancelar</button>
  `;

  ativarValidacaoNovoCliente();

}

// Funções de login e logout

async function login(event) {
    // Impede o recarregamento da página ao submeter o formulário
    if(event) event.preventDefault(); 

    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;

    const url = "http://localhost:8080/backend-p2-1.0-SNAPSHOT/rest/users/login";

    const dados = {
        username: usernameInput,
        password: passwordInput
    };

    try {
        const resposta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            localStorage.setItem("currentUser", usernameInput);
            sessionStorage.setItem("currentPass", passwordInput); 

            // NOVO: Pedir os detalhes do utilizador para obter o Primeiro Nome
            const profileUrl = `http://localhost:8080/backend-p2-1.0-SNAPSHOT/rest/users/${usernameInput}`;
            
            // Criamos a variável resProfile aqui
            const resProfile = await fetch(profileUrl);
            const userData = await resProfile.json();

            // Guardar o primeiro nome (atenção à escrita: use userFirstName)
            localStorage.setItem("userFirstName", userData.primeiroNome);
            
            console.log("Login e perfil carregados com sucesso.");
            window.location.href = "dashboard.html";
        } else {
            // O servidor retornou 401 [cite: 115]
            alert("Credenciais inválidas. Tente novamente.");
        }
    } catch (erro) {
        console.error("Erro ao ligar ao servidor:", erro);
        alert("Não foi possível ligar ao servidor de dados.");
    }
}

function logout() {
    // O enunciado exige apagar TODOS os dados 
    localStorage.clear();
    sessionStorage.clear();
    console.log("Sessão terminada.");
    window.location.href = "login.html";
}

// Função de Registo (Backend Integration)
async function registar(event) {
    event.preventDefault();

    const novoUtilizador = {
        primeiroNome: document.getElementById("regPrimeiroNome").value,
        ultimoNome: document.getElementById("regUltimoNome").value,
        email: document.getElementById("regEmail").value,
        username: document.getElementById("regUsername").value,
        password: document.getElementById("regPassword").value,
        fotoUrl: document.getElementById("regFotoUrl").value,
        telefone: "" // Campo opcional conforme o teu UserPojo
    };

    try {
        const resposta = await fetch("http://localhost:8080/backend-p2-1.0-SNAPSHOT/rest/users/register", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoUtilizador)
        });

        if (resposta.status === 201) {
            alert("Utilizador registado com sucesso!");
            window.location.href = "login.html";
        } else {
            alert("Erro no registo. Verifique se o username já existe.");
        }
    } catch (erro) {
        console.error("Erro na ligação:", erro);
    }
}


// as funções seguintes serão terminadas em projetos futuros
function loadProjetos() {
    content.innerHTML = `
    <h2>Projetos</h2>
    <p>Funcionalidade futura</p>
    `;
}

function loadTarefas() {
    content.innerHTML = `
    <h2>Tarefas</h2>
    <p>Funcionalidade futura</p>
    `;
}

function loadDashboardHome() {
    content.innerHTML = `
        <section class="dashboard-home">
            <h2>Bem-vindo ao CRM</h2>
            <p>Seleciona uma opção no menu lateral para começar.</p>
        </section>
    `;
}

// Função para inicializar a aplicação

window.onload = function() {
    // 1. Verifica se existe um utilizador logado
    const user = localStorage.getItem("currentUser");
    
    // 2. Obtém o nome do ficheiro atual (ex: registo.html ou login.html)
    const path = window.location.pathname;

    // 3. Se NÃO estiver logado e NÃO estiver no login nem no registo, manda para o login
    if (!user && !path.includes("login.html") && !path.includes("register.html")) {
        window.location.href = "login.html";
        return; // Interrompe a execução aqui
    }

    // 4. Se passar a verificação, carrega os elementos visuais
    loadHeader();
    loadFooter();

    if (path.includes("dashboard")) {
        loadDashboardHome();
    }
};


