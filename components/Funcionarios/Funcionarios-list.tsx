"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { FuncionariosCard } from "./Funcionarios-card"
import { Search, Users } from "lucide-react"
import type { Funcionarios } from "@/lib/types"

interface FuncionariosListProps {
  Funcionarios: Funcionarios[]
}

export function FuncionariosList({ Funcionarios }: FuncionariosListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const FuncionariosFiltrados = Funcionarios.filter(
    (Funcionarios) =>
      Funcionarios.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Funcionarios.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Funcionarios.servico.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      {/* Header da listagem */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-700" />
          <h2 className="text-xl font-bold text-gray-900">Lista de Funcionarios</h2>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar Funcionarios por nome, email ou serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl shadow-sm"
          />
        </div>
      </div>

      {/* Lista ou mensagem de vazio */}
      {FuncionariosFiltrados.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <p className="text-muted-foreground text-lg">
            {searchTerm
              ? "Nenhum Funcionarios encontrado com os critérios de busca."
              : "Nenhum Funcionarios cadastrado ainda."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FuncionariosFiltrados.map((Funcionarios) => (
            <FuncionariosCard key={Funcionarios.id} Funcionarios={Funcionarios} />
          ))}
        </div>
      )}
    </div>
  )
}
