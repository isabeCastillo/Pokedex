// pokem.js
//creando la clase llamada Pokemon
class Pokemon {
    //constructor que inicializa todas las propiedades de la clase Pokemon
    constructor(numero, nombre, especie, altura, peso, tipo, habilidades, debilidades, stats, moves, imagen, sprites) {
        this.numero = numero;
        this.nombre = nombre;
        this.especie = especie;
        this.altura = altura;
        this.peso = peso;
        this.tipo = tipo;
        this.habilidades = habilidades;
        this.debilidades = debilidades;
        this.stats = stats;
        this.moves = moves;
        this.imagen = imagen;
        this.sprites = sprites;
    }
  //metodo para obtener el color basado en el tipo
    obtenerColorDeTipo() {
        const coloresDeTipo = {
            normal: '#A8A77A',
            fire: '#EE8130',
            water: '#6390F0',
            electric: '#F7D02C',
            grass: '#7AC74C',
            ice: '#96D9D6',
            fighting: '#C22E28',
            poison: '#A33EA1',
            ground: '#E2BF65',
            flying: '#A98FF3',
            psychic: '#F95587',
            bug: '#A6B91A',
            rock: '#B6A136',
            ghost: '#735797',
            dragon: '#6F35FC',
            dark: '#705746',
            steel: '#B7B7CE',
            fairy: '#D685AD',
        };
// Por defecto es gris si no se encuentra el tipo
        return coloresDeTipo[this.tipo[0].toLowerCase()] || '#777';
    }

    dibujarPokemon() {
        const pokemonDiv = document.createElement('div');
        pokemonDiv.classList.add('pokemon-card');
        const tipoColor = this.obtenerColorDeTipo();
        pokemonDiv.style.backgroundColor = tipoColor;
        pokemonDiv.dataset.pokemonId = this.numero; // Añadir un data attribute para identificar el Pokémon

        pokemonDiv.innerHTML = `
            <img src="${this.imagen}" alt="${this.nombre}">
            <h3>${this.nombre}</h3>
            <p>${this.numero}</p>
            <p>Tipo: ${this.tipo.join(', ')}</p>
            <button class="select-companion-btn">Seleccionar acompañante</button>
        `;

        pokemonDiv.querySelector('.select-companion-btn').addEventListener('click', () => {
            this.seleccionarComoAcompanante();
        });

        pokemonDiv.addEventListener('click', () => {
            this.mostrarModal();
        });

        return pokemonDiv;
    }

    seleccionarComoAcompanante() {
        const acompanantes = JSON.parse(localStorage.getItem('acompanantes')) || [];
        if (acompanantes.length >= 6) {
            alert('No puedes seleccionar más de 6 acompañantes.');
            return;
        }

        if (acompanantes.find(pokemon => pokemon.numero === this.numero)) {
            alert(`${this.nombre} ya está en la lista de acompañantes.`);
            return;
        }

        acompanantes.push(this);
        localStorage.setItem('acompanantes', JSON.stringify(acompanantes));
        alert(`${this.nombre} ha sido añadido como acompañante.`);
    }

    mostrarModal() {
        let modal = document.getElementById('pokemon-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'pokemon-modal';
            modal.classList.add('modal');
            document.body.appendChild(modal);

            const modalContent = document.createElement('div');
            modalContent.classList.add('modal-content');
            modal.appendChild(modalContent);
        }
        const tipoColor = this.obtenerColorDeTipo();
        const modalContent = modal.querySelector('.modal-content');
        modalContent.innerHTML = `
        <span class="close">&times;</span>
        <div class="modal-header">
            <div><h1>${this.nombre}</h1></div>
        </div>
        <div class="modal-body">
            <div class="pokemon-info">
                <h3>Información general del Pokemón</h3>
                <p>${this.numero}</p>
                <img class="modal-img img-animate" src="${this.imagen}" alt="${this.nombre}">
                <p>Tipo: ${this.tipo.join(', ')}</p>
            </div>
            <div class="modal-section" id="sobre">
                <p>Especie: ${this.especie}</p>
                <p>Peso: ${this.peso} kg</p>
                <p>Altura: ${this.altura} m</p>
                <p>Habilidades: ${this.habilidades.join(', ')}</p>
                <p>Debilidades: ${this.debilidades.join(', ')}</p>
            </div>
            <div class="modal-section" id="stats">
                <h3>Estadisticas</h3>
                <ul class="stats-list">
                    ${this.stats.map(stat => `
                        <li>
                            ${stat.name}: ${stat.value}
                            <div class="stat-bar">
                                <div class="stat-bar-fill" style="width: ${stat.value / 200 * 100}%;"></div>
                            </div>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div class="modal-section" id="moves">
                <h3>Movimientos:</h3>
                <ul class="moves-list">
                    ${this.moves.map(move => `<li class="move-item">${move}</li>`).join('')}
                </ul>
            </div>
            <div class="sprites">
                ${this.sprites.map(sprite => `<img src="${sprite}" alt="sprite de ${this.nombre}">`).join('')}
            </div>
        </div>
    `;

        modalContent.style.backgroundColor = tipoColor;
        modal.style.display = 'block';

        const tabs = modal.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.dataset.tab;
                showTab(tabId, modal);
            });
        });

        modal.querySelector('.close').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
    }
}

function showTab(tabId, modal) {
    const tabs = modal.querySelectorAll('.tab');
    tabs.forEach(tab => {
        const contentId = tab.dataset.tab;
        const content = modal.querySelector(`#${contentId}`);
        if (contentId === tabId) {
            tab.classList.add('active');
            content.classList.add('active');
        } else {
            tab.classList.remove('active');
            content.classList.remove('active');
        }
    });
}

export default Pokemon;
