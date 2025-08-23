"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { adicionarSenha } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"
import { Shield, Eye, EyeOff } from "lucide-react"

interface SenhaFormProps {
  onSenhaAdicionada: () => void
}

const categorias = [
  "Redes Sociais",
  "Email",
  "Bancos",
  "Trabalho",
  "Streaming",
  "E-commerce",
  "Jogos",
  "Outros",
]

export function SenhaForm({ onSenhaAdicionada }: SenhaFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    titulo: "",
    categoria: "Redes Sociais",
    usuario: "",
    senha: "",
    url: "",
    observacoes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await adicionarSenha({
        ...formData,
        dataRegistro: new Date(),
      })

      toast({
        title: "Senha adicionada",
        description: "Senha foi adicionada com sucesso!",
      })

      setFormData({
        titulo: "",
        categoria: "Redes Sociais",
        usuario: "",
        senha: "",
        url: "",
        observacoes: "",
      })

      onSenhaAdicionada()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar senha. Tente novamente.",
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

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData({ ...formData, senha: password })
  }

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 shadow-sm">
      {/* Decorações de fundo */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-green-300 rounded-full opacity-15 -translate-y-20 translate-x-20" />
      <div className="absolute bottom-0 left-0 w-28 h-28 bg-emerald-500 rounded-full opacity-10 translate-y-14 -translate-x-14" />

      <CardHeader className="relative">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-700" />
          <CardTitle className="text-xl font-bold text-green-900">Adicionar Nova Senha</CardTitle>
        </div>
        <p className="text-sm text-green-700 mt-1">
          Preencha os campos abaixo para registrar uma nova senha no sistema.
        </p>
      </CardHeader>

      <CardContent className="relative">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="titulo" className="text-green-900">Título *</Label>
              <Input
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                placeholder="Ex: Facebook, Gmail, Banco do Brasil"
                className="border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
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
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="usuario" className="text-green-900">Usuário/Email *</Label>
              <Input
                id="usuario"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                required
                placeholder="usuario@exemplo.com"
                className="border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha" className="text-green-900">Senha *</Label>
              <div className="relative">
                <Input
                  id="senha"
                  name="senha"
                  type={showPassword ? "text" : "password"}
                  value={formData.senha}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="pr-20 border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="h-6 w-6 p-0 hover:bg-green-100"
                  >
                    {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={generatePassword}
                    className="h-6 px-2 text-xs hover:bg-green-100"
                  >
                    Gerar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url" className="text-green-900">URL (Opcional)</Label>
            <Input
              id="url"
              name="url"
              type="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://exemplo.com"
              className="border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes" className="text-green-900">Observações (Opcional)</Label>
            <Textarea
              id="observacoes"
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              placeholder="Informações adicionais sobre esta conta"
              rows={2}
              className="border-green-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
          >
            {loading ? "Adicionando..." : "Adicionar Senha"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}