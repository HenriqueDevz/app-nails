import { useState, useEffect } from "react"
import Header from "../components/Header"
import { getProducts, createProduct, deleteProduct, getProcedures, createProcedure, deleteProcedure, getRecipe, addToRecipe, removeFromRecipe, updateProduct } from '../services/api'

// Types - Tipos //
interface Product {
    id: number
    name: string
    quantity: number
    min_quantity: number
    unit: string
    capacity: string
}

interface Procedure {
    id: number
    name: string
}

function Storage() {
    const [activeTab, setActiveTab] = useState<'products' | 'procedures' | 'recipes'>('products')
    const [products, setProducts] = useState<Product[]>([])
    const [procedures, setProcedures] = useState<Procedure[]>([])
    const [showProductModal, setShowProductModal] = useState(false)
    const [showProcedureModal, setShowProcedureModal] = useState(false)

    // Product form - Formulário de produto //
    const [productName, setProductName] = useState('')
    const [productQty, setProductQty] = useState('')
    const [productMin, setProductMin] = useState('')
    const [productUnit, setProductUnit] = useState('unidade')
    const [productCapacity, setProductCapacity] = useState('')

    //Procedure form - Formulário de procedimento //
    const [procedureName, setProcedureName] = useState('')

    // Edit product state - Estado de edição de produto //
    const [showEditProductModal, setShowEditProductModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [editProductName, setEditProductName] = useState('')
    const [editProductQty, setEditProductQty] = useState('')
    const [editProductMin, setEditProductMin] = useState('')
    const [editProductUnit, setEditProductUnit] = useState('unidade')
    const [editProductCapacity, setEditProductCapacity] = useState(''   )
    
    //Recipe state - Estado da receita //
    const [selectedProcedure, setSelectedProcedure] = useState('')
    const [selectedProduct, setSelectedProduct] = useState('')
    const [recipe, setRecipe] = useState<{id: number, name: string, quantity: number, unit: string}[]>([])

    useEffect(() => {
        loadData()
    },[])

async function loadData() {
    const [productsData, proceduresData] = await Promise.all([
        getProducts(),
        getProcedures()
    ])
    if (productsData.success) setProducts(productsData.data)
    if (proceduresData.success) setProcedures(proceduresData.data)
}

async function handleCreateProduct() {
    if (!productName || !productQty || !productMin) {
        alert('Preencha todos os campos!')
        return
    }
    const data = await createProduct({
        name: productName,
        quantity: parseInt(productQty),
        min_quantity: parseInt(productMin),
        unit: productUnit,
        capacity: productCapacity
    })
    if (data.success) {
        setProductName('')
        setProductQty('')
        setProductMin('')
        setProductCapacity('')
        setShowProductModal(false)
        loadData()
    }
}

async function handleDeleteProduct (id: number) {
  const confirmed = window.confirm('Deseja apagar este produto?')
  if(!confirmed) return
  const data = await deleteProduct(id)
  if(data.success) loadData()
}

async function handleCreateProcedure() {
    if (!procedureName) {
        alert('Digite o nome do procedimento!')
        return
    }
    const data = await createProcedure(procedureName)
    if (data.success) {
        setProcedureName('')
        setShowProcedureModal(false)
        loadData()
    }
}

async function handleDeleteProcedure(id: number) {
    if (!confirm('Deseja apagar este procedimento?')) return
    const data = await deleteProcedure(id)
    if (data.success) loadData()
}

async function loadRecipe(procedure_id: number) {
    const data = await getRecipe(procedure_id)
    if (data.success) setRecipe(data.data)
}

async function handleSelectProcedure(id: string) {
    setSelectedProcedure(id)
    setRecipe([])
    if (id) loadRecipe(parseInt(id))
}

async function handleAddToRecipe() {
    if (!selectedProcedure || !selectedProduct) {
        alert('Selecione o procedimento e o produto!')
        return
    }
    const data = await addToRecipe(parseInt(selectedProcedure), parseInt(selectedProduct))
    if (data.success) loadRecipe(parseInt(selectedProcedure))
}

async function handleRemoveFromRecipe(id: number) {
    const confirmed = window.confirm('Deseja remover este produto da receita?')
    if (!confirmed) return
    const data = await removeFromRecipe(id)
    if (data.success) loadRecipe(parseInt(selectedProcedure))
}

function handleEditProduct(p: Product) {
    setEditingProduct(p)
    setEditProductName(p.name)
    setEditProductQty(String(p.quantity))
    setEditProductMin(String(p.min_quantity))
    setEditProductUnit(p.unit)
    setEditProductCapacity(p.capacity || '')
    setShowEditProductModal(true)
}

async function handleSaveEditProduct() {
    if (!editingProduct || !editProductName || !editProductQty || !editProductMin) {
        alert('Preencha todos os campos!')
        return
    }
    const data = await updateProduct(editingProduct.id, {
        name: editProductName,
        quantity: parseInt(editProductQty),
        min_quantity: parseInt(editProductMin),
        unit: editProductUnit,
        capacity: editProductCapacity
    })
    if (data.success) {
        setShowEditProductModal(false)
        setEditingProduct(null)
        loadData()
    }
}

return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
        <Header activePage="storage" />

        {/* Tabs - Abas */}
        <div className="flex gap-2 px-4 pt-3 max-w-lg mx-auto">
            {(['products', 'procedures', 'recipes'] as const).map(tab => (
            <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === tab
                        ? 'bg-pink-500 text-white'
                        : 'bg-pink-100 dark:bg-gray-800 text-pink-800 dark:text-pink-300'
                }`}
                >
                    {tab === 'products' ? 'Produtos' : tab === 'procedures' ? 'Procedimentos' : 'Receitas'}
            </button>
            ))}
        </div>
        
        <main className="max-w-lg mx-auto px-4 py-5">

        {/* Products tab - Aba de produtos */}
            {activeTab === 'products' && (
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <h2 className="text-sm font-medium text-pink-800 dark:text-pink-300">Produtos em Estoque</h2>
                        <button onClick={() => setShowProductModal(true)}
                        className="bg-pink-500 text-white text-sm px-4 py-2 rounded-full hover:bg-pink-700 transition-colors">
                            + Novo Produto
                        </button>
                    </div>
                    {products.length === 0 ? (
                        <p className="text-sm text-pink-400 text-center py-4">Nemhum produto cadastrado</p>
                    ) : (
                    products.map(p => (
                        <div key={p.id} className={`bg-pink-100 dark:bg-gray-800 rounded-2xl px-4 py-3.5 flex justify-between items-center ${p.quantity <= p.min_quantity ? 'border border-pink-400' : ''}`}>
                <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-pink-800 dark:text-pink-300">{p.name}</span>
                <span className="text-xs text-pink-600 dark:text-pink-400">
                    {p.quantity} {p.unit}{p.capacity ? ` — ${p.capacity}` : ''}
                </span>
                {p.quantity <= p.min_quantity && (
                    <span className="text-xs text-pink-500 font-medium">⚠️ Estoque baixo!</span>
                )}
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => handleEditProduct (p)}
                        className="text-pink-300 hover:text-pink-500 transition-colors text-base">✏️</button>
                    <button onClick={() => handleDeleteProduct(p.id)}
                        className="text-pink-300 hover:text-pink-500 transition-colors text-base">X</button>
                </div>
            </div>
            ))
        )}
    </div>
    )}

{/* Procedures tab - Aba de Procedimentos*/}
    {activeTab === 'procedures' && (
        <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <h2 className="text-sm font-medium text-pink-800 dark:text-pink-300">Procedimentos</h2>
                <button onClick={() => setShowProcedureModal(true)}
                    className="bg-pink-500 text-white text-sm px-4 py-2 rounded-full hover:bg-pink-700 transition-colors">
                    + Novo Procedimento
                    </button>
            </div>
            {procedures.length === 0 ? (
                <p className="text-sm text-pink-400 text-center py-4">Nemhum procedimento cadastrado</p>
            ) : (
                procedures.map(p => (
                    <div key={p.id} className="bg-pink-100 dark:bg-gray-800 rounded-2xl px-4 py-3.5 flex justify-between items-center">
                        <span className="text-sm font-medium text-pink-800 dark:text-pink-300">{p.name}</span>
                        <button onClick={() => handleDeleteProcedure(p.id)}
                        className="text-pink-300 hover:text-pink-500 transition-colors text-lg">X</button>
                    </div>
                ))
            )}
        </div>
    )}

{/* Recipes tab - Aba de Receitas */}
    {activeTab === 'recipes' && (
        <div className="flex flex-col gap-3">
            <h2 className="text-sm font-medium text-pink-800 dark:text-pink-300">Montar Receita</h2>

            <div className="bg-white dark:bg-gray-950 border border-pink-200 dark:border-gray-700 rounded-2xl p-5 flex flex-col gap-3.5">

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Procedimento</label>
                    <select value={selectedProcedure} onChange={e => handleSelectProcedure(e.target.value)}
                        className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3.5 py-3 text-sm text-pink-800 dark:text-pink-300 outline-none">
                        <option value="">Selecione...</option>
                        {procedures.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>    
                </div>

                {selectedProcedure && (
                    <>
                        <div className="flex flex-col gap-2">
                            {recipe.length === 0 ? (
                                <p className="text-xs text-pink-400 text-center py-2">Nemhum produto nesta receita</p>
                            ) : (
                                recipe.map(r => (
                                    <div key={r.id} className="bg-pink-100 dark:bg-gray-800 rounded-xl px-3.5 py-2.5 flex justify-between items-center">
                                        <span className="text-sm text-pink-800 dark:text-pink-300">{r.name}</span>
                                        <button onClick={() => handleRemoveFromRecipe(r.id)}
                                            className="text-pink-300 hover:text-pink-500 transition-colors">X</button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Adicionar Produto</label>
                            <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}
                                className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3.5 py-3 text-sm text-pink-800 dark:text-pink-300 outline-none">
                                <option value="">Selecione...</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>    
                        </div>

                        <button onClick={handleAddToRecipe}
                            className="bg-pink-500 text-white rounded-2xl py-3 text-sm font-medium hover:bg-pink-700 transition-colors">
                            Adicionar Receita
                        </button>
                    </>
                )}
            </div>
        </div>
    )}

</main>

{/* Modal: Edit Product - Editar Produto */}
{showEditProductModal && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-6">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-base font-medium text-pink-800 dark:text-pink-300">Editar Produto</h2>
                <button onClick={() => setShowEditProductModal(false)} className="text-pink-400 text-lg">✕</button>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Nome</label>
                <input type="text" value={editProductName}
                    onChange={e => setEditProductName(e.target.value)}
                    className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3.5 py-3 text-sm text-pink-800 dark:text-pink-300 outline-none"/>
            </div>
            <div className="flex gap-3">
                <div className="flex flex-col gap-1.5 w-24">
                    <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Qtd. Atual</label>
                    <input type="number" value={editProductQty}
                        onChange={e => setEditProductQty(e.target.value)}
                        className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3 py-3 text-sm text-pink-800 dark:text-pink-300 outline-none w-full"/>
                </div>
                <div className="flex flex-col gap-1.5 w-24">
                    <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Qtd. Mínima</label>
                    <input type="number" value={editProductMin}
                        onChange={e => setEditProductMin(e.target.value)}
                        className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3 py-3 text-sm text-pink-800 dark:text-pink-300 outline-none w-full"/>
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Unidade</label>
                <select value={editProductUnit} onChange={e => setEditProductUnit(e.target.value)}
                    className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3.5 py-3 text-sm text-pink-800 dark:text-pink-300 outline-none">
                    <option value="unidade">Unidade</option>
                    <option value="ml">mL</option>
                    <option value="g">g</option>
                    <option value="frasco">Frasco</option>
                    <option value="pacote">Pacote</option>
                </select>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Capacidade</label>
                <input type="text" value={editProductCapacity}
                    onChange={e => setEditProductCapacity(e.target.value)}
                    placeholder="Ex: 15g"
                    className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3.5 py-3 text-sm text-pink-800 dark:text-pink-300 outline-none"/>
            </div>
            <button onClick={handleSaveEditProduct}
                className="bg-pink-500 text-white rounded-2xl py-3 text-sm font-medium hover:bg-pink-700 transition-colors">
                Salvar Alterações
            </button>
        </div>
    </div>
)}

{/* Modal: New Product - Novo Produto */}
    {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center">
                    <h2 className="text-base font-medium text-pink-800 dark:text-pink-300">Novo Produto</h2>
                    <button onClick={() => setShowProductModal(false)} className="text-pink-400 text-lg">X</button>
                </div>
                    <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Nome</label>
                    <input type="text" value={productName} onChange={e => setProductName(e.target.value)}
                      placeholder="Ex: Gel UV"
                      className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3.5 py-3 text-sm text-pink-800 dark:text-pink-300 outline-none"/>
                </div>
                <div className="flex gap-3">
                    <div className="flex flex-col gap-2.5 w-24">
                    <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Qtd. Atual</label>
                    <input type="number" value={productQty} onChange={e => setProductQty(e.target.value)}
                      placeholder="3"
                      className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3 py-3 text-sm text-pink-800 dark:text-pink-300 outline-none w-full"/> 
                </div>
                <div className="flex flex-col gap-1.5 w-25">
                    <label className="text-sm font-medium text-pink-600 dark:text-pink-400">Qtd. Mínima</label>
                    <input type="number" value={productMin} onChange={e => setProductMin(e.target.value)}
                        placeholder="1"
                        className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3 py-3 text-sm text-pink-800 dark:text-pink-300 outline-none w-full"/>
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Unidade</label>
                    <select value={productUnit} onChange={e => setProductUnit(e.target.value)}
                    className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3.5 py-3 text-sm text-pink-800 dark:text-pink-300 outline-none">
                        <option value="unidade">Unidade</option>
                        <option value="ml">mL</option>
                        <option value="g">g</option>
                        <option value="frasco">Frasco</option>
                        <option value="pacote">Pacote</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Capacidade (Ex: 15g)</label>
                    <input type="text" value={productCapacity} onChange={e => setProductCapacity(e.target.value)}
                     placeholder="Ex: 15g"
                    className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3.5 py-3 text-sm text-pink-800 dark:text-pink-300 outline-none"/>
                </div>
                <button onClick={handleCreateProduct}
                className="bg-pink-500 text-white rounded-2xl py-3 text-sm font-medium hover:bg-pink-700 transition-colors">
                Adicionar Produto
                </button>
            </div>
        </div>
    )}

{/* Modal: New Procedure - Novo Procedimento*/}
        {showProcedureModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-6">
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
                    <div className="flex justify-between items-center">
                        <h2 className="text-base font-medium text-pink-800 dark:text-pink-300">Novo Procedimento</h2>
                        <button onClick={() => setShowProcedureModal(false)} className="text-pink-400 text-lg">X</button>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Nome do Procedimento</label>
                        <input type="text" value={procedureName} onChange={e => setProcedureName(e.target.value)}
                            placeholder="Ex: Gel com Molde F1"
                            className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3.5 py-3 text-sm text-pink-800 dark:text-pink-300 outline-none"/>
                    </div>
                    <button onClick={handleCreateProcedure}
                        className="bg-pink-500 text-white rounded-2xl py-3 text-sm font-medium hover:bg-pink-700 transition-colors">
                        Adicionar Procedimento
                    </button>
                </div>
            </div>
        )}
    </div>
    

)}



export default Storage