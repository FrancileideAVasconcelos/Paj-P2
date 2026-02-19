// ficheiro responsável pela gestão de clientes (adicionar, listar, editar e remover) com persistência em localStorage

// objeto cliente
var cliente = {nome : "", email : "", telefone : "", empresa : ""};


// Array de clientes
let clienteList = new Array();


// Função para adicionar um cliente
function adicionarCliente(nome, email, telefone, empresa) {

    var novoCliente = Object.create(cliente);
    novoCliente.nome = nome;
    novoCliente.email = email;
    novoCliente.telefone = telefone;
    novoCliente.empresa = empresa;

    clienteList.push(novoCliente); 

    // guarda no localStorage
    // ordena os clientes por ordem alfabetica
    // localeCompare compara strings, sort - ordena, neste caso por ordem alfabetica
    clienteList.sort(function(a, b) {
        return a.nome.localeCompare(b.nome);
    });

    localStorage.setItem("clientes", JSON.stringify(clienteList));
    console.log("Cliente adicionado:", novoCliente);

}

function guardarCliente(index = null) {

    const nome = document.getElementById("clienteNome").value;
    const email = document.getElementById("clienteEmail").value;
    const telefone = document.getElementById("clienteTelefone").value;
    const empresa = document.getElementById("clienteEmpresa").value;

    // verifica se os campos obrigatórios estão preenchidos: nome empresa e pelo menos um contacto (email ou telefone)
    // trim() remove espaços em branco no início e no fim da string, ex: quando o utilizador insere apenas espaços
    if (nome.trim() === "" || empresa.trim() === "" || (email.trim() === "" && telefone.trim() === "")) {
        return; 
    }

    // uso de expressões regex para validar numero de telefone e email
    // telefone deve ter 9 digitos e começar por 2 ou 9
    if (telefone !=="" && !/^[29][0-9]{8}$/.test(telefone)) {
        alert("Digite um número de telefone válido.");
        return;
    }

    // email deve ter algo != de espaçp ou @ antes do @, depois do @ deve ter algo != de espaço ou @, depois um ponto e depois algo != de espaço ou @
    if (email !=="" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Digite um email válido.");
        return;
    }


    // se o index for null => o cliente ainda não existe, é um novo cliente
    if (index === null) {

        adicionarCliente(nome, email, telefone, empresa);
        
        alert("Cliente adicionado com sucesso!");
        console.log("Lista de clientes após adição:", clienteList);

    } else {
    // editar cliente já existente
    clienteList[index].nome = nome;
    clienteList[index].email = email;
    clienteList[index].telefone = telefone;
    clienteList[index].empresa = empresa;

    // atualiza no localStorage: setItem()
    localStorage.setItem("clientes", JSON.stringify(clienteList));
    alert("Cliente editado com sucesso!");

    console.log("Cliente editado:", clienteList[index]);
    }

    loadClientes();
    window.location.href="dashboard.html#clientes"
}


// Função para listar todos os clientes
function mostrarDetalhesCliente() {
    
    // carregar lista do localStorage
    clienteList = JSON.parse(localStorage.getItem("clientes") || "[]");

    const index = parseInt(localStorage.getItem("clienteSelecionado"), 10);
    const detalhesDiv = document.getElementById("detalhesContent");

    if (!detalhesDiv) return;

   
    const c = clienteList[index];

    detalhesDiv.innerHTML = `

        <p><strong>Nome:</strong> ${c.nome}</p>
        <p><strong>Email:</strong> ${c.email}</p>
        <p><strong>Telefone:</strong> ${c.telefone}</p> 
        <p><strong>Empresa:</strong> ${c.empresa}</p> 
        
        <br>

        <button class="btn" type="button" onclick="editarCliente(${index})"><img src="/imagens/editar.jpg" alt="icon" class="icon">Editar</button>
        <button class="btn" type="button" onclick="removerCliente(${index})"><img src="/imagens/remover.jpg" alt="icon" class="icon">Remover</button>
        <button class="btn" onclick="window.location.href='dashboard.html#clientes'"><img src="/imagens/voltar.jpg" alt="icon" class="icon">Voltar</button>
    
    `;
    
}

function listarClientes() {
    
    var listaClientes = document.getElementById("listaClientes");
    listaClientes.innerHTML = ""; // Limpa a lista antes de adicionar novos elementos


    for (var i = 0; i < clienteList.length; i++) {

        listaClientes.innerHTML += `

            <li class="cliente-item">
                <button class = "cliente-item-btn" type="button" onclick="abrirDetalhesCliente(${i})"><strong>${clienteList[i].nome}</strong></button>
            </li>
            `;
    }

    console.log("Lista de clientes após ordenação:", clienteList);
}


function abrirDetalhesCliente(index) {
  localStorage.setItem("clienteSelecionado", index);
  window.location.href = "detalhes.html";
}


// Função para remover um cliente
function removerCliente(index) {
    if (confirm("Tem a certeza que deseja remover este cliente?")) {

        clienteList.splice(index, 1); // Remove o cliente do array  

        localStorage.setItem("clientes", JSON.stringify(clienteList)); 
        alert("Cliente removido com sucesso!");

        console.log("Cliente removido:", clienteList[index]); 

        listarClientes();
    }

}

// Função para editar um cliente
function editarCliente(index) {
    const cliente = clienteList[index];
    content.innerHTML = `

    <h2>Editar Cliente</h2> 
    
    <label>Nome</label>
    <input id="clienteNome" type="text" value="${cliente.nome}">
    <br><br>    

    <label>Email</label>
    <input id="clienteEmail" type="email" value="${cliente.email}">
    <br><br>

    <label>Telefone</label>
    <input id="clienteTelefone" type="text" value="${cliente.telefone}">
    <br><br>

    <label>Empresa</label>
    <input id="clienteEmpresa" type="text" value="${cliente.empresa}">
    <br><br>

    <button id="btnGuardarClienteEdicao" class="btn" disabled type="button" onclick="guardarCliente(${index})"><img src="/imagens/guardar.jpg" alt="icon" class="icon">Guardar</button>


    <button class="btn" onclick="window.location.href='dashboard.html#clientes'"><img src="/imagens/cancelar.jpg" alt="icon" class="icon">Cancelar</button>
    `;

    ativarValidacaoEdicaoCliente(cliente);

}
           

document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("detalhesContent")) {
        mostrarDetalhesCliente();
    }
});

function carregarClientes() {
    const dados = JSON.parse(localStorage.getItem("clientes"));
    if (dados) {
        clienteList = dados;
    }
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



