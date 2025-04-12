const readline = require("readline-sync");
const fs = require("fs");
const chalk = require("chalk");

let catalogo = [];

if (fs.existsSync("catalogo.json")) {
  catalogo = JSON.parse(fs.readFileSync("catalogo.json", "utf8"));
}

function guardarCatalogo() {
  fs.writeFileSync("catalogo.json", JSON.stringify(catalogo, null, 2));
  console.log(chalk.green(" Catálogo guardado correctamente.\n"));
}

function agregarLibro() {
  const titulo = readline.question("Título: ");
  const autor = readline.question("Autor: ");
  const precio = parseFloat(readline.question("Precio: "));
  const anio = parseInt(readline.question("Año de publicación: "));

  if (isNaN(precio) || precio <= 0 || isNaN(anio)) {
    console.log(chalk.red(" Datos inválidos. Intenta de nuevo.\n"));
    return;
  }

  const libro = { titulo, autor, precio, anio };
  catalogo.push(libro);
  guardarCatalogo();
  console.log(chalk.green(" Libro agregado exitosamente.\n"));
}

function mostrarCatalogo() {
  if (catalogo.length === 0) {
    console.log(chalk.yellow(" No hay libros en el catálogo.\n"));
    return;
  }
  console.log(chalk.cyan("\n Catálogo de Libros:"));
  catalogo.forEach((libro, index) => {
    console.log(`${index + 1}. ${libro.titulo} - ${libro.autor} - $${libro.precio} - Año: ${libro.anio}`);
  });
  console.log("");
}

function buscarPorTitulo() {
  const titulo = readline.question("Título del libro a buscar: ");
  const libro = catalogo.find(l => l.titulo.toLowerCase() === titulo.toLowerCase());

  if (libro) {
    console.log(chalk.cyan("\n Libro encontrado:"));
    console.log(libro);
  } else {
    console.log(chalk.red(" Libro no encontrado.\n"));
  }
}

function eliminarLibro() {
  const titulo = readline.question("Título del libro a eliminar: ");
  const indice = catalogo.findIndex(l => l.titulo.toLowerCase() === titulo.toLowerCase());

  if (indice !== -1) {
    catalogo.splice(indice, 1);
    guardarCatalogo();
    console.log(chalk.green(" Libro eliminado exitosamente.\n"));
  } else {
    console.log(chalk.red(" Libro no encontrado.\n"));
  }
}

function verEstadisticas() {
  if (catalogo.length === 0) {
    console.log(chalk.yellow(" No hay libros para analizar.\n"));
    return;
  }

  const total = catalogo.length;
  const promedio = catalogo.reduce((acc, l) => acc + l.precio, 0) / total;
  const masAntiguo = catalogo.reduce((prev, curr) => (curr.anio < prev.anio ? curr : prev));
  const masCaro = catalogo.reduce((prev, curr) => (curr.precio > prev.precio ? curr : prev));

  console.log(chalk.cyan("\n Estadísticas del Catálogo:"));
  console.log(` Total de libros: ${total}`);
  console.log(` Precio promedio: $${promedio.toFixed(2)}`);
  console.log(` Libro más antiguo: ${masAntiguo.titulo} (${masAntiguo.anio})`);
  console.log(` Libro más caro: ${masCaro.titulo} ($${masCaro.precio})\n`);
}

function ordenarLibros() {
  console.log("\n1. Ordenar por precio ascendente");
  console.log("2. Ordenar por precio descendente");
  console.log("3. Ordenar por año de publicación");

  const opcion = readline.question("Elige una opción: ");

  if (opcion === "1") {
    catalogo.sort((a, b) => a.precio - b.precio);
  } else if (opcion === "2") {
    catalogo.sort((a, b) => b.precio - a.precio);
  } else if (opcion === "3") {
    catalogo.sort((a, b) => a.anio - b.anio);
  } else {
    console.log(chalk.red(" Opción inválida.\n"));
    return;
  }

  mostrarCatalogo();
}

function editarLibro() {
  const titulo = readline.question("Título del libro a editar: ");
  const libro = catalogo.find(l => l.titulo.toLowerCase() === titulo.toLowerCase());

  if (!libro) {
    console.log(chalk.red(" Libro no encontrado.\n"));
    return;
  }

  const nuevoTitulo = readline.question(`Nuevo título (${libro.titulo}): `) || libro.titulo;
  const nuevoAutor = readline.question(`Nuevo autor (${libro.autor}): `) || libro.autor;
  const nuevoPrecio = readline.question(`Nuevo precio (${libro.precio}): `);
  const nuevoAnio = readline.question(`Nuevo año (${libro.anio}): `);

  libro.titulo = nuevoTitulo;
  libro.autor = nuevoAutor;
  libro.precio = parseFloat(nuevoPrecio) || libro.precio;
  libro.anio = parseInt(nuevoAnio) || libro.anio;

  guardarCatalogo();
  console.log(chalk.green(" Libro actualizado exitosamente.\n"));
}

function filtrarPorAutor() {
  const autor = readline.question("Autor a filtrar: ");
  const resultados = catalogo.filter(l => l.autor.toLowerCase().includes(autor.toLowerCase()));

  if (resultados.length === 0) {
    console.log(chalk.red(" No se encontraron libros de ese autor.\n"));
    return;
  }

  console.log(chalk.cyan(`\n Libros de ${autor}:`));
  resultados.forEach((libro, index) => {
    console.log(`${index + 1}. ${libro.titulo} - $${libro.precio} - Año: ${libro.anio}`);
  });
  console.log("");
}

function menu() {
  let opcion;

  do {
    console.log(chalk.blue.bold(" El Rincón del Saber - Sistema de Inventario"));
    console.log("1. Agregar libro");
    console.log("2. Mostrar catálogo");
    console.log("3. Buscar libro por título");
    console.log("4. Eliminar libro");
    console.log("5. Ver estadísticas");
    console.log("6. Ordenar libros");
    console.log("7. Editar libro");
    console.log("8. Salir");
    console.log("9. Filtrar libros por autor");

    opcion = readline.question("Elige una opción: ");
    console.log("");

    switch (opcion) {
      case "1": agregarLibro(); break;
      case "2": mostrarCatalogo(); break;
      case "3": buscarPorTitulo(); break;
      case "4": eliminarLibro(); break;
      case "5": verEstadisticas(); break;
      case "6": ordenarLibros(); break;
      case "7": editarLibro(); break;
      case "8": console.log(chalk.yellow(" Saliendo...")); break;
      case "9": filtrarPorAutor(); break;
      default: console.log(chalk.red(" Opción inválida.\n"));
    }
  } while (opcion !== "8");
}

menu();
