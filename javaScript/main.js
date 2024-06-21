import Pokedex from './pokedex.js';

document.addEventListener('DOMContentLoaded', async () => {
    const miPokedex = new Pokedex();
    await miPokedex.obtenerTodosLosPokemon();
    miPokedex.dibujarPokedex();

    // Manejar la navegación entre secciones
    const sectionLinks = document.querySelectorAll('nav a[data-section]');
    sectionLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const sectionId = event.target.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    // Manejar el clic en el enlace "Ver todos"
    const verTodosLink = document.getElementById('ver-todos');
    verTodosLink.addEventListener('click', (event) => {
        event.preventDefault();
        showSection('pokedex');
        mostrarTodosLosPokemon();
    });

    // Manejar el clic en las etiquetas de tipo de Pokémon
    const tipoLinks = document.querySelectorAll('.nav_vertical li a[data-tipo]');
    tipoLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const tipo = event.target.getAttribute('data-tipo');
            showSection('pokedex');
            filtrarPorTipo(tipo);
        });
    });

    // Función para mostrar una sección y ocultar las otras
    function showSection(sectionId) {
        const sections = document.querySelectorAll('main section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    // Función para mostrar todos los Pokémon
    function mostrarTodosLosPokemon() {
        const pokedexSection = document.getElementById('pokedex');
        pokedexSection.innerHTML = ''; // Limpia la Pokédex antes de mostrar todos los Pokémon

        miPokedex.pokemons.forEach(pokemon => {
            const pokemonDiv = pokemon.dibujarPokemon();
            pokedexSection.appendChild(pokemonDiv);
        });
    }

    // Función para filtrar y mostrar Pokémon por tipo
    function filtrarPorTipo(tipo) {
        const pokemonFiltrados = miPokedex.pokemons.filter(pokemon => {
            return pokemon.tipo.toLowerCase().includes(tipo);
        });

        const pokedexSection = document.getElementById('pokedex');
        pokedexSection.innerHTML = '';

        pokemonFiltrados.forEach(pokemon => {
            const pokemonDiv = pokemon.dibujarPokemon();
            pokedexSection.appendChild(pokemonDiv);
        });
    }

    // Mostrar la sección de inicio al cargar la página
    showSection('inicio');
});
