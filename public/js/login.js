const  usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

registerBtn.addEventListener('click', () =>{
    const username = prompt('Digite o nome de usuário:');
    if(!username) return;
    
    const password = prompt('Digite a senha:');
    if(!password) return;

    fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then (r => r.json())
    .then(data => {
        if(data.success) {
            alert('Conta criada com sucesso!');
        } else {
            alert('Erro ao criar conta!');
        }
    });
});

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

document.addEventListener('keydown', (e) =>{
    if (e.key === 'Enter') {
        loginBtn.click ();
    }
})
