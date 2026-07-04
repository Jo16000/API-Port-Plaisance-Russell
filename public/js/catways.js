async function loadCatways() {
  const res = await fetch("/catways");
  const catways = await res.json();

  const container = document.getElementById("catways");
  container.innerHTML = "";

  catways.forEach(c => {
    container.innerHTML += `
      <div>
        <h3>Catway n°${c.numero}</h3>
        <p>Longueur : ${c.longueur} m</p>
        <p>Largeur : ${c.largeur} m</p>
        <a href="reservations.html?catway=${c._id}">Voir les réservations</a>
      </div>
      <hr>
    `;
  });
}

loadCatways();
