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
const clientNameInput = document.getElementById('clientName');
const discountCard = document.getElementById('discountCard');
const discountValue = document.getElementById('discountValue');

let totalMonthValue = 0; // Stores total - Armazena o total //
let discountShowing = false; // Toggle state - Esdado do toggle //
let chart = null;

// Edit Service - Editar Atendimento //
const editServiceModal = document.getElementById('editServiceModal');
const closeEditServiceModalBtn = document.getElementById('closeEditServiceModalBtn');
const editServiceId = document.getElementById('editServiceId');
const editProcedure = document.getElementById('editProcedure');
const editPrice = document.getElementById('editPrice');
const editType = document.getElementById('editType');
const editDate = document.getElementById('editDate');
const editClientName = document.getElementById('editClientName');
const editNotes = document.getElementById('editNotes');
const saveEditServiceBtn = document.getElementById('saveEditServiceBtn');

// Open edit modal - Abre o modal de edição //

function openEditService(id, procedure_id, price, type, date, client_name, notes) {
    editServiceId.value = id;
    editPrice.value = price;
    editType.value = type;
    editDate.value = date;
    editClientName.value = client_name || '';
    editNotes.value = notes || '';

// Fill procedures select - Preenche o select de procedimento //
    fetch('/api/storage/procedures', { credentials: 'include' })
    .then(r => r.json())
    .then(data => {
        editProcedure.innerHTML = '<option value="">Selecione...</option>';
        data.data.forEach(p => {
            editProcedure.innerHTML +=
                `<option value="${p.id}" ${p.id == procedure_id ? 'selected' : ''}>${p.name}</option>`;
        });
    });
    editServiceModal.classList.add('active');
}

closeEditServiceModalBtn.addEventListener('click', () => {
    editServiceModal.classList.remove('active');
});

saveEditServiceBtn.addEventListener('click', async () => {
    const id = editServiceId.value;
    const procedure_id = editProcedure.value;
    const price = parseFloat(editPrice.value);
    const type = editType.value;
    const date = editDate.value;
    const client_name = editClientName.value.trim();
    const notes = editNotes.value.trim();

    if (!procedure_id || !price || !date) {
        alert('Preecha os campos obrigatórios!');
        return;
    }

    try {
        const response = await fetch(`/api/finances/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ procedure_id, price, type, date, notes, client_name })
        });

        const data = await response.json();
        if (data.success) {
            editServiceModal.classList.remove('active');
            loadServices();
        } else {
            alert('Erro ao salvar alterações!');
        }
    } catch(error) {
        alert('Erro ao conectar com o servidor!');
    }
});

//Discount card click - Clique no card de desconto //
discountCard.addEventListener('click', () => {
    if (!discountShowing) {
        const discounted = totalMonthValue * 0.85;
        discountValue.textContent = formatCurrency(discounted);
        discountShowing = true;
    } else {
        discountValue.textContent = 'Ver';
        discountShowing = false;
    }
});
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
    if (day >= 8 && day <=20) {
        return 1;
    } else {
        return 2;
    }
   // return (day >= 8 && day <= 20) ? 1 : 2; -> Forma curta //
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
            labels: ['Periódo 1 (8-20)', 'Periódo 2 (21-7)'],
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
        totalMonthValue = total;
// Update chart / Atualiza o gráfico //
        updateChart(services);
// Render list / Renderiza a lista //
        servicesList.innerHTML = '';
        services.forEach(s => {
            servicesList.innerHTML += `
                <div class="service-item">
                    <div class="service-info">
                        <span class="service-name">${s.procedure_name}</span>
                        ${s.client_name ? `<span class="service-name">👤${s.client_name}</span>` : ''}
                        ${s.notes ? `<span class="service-date">📝 ${s.notes}</span>` : ''}
                        <span class="service-date">${s.date.split('-').reverse().join('/')}</span>
                        <span class="service-type">${s.type === 'proprio' ? 'Serviço Próprio' : 'Comissão Cunhada'}</span>
                        <button class="btn-edit" onclick="openEditService(${s.id}, ${s.procedure_id}, ${s.price}, '${s.type}', '${s.date}', '${s.client_name || ''}', '${s.notes ||''}')">✏️</button>
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
    const client_name = clientNameInput.value.trim();

    if(!procedure_id || !price || !date) {
        alert('Preencha os campos obrigatórios!');
        return;
    }

    try {
        const response = await fetch('/api/finances', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ procedure_id, price, type, date, notes, client_name }),
            credentials: 'include'
        });

        const data = await response.json();
        if(data.success) {
// Clear form / Limpa o formulário //
        procedureSelect.value ='';
        priceInput.value = '';
        dateInput.value = '';
        notesInput.value = '';
        clientNameInput.value = '';
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