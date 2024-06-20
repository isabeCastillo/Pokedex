 class Pokemon{
    constructor(nombre, tipo, imagen){
        this.nombre = nombre;
        this.tipo = tipo;
        this.imagen = imagen;
    }

    dibujarPokemon(){
        const pokemonDiv = document.createElement('div');
        pokemonDiv.classList.add('pokemon-card');

        pokemonDiv.innerHTML = `
        <img src="${this.imagen}" alt ="${this.nombre}">
        <h3>${this.nombre}</h3>
        <p>Tipo: ${this.tipo}</p>
        `;
        
        return pokemonDiv;
    }
}

export default Pokemon;