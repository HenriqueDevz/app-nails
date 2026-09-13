const  usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const forgotBtn = document.getElementById('forgotBtn');

loginBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        alert('Preencha todos os campos!');
        return;
    }

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();

        if(data.success) {
            window.location.href = '/finances.html';
        } else {
            alert ('Usuário ou senha incorretos!');
        }
    } catch(error) {
        alert('Erro ao conectar com o servidor!');
    }
});

forgotBtn.addEventListener('click', () => {
    alert('Entre em contato com administrador para redefinir sua senha!');
});