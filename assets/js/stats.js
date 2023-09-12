function generateStats(items) {
  const tablebodymain = document.getElementById("event-statistics");
  const tBodyUpcoming = document.getElementById("event-upcoming-statistics");
  const tBodyPast = document.getElementById("event-past-statistics");

  // Separación arreglos de estadísticas
  const withAssistance = [];
  const withEstimate = [];
  const withCapacity = [];

  items.forEach((event) => {
    if (event.assistance != null) {
      withAssistance.push({
        name: event.name,
        porcentaje: (event.assistance / event.capacity) * 100,
      });
    } else {
      withEstimate.push({
        name: event.name,
        porcentaje: (event.estimate / event.capacity) * 100,
      });
    }
  });

  items.forEach((event) => {
    withCapacity.push({
      name: event.name,
      capacity: event.capacity,
    });
  });

  // Esta función toma un arreglo de estadísticas y lo ordena de mayor a menor
  function ordenarPorcentaje(stats) {
    return stats.slice().sort((eventA, eventB) => {
      return eventB.porcentaje - eventA.porcentaje;
    });
  }

  function ordenarCapacidad(stats) {
    return stats.slice().sort((eventA, eventB) => {
      return eventB.capacity - eventA.capacity;
    });
  }

  // Generar tabla de estadísticas generales
  generateGeneralStatsTable(
    ordenarPorcentaje(withAssistance),
    ordenarCapacidad(withCapacity),
    tablebodymain
  );

  // Generar tablas de estadísticas por categoría para eventos futuros y pasados
  generateCategoryStatsTable(stats, tBodyUpcoming, true);
  generateCategoryStatsTable(stats, tBodyPast, false);

  // Función para generar tabla de estadísticas generales
  function generateGeneralStatsTable(eventsPorcentaje, eventCapacity, tbody) {
    console.log(eventsPorcentaje);
    console.log(eventCapacity);
    const highestAttendanceEvent = eventsPorcentaje[0];
    const lowestAttendanceEvent = eventsPorcentaje[eventsPorcentaje.length - 1];
    const highestCapacityEvent = eventCapacity[0];

    tbody.innerHTML = `
    <tr>
      <td class="text-secondary fw-semibold">${highestAttendanceEvent.name}</td>
      <td class="text-secondary fw-semibold">${lowestAttendanceEvent.name}</td>
      <td class="text-secondary fw-semibold">${highestCapacityEvent.name}</td>
    </tr>
  `;
  }

  // Función para generar tablas de estadísticas por categoría
  function generateCategoryStatsTable(events, tbody, upcoming) {
    const uniqueCategories = [...new Set(items.map((event) => event.category))];

    tbody.innerHTML = `
      <tr>
        <td class="bg-primary-subtle">Categories</td>
        <td class="bg-primary-subtle">Revenues</td>
        <td class="bg-primary-subtle">Percentage of Attendance</td>
      </tr>
    `;

    uniqueCategories.forEach((category) => {
      const categoryEvents = events.filter(
        (event) => event.category === category
      );

      const filteredCategoryEvents = categoryEvents.filter((event) =>
        upcoming ? event.assistance != null : event.assistance == null
      );

      if (filteredCategoryEvents.length > 0) {
        const totalEarnings = filteredCategoryEvents.reduce(
          (total, event) =>
            total + event.price * (event.assistance || event.estimate),
          0
        );
        const totalCapacity = filteredCategoryEvents.reduce(
          (total, event) => total + event.capacity,
          0
        );
        const totalAttendance = filteredCategoryEvents.reduce(
          (total, event) => total + (event.assistance || 0),
          0
        );
        const percentageAttendance = (
          (totalAttendance / totalCapacity) *
          100
        ).toFixed(1);

        tbody.innerHTML += `
          <tr>
            <td class="text-secondary fw-semibold">${category}</td>
            <td class="text-secondary">$${totalEarnings.toLocaleString(
              "en-GB"
            )}</td>
            <td class="text-secondary">${percentageAttendance}%</td>
          </tr>
        `;
      }
    });
  }
}
