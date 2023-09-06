// Parametros de busqueda

let quearySearch = document.location.search;

const id = new URLSearchParams(quearySearch).get("id");

let event = data.events.find((evento) => evento._id === id);

// Función para crear cards detalles dinamicamente

function cardDetail() {
  document.getElementById("detailCards").innerHTML = `<div class="container">
  <div class="row d-flex align-items-center">
    <div class="col-md-6">
      <div class="card mb-4">
        <img src="${event.image}" alt="${event.name}" class="card-img-top">
        <div class="card-body">
          <h4 class="card-title">${event.name}</h4>
          <p class="card-text">${event.description}</p>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="card mb-4">
        <div class="card-body">
          <p class="card-text">Category: ${event.category}</p>
          <p class="card-text">Place: ${event.place}</p>
          <p class="card-text">Max capacity: ${event.capacity}</p>
          <p class="card-text">Assistance: ${event.assistance}</p>
          <p class="card-text">Estimate: ${event.estimate || "N/A"}</p>
          <p class="card-text">Price: $${event.price}</p>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

cardDetail();
