const instance = axios.create({
    baseURL: "https://rickandmortyapi.com/api/"
});

const cardsContainer = document.getElementById('cards-container');
const mainContainer = document.getElementById('main-container');
const botaoPagAnterior = document.getElementById('paginaAnterior');
const botaoProxPagina = document.getElementById('proximaPagina');

let paginaAtual = 1;

//Cria os cards
function createCard(character) {

    const card = document.createElement('div');
    card.classList.add('border-success', 'card','g-5')
    card.innerHTML = `
    <img src="${character.image}" class="card-img-top mt-3" alt="${character.name}">
    <div class="card-body">
      <h5 class="card-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" >${character.name}</h5>
      <p class="card-text text-start"><u><b>Status</u>:</b> ${character.status}</p>
      <p class="card-text text-start" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><u><b>Specie</u>:</b> ${character.species}</p>
     
      <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#characterModal" 
        onclick="mostrarDetalhes('${character.image}','${character.name}', '${character.status}', 
        '${character.species}', '${character.gender}', '${character.origin.name}','${character.location.name}')">Details</button>
    </div>
    `;
    
    cardsContainer.appendChild(card);
}

//Cria os cards com os personagens
async function buscarPersonagens(page) {
    await instance.get(`character/?page=${page}`)
    
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

// Modal com informações adicionais
function mostrarDetalhes(image, name, status, species, gender, origin,location) {
    const modalBody = document.getElementById('characterModalBody');
    modalBody.innerHTML = `
        <img src="${image}" class="card-img-top text-center" alt="${name}">
        <p class="mt-2"><b>Name:</b> ${name}</p>
        <p><b>Status:</b> ${status}</p>
        <p><b>Specie:</b> ${species}</p>
        <p><b>Gender:</b> ${gender}</p>
        <p><b>Origin:</b> ${origin}</p>
        <p><b>Localization:</b> ${location}</p>
        `;
}

//limpa os cards atuais ao trocar de página
function limparCards() {
    cardsContainer.innerHTML = '';
}

//Ao chegar na primeira ou ultima pagina. Desabilita o botão respectivo.
function atualizarBotaoPagina() {
    if(paginaAtual===1) {
        botaoPagAnterior.classList.add('disabled')
    } else {
        botaoPagAnterior.classList.remove('disabled')
    }

    if(paginaAtual >= totalPaginas) {
        botaoProxPagina.classList.add('disabled')
    } else {
        botaoProxPagina.classList.remove('disabled')
    }
}


//Paginação para voltar a página
botaoPagAnterior.addEventListener('click', () => {
    if (paginaAtual > 1) {
        paginaAtual--;
        limparCards();
        buscarPersonagens(paginaAtual);
    }
});


//Paginação para passar a página
botaoProxPagina.addEventListener('click', () => {
    if (paginaAtual < totalPaginas) {
        paginaAtual++;
        limparCards();
        buscarPersonagens(paginaAtual);
    }
});

let totalPaginas = 1;
buscarPersonagens(paginaAtual);

