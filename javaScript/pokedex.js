// pokedex.js
// Importar la clase Pokemon desde './pokem.js'
import Pokemon from "./pokem.js";

// Resto del código de la clase Pokedex
class Pokedex {
    constructor() {
        this.pokemons = []; // Inicializar un arreglo vacío para almacenar los Pokémon
    }

    async obtenerTodosLosPokemon() {
        try {
            //Iterar del 1 al 150 para obtener cada Pokémon por su ID
            for (let id = 1; id <= 150; id++) {
                await this.obtenerInfoPokemonPorId(id);
            }
        } catch (error) {
            console.error('Error al obtener datos de Pokemon:', error); // Permite manejar los errores
        }
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
            const moves = data.moves.slice(0, 5).map(move => move.move.name); // Limitar a los primeros 5 movimientos
            const imagen = data.sprites.front_default;
            const sprites = Object.values(data.sprites).filter(sprite => typeof sprite === 'string'); // Filtrar solo las URL de las imágenes

            // Crear una nueva instancia de Pokemon con los datos obtenidos
            const nuevoPokemon = new Pokemon(numero, nombre, especie, altura, peso, tipo, habilidades, debilidades, stats, moves, imagen, sprites);
            this.agregarPokemon(nuevoPokemon); // Agregar el Pokémon a la Pokedex
        } catch (error) {
            console.error(`Error al obtener datos de Pokemon con ID ${id}:`, error); // Manejar errores de la solicitud
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
        return Array.from(debilidades); // Convertir el Set a un arreglo
    }

    // Método para agregar un Pokémon al arreglo de pokemons
    agregarPokemon(pokemon) {
        this.pokemons.push(pokemon);
    }

    // Método para dibujar la Pokedex en el elemento HTML con id 'pokedex'
    dibujarPokedex() {
        const pokedexSection = document.getElementById('pokedex');
        pokedexSection.innerHTML = ''; // Limpiar el contenido existente

        // Iterar sobre cada Pokémon y añadir su representación HTML a la Pokedex
        this.pokemons.forEach(pokemon => {
            const pokemonDiv = pokemon.dibujarPokemon(false,this.dibujarAcompanantes.bind);
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
        const pokemonDiv = pokemon.dibujarPokemon(true,this.dibujarAcompanantes.bind(this)); //bind se usa para asegurar que la función dibujarAcompanantes siempre se ejecute con this apuntando al objeto de la clase Pokedex
        section.appendChild(pokemonDiv);
    });
}
}

export default Pokedex; // Exportar la clase Pokedex para ser utilizada en otros módulos
