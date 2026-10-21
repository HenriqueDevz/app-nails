import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { getServices, getProcedures, createService, deleteService, updateService } from '../services/api'

// Types / Tipos //

interface Service {
    id: number
    procedure_id: number
    procedure_name: string
    price: number
    type: string
    date: string
    client_name: string
    notes: string
}

interface Procedure {
    id: number
    name: string
}

// Format currency / Formata moeda //

function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

function getPeriod(dateStr: string): number {
    const day = parseInt(dateStr.split('-')[2])
    if (day >= 8 && day <= 20) return 1
    return 2
}

function Finances () {
    const [services, setServices] = useState<Service[]>([])
    const [procedures, setProcedures] = useState<Procedure[]>([])
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
    const [selectedYear, setSelectedYear] = useState (new Date().getFullYear())

    //Form state / Estado do Formulário //

    const [ procedureId, setProcedureId] = useState('')
    const [price, setPrice] = useState ('')
    const [type, setType] = useState ('proprio')
    const [date, setDate] = useState('')
    const [clientName, setClientName] = useState('')
    const [notes, setNotes] = useState('')

    // Edit service state - Estado de edição //
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingService, setEditingService] = useState<Service | null>(null)
    const [editProcedureId,setEditProcedureId] = useState('')
    const [editPrice, setEditPrice] = useState ('')
    const [editType, setEditType] = useState ('proprio')
    const [editDate, setEditDate] = useState ('')
    const [editClientName, setEditClientName] = useState ('')
    const [editNotes, setEditNotes] = useState ('')

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        const [servicesData, proceduresData] = await Promise.all([
            getServices(),
            getProcedures(),
        ])
        if(servicesData.success) setServices(servicesData.data)
        if(proceduresData.success) setProcedures(proceduresData.data)
    }

    // Filter by selected month - Filtra pelo mês selecionado //

    const monthServices = services.filter(s => {
        const [y, m] = s.date.split('-')
        return parseInt(m) - 1 === selectedMonth && parseInt(y) === selectedYear
    })

    // Calculate totals - Calcula os totais //

    const total = monthServices.reduce((sum, s) => sum + s.price, 0)
    const currentPeriod = getPeriod(new Date().toISOString())
    const periodTotal = monthServices
        .filter(s => getPeriod(s.date) === currentPeriod)
        .reduce((sum, s) => sum + s.price, 0)
    const avg = monthServices.length > 0 ? total / monthServices.length : 0

    // Period chart data - Dados do Gráfico por período //

    const period1Total = monthServices.filter(s => getPeriod(s.date) === 1).reduce((sum, s) => sum + s.price, 0)
    const period2Total = monthServices.filter(s => getPeriod(s.date) === 2).reduce((sum, s) => sum + s.price, 0)
    const maxPeriod = Math.max(period1Total, period2Total, 1)

    async function handleCreateService() {
        if (!procedureId || !price || !date) {
            alert('Preencha os campos obrigatórios!')
            return
        }

        const data = await createService({
            procedure_id: parseInt(procedureId),
            price: parseFloat(price),
            type,
            date,
            client_name: clientName,
            notes
        })

        if(data.success) {
            setProcedureId('')
            setPrice('')
            setDate('')
            setClientName('')
            setNotes('')
            loadData()
        }
    }

    async function handleDeleteService(id: number) {
        if (!confirm('Deseja apagar este atendimento?')) return
        const data = await deleteService(id)
        if(data.success) loadData()
    }

    function prevMonth() {
        if (selectedMonth === 0) {
            setSelectedMonth(11)
            setSelectedYear(y => y -1)
        } else {
            setSelectedMonth(m => m -1)
        }
    }

    function nextMonth () {
        if(selectedMonth === 11) {
            setSelectedMonth(0)
            setSelectedYear(y => y +1)
        } else {
            setSelectedMonth(m => m +1)
        }
    }

    function handleEditService(s: Service) {
        setEditingService(s)
        setEditProcedureId(String(s.procedure_id))
        setEditPrice(String(s.price))
        setEditType(s.type)
        setEditDate(s.date)
        setEditClientName(s.client_name || '')
        setEditNotes(s.notes || '')
        setShowEditModal(true)
    }

    async function handleSaveEdit () {
        if (!editingService || !editProcedureId || !editPrice || !editDate) {
            alert('Preencha os campos obrigatórios!')
            return
        }

        const data = await updateService(editingService.id, {
            procedure_id: parseInt(editProcedureId),
            price: parseFloat(editPrice),
            type: editType,
            date: editDate,
            client_name: editClientName,
            notes: editNotes
        })

        if (data.success) {
            setShowEditModal(false)
            setEditingService(null)
            loadData()
        }
    }

    return (
        <div className='min-h-screen bg-white dark:bg-gray-950'>
            <Header activePage='finances' />

            <main className="max-w-lg mx-auto px-4 py-5 flex flex-col gap-6">

                {/* Summary cards / Cards de resumo */}
                <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-pink-100 dark:bg-gray-800 rounded-2xl p-3.5 flex flex-col items-center gap-1.5 text-center">
                        <span className="text-xs font-medium text-pink-800 dark:text-pink-300">Total do Mês</span>
                        <span className="text-base font-medium text-pink-500 dark:text-pink-400">{formatCurrency(total)}</span>
                    </div>
                    <div className="bg-pink-100 dark:bg-gray-800 rounded-2xl p-3.5 flex flex-col items-center gap-1.5 text-center">
                        <span className="text-xs font-medium text-pink-800 dark:text-pink-300">Período Atual</span>
                        <span className="text-base font-medium text-pink-500 dark:text-pink-400">{formatCurrency(periodTotal)}</span>
                    </div>
                    <div className="bg-pink-100 dark:bg-gray-800 rounded-2xl p-3.5 flex flex-col items-center gap-1.5 text-center col-span-2">
                        <span className="text-xs font-medium text-pink-800 dark:text-pink-300">Média por Atendimento</span>
                        <span className="text-base font-medium text-pink-500 dark:text-pink-400">{formatCurrency(avg)}</span>
                    </div>
                </div>

                {/* Month selector - Seletor de mês */}
                <div className="flex items-center justify-center gap-4">
                    <button onClick={prevMonth} className="w-8 h-8 rounded-full bg-pink-100 dark:bg-gray-800 text-pink-800 hover:bg-pink-200 transition-colors">←</button>
                    <span className="text-sm font-medium text-pink-800 dark:text-pink-300 min-w-36 text-center">
                        {monthNames[selectedMonth]} {selectedYear}
                    </span>
                    <button onClick={nextMonth} className="w-8 h-8 rounded-full bg-pink-100 text-pink-800 hover:bg-pink-200 transition-colors">→</button>
                </div>

                {/* Chart placeholder - Placeholder do Gráfico */}
                <div className="border border-pink-200 dark:border-gray-700 rounded-2xl p-4">
                    <h2 className="text-sm font-medium text-pink-800 dark:text-pink-300 mb-3">Comparativo do Período</h2>
                    <div className="h-32 flex items-end justify-around gap-4 px-4 relative">
                        <div className="flex flex-col items-center gap-1.5 flex-1 h-full justify-end">
                            <span className="text-xs text-pink-600">{formatCurrency(period1Total)}</span>
                            <div className="w-full bg-pink-200 rounded-t-lg transition-all min-h-[4px]" style={{height: `${(period1Total / maxPeriod) * 100}%`}}/>
                            <span className="text-xs text-pink-600">Período 1</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 flex-1 h-full justify-end">
                            <span className="text-xs text-pink-600">{formatCurrency(period2Total)}</span>
                            <div className="w-full bg-pink-500 rounded-t-lg transition-all min-h-[4px]" style={{height: `${(period2Total / maxPeriod) * 100}%`}}/>
                            <span className="text-xs text-pink-600">Período 2</span>
                        </div>
                    </div>
                </div>

                {/* New service form - Formulário novo Atendimento */}

                <div>
                    <h2 className="text-sm font-medium text-pink-800 dark:text-pink-300 mb-3">Novo Atendimento</h2>
                    <div className="bg-white dark:bg-gray-900 border border-pink-200 dark:border-gray-700 rounded-2xl p-5 flex flex-col gap-3.5">
                        
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Procedimento</label>
                            <select value={procedureId} onChange={e => setProcedureId(e.target.value)}
                            className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3.5 py-3 text-sm text-pink-800 dark:text-gray-100 outline-none">
                            <option value="">Selecione...</option>
                            {procedures.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Valor  (R$)</label>
                            <input type="number" step="0.01" placeholder="0,00" value={price}
                                onChange={e => setPrice(e.target.value)}
                                className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3.5 py-3 text-sm text-pink-800 dark:text-gray-100 outline-none"/>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Tipo</label>
                            <select value={type} onChange={e => setType(e.target.value)}
                                className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3.5 py-3 text-sm text-pink-800 dark:text-gray-100 outline-none">
                                <option value="proprio">Serviço Próprio</option> 
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Data</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)}
                            className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3.5 py-3 text-sm text-pink-800 dark:text-gray-100 outline-none"/>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Nome do Cliente</label>
                            <input type="text" placeholder="Ex: Maria Silva" value={clientName}
                                onChange={e => setClientName(e.target.value)} autoComplete="off"
                                className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3.5 py-3 text-sm text-pink-800 dark:text-gray-100 outline-none"/>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Observações</label>
                            <input type="text" placeholder="Ex: Cliente Especial" value={notes}
                                onChange={e => setNotes(e.target.value)}
                                className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3.5 py-3 text-sm text-pink-800 dark:text-gray-100 outline-none"/>    
                        </div>

                        <button onClick={handleCreateService}
                        className="bg-pink-500 text-white rounded-2xl py-3 text-sm font-medium hover:bg-pink-700 transition-colors">
                            Registrar Atendimento
                        </button>
                    </div>
                </div>

                {/* Services List - Lista de Atendimentos*/}

                <div>
                    <h2 className="text-sm font-medium text-pink-800 dark:text-pink-300 mb-3">Atendimentos</h2>
                    <div className="flex flex-col gap-2.5">
                        {monthServices.length === 0 ? (
                            <p className="text-sm text-pink-400 text-center py-4">Nemhum atendimento neste Mês</p>
                        ) : (
                            monthServices.map(s => (
                                <div key={s.id} className="bg-pink-100 dark:bg-gray-800 rounded-2xl px-4 py-3.4 flex justify-between items-center">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-medium text-pink-800 dark:text-pink-300">{s.procedure_name}</span>
                                    {s.client_name && <span className="text-xs text-pink-600 dark:text-pink-400">👤{s.client_name}</span>}
                                    {s.notes && <span className="text-xs text-pink-600 dark:text-pink-400">📝{s.notes}</span>}
                                    <span className="text-xs text-pink-500 dark:text-pink-400">{s.date.split('-').reverse().join('/')}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-base font-medium text-pink-500">{formatCurrency(s.price)}</span>
                                    <button onClick={() => handleEditService(s)}
                                        className="text-pink-300 hover:text-pink-500 transition-colors">✏️</button>
                                    <button onClick={() => handleDeleteService(s.id)}
                                        className="text-pink-300 hover:text-pink-500 transition-colors text-lg">X</button>
                                </div>
                            </div>
                            ))
                        )}
                    </div>
                </div>

            </main>
            {showEditModal && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-6">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-base font-medium text-pink-800 dark:text-pink-300">Editar Atendimento</h2>
                <button onClick={() => setShowEditModal(false)} className="text-pink-400 text-lg">✕</button>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Procedimento</label>
                <select value={editProcedureId} onChange={e => setEditProcedureId(e.target.value)}
                    className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3.5 py-3 text-sm text-pink-800 dark:text-gray-100 outline-none">
                    <option value="">Selecione...</option>
                    {procedures.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Valor (R$)</label>
                <input type="number" step="0.01" value={editPrice}
                    onChange={e => setEditPrice(e.target.value)}
                    className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3.5 py-3 text-sm text-pink-800 dark:text-gray-100 outline-none"/>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Tipo</label>
                <select value={editType} onChange={e => setEditType(e.target.value)}
                    className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3.5 py-3 text-sm text-pink-800 dark:text-gray-100 outline-none">
                    <option value="proprio">Serviço Próprio</option>
                    <option value="comissao">Comissão</option>
                </select>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Data</label>
                <input type="date" value={editDate}
                    onChange={e => setEditDate(e.target.value)}
                    className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3.5 py-3 text-sm text-pink-800 dark:text-gray-100 outline-none"/>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Nome do Cliente</label>
                <input type="text" value={editClientName}
                    onChange={e => setEditClientName(e.target.value)}
                    autoComplete="off"
                    className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3.5 py-3 text-sm text-pink-800 dark:text-gray-100 outline-none"/>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-pink-600 dark:text-pink-400">Observações</label>
                <input type="text" value={editNotes}
                    onChange={e => setEditNotes(e.target.value)}
                    className="bg-pink-100 dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-xl px-3.5 py-3 text-sm text-pink-800 dark:text-gray-100 outline-none"/>
            </div>

            <button onClick={handleSaveEdit}
                className="bg-pink-500 text-white rounded-2xl py-3 text-sm font-medium hover:bg-pink-700 transition-colors">
                Salvar Alterações
            </button>
        </div>
    </div>
)}
        </div>
    )
}

export default Finances