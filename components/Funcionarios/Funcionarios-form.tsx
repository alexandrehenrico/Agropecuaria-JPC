"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { adicionarFuncionarios } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"
import { UserPlus } from "lucide-react"

interface FuncionariosFormProps {
  onFuncionariosAdicionado: () => void
}

export function FuncionariosForm({ onFuncionariosAdicionado }: FuncionariosFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    contato: "",
    atividade: "",
    salarioFixo: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const funcionarioData = {
        ...formData,
        salarioFixo: formData.salarioFixo ? Number.parseFloat(formData.salarioFixo) : undefined,
        dataRegistro: new Date(),
      }
      
      await adicionarFuncionarios(funcionarioData)

      toast({
        title: "Funcionário adicionado",
        description: "O funcionário foi registrado com sucesso!",
      })

      setFormData({
        nome: "",
        contato: "",
        atividade: "",
        salarioFixo: "",
      })

      onFuncionariosAdicionado()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o funcionário. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <Card className="relative overflow-hidden bg-green-50 rounded-xl border border-green-100 shadow-sm">
      {/* Decorações de fundo */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-green-100 rounded-full opacity-20 -translate-y-20 translate-x-20" />
      <div className="absolute bottom-0 left-0 w-28 h-28 bg-green-200 rounded-full opacity-10 translate-y-14 -translate-x-14" />

      <CardHeader className="relative">
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-green-700" />
          <CardTitle className="text-xl font-bold text-green-900">Adicionar Novo Funcionário</CardTitle>
        </div>
        <p className="text-sm text-green-600 mt-1">
          Preencha os campos abaixo para registrar um novo funcionário no sistema.
        </p>
      </CardHeader>

      <CardContent className="relative">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-green-900">Nome *</Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                placeholder="Nome completo do funcionário"
                className="border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contato" className="text-green-900">Contato *</Label>
              <Input
                id="contato"
                name="contato"
                value={formData.contato}
                onChange={handleChange}
                required
                placeholder="Telefone, email ou outro contato"
                className="border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="atividade" className="text-green-900">Atividade *</Label>
              <Input
                id="atividade"
                name="atividade"
                value={formData.atividade}
                onChange={handleChange}
                required
                placeholder="Função ou atividade exercida"
                className="border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salarioFixo" className="text-green-900">Salário Fixo (Opcional)</Label>
              <Input
                id="salarioFixo"
                name="salarioFixo"
                type="number"
                step="0.01"
                min="0"
                value={formData.salarioFixo}
                onChange={handleChange}
                placeholder="0,00"
                className="border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
          >
            {loading ? "Adicionando..." : "Adicionar Funcionário"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
