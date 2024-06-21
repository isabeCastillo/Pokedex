//creando la clase llamada Pokemon
class Pokemon {
    // Constructor que inicializa todas las propiedades de la clase Pokemon
    constructor(numero, nombre, especie, altura, peso, tipo, habilidades, debilidades, stats, moves, imagen, sprites) {
        this.numero = numero; // Número o ID del Pokémon
        this.nombre = nombre; // Nombre del Pokémon
        this.especie = especie; // Especie del Pokémon
        this.altura = altura; // Altura del Pokémon en metros
        this.peso = peso; // Peso del Pokémon en kilogramos
        this.tipo = tipo; // Tipo(s) del Pokémon, un arreglo de cadenas
        this.habilidades = habilidades; // Habilidades del Pokémon, un arreglo de cadenas
        this.debilidades = debilidades; // Debilidades del Pokémon, un arreglo de cadenas
        this.stats = stats; // Estadísticas del Pokémon, un arreglo de objetos con {name, value}
        this.moves = moves; // Movimientos del Pokémon, un arreglo de cadenas
        this.imagen = imagen; // URL de la imagen principal del Pokémon
        this.sprites = sprites; // URLs de sprites adicionales del Pokémon, un arreglo de cadenas
    }

    //Método para dibujar el Pokémon
    dibujarPokemon() {
        // Creando un div contenedor para la tarjeta del Pokémon
        const pokemonDiv = document.createElement('div');
        pokemonDiv.classList.add('pokemon-card'); //Añadir clase CSS para estilos

        //Definiendo el contenido HTML
        pokemonDiv.innerHTML = `
            <img src="${this.imagen}" alt="${this.nombre}"> <!-- Imagen principal del Pokémon -->
            <h3>${this.nombre}</h3> <!-- Nombre del Pokémon -->
            <p>${this.numero}</p> <!-- Número del Pokémon -->
            <p>Nombre: ${this.nombre}</p>
            <p>Especie: ${this.especie}</p> <!-- Especie del Pokémon -->
            <p>Altura: ${this.altura} m</p> <!-- Altura del Pokémon -->
            <p>Peso: ${this.peso} kg</p> <!-- Peso del Pokémon -->
            <p>Tipo: ${this.tipo.join(', ')}</p> <!-- Tipos del Pokémon, concatenados por comas -->
            <p>Habilidades: ${this.habilidades.join(', ')}</p> <!-- Habilidades del Pokémon -->
            <p>Debilidades: ${this.debilidades.join(', ')}</p> <!-- Debilidades del Pokémon -->
            <p>Stats:</p> <!-- Título para las estadísticas -->
            <ul>
                <!-- Mapeo de las estadísticas a elementos de lista -->
                ${this.stats.map(stat => `<li>${stat.name}: ${stat.value}</li>`).join('')}
            </ul>
            <p>Movimientos:</p> <!-- Título para los movimientos -->
            <ul>
                <!-- Mapeo de los movimientos a elementos de lista -->
                ${this.moves.map(move => `<li>${move}</li>`).join('')}
            </ul>
            <div class="sprites">
                <!-- Mapeo de los sprites adicionales a imágenes -->
                ${this.sprites.map(sprite => `<img src="${sprite}" alt="sprite de ${this.nombre}">`).join('')}
            </div>
        `;
        return pokemonDiv; //Retornar el div contenedor completo
    }
}

export default Pokemon; // Exportar la clase Pokemon para ser utilizada en otros módulos