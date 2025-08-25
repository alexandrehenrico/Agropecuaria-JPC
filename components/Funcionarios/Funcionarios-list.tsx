"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { FuncionarioCard } from "./Funcionarios-card"
import { Search, Users } from "lucide-react"
import type { Funcionario } from "@/lib/types"

interface FuncionariosListProps {
  funcionarios: Funcionario[]
}

export function FuncionariosList({ funcionarios }: FuncionariosListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const funcionariosFiltrados = funcionarios.filter(
    (funcionario) =>
      funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.contato.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.atividade.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      {/* Header da listagem */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-green-700" />
          <h2 className="text-xl font-bold text-green-900">Lista de Funcionários</h2>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600" />
          <Input
            placeholder="Buscar funcionários por nome, contato ou atividade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl shadow-sm border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Lista ou mensagem de vazio */}
      {funcionariosFiltrados.length === 0 ? (
        <div className="text-center py-16 bg-green-50 rounded-xl border border-green-100">
          <p className="text-green-600 text-lg">
            {searchTerm
              ? "Nenhum funcionário encontrado com os critérios de busca."
              : "Nenhum funcionário cadastrado ainda."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {funcionariosFiltrados.map((funcionario) => (
            <FuncionarioCard key={funcionario.id} funcionario={funcionario} />
          ))}
        </div>
      )}
    </div>
  )
}
