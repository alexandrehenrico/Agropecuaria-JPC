"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { FuncionariosForm } from "@/components/Funcionarios/Funcionarios-form"
import { FuncionariosList } from "@/components/Funcionarios/Funcionarios-list"
import { obterFuncionarios } from "@/lib/database"
import type { Funcionarios } from "@/lib/types"

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionarios[]>([])
  const [loading, setLoading] = useState(true)

  const carregarFuncionarios = async () => {
    try {
      const funcionariosData = await obterFuncionarios()
      setFuncionarios(funcionariosData)
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarFuncionarios()
  }, [])

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen bg-green-50">
          <Sidebar />
          <main className="flex-1 lg:ml-64 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center h-64">
                <div className="text-green-700">Carregando funcionários...</div>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-green-50">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-green-900">Funcionários</h1>
              <p className="text-green-700">Gerencie seus funcionários e finanças</p>
            </div>

            <FuncionariosForm onFuncionariosAdicionado={carregarFuncionarios} />

            <div>
              <h2 className="text-xl font-semibold mb-4 text-green-800">
                Lista de Funcionários ({funcionarios.length})
              </h2>
              <FuncionariosList Funcionarios={funcionarios} />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}