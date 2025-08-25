"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Clock, Zap } from "lucide-react"
import { createWhatsAppUrl, messageTemplates } from "@/lib/whatsapp"
import type { Funcionario } from "@/lib/types"
import { Timestamp } from "firebase/firestore"

// ... resto do seu código

interface QuickContactProps {
  funcionarios: Funcionario[]
  maxItems?: number
  className?: string
  variant?: 'default' | 'compact'
}

export function QuickContact({ funcionarios, maxItems = 3, className, variant = 'default' }: QuickContactProps) {
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Hoje'
    if (diffInDays === 1) return 'Ontem'
    if (diffInDays < 7) return `${diffInDays} dias atrás`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} sem atrás`
    return `${Math.floor(diffInDays / 30)} mês${Math.floor(diffInDays / 30) > 1 ? 'es' : ''} atrás`
  }

  const getInitials = (nome: string) => {
    const words = nome.split(" ")
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase()
    }
    return nome.charAt(0).toUpperCase()
  }

  const funcionariosRecentes = funcionarios
    .sort((a, b) => {
      const dateA = typeof a.dataRegistro === 'string' ? new Date(a.dataRegistro) : a.dataRegistro
      const dateB = typeof b.dataRegistro === 'string' ? new Date(b.dataRegistro) : b.dataRegistro
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, maxItems)

  const handleQuickWhatsApp = (funcionario: Funcionario) => {
    const message = messageTemplates.followUp(funcionario.nome, funcionario.atividade)
    const whatsappUrl = createWhatsAppUrl(funcionario.contato, message)
    window.open(whatsappUrl, "_blank")
  }

  if (funcionariosRecentes.length === 0) {
    return (
      <Card className={`border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 ${className}`}>
        <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <MessageCircle className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="font-medium text-green-900 mb-2">Nenhum funcionário ainda</h3>
          <p className="text-sm text-green-700 max-w-48">
            Cadastre seus primeiros funcionários para aparecerem aqui
          </p>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'compact') {
    return (
      <Card className={`border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 ${className || ''}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-green-900">
            <Zap className="h-4 w-4 text-green-700" />
            Contato Rápido
            <Badge variant="secondary" className="ml-auto text-xs bg-green-100 text-green-700">
              {funcionariosRecentes.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-3 py-4">
          {funcionariosRecentes.map((funcionario) => (
            <div key={funcionario.id} className="flex items-center gap-2 p-3 hover:bg-green-100 rounded-lg transition-colors duration-200">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={undefined} />
                <AvatarFallback className="text-xs bg-gradient-to-br from-green-700 to-green-800 text-white">
                  {getInitials(funcionario.nome)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-green-900">{funcionario.nome}</p>
                <p className="text-xs text-green-700 truncate">{funcionario.atividade}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleQuickWhatsApp(funcionario)}
                className="h-10 w-10 p-0 hover:bg-green-200 flex-shrink-0"
              >
                <MessageCircle className="h-4 w-4 text-green-600" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`transition-all duration-200 hover:shadow-md border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 ${className || ''}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-green-900">
          <div className="p-2 bg-green-100 rounded-lg">
            <MessageCircle className="h-5 w-5 text-green-700" />
          </div>
          Contato Rápido
          <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700">
            {funcionariosRecentes.length} funcionário{funcionariosRecentes.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {funcionariosRecentes.map((funcionario, index) => (
            <div 
              key={funcionario.id} 
              className="group bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl border border-green-200 transition-all duration-200 hover:shadow-sm"
            >
              {/* Layout Desktop */}
              <div className="hidden sm:flex items-center justify-between p-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      <AvatarImage src={undefined} />
                      <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-green-700 to-green-800 text-white">
                        {getInitials(funcionario.nome)}
                      </AvatarFallback>
                    </Avatar>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm text-green-900 truncate">{funcionario.nome}</p>
                      {index === 0 && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          Mais recente
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-green-700 truncate mb-1">{funcionario.atividade}</p>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(funcionario.dataRegistro)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleQuickWhatsApp(funcionario)}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 shadow-sm transition-all duration-200 group-hover:scale-105 ml-3 h-8 w-8 p-0"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>

              {/* Layout Mobile */}
              <div className="sm:hidden p-3">
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarImage src={undefined} />
                      <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-green-700 to-green-800 text-white">
                        {getInitials(funcionario.nome)}
                      </AvatarFallback>
                    </Avatar>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                      <p className="font-semibold text-base sm:text-sm text-green-900 truncate">{funcionario.nome}</p>
                      {index === 0 && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 w-fit">
                          Mais recente
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm sm:text-xs text-green-700 mb-2 leading-relaxed">
                      {funcionario.atividade}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(funcionario.dataRegistro)}</span>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => handleQuickWhatsApp(funcionario)}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 shadow-sm transition-all duration-200 h-8 w-8 p-0"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}