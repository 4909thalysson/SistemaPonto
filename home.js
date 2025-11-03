document.addEventListener('DOMContentLoaded', () => {
    const usuario = localStorage.getItem('usuarioLogado');

    if (usuario !== 'thalysson.oliveira') {
        alert('Acesso não autorizado. Redirecionando para o login...');
        window.location.href = 'login.html';
        return;
    }

    // Elementos da página
    const dataAtualEl = document.getElementById('data-atual');
    const horaAtualEl = document.getElementById('hora-atual');
    const btnRegistrarEntrada = document.getElementById('btn-registrar-entrada');
    const btnRegistrarSaida = document.getElementById('btn-registrar-saida');
    const horaEntradaEl = document.getElementById('hora-entrada');
    const horaSaidaEl = document.getElementById('hora-saida');

    // Atualiza relógio em tempo real
    function atualizarRelogio() {
        const agora = new Date();
        dataAtualEl.textContent = agora.toLocaleDateString('pt-BR');
        horaAtualEl.textContent = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
    setInterval(atualizarRelogio, 1000);
    atualizarRelogio();

    // Atualiza painel do dia
    function atualizarRegistrosDoDia() {
        const registros = JSON.parse(localStorage.getItem('registrosPonto')) || [];
        const hoje = new Date().toLocaleDateString('pt-BR');

        const registroDoDia = registros.find(r => r.usuario === usuario && r.data === hoje);

        horaEntradaEl.textContent = registroDoDia?.horaEntrada || '--:--';
        horaSaidaEl.textContent = registroDoDia?.horaSaida || '--:--';
    }

    // Função para registrar ponto (entrada ou saída)
    function registrarPonto(tipo) {
        const agora = new Date();
        const data = agora.toLocaleDateString('pt-BR');
        const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const registros = JSON.parse(localStorage.getItem('registrosPonto')) || [];

        // Busca registro do dia
        let registroDoDia = registros.find(r => r.usuario === usuario && r.data === data);

        if (!registroDoDia) {
            registroDoDia = { usuario, data, horaEntrada: '', horaSaida: '' };
            registros.push(registroDoDia);
        }

        // Verifica se já registrou
        if (tipo === 'Entrada') {
            if (registroDoDia.horaEntrada) {
                alert('Você já registrou a entrada hoje.');
                return;
            }
            registroDoDia.horaEntrada = hora;
        } else if (tipo === 'Saída') {
            if (registroDoDia.horaSaida) {
                alert('Você já registrou a saída hoje.');
                return;
            }
            registroDoDia.horaSaida = hora;
        }

        localStorage.setItem('registrosPonto', JSON.stringify(registros));

        atualizarRegistrosDoDia();
        verificarBotaoDoDia();
    }

    // Desabilita botões se já registrou
    function verificarBotaoDoDia() {
        const registros = JSON.parse(localStorage.getItem('registrosPonto')) || [];
        const hoje = new Date().toLocaleDateString('pt-BR');
        const registroDoDia = registros.find(r => r.usuario === usuario && r.data === hoje);

        btnRegistrarEntrada.disabled = !!registroDoDia?.horaEntrada;
        btnRegistrarSaida.disabled = !!registroDoDia?.horaSaida;
    }

    // Liga eventos
    btnRegistrarEntrada.addEventListener('click', () => registrarPonto('Entrada'));
    btnRegistrarSaida.addEventListener('click', () => registrarPonto('Saída'));

    // Inicializa tela
    atualizarRegistrosDoDia();
    verificarBotaoDoDia();
});
