import Pokemon from "./pokem.js";
class Pokedex {
    constructor() {
        this.pokemons = [];
    }

    async obtenerTodosLosPokemon() {
        const URL = "https://pokeapi.co/api/v2/pokemon?limit=150";
        try {
            const response = await fetch(URL);
            if (!response.ok) {
                throw new Error(`Error HTTP!! Estado: ${response.status}`);
            }
            const data = await response.json();
            const pokemons = data.results;

            for (const pokemon of pokemons) {
                await this.obtenerInfoPokemon(pokemon);
            }
        } catch (error) {
            console.error('Error al obtener datos de Pokemon:', error);
        }
    }

    async obtenerInfoPokemon(pokemon) {
        try {
            const response = await fetch(pokemon.url);
            if (!response.ok) {
                throw new Error(`Error HTTP!! Estado: ${response.status}`);
            }
            const data = await response.json();
            const nombre = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            const tipo = data.types.map(type => type.type.name).join(', ');
            const imagen = data.sprites.front_default;

            const nuevoPokemon = new Pokemon(nombre, tipo, imagen);
            this.agregarPokemon(nuevoPokemon);

        } catch (error) {
            console.error('Error al obtener datos de Pokemon:', error);
        }
    }

    agregarPokemon(pokemon) {
        this.pokemons.push(pokemon);
    }

    dibujarPokedex() {
        const pokedexSection = document.getElementById('pokedex');
        pokedexSection.innerHTML = '';

        this.pokemons.forEach(pokemon => {
            const pokemonDiv = pokemon.dibujarPokemon();
            pokedexSection.appendChild(pokemonDiv);
        });
    }
}

export default Pokedex;