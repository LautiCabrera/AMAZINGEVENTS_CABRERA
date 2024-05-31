let data;
let allEvents = [];
let upcomingCards = [];
let pastCards = [];

async function getData() {
  try {
    const respuesta = await fetch(
      "https://mindhub-xj03.onrender.com/api/amazing"
    );
    const datos = await respuesta.json();
    data = datos;
  } catch (error) {
    console.log("Error al cargar la API:", error);
  }
}

getData()
  .then(() => {
    allEvents = data.events;
    currentDate = data.currentDate;
    // Separación del array principal en eventos pasados y futuros.
    for (let event of allEvents) {
      if (currentDate < event.date) {
        upcomingCards.push(event);
      } else {
        pastCards.push(event);
      }
    }
    // Ejecuta la función con el arreglo correspondiente al sitio donde está
    let location = window.location.pathname;
    if (location === "/" || location === "/index.html") {
      generateEvents(allEvents);
    } else if (location === "/upcoming-events.html") {
      generateEvents(upcomingCards);
    } else if (location === "/past-events.html") {
      generateEvents(pastCards);
    } else if (location === "/details.html") {
      generateDetails(allEvents);
    }
  })
  .catch((error) => {
    console.log("Error al cargar la API:", error);
  });

// Función para generar las cards de eventos dinámicamente.
// Se le pasa un array de eventos y el id del contenedor del HTML.
function createCards(items, idContenedor) {
  let cardHTML = "";
  for (const item of items) {
    let card = `
        <div class="col mb-4">
          <div class="card card-custom">
            <img src="${item.image}" class="card-img-top card-image" alt="${item.name}">
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">${item.description}</p>
                <div class="d-flex justify-content-around align-items-center">
                    <h6><b>Price: </b> ${item.price}</h6>
                    <a href="./details.html?id=${item._id}" class="btn btn-primary">Details</a>
                </div>
            </div>
          </div>
        </div>`;
    cardHTML += card;
  }
  document.getElementById(idContenedor).innerHTML = cardHTML;
}

// Función para generar los checkboxes de eventos dinámicamente.
// Se le pasa un array de eventos y el id del contenedor del HTML.
function createCheckboxes(items, idContenedor) {
  const categoriesSet = new Set();
  let checkboxHTML = "";
  for (const item of items) {
    // Verificamos si la categoría ya existe.
    if (!categoriesSet.has(item.category)) {
      categoriesSet.add(item.category);
      let checkbox = `
        <li class="list-group-item d-flex justify-content-center">
          <input type="checkbox" id="${item._id}" name="category" value="${item.category}">
          <label for="${item._id}">${item.category}</label>
        </li>`;
      checkboxHTML += checkbox;
    }
  }
  document.getElementById(idContenedor).innerHTML = checkboxHTML;
}

function filterGeneral(events, idContenedor) {
  const searchInput = document.querySelector(".search-input");
  const checkboxes = document.querySelectorAll('input[name="category"]');

  // Filtrado por buscador y checkbox
  function searchCards() {
    const searchText = searchInput.value.toLowerCase();
    const categoriasSeleccionadas = Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value.toLowerCase());
    const filteredEvents = events.filter((evento) => {
      const nombreEnMinusculas = evento.name.toLowerCase();
      return (
        nombreEnMinusculas.includes(searchText) &&
        (categoriasSeleccionadas.length === 0 ||
          categoriasSeleccionadas.includes(evento.category.toLowerCase()))
      );
    });

    if (filteredEvents.length > 0) {
      createCards(filteredEvents, idContenedor);
    } else {
      document.getElementById(
        idContenedor
      ).innerHTML = `<div class="alert alert-info mt-3">
          <p class="mb-0 text-center">No results found.</p>
      </div>`;
    }
  }

  // Carga todos los eventos de la sección en la que se encuentra la página
  createCards(events, idContenedor);

  // Agrega los eventos filtrados a los checkboxes
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      searchCards();
    });
  });

  // Escucha el evento de búsqueda en el input
  searchInput.addEventListener("input", () => {
    searchCards();
  });

  // Limpia los filtros de los checkboxes y search cargando todos los de la sección
  document.querySelector("#clearFilters").addEventListener("click", () => {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
      searchInput.value = "";
    });
    searchCards();
  });
}
