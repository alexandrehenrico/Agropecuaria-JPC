"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { ReceitaForm } from "@/components/receitas/receita-form"
import { ReceitasList } from "@/components/receitas/receitas-list"
import { obterReceitas, obterFuncionarios } from "@/lib/database"
import type { Receita, Funcionario } from "@/lib/types"

export default function ReceitasPage() {
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [loading, setLoading] = useState(true)

  const carregarDados = async () => {
    try {
      const [receitasData, funcionariosData] = await Promise.all([obterReceitas(), obterFuncionarios()])
      setReceitas(receitasData)
      setFuncionarios(funcionariosData)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen bg-gradient-to-br from-green-50 to-emerald-100">
          <Sidebar />
          <main className="flex-1 lg:ml-64 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center h-64">
                <div className="text-green-700">Carregando receitas...</div>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-green-900">Receitas</h1>
              <p className="text-green-700">Gerencie suas receitas e faturamento</p>
            </div>

            <ReceitaForm onReceitaAdicionada={carregarDados} />

            <div>
              <h2 className="text-xl font-semibold mb-4 text-green-900">Lista de Receitas ({receitas.length})</h2>
              <ReceitasList receitas={receitas} funcionarios={funcionarios} />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
