import Pokedex from './pokedex.js';

document.addEventListener('DOMContentLoaded', async() =>{
    const miPokedex = new Pokedex();
    await miPokedex.obtenerTodosLosPokemon();
    miPokedex.dibujarPokedex();

    //manjera la navegacion entre secciones
    const sectionLinks = document.querySelectorAll('nav a[data-section]');
    sectionLinks.forEach(link =>{
        link.addEventListener('click', (event) =>{
            event.preventDefault();
            const sectionId = event.target.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    //manejar el clic en el enlace "Ver todos"
    const verTodosLink = document.getElementById('ver-todos');
    verTodosLink.addEventListener('click', (event) =>{
        event.preventDefault();
        showSection('pokedex');
        mostrarTodosLosPokemon();
    });

    //manejar el clic en las etiquetas de tipo de Pokemon
    const tipoLinks = document.querySelectorAll('.nav_vertical li a[data-tipo]');
    tipoLinks.forEach(link =>{
        link.addEventListener('click', (event)=>{
            event.preventDefault();
            const tipo = event.target.getAttribute('data-tipo');
            showSection('pokedex');
            filtrarPorTipo(tipo);
        });
    });
    //funcion para mostra una seccion y ocultar las demas
    function showSection(sectionId){
        const sections = document.querySelectorAll('main section');
        sections.forEach(section =>{
            section.classList.remove('active');
        });
        const targetSection = document.getElementById(sectionId);
        if(targetSection){
            targetSection.classList.add('active');
        }
    }

    //funcion para mostrar los pokemon

    function mostrarTodosLosPokemon(){
        const pokedexSection = document.getElementById('pokedex');
        pokedexSection.innerHTML = ''; //limpia la pokedex antes de mostrar todos los pokemons

        miPokedex.pokemons.forEach(pokemon =>{
            const pokemonDiv = pokemon.dibujarPokemon();
            pokedexSection.appendChild(pokemonDiv);
        });
    }

    //funcion para filtrar y mostrar pokemon por tipo

    function filtrarPorTipo(tipo){
        const pokemonFiltrados = miPokedex.pokemons.filter(pokemon =>{
            return pokemon.tipo.toLowerCase().includes(tipo);
        });

        const pokedexSection = document.getElementById('pokdex');
        pokedexSection.innerHTML = '';

        pokemonFiltrados.forEach(pokemon=>{
            const pokemonDiv = pokemon.dibujarPokemon();
            pokedexSection.appendChild(pokemonDiv);
        });
    }
    //mostrar la seccion de inicio al cargar la pagina
    showSection('inicio');
});