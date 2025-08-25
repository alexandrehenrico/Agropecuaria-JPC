export interface Funcionario {
  id: string
  nome: string
  contato: string
  atividade: string
  salarioFixo?: number
  dataRegistro: Date
  registradoPor?: string
}

export interface Receita {
  id: string
  descricao: string
  valor: number
  funcionarioId?: string
  categoria: string
  data: Date
  registradoPor?: string
}

export interface Despesa {
  id: string
  descricao: string
  valor: number
  funcionarioId?: string
  categoria: string
  data: Date
  registradoPor?: string
}

export interface DashboardData {
  totalReceitas: number
  totalDespesas: number
  lucro: number
  totalFuncionarios: number
  receitasMes: number
  despesasMes: number
}

export interface Senha {
  id: string
  titulo: string
  categoria: string
  usuario: string
  senha: string
  url?: string
  observacoes?: string
  dataRegistro: Date
  registradoPor?: string
}

export interface Projeto {
  id: string
  nome: string
  descricao: string
  funcionarioId?: string
  status: 'prospeccao' | 'desenvolvimento' | 'entregue'
  valor?: number
  dataInicio: Date
  dataPrevisao?: Date
  dataEntrega?: Date
  observacoes?: string
  registradoPor?: string
}

export interface AtividadeProjeto {
  id: string
  projetoId: string
  titulo: string
  descricao?: string
  concluida: boolean
  dataCriacao: Date
  dataConclusao?: Date
  registradoPor?: string
}

export interface ItemOrcamento {
  id: string
  descricao: string
  quantidade: number
  valorUnitario: number
  valorTotal: number
}

export interface Orcamento {
  id: string
  numeroOrcamento: string
  funcionarioId?: string
  nomeFuncionario: string
  emailFuncionario: string
  telefoneFuncionario: string
  titulo: string
  descricao?: string
  itens: ItemOrcamento[]
  subtotal: number
  desconto: number
  valorTotal: number
  status: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado'
  dataVencimento: Date
  dataCriacao: Date
  observacoes?: string
  registradoPor?: string
}

export interface Recibo {
  id: string
  numeroRecibo: string
  funcionarioId?: string
  nomeFuncionario: string
  emailFuncionario: string
  telefoneFuncionario: string
  descricaoServico: string
  valorPago: number
  formaPagamento: 'dinheiro' | 'pix' | 'cartao' | 'transferencia' | 'boleto'
  dataPagamento: Date
  dataVencimento?: Date
  observacoes?: string
  status: 'pago' | 'pendente' | 'cancelado'
  dataCriacao: Date
  registradoPor?: string
}