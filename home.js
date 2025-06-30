// Verificação de acesso antes de tudo
document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = localStorage.getItem('usuarioLogado');

    if (usuarioLogado !== 'thalysson.oliveira@cambai.com.br') {
        alert('Acesso não autorizado. Redirecionando para o login...');
        window.location.href = 'login.html';
        return;
    }

    // Segue execução normal do sistema após verificação
    const dataAtualEl = document.getElementById('data-atual');
    const horaAtualEl = document.getElementById('hora-atual');
    const btnRegistrarEntrada = document.getElementById('btn-registrar-entrada');
    const btnRegistrarSaida = document.getElementById('btn-registrar-saida');
    const corpoTabela = document.getElementById('corpo-tabela');
    const btnExportarPdf = document.getElementById('btn-exportar-pdf');

    const usuario = usuarioLogado; // Define o usuário com base no login

    function atualizarRelogio() {
        const agora = new Date();
        dataAtualEl.textContent = agora.toLocaleDateString('pt-BR');
        horaAtualEl.textContent = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    setInterval(atualizarRelogio, 1000);
    atualizarRelogio();

    function adicionarLinhaNaTabela({ usuario, data, hora, tipo }) {
        const novaLinha = document.createElement('tr');
        novaLinha.innerHTML = `
            <td>${usuario}</td>
            <td>${data}</td>
            <td>${hora}</td>
            <td>${tipo}</td>
        `;
        corpoTabela.appendChild(novaLinha);
    }

    function verificarBotaoDoDia() {
        const hoje = new Date().toLocaleDateString('pt-BR');
        const registros = JSON.parse(localStorage.getItem('registrosPonto')) || [];

        const temEntrada = registros.some(r => r.usuario === usuario && r.data === hoje && r.tipo === 'Entrada');
        const temSaida = registros.some(r => r.usuario === usuario && r.data === hoje && r.tipo === 'Saída');

        btnRegistrarEntrada.disabled = temEntrada;
        btnRegistrarSaida.disabled = temSaida;
    }

    function registrarPonto(tipo) {
        const agora = new Date();
        const data = agora.toLocaleDateString('pt-BR');
        const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const registros = JSON.parse(localStorage.getItem('registrosPonto')) || [];

        const jaRegistrado = registros.some(reg =>
            reg.usuario === usuario && reg.data === data && reg.tipo === tipo
        );

        if (jaRegistrado) {
            alert(`Você já registrou ${tipo.toLowerCase()} hoje.`);
            return;
        }

        const novoRegistro = { usuario, data, hora, tipo };
        registros.push(novoRegistro);
        localStorage.setItem('registrosPonto', JSON.stringify(registros));

        adicionarLinhaNaTabela(novoRegistro);
        verificarBotaoDoDia();
    }
function exportarParaPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  doc.text("Relatório de Ponto", 10, 10);

  const registros = JSON.parse(localStorage.getItem('registrosPonto')) || [];

  let y = 20;
  registros.forEach(reg => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }

    const texto = `Usuário: ${reg.usuario} | Data: ${reg.data} | Hora: ${reg.hora} | Tipo: ${reg.tipo}`;
    const linhas = doc.splitTextToSize(texto, 180);
    doc.text(linhas, 10, y);
    y += linhas.length * 10;
  });

  doc.save("registro-ponto.pdf");
}


    // Inicializa ao carregar
    const registros = JSON.parse(localStorage.getItem('registrosPonto')) || [];
    registros.forEach(adicionarLinhaNaTabela);
    verificarBotaoDoDia();

    btnRegistrarEntrada.addEventListener('click', () => registrarPonto('Entrada'));
    btnRegistrarSaida.addEventListener('click', () => registrarPonto('Saída'));
    btnExportarPdf.addEventListener('click', exportarParaPDF);
});
