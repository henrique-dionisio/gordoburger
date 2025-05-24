// Animação Scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            entry.target.classList.add('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.item, .hero h2, .hero p, .hero .btn, h2');
hiddenElements.forEach((el) => observer.observe(el));

/* --------------------------------------------------------------------------- */
// Modal
function abrirModal(titulo, descricao, preco){
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('modal-title').innerText = titulo;
    document.getElementById('modal-desc').innerText = descricao;
    document.getElementById('modal-price').innerText = preco;
}

function fecharModal(){
    document.getElementById('modal').style.display = 'none';
}

/* --------------------------------------------------------------------------- */
// Carrinho de Compras
let carrinho = [];

function adicionarAoCarrinho(nome, preco) {
    carrinho.push({ nome, preco: parseFloat(preco.replace('R$', '').replace(',', '.')) });
    atualizarCarrinho();
}

/* --------------------------------------------------------------------------- */
//Atualizar o carrinho
function atualizarCarrinho() {
    const lista = document.getElementById('itens-carrinho');
    lista.innerHTML = '';
    let total = 0;

    carrinho.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.nome} - R$ ${item.preco.toFixed(2)} <button onclick="removerItem(${index})">🗑️</button>`;
        lista.appendChild(li);
        total += item.preco;
    });

    const taxaEntrega = 5;
    total += taxaEntrega;

    document.getElementById('total-carrinho').innerText = `Total (com entrega): R$ ${total.toFixed(2)}`;
}

function removerItem(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

/* --------------------------------------------------------------------------- */
// Formulário
function abrirFormulario() {
    document.getElementById('formulario').style.display = 'flex';
}

function fecharFormulario() {
    document.getElementById('formulario').style.display = 'none';
}

/* --------------------------------------------------------------------------- */
//Buscar o CEP
function buscarCep() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        alert('CEP inválido. Digite 8 números.');
        return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert('CEP não encontrado.');
                return;
            }

            document.getElementById('rua').value = data.logradouro;
            document.getElementById('bairro').value = data.bairro;
        })
        .catch(() => {
            alert('Erro ao buscar CEP.');
        });
}

/* --------------------------------------------------------------------------- */
// Enviar para WhatsApp
function enviarPedido() {
    const nome = document.getElementById('nome').value;
    const cep = document.getElementById('cep').value;
    const rua = document.getElementById('rua').value;
    const numeroCasa = document.getElementById('numero').value;
    const complemento = document.getElementById('complemento').value;
    const bairro = document.getElementById('bairro').value;
    const pagamento = document.getElementById('pagamento').value;

    // Validação dos campos obrigatórios
    if (!nome || !cep || !rua || !numeroCasa || !bairro) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    const taxaEntrega = 5;

    let mensagem = `*Pedido - GordoBurger*%0A%0A`;

    let total = 0;

    carrinho.forEach(item => {
        mensagem += `🍔 ${item.nome} - R$ ${item.preco.toFixed(2)}%0A`;
        total += item.preco;
    });

    total += taxaEntrega;

    mensagem += `%0A🚚 *Taxa de Entrega:* R$ ${taxaEntrega.toFixed(2)}`;
    mensagem += `%0A*Total: R$ ${total.toFixed(2)}*%0A%0A`;

    mensagem += `🧑 *Nome:* ${nome}%0A`;
    mensagem += `🏠 *Endereço:* Rua ${rua}, Nº ${numeroCasa}${complemento ? ', ' + complemento : ''}, Bairro ${bairro}, CEP ${cep}%0A`;
    mensagem += `💰 *Forma de Pagamento:* ${pagamento}%0A`;

    const numero = '5531999149772'; // ✅ Substitua pelo número da hamburgueria

    window.open(`https://wa.me/${numero}?text=${mensagem}`, '_blank');

    // Limpa carrinho e fecha o formulário após enviar
    carrinho = [];
    atualizarCarrinho();
    fecharFormulario();
}



