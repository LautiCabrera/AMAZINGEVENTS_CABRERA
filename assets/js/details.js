// Parametros de busqueda

let quearySearch = document.location.search;

const id = new URLSearchParams(quearySearch).get("id");

let event = data.events.find((evento) => evento._id === id);

let assistanceEstimate = ""

// Conicional para inyectar asistence y estimate segun eventos pasados o futuros

if(event.assistance){
  assistanceEstimate = `<p class="card-text">Assistance: ${event.assistance}</p>`;
} else {
  assistanceEstimate = `<p class="card-text">Estimate: ${event.estimate}</p>`
}

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
          ${assistanceEstimate}
          <p class="card-text">Price: $${event.price}</p>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

cardDetail();
