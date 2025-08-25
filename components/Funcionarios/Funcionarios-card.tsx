"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, Phone, UserCheck, Calendar, DollarSign } from "lucide-react"
import type { Funcionarios } from "@/lib/types"

interface FuncionariosCardProps {
  Funcionarios: Funcionarios
  onClick?: () => void
  className?: string
}

export function FuncionariosCard({ Funcionarios, onClick, className }: FuncionariosCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(dateObj)
  }

  const getInitials = (name: string) => {
    const words = name.split(" ")
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase()
    }
    return name.charAt(0).toUpperCase()
  }

  const getStatusColor = () => "bg-green-100 text-green-700 border-green-200"

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("[role='menuitem']")) {
      return
    }
    onClick?.()
  }

  return (
    <Card
      className={`relative overflow-hidden bg-green-50 rounded-xl border border-green-100 p-6 transition-all duration-200 hover:shadow-md ${
        onClick ? "cursor-pointer hover:scale-[1.02]" : ""
      } ${className || ""}`}
      onClick={handleCardClick}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full opacity-20 -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-200 rounded-full opacity-10 translate-y-12 -translate-x-12" />

      <div className="relative flex items-center gap-4 mb-4">
        {/* Avatar simples com iniciais */}
        <div className="relative flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold shadow-md">
          {getInitials(Funcionarios.nome)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-green-900 truncate">{Funcionarios.nome}</h2>
            <Badge variant="outline" className={`${getStatusColor()} bg-white/80`}>
              Ativo
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-green-600">
            <Calendar className="h-4 w-4" />
            <span className="capitalize">Funcionário desde {formatDate(Funcionarios.dataRegistro)}</span>
          </div>
        </div>
      </div>

      {/* Dados principais */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-green-700" />
          <span className="font-medium text-green-900">Atividade:</span>
          <span className="text-green-700">{Funcionarios.atividade}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-green-700" />
          <span className="font-medium text-green-900">Contato:</span>
          <span className="text-green-700">{Funcionarios.contato}</span>
        </div>

        {Funcionarios.salarioFixo && (
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-green-700" />
            <span className="font-medium text-green-900">Salário Fixo:</span>
            <span className="text-green-700 font-semibold">{formatCurrency(Funcionarios.salarioFixo)}</span>
          </div>
        )}
      </div>

      {/* Registrado por */}
      {Funcionarios.registradoPor && (
        <div className="pt-3 border-t border-green-100 mb-4">
          <div className="flex items-center gap-2">
            <UserCheck className="h-3 w-3 text-green-600" />
            <span className="text-xs text-green-600">Registrado por {Funcionarios.registradoPor}</span>
          </div>
        </div>
      )}
    </Card>
  )
}
