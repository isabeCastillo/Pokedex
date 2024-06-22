//creando la clase llamada Pokemon
class Pokemon {
    // Constructor que inicializa todas las propiedades de la clase Pokemon
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

    // Método para obtener el color basado en el tipo
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

        // Usar el primer tipo para determinar el color
        return coloresDeTipo[this.tipo[0].toLowerCase()] || '#777'; // Default to grey if type not found
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
            <p>Nombre: ${this.nombre}</p><!-- Nombre del Pokémon -->
            <p>Especie: ${this.especie}</p><!-- Especie del Pokémon -->
            <p>Altura: ${this.altura} m</p> <!-- Altura del Pokémon -->
            <p>Peso: ${this.peso} kg</p> <!-- Peso del Pokémon -->
            <p>Tipo: ${this.tipo.join(', ')}</p><!-- Tipos del Pokémon, concatenados por comas -->
            <p>Habilidades: ${this.habilidades.join(', ')}</p><!-- Habilidades del Pokémon -->
            <p>Debilidades: ${this.debilidades.join(', ')}</p><!-- Debilidades del Pokémon -->
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
            <p>Movimientos:</p>
            <ul class="moves-list" style="background-color:${tipoColor};">
                ${this.moves.map(move => `<li class="move-item">${move}</li>`).join('')}
            </ul>
            <p></p>
            <div class="sprites">
                ${this.sprites.map(sprite => `<img src="${sprite}" alt="sprite de ${this.nombre}">`).join('')}
            </div>
        `;
        //las statd se dividen entre 200 y se multiplican por 100, ya que algunas
        //exceden el 100% y se indica que el valor máximo es de 200 para el ancho del contenedor
        return pokemonDiv; //Retornar el div contenedor completo
    }
}

export default Pokemon; //Exportar la clase Pokemon para ser utilizada en otros módulos