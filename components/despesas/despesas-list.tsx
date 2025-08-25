"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DespesaCard } from "./despesa-card"
import { Search, Filter } from "lucide-react"
import type { Despesa, Funcionario } from "@/lib/types"

interface DespesasListProps {
  despesas: Despesa[]
  funcionarios?: Funcionario[]
}

const categorias = [
  "Todas",
"Salário",
"Diárias de Serviço",
"Reforma de Cerca", 
"Construção de Cerca", 
"Roço de Juquira",
"Mexida com Gado",
"Limpeza de Açude",
"Aplicação de Herbicida", 
"Limpeza de Curral",
"Serviço Gerais",
"Reforma de Curral",
"Pintura de Curral",
"Aplicação de Herbicida em Pindoba",
"Acero de Pé de Cerca",
"Montagem de Cocheira",
"Aração de Girico",
"Maquinas Pesadas – Açude",
"Maquinas Pesadas – Desmatamento",
"Sementes",
"Sal Mineral",
"Milho",
"Grampo",
"Arame Liso",
"Medicamentos",
"Ferramentas de Trabalho",
"Animal de Serviço",
"Montaria P/ animal de Serviço",
"Casa de Cocho",
"Energia Elétrica",
"Combustível Carro",
"Combustível Moto",
"Combustível Maquinas",
"Diesel – Pindoba",
]

export function DespesasList({ despesas, funcionarios = [] }: DespesasListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas")
  const [periodoFiltro, setPeriodoFiltro] = useState("Todos")
  const [funcionarioFiltro, setFuncionarioFiltro] = useState("Todos")

  const getFuncionarioNome = (funcionarioId?: string) => {
    if (!funcionarioId) return null
    const funcionario = funcionarios.find(f => f.id === funcionarioId)
    return funcionario?.nome || null
  }

  const despesasFiltradas = despesas.filter((despesa) => {
    const matchesSearch =
      despesa.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      despesa.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (despesa.funcionarioId && getFuncionarioNome(despesa.funcionarioId)?.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategoria = categoriaFiltro === "Todas" || despesa.categoria === categoriaFiltro

    const matchesFuncionario = funcionarioFiltro === "Todos" || 
      (funcionarioFiltro === "Sem funcionário" && !despesa.funcionarioId) ||
      despesa.funcionarioId === funcionarioFiltro

    let matchesPeriodo = true
    if (periodoFiltro !== "Todos") {
      const hoje = new Date()
      const despesaDate = new Date(despesa.data)

      switch (periodoFiltro) {
        case "Este mês":
          matchesPeriodo =
            despesaDate.getMonth() === hoje.getMonth() && despesaDate.getFullYear() === hoje.getFullYear()
          break
        case "Últimos 3 meses":
          const tresMesesAtras = new Date()
          tresMesesAtras.setMonth(hoje.getMonth() - 3)
          matchesPeriodo = despesaDate >= tresMesesAtras
          break
        case "Este ano":
          matchesPeriodo = despesaDate.getFullYear() === hoje.getFullYear()
          break
      }
    }

    return matchesSearch && matchesCategoria && matchesPeriodo && matchesFuncionario
  })

  const totalDespesas = despesasFiltradas.reduce((sum, despesa) => sum + despesa.valor, 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const despesasPorCategoria = despesasFiltradas.reduce(
    (acc, despesa) => {
      acc[despesa.categoria] = (acc[despesa.categoria] || 0) + despesa.valor
      return acc
    },
    {} as Record<string, number>
  )

  const categoriaComMaiorGasto = Object.entries(despesasPorCategoria).reduce(
    (max, [categoria, valor]) => (valor > max.valor ? { categoria, valor } : max),
    { categoria: "", valor: 0 }
  )

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-700" />
          <Input
            placeholder="Buscar despesas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
            <SelectTrigger className="w-48 flex items-center border-green-200 focus:border-emerald-500 focus:ring-emerald-500">
              <Filter className="h-4 w-4 mr-2 text-green-700" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((categoria) => (
                <SelectItem key={categoria} value={categoria}>
                  {categoria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {funcionarios.length > 0 && (
            <Select value={funcionarioFiltro} onValueChange={setFuncionarioFiltro}>
              <SelectTrigger className="w-48 border-green-200 focus:border-emerald-500 focus:ring-emerald-500">
                <SelectValue placeholder="Funcionário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos funcionários</SelectItem>
                <SelectItem value="Sem funcionário">Sem funcionário</SelectItem>
                {funcionarios.map((funcionario) => (
                  <SelectItem key={funcionario.id} value={funcionario.id}>
                    {funcionario.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={periodoFiltro} onValueChange={setPeriodoFiltro}>
            <SelectTrigger className="w-40 border-green-200 focus:border-emerald-500 focus:ring-emerald-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Este mês">Este mês</SelectItem>
              <SelectItem value="Últimos 3 meses">Últimos 3 meses</SelectItem>
              <SelectItem value="Este ano">Este ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 shadow-sm">
          <span className="text-sm font-medium text-green-900">{despesasFiltradas.length} despesa(s) encontrada(s)</span>
          <span className="text-lg font-bold text-red-600">Total: {formatCurrency(totalDespesas)}</span>
        </div>

        {categoriaComMaiorGasto.categoria && (
          <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 shadow-sm">
            <span className="text-sm font-medium text-green-900">Maior gasto: {categoriaComMaiorGasto.categoria}</span>
            <span className="text-lg font-bold text-red-600">{formatCurrency(categoriaComMaiorGasto.valor)}</span>
          </div>
        )}
      </div>

      {/* Lista de despesas */}
      {despesasFiltradas.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200">
          <p className="text-green-700 text-lg">
            {searchTerm || categoriaFiltro !== "Todas" || periodoFiltro !== "Todos" || funcionarioFiltro !== "Todos"
              ? "Nenhuma despesa encontrada com os filtros aplicados."
              : "Nenhuma despesa cadastrada ainda."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {despesasFiltradas.map((despesa) => (
            <DespesaCard key={despesa.id} despesa={despesa} funcionarios={funcionarios} />
          ))}
        </div>
      )}
    </div>
  )
}
