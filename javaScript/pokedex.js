//heredando la clase
import Pokemon from "./pokem.js"; // Importar la clase Pokemon

class Pokedex {
    constructor() {
        this.pokemons = []; // Inicializar un arreglo vacío para almacenar los Pokémon
        this.entrenadores = [ //Inicializa los entrenadores
            {id: 1, nombre: "Isabel", foto: "https://avatars.githubusercontent.com/u/139247973?v=4", acompanante:null},
            {id: 2, nombre: "Dayna", foto: "https://avatars.githubusercontent.com/u/94188953?v=4", acompanante:null},
            {id: 3, nombre: "Osiris", foto: "https://avatars.githubusercontent.com/u/89263074?v=4", acompanante:null},
            {id: 4, nombre: "Vilma", foto: "https://avatars.githubusercontent.com/u/167550716?v=4", acompanante:null},
            {id: 5, nombre: "Katia", foto: "https://avatars.githubusercontent.com/u/100703979?v=4", acompanante:null}
        ]
    }

    
    
    // Nuevo método para obtener información de un Pokémon por su ID
    async obtenerInfoPokemonPorId(id) {
        const URL = `https://pokeapi.co/api/v2/pokemon/${id}`;
        try {
            const response = await fetch(URL); // Realizar la solicitud HTTP a la API
            if (!response.ok) {
                throw new Error(`Error HTTP!! Estado: ${response.status}`); // Lanzar un error si la respuesta no es exitosa
            }
            const data = await response.json(); // Parsear la respuesta JSON
    
            // Obtener y formatear los datos necesarios del Pokémon
            const numero = `#${String(data.id).padStart(4, '0')}`;
            const nombre = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            const especie = data.species.name;
            const altura = data.height / 10;
            const peso = data.weight / 10;
            const tipo = data.types.map(type => type.type.name);
            const habilidades = data.abilities.map(ability => ability.ability.name);
            const debilidades = await this.obtenerDebilidades(tipo);
            const stats = data.stats.map(stat => ({ name: stat.stat.name, value: stat.base_stat }));
            const moves = data.moves.slice(0, 5).map(move => move.move.name);//limitar a los primeros 5 movimientos
            const imagen = data.sprites.front_default;
            const sprites = Object.values(data.sprites).filter(sprite => typeof sprite === 'string');//filtrar solo las URL de las imagenes

            // Crear una nueva instancia de Pokemon con los datos obtenidos
            const nuevoPokemon = new Pokemon(numero, nombre, especie, altura, peso, tipo, habilidades, debilidades, stats, moves, imagen, sprites);
            this.agregarPokemon(nuevoPokemon); // Agregar el Pokémon a la Pokedex

        } catch (error) {
            console.error(`Error al obtener datos de Pokemon con ID ${id}:`, error); // Manejar errores de la solicitud
        }
    }
    async obtenerTodosLosPokemon() {
        try {
            //Iterar del 1 al 150 para obtener cada Pokémon por su ID
            for (let id = 1; id <= 150; id++) {
                await this.obtenerInfoPokemonPorId(id);
            }
        } catch (error) {
            console.error('Error al obtener datos de Pokemon:', error);//permite manejar los errores
        }
    }

// Método para obtener las debilidades de un Pokémon según su tipo
async obtenerDebilidades(tipos) {
    const debilidades = new Set();
    for (const tipo of tipos) {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
        const data = await response.json();
        data.damage_relations.double_damage_from.forEach(damage => debilidades.add(damage.name));
    }
    return Array.from(debilidades); //convertir el Set a un arreglo
}

// Método para agregar un Pokémon al arreglo de pokemons
agregarPokemon(pokemon) {
    this.pokemons.push(pokemon);
}

// Método para agregar los entrenadores al localstorage
agregarEntreadores() {
    // obtiene el item entrenadores
    const entrenadores = JSON.parse(localStorage.getItem('entrenadores')) || [];
    if(entrenadores.length === 0) { //si no existe el item, lo agrega
        localStorage.setItem('entrenadores', JSON.stringify(this.entrenadores));
    }
}

// Método para dibujar la Pokedex en el elemento HTML con clase 'pokedex'
dibujarPokedex() {
    const pokedexSection = document.querySelector('.pokedex');
    pokedexSection.innerHTML = ''; // Limpiar el contenido existente
    // Iterar sobre cada Pokémon y añadir su representación HTML a la Pokedex
    this.pokemons.forEach(pokemon => {
        const pokemonDiv = pokemon.dibujarPokemon(false,this.dibujarAcompanantes.bind(this));
        pokedexSection.appendChild(pokemonDiv);
    });
}

// Método para dibujar los acompanantes en el HTML con clase 'acompanantes'
dibujarAcompanantes() {
    const section = document.querySelector('.acompanantes');
    section.innerHTML = ''; // Limpiar el contenido existente
    // Itera sobre los acompañantes para dibujarlos en la sección que responde
    const acompanantes = JSON.parse(localStorage.getItem('acompanantes')) || [];
    acompanantes.forEach(acompanante => {
        // Desestructuracion para obtener los datos para crear Pokemon
        const {numero, nombre, especie, altura, peso, tipo, habilidades, debilidades, stats, moves, imagen, sprites} = acompanante
        // Se crea el pokemon
        const pokemon = new Pokemon(numero, nombre, especie, altura, peso, tipo, habilidades, debilidades, stats, moves, imagen, sprites)
        //Se dibuja
        const pokemonDiv = pokemon.dibujarPokemon(true,this.dibujarAcompanantes.bind(this),this.dibujarEntrenadores.bind(this)); //bind se usa para asegurar que la función dibujarAcompanantes siempre se ejecute con this apuntando al objeto de la clase Pokedex
        section.appendChild(pokemonDiv);
    });
}

dibujarEntrenador(entrenador) {
    const entrenadorDiv = document.createElement('div');
    let acompanante = undefined
    if(entrenador.acompanante){
        acompanante = entrenador.acompanante
    }

    entrenadorDiv.classList.add('pokemon-card'); //añadir clase para el css
    // Aplicar el color de fondo
    entrenadorDiv.style.backgroundColor = "#000550";
    //aqui es utilizan los ternarios para asegurarse que renderizar en caso de no tener acompanante
    entrenadorDiv.innerHTML = `
        <div class="pokemon-container">
            <img class="foto-entrenador" src="${entrenador.foto}" alt="${entrenador.nombre}">
            <h3>${entrenador.nombre}</h3>
            <div class="entrenador-contenedor">
                <p>
                    ${acompanante ? `Acompañante Asigando:` : "Sin acompañante asignado"}
                </p>
                <img
                    src="${acompanante ? acompanante.imagen : '../img/pokemon-desconocido.png'}"
                    alt="${acompanante ? acompanante.nombre : ''}"
                >
                <button id="btnEliminarAsignado"  ${acompanante ? "class='select-companion-btn' " : "class='select-companion-disabled' disabled"} >Eliminar acompañante</button>
            </div>
        </div>
    `;

    entrenadorDiv.querySelector('#btnEliminarAsignado').addEventListener('click', () => {
        this.eliminarAcompananteAEntrenador(entrenador.id)
    });

    return entrenadorDiv;
}

dibujarEntrenadores() {
    const entrenadores = JSON.parse(localStorage.getItem('entrenadores')) || []
    const entrenadoresSection = document.querySelector('.entrenadores');
    entrenadoresSection.innerHTML = ''; // Limpiar el contenido existente
    // 
    entrenadores.forEach(entrenador => {
        const entrenadorDiv = this.dibujarEntrenador(entrenador)
        entrenadoresSection.appendChild(entrenadorDiv);
    });
}

    // Metodo para eliminar pokemon acompanante, recibe el id del entrenador y funcion para redibujar los entrenadores
    eliminarAcompananteAEntrenador(idEntrenador) {
        //Se obtienen los entrenadores
        const entrenadores = JSON.parse(localStorage.getItem('entrenadores')) || []
        // Se elimina el acompanante del entrenador
        let nombreEntrenador = '' 
        const nuevosEntrenadores = entrenadores.map(entrenador => {
            if(entrenador.id === parseInt(idEntrenador)){
                entrenador.acompanante = null
                nombreEntrenador = entrenador.nombre
            }
            return entrenador
        })
        // Se guardan los entrenadores con los nuevos datos
        localStorage.setItem('entrenadores', JSON.stringify(nuevosEntrenadores));
        this.dibujarEntrenadores()
        this.dibujarAcompanantes()
    }

}

export default Pokedex; // Exportar la clase Pokedex para ser utilizada en otros módulos