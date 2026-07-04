async function loadUsers() {
  const res = await fetch("/users");
  const users = await res.json();

  const container = document.getElementById("users");
  container.innerHTML = "";

  users.forEach(u => {
    container.innerHTML += `
      <p>${u.username} – ${u.email}</p>
      <hr>
    `;
  });
}

loadUsers();
