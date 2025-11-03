window.addEventListener('load', () => {
    const usuario = localStorage.getItem('usuarioLogado');
    const corpoTabela = document.getElementById('tabelaRegistros');
    const btnExportarExcel = document.getElementById('btnExportarExcel');

    if (!usuario) {
        alert('Acesso não autorizado.');
        window.location.href = 'login.html';
        return;
    }

    // Função para renderizar os registros na tabela
    function carregarRegistros() {
        const registros = JSON.parse(localStorage.getItem('registrosPonto')) || [];
        corpoTabela.innerHTML = '';

        registros
            .filter(r => r.usuario === usuario)
            .forEach(reg => {
                const linha = document.createElement('tr');
                let status = '';
                if (reg.horaEntrada && reg.horaSaida) status = 'Fechado';
                else if (reg.horaEntrada) status = 'Apenas Entrada';
                else if (reg.horaSaida) status = 'Apenas Saída';

                linha.innerHTML = `
                    <td>${reg.usuario}</td>
                    <td>${reg.data || '--/--/----'}</td>
                    <td>${reg.horaEntrada || '--:--'}</td>
                    <td>${reg.horaSaida || '--:--'}</td>
                    <td>${status}</td>
                `;
                corpoTabela.appendChild(linha);
            });
    }

    // Carrega a tabela ao abrir a página
    carregarRegistros();

    // Exporta os registros para Excel
    btnExportarExcel.addEventListener('click', () => {
        const registros = JSON.parse(localStorage.getItem('registrosPonto')) || [];
        const registrosFormatados = registros
            .filter(r => r.usuario === usuario)
            .map(r => ({
                Usuário: r.usuario,
                Data: r.data || '--/--/----',
                "Hora de entrada": r.horaEntrada || '--:--',
                "Hora de saída": r.horaSaida || '--:--',
                Tipo: r.horaEntrada && r.horaSaida ? 'Fechado' : 'Aberto'
            }));

        const ws = XLSX.utils.json_to_sheet(registrosFormatados);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Registros");
        XLSX.writeFile(wb, "registro-ponto.xlsx");
    });
});
