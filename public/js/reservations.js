const params = new URLSearchParams(window.location.search);
const catwayId = params.get("catway");

async function loadReservations() {
  const token = localStorage.getItem("token");

  const res = await fetch(`/catways/${catwayId}/reservations`, {
    headers: { "Authorization": token }
  });

  const reservations = await res.json();
  const container = document.getElementById("reservations");

  container.innerHTML = "<h3>Réservations existantes :</h3>";

  reservations.forEach(r => {
    container.innerHTML += `
      <p>
        <strong>${r.userEmail}</strong><br>
        Du : ${new Date(r.dateDebut).toLocaleDateString()}<br>
        Au : ${new Date(r.dateFin).toLocaleDateString()}
      </p>
      <hr>
    `;
  });
}

document.getElementById("reservationForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  const data = {
    userEmail: document.getElementById("email").value,
    dateDebut: document.getElementById("dateDebut").value,
    dateFin: document.getElementById("dateFin").value
  };

  const res = await fetch(`/catways/${catwayId}/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  alert(result.message || "Réservation effectuée");

  loadReservations();
});

loadReservations();
