const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const registerBtn = document.getElementById('registerBtn');

registerBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (!username || !password || !confirmPassword) {
        alert('Preencha todos os campos!');
        return;
    }

    if (password !== confirmPassword) {
        alert('as senhas não coincidem!');
        return;
    }

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if(data.success) {
            alert('Conta criada com sucesso!');
            window.location.href ='/login.html';
        }else {
            alert('Erro ao criar conta! Usuário ja existe.');
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor!');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') registerBtn.click();
});