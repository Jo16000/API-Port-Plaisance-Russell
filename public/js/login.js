document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  const res = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (result.token) {
    localStorage.setItem("token", result.token);
    alert("Connexion réussie");
    window.location.href = "catways.html";
  } else {
    alert(result.message || "Erreur de connexion");
  }
});
