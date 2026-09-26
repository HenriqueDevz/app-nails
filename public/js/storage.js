const productNameInput = document.getElementById('productName');
const productQtyInput = document.getElementById('productQty');
const productMinInput = document.getElementById('productMin');
const productUnitSelect = document.getElementById('productUnit');
const saveProductBtn = document.getElementById('saveProductBtn');
const productsList = document.getElementById('productsList');
const productCapacityInput = document.getElementById('productCapacity');

const procedureNameInput = document.getElementById('procedureName');
const saveProcedureBtn = document.getElementById('saveProcedureBtn');
const proceduresList = document.getElementById('proceduresList');

const recipeProcedure = document.getElementById('recipeProcedure');
const recipeProduct = document.getElementById('recipeProduct');
const saveRecipeBtn = document.getElementById('saveRecipeBtn');
const recipesList = document.getElementById('recipesList');

const logoutBtn = document.getElementById('logoutBtn');

// Tabs - Abas //
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        // Remove active de todos os botões e conteúdos / Remove active from all buttons or content //
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Ativa o botão clicado e a aba correspondente / Active clicked button and matching tab //
        btn.classList.add('active');
    document.getElementById(`tab-${target}`).classList.add('active');
    });
});

// Edit Product - Editar Produto //
const editProductModal = document.getElementById('editProductModal');
const closeEditProductModalBtn = document.getElementById('closeEditProductModalBtn');
const editProductNameModal = document.getElementById('editProductNameModal');
const editProductQtyModal = document.getElementById('editProductQtyModal');
const editProductMinModal = document.getElementById('editProductMinModal');
const editProductCapacityModal = document.getElementById('editProductCapacityModal');
const editProductUnitModal = document.getElementById('editProductUnitModal');
const saveEditProductBtn = document.getElementById('saveEditProductBtn');
const editProductId = document.getElementById('editProductId');

function openEditProduct (id, name , quantity, min_quantity, unit, capacity) {
   editProductId.value = id;
   editProductNameModal.value = name;
   editProductQtyModal.value = quantity;
   editProductMinModal.value = min_quantity;
   editProductUnitModal.value = unit;
   editProductCapacityModal.value = capacity || '';
   editProductModal.classList.add('active');
}
closeEditProductModalBtn.addEventListener('click', () => {
    editProductModal.classList.remove('active');
});

saveEditProductBtn.addEventListener('click', async () => {
    const id = editProductId.value;
    const name = editProductNameModal.value.trim();
    const quantity = parseInt(editProductQtyModal.value);
    const min_quantity = parseInt(editProductMinModal.value);
    const unit = editProductUnitModal.value;
    const capacity = editProductCapacityModal.value.trim();

    if (!name || isNaN(quantity) || isNaN(min_quantity)) {
        alert('Preencha todos os campos!');
        return;
    }
    try {
        const response = await fetch(`/api/storage/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name, quantity, min_quantity, unit, capacity })
        });

        const data = await response.json();
        if(data.success) {
            editProductModal.classList.remove('active');
            loadProducts();
        } else {
            alert('Erro ao salvar produto!');
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor!');
    }
});

// Modal: Product // Produto //
const productModal = document.getElementById('productModal');
const openProductModalBtn = document.getElementById('openProductModalBtn');
const closeProductModalBtn = document.getElementById('closeProductModalBtn');

openProductModalBtn.addEventListener('click', () => {
    productModal.classList.add('active');
});

closeProductModalBtn.addEventListener('click', () => {
    productModal.classList.remove('active');
});

// Modal: Procedure / Procedimento //
const procedureModal = document.getElementById('procedureModal');
const openProcedureModalBtn = document.getElementById('openProcedureModalBtn');
const closeProcedureModalBtn = document.getElementById('closeProcedureModalBtn');

openProcedureModalBtn.addEventListener('click', () => {
    procedureModal.classList.add('active');
});

closeProcedureModalBtn.addEventListener('click', () => {
    procedureModal.classList.remove('active');
});

// Load Products - Carrega Produtos //
async function loadProducts() {
    try {
        const response = await fetch('/api/storage/products', {
            credentials: 'include'
        });
        const data = await response.json();

        if(!data.success) return;

// Fill Recipe Select = Preenche o Select das Receitas //
        recipeProduct.innerHTML = '<option value="">Selecione...</option>';
        data.data.forEach (p => {
            recipeProduct.innerHTML +=
                `<option value="${p.id}">${p.name}</option>`;
        });

// Render List = Renderiza a lista //
        productsList.innerHTML = '';
        data.data.forEach(p => {
            const low = p.quantity <= p.min_quantity;
            productsList.innerHTML += `
                <div class="service-item ${low ? 'stock-low' : ''}">
                    <div class="service-info">
                        <span class="service-name">${p.name}</span>
                        <span class="service-date">${p.quantity} ${p.unit}${p.capacity ? ' - ' + p.capacity : ''}</span>
                         ${low ? '<span class="stock-alert">Estoque Baixo!</span>' : '' }
                        </div>
                        <button class="btn-delete" onclick="deleteProduct(${p.id})">X</button>
                        <button class="btn-edit" onclick="openEditProduct(${p.id}, '${p.name}', ${p.quantity}, ${p.min_quantity}, '${p.unit}', '${p.capacity || ''}')">✏️</button>
                    </div>
                `;
        });
    }catch (error) {
        console.error('Error loading products:', error);
    }
}

// Save Product - Salva Produto //
saveProductBtn.addEventListener('click', async () => {
    const name = productNameInput.value.trim();
    const quantity = parseInt(productQtyInput.value);
    const min_quantity = parseInt(productMinInput.value);
    const unit = productUnitSelect.value;
    const capacity = productCapacityInput.value.trim();

    if (!name || isNaN(quantity) || isNaN(min_quantity)) {
        alert('Preencha todos os campos!');
        return;
    }

    try {
        const response = await fetch('/api/storage/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name, quantity, min_quantity, unit, capacity })
        });

        const data = await response.json();
        if (data.success) {
            productNameInput.value = '';
            productQtyInput.value = '';
            productMinInput.value = '';
            productCapacityInput.value = '';
            loadProducts();
            productModal.classList.remove('active');
        } else {
            alert('Erro ao adicionar produto!');
        }
    } catch (error) {
        alert('Erro ao conectar com o  servidor!');
    }
});

// Delete Product - Apaga Produto //
async function deleteProduct(id) {
    if (!confirm('Deseja apagar este produto?')) return;

    try {
        const response = await fetch(`/api/storage/products/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const data = await response.json();
        if (data.success) loadProducts();
    } catch (error) {
        alert('Erro ao apagar produto!');
    }
}

// Load Procedures -- Carrega os Procedimentos //
async function loadProcedures() {
    try {
        const response = await fetch('/api/storage/procedures', {
            credentials: 'include'
        });
        const data = await response.json();

        if(!data.success) return;
// Fill Recipe Select -- Preenche o Select de Receitas //
        recipeProcedure.innerHTML = '<option value="">Selecione...</option>';
        data.data.forEach(p => {
            recipeProcedure.innerHTML +=
                `<option value="${p.id}">${p.name}</option>`;
        });

// Render List -- Renderiza a lista //
        proceduresList.innerHTML = '';
        data.data.forEach(p => {
            proceduresList.innerHTML += `
                <div class="service-item">
                    <div class="service-info">
                        <span class="service-name">${p.name}</span>
                    </div>
                    <button class="btn-delete" onclick="deleteProcedure(${p.id})">✕</button>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading procedures:', error);
    }
}

// Save Procedure -- Salva Procedimento //
saveProcedureBtn.addEventListener('click', async () => {
    const name = procedureNameInput.value.trim();

    if (!name) {
        alert('Digite o nome do procedimento!');
        return;
    }
    
    try {
        const response = await fetch('/api/storage/procedures', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name })
        });

        const data = await response.json();
        if(data.success) {
            procedureNameInput.value = '';
            loadProcedures();
            procedureModal.classList.remove('active');
        } else {
            alert('Erro ao adicionar procedimento!');
        }
    } catch(error) {
        alert('Erro ao conctar com o  servidor');
    }
});

// Delete Procedure - Apaga Procedimento //
async function deleteProcedure(id) {
    if (!confirm('Deseja apagar este procedimento?')) return;

    try {
        const response = await fetch(`/api/storage/procedures/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const data = await response.json();
        if (data.success) loadProcedures();
    } catch(error) {
        alert('Erro ao apagar procedimento!');
    }
}

// Load Recipes - Carrega Receitas //
async function loadRecipes () {
    const procedure_id = recipeProcedure.value;
    if (!procedure_id) {
        recipesList.innerHTML = '';
        return;
    }

    try {
        const response = await fetch(`/api/storage/procedure-products/${procedure_id}`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (!data.success) return;

        recipesList.innerHTML = '';
        data.data.forEach(r => {
            recipesList.innerHTML += `
                <div class="service-item">
                    <div class="service-info">
                        <span class="service-name">${r.name}</span>
                        <span class="service-date">${r.quantity} ${r.unit}</span>
                    </div>
                    <button class="btn-delete" onclick="deleteRecipe(${r.id})">X</button>
                </div>
            `;
        });
    } catch (error) {
        console.error('Erro loading recipes:', error);
    }
}

// Save Recipe -- Salva Receita //
saveRecipeBtn.addEventListener('click', async () => {
    const procedure_id = recipeProcedure.value;
    const product_id = recipeProduct.value;

    if (!procedure_id || !product_id) {
        alert('Selecione o procedimento e o produto!');
        return;
    }

    try {
        const response = await fetch('/api/storage/procedure-products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({ procedure_id, product_id })
        });

        const data = await response.json ();
        if (data.success) loadRecipes();
        else alert('Erro ao adicionar á receita!');
    } catch (error) {
        alert('Erro ao conectar com o servidor!');
    }
});

// Delete Recipe -- Apaga Receita //
async function deleteRecipe(id) {
    if (!confirm('Deseja remover este produto da receita?')) return;

    try {
        const response = await fetch(`/api/storage/procedure-products/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const data = await response.json();
        if (data.success) loadRecipes();
    } catch (error) {
        alert('Erro ao remover da receita!');
    }
}

//Recipe Change -- Muda o Procedimento //
recipeProcedure.addEventListener('change', loadRecipes);

// Logout //
logoutBtn.addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login.html';
});

// Init - Inicializa //

loadProducts();
loadProcedures();