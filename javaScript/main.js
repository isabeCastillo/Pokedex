// main.js
// Importar la clase Pokedex
import Pokedex from './pokedex.js';

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', async () => {
    const miPokedex = new Pokedex(); // Crear una nueva instancia de Pokedex
    await miPokedex.obtenerTodosLosPokemon(); // Obtener todos los Pokémon y añadirlos a la Pokedex
    miPokedex.dibujarPokedex(); // Dibujar la Pokedex en el DOM
    miPokedex.dibujarAcompanantes(); // Dibuja los acompanantes

    // Manejar la navegación entre secciones
    function setupSectionLinks() {
        const sectionLinks = document.querySelectorAll('nav a[data-section]');
        sectionLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault(); // Prevenir el comportamiento por defecto del enlace
                const sectionId = event.target.getAttribute('data-section'); // Obtener el ID de la sección a mostrar
                showSection(sectionId); // Mostrar la sección correspondiente
            });
        });
    }

    function mostrarTodosLosPokemon() {
        const pokedexSection = document.getElementById('pokedex');
        pokedexSection.innerHTML = '';

        miPokedex.pokemons.forEach(pokemon => {
            const pokemonDiv = pokemon.dibujarPokemon();
            pokedexSection.appendChild(pokemonDiv);
        });
    }

    function setupVerTodosLink() {
        const verTodosLink = document.getElementById('ver-todos');
        if (verTodosLink) {
            verTodosLink.addEventListener('click', (event) => {
                event.preventDefault();
                showSection('pokedex');
                mostrarTodosLosPokemon();
            });
        }
    }

    function setupTipoLinks() {
        const tipoLinks = document.querySelectorAll('.nav_vertical li a[data-tipo]');
        tipoLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const tipo = event.target.getAttribute('data-tipo');
                showSection('pokedex');
                filtrarPorTipo(tipo);
            });
        });
    }

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

    function filtrarPorTipo(tipo) {
        const pokemonFiltrados = miPokedex.pokemons.filter(pokemon => {
            return pokemon.tipo.includes(tipo.toLowerCase());
        });

        const pokedexSection = document.getElementById('pokedex');
        pokedexSection.innerHTML = '';

        pokemonFiltrados.forEach(pokemon => {
            const pokemonDiv = pokemon.dibujarPokemon();
            pokedexSection.appendChild(pokemonDiv);
        });
    }

    setupSectionLinks();
    setupVerTodosLink();
    setupTipoLinks();

});
