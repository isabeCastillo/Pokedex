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
        this.db = null; // Inicializar la referencia a IndexedDB
    }
    //Itera del Pokémon 1 al 150 y llama a obtenerInfoPokemonPorId(id) para obtener la información de cada uno.
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
    
    // Nuevo método para obtener información de un Pokémon por su ID
     //Realiza una solicitud a la PokeAPI para obtener los datos del Pokémon con el id especificado.
    //Procesa la respuesta JSON para obtener detalles como número, nombre, tipo, habilidades, entre otros.
    //Crea una nueva instancia de la clase Pokemon con estos datos y la agrega al arreglo 
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
            const nuevoPokemon = new Pokemon(numero, nombre, especie, altura, peso, tipo, habilidades, debilidades, stats, moves, imagen, sprites, this);
            this.agregarPokemon(nuevoPokemon); // Agregar el Pokémon a la Pokedex

        } catch (error) {
            console.error(`Error al obtener datos de Pokemon con ID ${id}:`, error); // Manejar errores de la solicitud
        }
    }

// Método para obtener las debilidades de un Pokémon según su tipo
// Método para obtener las debilidades de un Pokémon según su tipo
//Obtiene las debilidades de los tipos de Pokémon especificados consultando la PokeAPI.
//Utiliza un Set para evitar duplicados y devuelve un arreglo de debilidades.
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
//agregarPokemon(pokemon): Agrega un Pokémon al arreglo pokemons.
//agregarEntreadores(): Almacena los entrenadores en el localStorage si no existen ya.
agregarPokemon(pokemon) {
    this.pokemons.push(pokemon);
}


// Método para inicializar IndexedDB
async inicializarIndexedDB() {
    return new Promise((resolve, reject) => {
        // Abre una conexión a la base de datos 'PokedexDB', versión 1
        const request = indexedDB.open('PokedexDB', 1);

        // Este evento se dispara si la base de datos no existe o la versión cambia
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // Verifica si el almacén de objetos 'entrenadores' no existe
            if (!db.objectStoreNames.contains('entrenadores')) {
                // Crea un almacén de objetos 'entrenadores' con 'id' como clave primaria
                db.createObjectStore('entrenadores', { keyPath: 'id' });
            }
        };

        // Este evento se dispara cuando se abre exitosamente la conexión a la base de datos
        request.onsuccess = (event) => {
            this.db = event.target.result; // Guarda la referencia a la base de datos
            resolve(); // Resuelve la promesa indicando éxito
        };

        // Este evento se dispara si hay un error al abrir la base de datos
        request.onerror = (event) => {
            console.error('Error al abrir IndexedDB:', event.target.error); // Muestra el error en la consola
            reject(event.target.error); // Rechaza la promesa indicando un error
        };
    });
}


// Método para agregar entrenadores a IndexedDB
async agregarEntrenadores() {
    return new Promise((resolve, reject) => {
        // Inicia una transacción de lectura y escritura en el almacén de objetos 'entrenadores'
        const transaction = this.db.transaction(['entrenadores'], 'readwrite');
        const store = transaction.objectStore('entrenadores');

        // Itera sobre la lista de entrenadores
        this.entrenadores.forEach(entrenador => {
            // Intenta obtener un entrenador con el id especificado
            const request = store.get(entrenador.id);
            
            // Este evento se dispara si la solicitud de obtención es exitosa
            request.onsuccess = (event) => {
                // Verifica si el entrenador con el id especificado no existe en el almacén
                if (!event.target.result) {
                    // Agrega el entrenador al almacén de objetos
                    store.add(entrenador);
                }
            };
        });

        // Este evento se dispara cuando la transacción se completa exitosamente
        transaction.oncomplete = () => {
            resolve(); // Resuelve la promesa indicando éxito
        };

        // Este evento se dispara si hay un error en la transacción
        transaction.onerror = (event) => {
            console.error('Error al agregar entrenadores a IndexedDB:', event.target.error); // Muestra el error en la consola
            reject(event.target.error); // Rechaza la promesa indicando un error
        };
    });
}

// Método para obtener entrenadores
async obtenerEntrenadores() {
    return await new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['entrenadores'], 'readonly');
        const store = transaction.objectStore('entrenadores');
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = (event) => {
            console.error('Error al obtener entrenadores:', event.target.error);
            reject(event.target.error);
        };
    });
}

// Método para dibujar la Pokedex en el elemento HTML con clase 'pokedex'
//dibujarPokedex(): Renderiza los Pokémon en el elemento HTML con clase pokedex.
//dibujarAcompanantes(): Renderiza los acompañantes en el elemento HTML con clase acompanantes, obtenidos del localStorage
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
        const pokemon = new Pokemon(numero, nombre, especie, altura, peso, tipo, habilidades, debilidades, stats, moves, imagen, sprites, this)
        //Se dibuja
        const pokemonDiv = pokemon.dibujarPokemon(true,this.dibujarAcompanantes.bind(this),this.dibujarEntrenadores.bind(this)); //bind se usa para asegurar que la función dibujarAcompanantes siempre se ejecute con this apuntando al objeto de la clase Pokedex
        section.appendChild(pokemonDiv);
    });
}
//dibujarEntrenador(entrenador): Crea y retorna un elemento HTML que representa visualmente a un entrenador, con opción de mostrar su acompañante y un botón para eliminarlo.
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

// Método para dibujar entrenadores
async dibujarEntrenadores() {
    try {
        const entrenadores = await this.obtenerEntrenadores() || [];
        const entrenadoresSection = document.querySelector('.entrenadores');
        entrenadoresSection.innerHTML = ''; // Limpiar el contenido existente
        
        entrenadores.forEach(entrenador => {
            const entrenadorDiv = this.dibujarEntrenador(entrenador);
            entrenadoresSection.appendChild(entrenadorDiv);
        });
    } catch (error) {
        console.error('Error al dibujar entrenadores:', error);
    }
}

    // Metodo para agregar acompanante a entrenador
    async asignarAcompananteAEntrenador(entrenadores, pokemon, modal) {
        // Se obtiene el valor del select
        const idEntrenador = parseInt(document.getElementById('selectAsignar').value);
        // Se verifica si hay un entrenador que ya tenga el acompañante
        const asignadoPreviamente = entrenadores.find(entrenador => entrenador?.acompanante?.numero === pokemon.numero);
        // Si se encuentra un entrenador con el mismo acompañante, no se asigna
        if (asignadoPreviamente) {
            alert(`Error, el acompañante ya ha sido asignado a ${asignadoPreviamente.nombre}`);
            return;
        }
        // Se obtiene el entrenador seleccionado
        const entrenador = entrenadores.find(entrenador => entrenador.id === idEntrenador);
        // Si se encuentra el entrenador, se asigna el acompañante
        if (entrenador) {
            // Crear una copia del Pokémon sin la referencia a pokedex
            const acompanante = { 
                numero: pokemon.numero,
                nombre: pokemon.nombre,
                imagen: pokemon.imagen
            };
            entrenador.acompanante = acompanante; 
        }
        // Se actualiza el entrenador en IndexedDB
        try {
            const transaction = this.db.transaction(['entrenadores'], 'readwrite');
            const store = transaction.objectStore('entrenadores');
            await new Promise((resolve, reject) => {
                const request = store.put(entrenador);
                request.onsuccess = () => resolve();
                request.onerror = (event) => reject(event.target.error);
            });
            // Se cierra el modal y se redibujan los entrenadores
            document.body.removeChild(modal);
            this.dibujarEntrenadores();
        } catch (error) {
            console.error('Error al actualizar el entrenador en IndexedDB:', error);
        }
    }

    // Método para eliminar pokemon acompañante, recibe el id del entrenador
    async eliminarAcompananteAEntrenador(idEntrenador) {
        // Obtener todos los entrenadores de IndexedDB
        const entrenadores = await this.obtenerEntrenadores();

        // Encontrar el entrenador específico y eliminar el acompañante
        const entrenador = entrenadores.find(entrenador => entrenador.id === parseInt(idEntrenador));
        if (entrenador) {
            entrenador.acompanante = null;
        }

        // Actualizar el entrenador en IndexedDB
        try {
            const transaction = this.db.transaction(['entrenadores'], 'readwrite');
            const store = transaction.objectStore('entrenadores');
            const entrenadorToUpdate = { ...entrenador }; // Crear una copia simple del objeto entrenador
            await new Promise((resolve, reject) => {
                const request = store.put(entrenadorToUpdate);
                request.onsuccess = () => resolve();
                request.onerror = (event) => reject(event.target.error);
            });

            // Redibujar los entrenadores y acompañantes
            this.dibujarEntrenadores();
            this.dibujarAcompanantes();
        } catch (error) {
            console.error('Error al actualizar el entrenador en IndexedDB:', error);
        }
    }

}

export default Pokedex; // Exportar la clase Pokedex para ser utilizada en otros módulos