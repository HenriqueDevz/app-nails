const totalMonth = document.getElementById('totalMonth');
const totalFortnight = document.getElementById('totalFortnight');
const avgService = document.getElementById('avgService');
const procedureSelect = document.getElementById('procedure');
const priceInput = document.getElementById('price');
const typeSelect = document.getElementById('type');
const dateInput = document.getElementById('date');
const notesInput = document.getElementById('notes');
const saveBtn = document.getElementById('saveBtn');
const logoutBtn = document.getElementById('logoutBtn');
const servicesList = document.getElementById('servicesList');

let chart = null;

// --- Load Procedures / Carrega Procedimentos //

async function loadProcedures() {
    try {
        const response = await fetch('/api/storage/procedures', {
            credentials: 'include'
    });
        const data = await response.json();

        if (data.success) {
            procedureSelect.innerHTML = '<option value="">Selecione...</option>';
            data.data.forEach (proc => {
                procedureSelect.innerHTML +=
                    `<option value="${proc.id}">${proc.name}</option>`;
            });
        }
    } catch(error) {
        console.error('Error loading procedures:', error);
    }
}

// Format Currency / Formata moeda //

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Get fortnight / Pega a Quinzeba //

function getFortnight(dateStr) {
    const day = parseInt(dateStr.split ('-')[2]);
    return day <= 15 ? 1 : 2;
}

// Uptade Chart / Atualiza o Grafico // 

function updateChart(services) {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
// Filter by current month / Filtra pelo mês atual //
    const monthServices = services.filter(s => {
        const [y, m] = s.date.split ('-');
        return parseInt(m) - 1 === month && parseInt(y) === year;
    });
// Split by fortnight / Divide por quinzena //
    const first = monthServices.filter(s => getFortnight(s.date) === 1)
                                .reduce((sum, s) => sum + s.price, 0);
    const second = monthServices.filter(s => getFortnight(s.date) === 2)
                                .reduce((sum , s) => sum + s.price, 0);
    if (chart) chart.destroy();

    const ctx = document.getElementById('fortnightChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1ª Quinzena (1-15)', '2ª Quinzena (16-31)'],
            datasets: [{
                label:'Receita (R$)',
                data: [first, second],
                backgroundColor: ['#F4C0D1', '#D4537E'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
                plugins: {legend: { display: false} },
                scales: {
                    y: { beginAtZero: true }
            }
        }
    });
}

// Load Services / Carrega Atendimentos //

async function loadServices() {
    try {
        const response = await fetch('/api/finances', {
            credentials: 'include'
        });
        const data = await response.json();

        if (!data.success) return;

        const services = data.data;
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();
// Filter current month / Filtra mês atual //
        const monthServices = services.filter(s =>  {
            const [y, m] = s.date.split('-');
            return parseInt(m) - 1 === month && parseInt(y) === year;
        });
// Calculate totals / Calcula os totais //
        const total = monthServices.reduce((sum, s) => sum + s.price, 0);
        const fortnight = getFortnight(new Date().toISOString());
        const fTotal = monthServices.filter(s => getFortnight(s.date) === fortnight)
                                    .reduce((sum, s) => sum + s.price, 0);
        const avg = monthServices.length > 0 ? total / monthServices.length : 0;
// Update cards / Atualiza os cards //
        totalMonth.textContent = formatCurrency(total);
        totalFortnight.textContent = formatCurrency(fTotal);
        avgService.textContent = formatCurrency(avg);
// Update chart / Atualiza o gráfico //
        updateChart(services);
// Render list / Renderiza a lista //
        servicesList.innerHTML = '';
        services.forEach(s => {
            servicesList.innerHTML += `
                <div class="service-item">
                    <div class="service-info">
                        <span class="service-name">${s.procedure_name}</span>
                        <span class="service-date">${s.date.split('-').reverse().join('/')}</span>
                        <span class="service-type">${s.type === 'proprio' ? 'Serviço Próprio' : 'Comissão Cunhada'}</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span class="service-price">${formatCurrency(s.price)}</span>
                        <button class="btn-delete" onclick="deleteService(${s.id})">X</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

// Save Service / Salva Atendimento //
saveBtn.addEventListener('click', async () => {
    const procedure_id = procedureSelect.value;
    const price = parseFloat(priceInput.value);
    const type = typeSelect.value;
    const date = dateInput.value;
    const notes = notesInput.value.trim();

    if(!procedure_id || !price || !date) {
        alert('Preencha os campos obrigatórios!');
        return;
    }

    try {
        const response = await fetch('/api/finances', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ procedure_id, price, type, date, notes }),
            credentials: 'include'
        });

        const data = await response.json();
        if(data.success) {
// Clear form / Limpa o formulário //
        procedureSelect.value ='';
        priceInput.value = '';
        dateInput.value = '';
        notesInput.value = '';
        loadServices();
    } else {
        alert('Erro ao registrar atendimento!');
    }
}catch (error) {
    alert('Erro ao conectar com o servidor!');
}
});

// Delete Service / Apaga Atendimento //
async function deleteService(id) {
    if(!confirm('Deseja apagar este atendimento ?')) return;

    try{
        const response = await fetch(`/api/finances/${id}`, {
            method: 'DELETE',
            credentials:'include'
        });

        const data = await response.json();
        if(data.success) loadServices();
    } catch (error) {
        alert('Erro ao apagar atendimento!');
    }
}

// Logout //
logoutBtn.addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login.html';
});

// Init / Inicializa //
loadProcedures();
loadServices();