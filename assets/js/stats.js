function generateStats(items, currentDate) {
  // Función para calcular el porcentaje de asistencia y otras métricas
  function calcAttendancePast(eventos) {
    let eventsAttendancePast = [];
    eventos.forEach((evento) => {
      let even = {};
      even.name = evento.name;
      even.ganancias =
        evento.assistance != null
          ? evento.assistance * evento.price
          : evento.estimate * evento.price;
      even.pAssistance =
        evento.assistance != null
          ? (evento.assistance / evento.capacity) * 100
          : (evento.estimate / evento.capacity) * 100;
      even.assistance =
        evento.assistance != null ? evento.assistance : evento.estimate;
      even.capacity = evento.capacity;
      even.date = evento.date;
      even.category = evento.category;
      eventsAttendancePast.push(even);
    });
    return eventsAttendancePast;
  }

  // Función para ordenar eventos de mayor a menor por porcentaje de asistencia
  function ordenarMayorAMenor(eventos) {
    return eventos.sort((a, b) => b.pAssistance - a.pAssistance);
  }

  // Función para ordenar eventos de mayor a menor por capacidad
  function ordenarMayorAMenorCapacity(eventos) {
    return eventos.sort((a, b) => b.capacity - a.capacity);
  }

  // Función para crear tablas de eventos
  function crearTablas(eventos, capacidad, idContenedor) {
    let html = "";
    for (let i = 0; i < 3; i++) {
      html += `<tr>
                    <td>${eventos[i].name}</td>
                    <td>${eventos[eventos.length - (i + 1)].name}</td>
                    <td>${capacidad[i].name}</td>
                </tr>`;
    }
    document.getElementById(idContenedor).innerHTML = html;
  }

  // Función para calcular ingresos por categoría (eventos futuros o pasados)
  function calcularIngresosPorCategoria(
    categoria,
    esFuturo,
    currentDate,
    eventos
  ) {
    let ingresos = 0;
    for (let i = 0; i < eventos.length; i++) {
      const evento = eventos[i];
      const fechaEvento = evento.date;
      if (
        evento.category === categoria &&
        ((esFuturo && fechaEvento >= currentDate) ||
          (!esFuturo && fechaEvento < currentDate))
      ) {
        if (evento.assistance === null) {
          ingresos += evento.estimate * evento.price;
        } else {
          ingresos += evento.assistance * evento.price;
        }
      }
    }
    return ingresos;
  }

  // Función para calcular el porcentaje de asistencia por categoría (eventos futuros o pasados)
  function calcularPorcentajePorCategoria(
    categoria,
    esFuturo,
    currentDate,
    eventos
  ) {
    let sumaAsistencias = 0;
    let sumaCapacidad = 0;
    for (let i = 0; i < eventos.length; i++) {
      const evento = eventos[i];
      const fechaEvento = evento.date;
      if (
        evento.category === categoria &&
        ((esFuturo && fechaEvento >= currentDate) ||
          (!esFuturo && fechaEvento < currentDate))
      ) {
        sumaCapacidad += evento.capacity;
        if (evento.assistance === null) {
          sumaAsistencias += evento.estimate;
        } else {
          sumaAsistencias += evento.assistance;
        }
      }
    }
    return sumaCapacidad === 0
      ? "No events"
      : ((sumaAsistencias / sumaCapacidad) * 100).toFixed(2) + "%";
  }

  // Función para llenar las tablas de categorías (eventos futuros y pasados)
  function llenarTablasCategory(eventos, idContenedor, esFuturo, currentDate) {
    let html = "";
    eventos.forEach((categoria) => {
      const ingresos = calcularIngresosPorCategoria(
        categoria.name,
        esFuturo,
        currentDate,
        items
      );
      const porcentaje = calcularPorcentajePorCategoria(
        categoria.name,
        esFuturo,
        currentDate,
        items
      );
      html += `<tr>
                    <td>${categoria.name}</td>
                    <td>$${ingresos.toFixed(2)}</td>
                    <td>${porcentaje}</td>
                </tr>`;
    });
    document.getElementById(idContenedor).innerHTML = html;
  }

  // Calcular métricas y generar tablas para eventos pasados
  const eventsAttendancePast = calcAttendancePast(items);
  ordenarMayorAMenor(eventsAttendancePast);
  crearTablas(
    eventsAttendancePast,
    ordenarMayorAMenorCapacity(items),
    "event-statistics"
  );

  // Calcular métricas y generar tablas para eventos futuros
  const eventsAttendanceFuture = calcAttendancePast(
    items.filter((evento) => evento.date >= currentDate)
  );

  ordenarMayorAMenor(eventsAttendanceFuture);
  crearTablas(
    eventsAttendanceFuture,
    ordenarMayorAMenorCapacity(items),
    "event-upcoming-statistics"
  );

  // Llenar tablas de categorías para eventos pasados y futuros
  const categorias = Array.from(
    new Set(items.map((evento) => evento.category))
  );
  llenarTablasCategory(categorias, "event-past-statistics", false, currentDate);
  llenarTablasCategory(
    categorias,
    "event-upcoming-statistics",
    true,
    currentDate
  );
}
