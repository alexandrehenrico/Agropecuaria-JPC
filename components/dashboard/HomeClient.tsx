// components/dashboard/HomeClient.tsx
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

export default function HomeClient() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [despesas, setDespesas] = useState<Despesa[]>([])

  const carregarDados = async () => {
    try {
      const [funcs, recs, deps] = await Promise.all([
        obterFuncionarios(),
        obterReceitas(),
        obterDespesas(),
      ])
      setFuncionarios(funcs)
      setReceitas(recs)
      setDespesas(deps)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const DashboardData: DashboardData = {
    totalReceitas: receitas.reduce((s, r) => s + r.valor, 0),
    totalDespesas: despesas.reduce((s, d) => s + d.valor, 0),
    lucro:
      receitas.reduce((s, r) => s + r.valor, 0) -
      despesas.reduce((s, d) => s + d.valor, 0),
    totalFuncionarios: funcionarios.length,
    receitasMes: receitas
      .filter((r) => {
        const now = new Date()
        const rd = new Date(r.data)
        return rd.getMonth() === now.getMonth() && rd.getFullYear() === now.getFullYear()
      })
      .reduce((s, r) => s + r.valor, 0),
    despesasMes: despesas
      .filter((d) => {
        const now = new Date()
        const dd = new Date(d.data)
        return dd.getMonth() === now.getMonth() && dd.getFullYear() === now.getFullYear()
      })
      .reduce((s, d) => s + d.valor, 0),
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
