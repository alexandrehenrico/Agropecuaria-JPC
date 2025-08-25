"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { adicionarDespesa } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"
import { Wallet } from "lucide-react"
import type { Funcionarios } from "@/lib/types"

interface DespesaFormProps {
  onDespesaAdicionada: () => void
  funcionarios?: Funcionarios[]
}

const categorias = [
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

export function DespesaForm({ onDespesaAdicionada, funcionarios = [] }: DespesaFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    descricao: "",
    valor: "",
    funcionarioId: "",
    categoria: "Salário",
    data: new Date().toISOString().split("T")[0],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const despesaData = {
        descricao: formData.descricao,
        valor: Number.parseFloat(formData.valor),
        funcionarioId: formData.funcionarioId || undefined,
        categoria: formData.categoria,
        data: new Date(formData.data),
      }
      
      await adicionarDespesa(despesaData)

      toast({
        title: "Despesa adicionada",
        description: "Despesa foi adicionada com sucesso!",
      })

      setFormData({
        descricao: "",
        valor: "",
        funcionarioId: "",
        categoria: "Salário",
        data: new Date().toISOString().split("T")[0],
      })

      onDespesaAdicionada()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar despesa. Tente novamente.",
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
    <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 shadow-sm">
      {/* Decorações de fundo */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-green-300 rounded-full opacity-15 -translate-y-20 translate-x-20" />
      <div className="absolute bottom-0 left-0 w-28 h-28 bg-emerald-500 rounded-full opacity-10 translate-y-14 -translate-x-14" />

      <CardHeader className="relative">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-green-700" />
          <CardTitle className="text-xl font-bold text-green-900">Adicionar Nova Despesa</CardTitle>
        </div>
        <p className="text-sm text-green-700 mt-1">
          Preencha os campos abaixo para registrar uma nova despesa no sistema.
        </p>
      </CardHeader>

      <CardContent className="relative">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-green-900">Descrição *</Label>
            <Textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              required
              placeholder="Descreva a despesa (ex: Hospedagem mensal do servidor)"
              rows={2}
              className="border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="valor" className="text-green-900">Valor (R$) *</Label>
              <Input
                id="valor"
                name="valor"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor}
                onChange={handleChange}
                required
                placeholder="0,00"
                className="border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="funcionarioId" className="text-green-900">Funcionário (Opcional)</Label>
              <Select
                value={formData.funcionarioId}
                onValueChange={(value) => setFormData({ ...formData, funcionarioId: value })}
              >
                <SelectTrigger className="border-green-200 focus:border-emerald-500 focus:ring-emerald-500">
                  <SelectValue placeholder="Selecione um funcionário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum funcionário</SelectItem>
                  {funcionarios.map((funcionario) => (
                    <SelectItem key={funcionario.id} value={funcionario.id}>
                      {funcionario.nome} - {funcionario.atividade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria" className="text-green-900">Categoria *</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData({ ...formData, categoria: value })}
              >
                <SelectTrigger className="border-green-200 focus:border-emerald-500 focus:ring-emerald-500">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data" className="text-green-900">Data *</Label>
              <Input
                id="data"
                name="data"
                type="date"
                value={formData.data}
                onChange={handleChange}
                required
                className="border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
          >
            {loading ? "Adicionando..." : "Adicionar Despesa"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
