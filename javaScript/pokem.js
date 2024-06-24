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

        //usa el primer tipo (refiriendo al tipo de pokemon) para determinar el color
        return coloresDeTipo[this.tipo[0].toLowerCase()] || '#777'; // Por defecto es gris si no se encuentra el tipo
    }

    // Método para dibujar el Pokémon
    dibujarPokemon() {
        //creando un div contenedor para la tarjeta
        const pokemonDiv = document.createElement('div');
        pokemonDiv.classList.add('pokemon-card');//añadir clase para el css
        // Aplicar el color de fondo según el tipo
        const tipoColor = this.obtenerColorDeTipo();
        pokemonDiv.style.backgroundColor = tipoColor;

        //definiendo html
        pokemonDiv.innerHTML = `
            <img src="${this.imagen}" alt="${this.nombre}"><!-- Imagen principal del Pokémon -->
            <h3>${this.nombre}</h3><!-- Nombre del Pokémon -->
            <p>${this.numero}</p><!-- Número del Pokémon -->
            <p>Tipo: ${this.tipo.join(', ')}</p><!-- Tipos del Pokémon, concatenados por comas -->
            <button class="select-companion-btn">Seleccionar acompañante</button>
        `;

        pokemonDiv.querySelector('.select-companion-btn').addEventListener('click', () => {
            this.seleccionarComoAcompanante();
        });

        //agregar evento de clic para mostrar el modal
        pokemonDiv.addEventListener('click', () => {
            this.mostrarModal(); // Llamar a la función mostrarModal al hacer clic en la tarjeta
        });
        return pokemonDiv; //Retornar el div contenedor completo
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

    // Método para mostrar el modal con información detallada
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
            <div class="modal-header">
                <h2>${this.nombre}</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="pokemon-info">
                    <p>${this.numero}</p>
                    <img class="modal-img img-animate" src="${this.imagen}" alt="${this.nombre}">
                    <p>Tipo: ${this.tipo.join(', ')}</p>
                </div>
                <nav class="modal-nav">
                    <button class="nav-button active" data-section="sobre">Sobre</button>
                    <button class="nav-button" data-section="stats">Stats</button>
                    <button class="nav-button" data-section="moves">Moves</button>
                </nav>
                <div class="modal-section active" id="sobre">
                    <p>Especie: ${this.especie}</p>
                    <p>Peso: ${this.peso} kg</p>
                    <p>Altura: ${this.altura} m</p>
                    <p>Habilidades: ${this.habilidades.join(', ')}</p>
                    <p>Debilidades: ${this.debilidades.join(', ')}</p>
                </div>
                <div class="modal-section" id="stats">
                    <p>Stats:</p>
                    <ul class="stats-list">
                        ${this.stats.map(stat => `
                            <li>
                                ${stat.name}: ${stat.value}
                                <div class="stat-bar">
                                    <div class="stat-bar-fill" style="width: ${stat.value/200 * 100}%;"></div>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="modal-section" id="moves">
                    <p>Movimientos:</p>
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

        // Event listeners para navegación del modal
        const navButtons = modal.querySelectorAll('.nav-button');
        const sections = modal.querySelectorAll('.modal-section');

        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remover la clase 'active' de todas las secciones y botones
                navButtons.forEach(btn => btn.classList.remove('active'));
                sections.forEach(section => section.classList.remove('active'));

                // Agregar la clase 'active' al botón y sección seleccionada
                button.classList.add('active');
                const sectionId = button.getAttribute('data-section');
                document.getElementById(sectionId).classList.add('active');
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

export default Pokemon; //exportar la clase Pokemon para ser utilizada