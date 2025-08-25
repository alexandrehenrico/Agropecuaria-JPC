import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ReceitaCard } from "./receita-card"
import { Search, Filter } from "lucide-react"
import type { Receita, Funcionario } from "@/lib/types"

interface ReceitasListProps {
  receitas: Receita[]
  funcionarios?: Funcionario[]
}

const categorias = [
  "Todas",
  "Desenvolvimento Web",
  "Desenvolvimento Mobile",
  "Consultoria",
  "Manutenção",
  "Design",
  "SEO/Marketing",
  "Hospedagem",
  "Outros",
]

export function ReceitasList({ receitas, funcionarios = [] }: ReceitasListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas")
  const [periodoFiltro, setPeriodoFiltro] = useState("Todos")

  const receitasFiltradas = receitas.filter((receita) => {
    const matchesSearch =
      receita.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receita.categoria.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategoria =
      categoriaFiltro === "Todas" || receita.categoria === categoriaFiltro

    let matchesPeriodo = true
    if (periodoFiltro !== "Todos") {
      const hoje = new Date()
      const receitaDate = new Date(receita.data)

      switch (periodoFiltro) {
        case "Este mês":
          matchesPeriodo =
            receitaDate.getMonth() === hoje.getMonth() &&
            receitaDate.getFullYear() === hoje.getFullYear()
          break
        case "Últimos 3 meses":
          const tresMesesAtras = new Date()
          tresMesesAtras.setMonth(hoje.getMonth() - 3)
          matchesPeriodo = receitaDate >= tresMesesAtras
          break
        case "Este ano":
          matchesPeriodo = receitaDate.getFullYear() === hoje.getFullYear()
          break
      }
    }

    return matchesSearch && matchesCategoria && matchesPeriodo
  })

  const totalReceitas = receitasFiltradas.reduce(
    (sum, receita) => sum + receita.valor,
    0
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Barra de busca e filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-700" />
          <Input
            placeholder="Buscar receitas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-2">
          <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
            <SelectTrigger className="w-48 border-green-200 focus:border-emerald-500 focus:ring-emerald-500">
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

      {/* Total de receitas */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-xl shadow-sm">
        <span className="text-sm font-medium text-green-700">
          {receitasFiltradas.length} receita(s) encontrada(s)
        </span>
        <span className="text-lg font-bold text-green-600">
          Total: {formatCurrency(totalReceitas)}
        </span>
      </div>

      {/* Lista de receitas */}
      {receitasFiltradas.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200">
          <p className="text-green-700 text-lg">
            {searchTerm || categoriaFiltro !== "Todas" || periodoFiltro !== "Todos"
              ? "Nenhuma receita encontrada com os filtros aplicados."
              : "Nenhuma receita cadastrada ainda."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {receitasFiltradas.map((receita) => (
            <ReceitaCard key={receita.id} receita={receita} />
          ))}
        </div>
      )}
    </div>
  )
}
