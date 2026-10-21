// Base URL of the API / URL base da API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Login function / Função de login
export async function loginUser(username: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password })
  })
  return response.json()
}

// Register function / Função de registro
export async function registerUser(username: string, password: string) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password })
  })
  return response.json()
}

// Logout function / Função de logout
export async function logoutUser() {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  })
  return response.json()
}

// Get all services / Busca todos os atendimetos //
export async function getServices() {
  const response = await fetch(`${API_URL}/finances`, {
    credentials: 'include'
  })
  return response.json()
}

// Create service / Cria um atendimento //
export async function createService (data: {
  procedure_id: number
  price: number
  type: string
  date: string
  client_name: string
  notes: string
}) {
  const response = await fetch(`${API_URL}/finances`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  })
  return response.json()
}

// Delete service / Apaga um atendimento //
export async function deleteService (id: number) {
  const response = await fetch(`${API_URL}/finances/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  })
  return response.json()
}

// Get procedures  / Busca os procedimentos //
export async function getProcedures() {
  const response = await fetch(`${API_URL}/storage/procedures`, {
    credentials: 'include'
  })
  return response.json()
}

// Products - Produtos //
export async function getProducts () {
  const response = await fetch(`${API_URL}/storage/products`, {
    credentials: 'include'
  })
  return response.json()
}

export async function createProduct (data: {
  name: string
  quantity: number
  min_quantity: number
  unit: string
  capacity: string
}) {
  const response = await fetch(`${API_URL}/storage/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  })
  return response.json()
}

export async function createProcedure(name: string) {
  const response = await fetch(`${API_URL}/storage/procedures`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name })
  })
  return response.json()
}

export async function deleteProduct (name: number) {
  const response = await fetch(`${API_URL}/storage/procedures`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name })
  })
  return response.json()
}

export async function deleteProcedure (id: number) {
  const response = await fetch(`${API_URL}/storage/procedures/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  })
  return response.json()
}

// Get recipe by procedure - Busca receita por procedimento //
export async function getRecipe (procedure_id: number) {
  const response = await fetch(`${API_URL}/storage/procedure-products/${procedure_id}`, {
    credentials: 'include'
  })
  return response.json()
}

// Add product to recipe - Adiciona produto à receita //
export async function addToRecipe(procedure_id: number, product_id: number) {
  const response = await fetch(`${API_URL}/storage/procedure-products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ procedure_id, product_id })
  })
  return response.json()
}

// Remove from recipe - Remove da receita //
export async function removeFromRecipe(id: number) {
  const response = await fetch(`${API_URL}/storage/procedure-products/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  })
  return response.json()
}

// Update service - Atualiza atendimento //
export async function updateService(id: number, data: {
  procedure_id: number
  price: number
  type: string
  date: string
  client_name: string
  notes: string
}) {
  const response = await fetch(`${API_URL}/finances/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  })
  return response.json()
}

// Update product -- Atualiza Produto //
export async function updateProduct(id: number, data: {
  name: string
  quantity: number
  min_quantity: number
  unit: string
  capacity: string
})
{
  const response = await fetch(`${API_URL}/storage/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  })
  return response.json()
}