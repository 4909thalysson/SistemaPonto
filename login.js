document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.login-form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const emailInput = document.getElementById('usuario').value.trim();
    const senhaInput = document.getElementById('senha').value.trim();

    const emailAutorizado = "thalysson.oliveira";
    const senhaAutorizada = "r4N5h#9B";

    if (emailInput === emailAutorizado && senhaInput === senhaAutorizada) {
      localStorage.setItem("usuarioLogado", emailInput);
      window.location.href = "home.html";
    } else {
      alert("Usuário ou senha inválidos.");
    }
  });
});