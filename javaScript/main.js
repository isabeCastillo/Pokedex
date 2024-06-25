import Pokedex from './pokedex.js'; // Importar la clase Pokedex

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', async () => {
    const miPokedex = new Pokedex(); // Crear una nueva instancia de Pokedex
    await miPokedex.obtenerTodosLosPokemon(); // Obtener todos los Pokémon y añadirlos a la Pokedex
    miPokedex.dibujarPokedex(); // Dibujar la Pokedex en el DOM
    miPokedex.dibujarAcompanates();

    // Manejar la navegación entre secciones
    const sectionLinks = document.querySelectorAll('nav a[data-section]');
    sectionLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevenir el comportamiento por defecto del enlace
            const sectionId = event.target.getAttribute('data-section'); // Obtener el ID de la sección a mostrar
            showSection(sectionId); // Mostrar la sección correspondiente
        });
    });

    // Manejar el clic en el enlace "Ver todos"
    const verTodosLink = document.getElementById('ver-todos');
    verTodosLink && verTodosLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del enlace
        showSection('pokedex'); // Mostrar la sección de la Pokedex
        mostrarTodosLosPokemon(); // Mostrar todos los Pokémon
    });

    // Manejar el clic en las etiquetas de tipo de Pokémon
    const tipoLinks = document.querySelectorAll('.nav_vertical li a[data-tipo]');
    tipoLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevenir el comportamiento por defecto del enlace
            const tipo = event.target.getAttribute('data-tipo'); // Obtener el tipo de Pokémon a filtrar
            showSection('pokedex'); // Mostrar la sección de la Pokedex
            filtrarPorTipo(tipo); // Filtrar los Pokémon por tipo
        });
    });

    // Función para mostrar una sección y ocultar las otras
    function showSection(sectionId) {
        const sections = document.querySelectorAll('main section');
        sections.forEach(section => {
             // Ocultar todas las secciones
            section.classList.remove('active');
            section.classList.add('inactive');
        });
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('inactive');
            targetSection.classList.add('active'); // Mostrar la sección objetivo
        }
    }

    // Función para mostrar todos los Pokémon
    function mostrarTodosLosPokemon() {
        const pokedexSection = document.querySelector('.pokedex');
        pokedexSection.innerHTML = ''; // Limpiar el contenido de la Pokedex antes de mostrar todos los Pokémon

        miPokedex.pokemons.forEach(pokemon => {
            const pokemonDiv = pokemon.dibujarPokemon(); // Dibujar la tarjeta del Pokémon
            pokedexSection.appendChild(pokemonDiv); // Añadir la tarjeta a la Pokedex
        });
    }

    // Función para filtrar y mostrar Pokémon por tipo
    function filtrarPorTipo(tipo) {
        const pokemonFiltrados = miPokedex.pokemons.filter(pokemon => {
            return pokemon.tipo.includes(tipo.toLowerCase()); // Filtrar los Pokémon por tipo
        });

        const pokedexSection = document.querySelector('.pokedex');
        pokedexSection.innerHTML = ''; // Limpiar el contenido de la Pokedex antes de mostrar los Pokémon filtrados

        pokemonFiltrados.forEach(pokemon => {
            const pokemonDiv = pokemon.dibujarPokemon(); // Dibujar la tarjeta del Pokémon filtrado
            pokedexSection.appendChild(pokemonDiv); // Añadir la tarjeta a la Pokedex
        });
    }

    // Mostrar la sección de inicio al cargar la página
    showSection('inicio');
});