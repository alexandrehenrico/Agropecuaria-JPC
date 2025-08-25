"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { UserHeader } from "@/components/dashboard/user-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { MonthlyOverview } from "@/components/dashboard/monthly-overview"
import { QuickContact } from "@/components/dashboard/quick-contact"
import { obterFuncionarios, obterReceitas, obterDespesas } from "@/lib/database"
import type { Funcionario, Receita, Despesa, DashboardData } from "@/lib/types"

export default function HomePage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [despesas, setDespesas] = useState<Despesa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setError(null)
        const [funcionariosData, receitasData, despesasData] = await Promise.all([
          obterFuncionarios(),
          obterReceitas(),
          obterDespesas(),
        ])

        console.log('Dados carregados:', { 
          funcionarios: funcionariosData.length, 
          receitas: receitasData.length, 
          despesas: despesasData.length 
        })

        setFuncionarios(funcionariosData)
        setReceitas(receitasData)
        setDespesas(despesasData)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setError("Erro ao carregar dados do Dashboard")
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [])

  const DashboardData: DashboardData = {
    totalReceitas: receitas.reduce((sum, r) => sum + r.valor, 0),
    totalDespesas: despesas.reduce((sum, d) => sum + d.valor, 0),
    lucro: receitas.reduce((sum, r) => sum + r.valor, 0) - despesas.reduce((sum, d) => sum + d.valor, 0),
    totalFuncionarios: funcionarios.length,
    receitasMes: receitas
      .filter((r) => {
        const now = new Date()
        const rDate = new Date(r.data)
        return rDate.getMonth() === now.getMonth() && rDate.getFullYear() === now.getFullYear()
      })
      .reduce((sum, r) => sum + r.valor, 0),
    despesasMes: despesas
      .filter((d) => {
        const now = new Date()
        const dDate = new Date(d.data)
        return dDate.getMonth() === now.getMonth() && dDate.getFullYear() === now.getFullYear()
      })
      .reduce((sum, d) => sum + d.valor, 0),
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen bg-gradient-to-br from-green-50 to-emerald-100">
          <Sidebar />
          <main className="flex-1 lg:ml-64 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center h-64">
                <div className="text-green-700">Carregando...</div>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen bg-gradient-to-br from-green-50 to-emerald-100">
          <Sidebar />
          <main className="flex-1 lg:ml-64 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center h-64">
                <div className="text-red-600">{error}</div>
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
            <UserHeader />

            <div>
              <h1 className="text-3xl font-bold text-green-900">Visão Geral Fazenda Progresso</h1>
              <p className="text-green-700">Sistema de Gestão Interna - Visão Geral Financeira</p>
              <p className="text-xs text-green-700 mt-2">
                Debug: {funcionarios.length} funcionários, {receitas.length} receitas, {despesas.length} despesas
              </p>
            </div>

            <StatsCards data={DashboardData} />

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <MonthlyOverview receitas={receitas} despesas={despesas} />
              </div>
              <QuickContact funcionarios={funcionarios} />
            </div>

            <RecentActivities receitas={receitas} despesas={despesas} funcionarios={funcionarios} />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
