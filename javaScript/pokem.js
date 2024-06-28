//creando la clase llamada Pokemon
class Pokemon {
    //constructor que inicializa todas las propiedades de la clase Pokemon
    constructor(numero, nombre, especie, altura, peso, tipo, habilidades, debilidades, stats, moves, imagen, sprites, pokedexInstance) {
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
        this.pokedex = pokedexInstance; // Pasar la instancia de Pokedex a Pokemon
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

    // Método para dibujar el Pokémon, recibe dibujarComoAcompanante que es un booleano y 
    dibujarPokemon(dibujarComoAcompanante) {
        //creando un div contenedor para la tarjeta
        const pokemonDiv = document.createElement('div');
        pokemonDiv.classList.add('pokemon-card');//añadir clase para el css
        // Aplicar el color de fondo según el tipo
        const tipoColor = this.obtenerColorDeTipo();
        pokemonDiv.style.backgroundColor = tipoColor;

        //Este es el html de la tarjeta, se muestra la imagen, el nombre y el tipo del pokemon
        pokemonDiv.innerHTML = `
            <div class="pokemon-container">
                <img src="${this.imagen}" alt="${this.nombre}">
                <h3>${this.nombre}</h3>
                <p>${this.numero}</p>
                <p>Tipo: ${this.tipo.join(', ')}</p>
            </div>
            <div class="pokemon-buttons-container">
                <button id="selectCompanionBtn" class="select-companion-btn">
                ${dibujarComoAcompanante ? 'Eliminar acompañante' : 'Agregar acompañante'}
                </button>
                ${dibujarComoAcompanante ? '<button id="asignarAEntrenadorBtn" class="select-companion-btn">Asignar a entrenador</button>' : ''}
            </div>
        `;

        //Boton para eliminar o asignar acompanante, depende del argumento que se pase en dibuajrComoAcompanante
        pokemonDiv.querySelector('#selectCompanionBtn').
        addEventListener('click', () => {
            if(dibujarComoAcompanante){
                this.eliminarAcompanante();
            } else {
                this.seleccionarComoAcompanante();
            }
        });

        //boton para el modal de asignar a entrenador
        const botonAsignar = pokemonDiv.querySelector('#asignarAEntrenadorBtn')
        //Se asigna el escuchador solo cuando botonAsignar no es null
        botonAsignar && botonAsignar.addEventListener('click', () => {
            this.mostrarModalAsignar();
        });

        //agregar evento de clic para mostrar el modal
        pokemonDiv.querySelector('.pokemon-container').addEventListener('click', () => {
            this.mostrarModal(); // Llamar a la función mostrarModal al hacer clic en la tarjeta
        });
        return pokemonDiv; //Retornar el div contenedor completo
    }

    seleccionarComoAcompanante() {
        // Obtener la lista de acompañantes del localStorage
        const acompanantes = JSON.parse(localStorage.getItem('acompanantes')) || [];
        
        // Verificar si ya hay 6 acompañantes
        if (acompanantes.length >= 6) {
            alert('No puedes seleccionar más de 6 acompañantes.');
            return;
        }
    
        // Verificar si el Pokémon ya está en la lista de acompañantes
        if (acompanantes.find(pokemon => pokemon.numero === this.numero)) {
            alert(`${this.nombre} ya está en la lista de acompañantes.`);
            return;
        }
    
        // Añadir el Pokémon a la lista de acompañantes y guardar en localStorage
        const { pokedex, ...todasLasDemasPropiedades} = this // se quita la refererencia a la pokedex porque no se puede guardar en el local storage
        acompanantes.push(todasLasDemasPropiedades);
        localStorage.setItem('acompanantes', JSON.stringify(acompanantes));
        alert(`${this.nombre} ha sido añadido como acompañante.`);

        // Redibujar la lista de acompañantes
        this.pokedex.dibujarAcompanantes();
    }
    
    async eliminarAcompanante() {
        // Obtener la lista de entrenadores de IndexedDB
        const entrenadores = await this.pokedex.obtenerEntrenadores();

        // Verificar si algún entrenador tiene asignado este acompañante
        const asignado = entrenadores.some(entrenador => entrenador?.acompanante?.numero === this.numero);

        if (asignado) {
            alert('Error: Este acompañante está asignado a un entrenador y no se puede eliminar.');
            return;
        }

        // Obtener la lista de acompañantes del localStorage
        let acompanantes = JSON.parse(localStorage.getItem('acompanantes')) || [];
    
        // Filtrar la lista para eliminar el acompañante actual
        acompanantes = acompanantes.filter(pokemon => pokemon.numero !== this.numero);
    
        // Guardar la lista actualizada en el localStorage
        localStorage.setItem('acompanantes', JSON.stringify(acompanantes));
        
        // Redibujar la lista de acompañantes
        this.pokedex.dibujarAcompanantes();
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
    // Metodo para asignar pokemon a entrenador
    async mostrarModalAsignar() {
        // Se obtienen los entrenadores desde IndexedDB
        const entrenadores = await this.pokedex.obtenerEntrenadores();
        // Se generan los elementos necesarios para el modal con sus respectivas clases
        const modal = document.createElement('div');
        modal.id = 'asignar-modal';
        modal.classList.add('modal');
        document.body.appendChild(modal);
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        modal.appendChild(modalContent);
        //Se genera el contenido del modal
        modalContent.innerHTML = `
        <div class="modal-header">
            <h2>${"Asignar acompañante a entrenador"}</h2>
            <span class="close">&times;</span>
        </div>
        <div class="modal-body">
            <div>
                Selecciona entrenador
                <select id="selectAsignar">
                ${entrenadores.map(entrenador => {
                    //se generan los options a partir de los entrenadores que no tienen acompanante
                    // se selecciona el primero por defecto
                    if(!entrenador.acompanante){
                        return `<option value="${entrenador.id}" ${entrenador.id === 1 ? "selected" : "" }>
                            ${entrenador.nombre}
                        </option>`
                    }
                }).join("")}
                </select>
            </div>
            <button id="btnAsignar" class="select-companion-btn">Asignar</button>
        </div>
        `;
        // Se le agrega color y se muestra el modal
        modalContent.style.backgroundColor = "#000550";
        modal.style.display = 'block';
        // Se agrega un click para asignar acompanante al entrenador
        modal.querySelector('#btnAsignar').addEventListener('click', () => {
            this.pokedex.asignarAcompananteAEntrenador(entrenadores,this,modal)
        });
        // Se agrega un click a la equis del modal
        modal.querySelector('.close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        // Se agrega un click a la equis del modal
        window.onclick = function(event) {
            if (event.target == modal) {
                document.body.removeChild(modal);
            }
        };
    }    

}

export default Pokemon; //exportar la clase Pokemon para ser utilizada