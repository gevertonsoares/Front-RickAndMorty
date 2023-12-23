const instance = axios.create({
    baseURL: "https://rickandmortyapi.com/api/"
});

const cardsContainer = document.getElementById('cards-container');
const mainContainer = document.getElementById('main-container');
const botaoPagAnterior = document.getElementById('paginaAnterior');
const botaoProxPagina = document.getElementById('proximaPagina');

let paginaAtual = 1;

function createCard(character) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <h2>${character.name}</h2>
      <img src="${character.image}" alt="${character.name}">
      <div class="card-info">
      <p><u><b>Status:</b></u> ${character.status}</p>
      <p><u><b>Specie:</b></u> ${character.species}</p>
      <p><u><b>Gender</b></u> ${character.gender}</p>
      </div>
    `;
    cardsContainer.appendChild(card);
}

//limpa os cards atuais ao trocar de página
function limparCards() {
    cardsContainer.innerHTML = '';
}

//Ao chegar na primeira ou ultima pagina. Desabilita o botão respectivo.
function atualizarBotaoPagina() {
    botaoPagAnterior.disabled = paginaAtual === 1;
    botaoProxPagina.disabled = paginaAtual >= totalPaginas;
}

//Cria os cards com os personagens
function buscarPersonagens(page) {
    instance.get(`character/?page=${page}`)
        .then(response => {
            const personagens = response.data.results;

            personagens.forEach(personagem => {
                createCard(personagem);
            });

            totalPaginas = response.data.info.pages;
            atualizarBotaoPagina();
        })
        .catch(error => {
            console.error('Erro ao carregar API', error);
        });
}

//Paginação para voltar a página
botaoPagAnterior.addEventListener('click', () => {
    if (paginaAtual > 1) {
        paginaAtual--;
        limparCards();
        buscarPersonagens(paginaAtual);
    }
});


//Paginação para voltar a página
botaoProxPagina.addEventListener('click', () => {
    if (paginaAtual < totalPaginas) {
        paginaAtual++;
        limparCards();
        buscarPersonagens(paginaAtual);
    }
});

let totalPaginas = 1;
buscarPersonagens(paginaAtual);
