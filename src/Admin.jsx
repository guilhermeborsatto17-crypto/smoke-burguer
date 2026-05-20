import { useState, useEffect } from 'react'
import Admin from './Admin'
import Cozinha from './Cozinha'
import { supabase } from './supabase'

const CONFIG = {
  nome: 'Smoke Burguer',
  cor: '#c0392b',
  corEscura: '#96281b',
  bg: '#111111',
  bgCard: '#1e1e1e',
  bgSidebar: '#1a1a1a',
  heroUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80'
}

function TelaInicio({ onComecar, onAdmin }) {
  return (
    <div style={{ minHeight: '100vh', background: CONFIG.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: '55vh', overflow: 'hidden' }}>
        <img src={CONFIG.heroUrl} alt="Hambúrguer"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(17,17,17,0.95))'
        }} />
        <div style={{
          position: 'absolute', top: 20, left: 20,
          background: '#111', border: `2px solid ${CONFIG.cor}`,
          borderRadius: 10, padding: '8px 14px'
        }}>
          <div style={{ color: '#fff', fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>SMOKE</div>
          <div style={{ color: CONFIG.cor, fontSize: 16, fontWeight: 700 }}>BURGUER</div>
          <div style={{ color: '#666', fontSize: 9, textTransform: 'uppercase', letterSpacing: 2 }}>delivery</div>
        </div>
      </div>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '32px 24px', gap: 20
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: 12, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 8 }}>
            Bem-vindo
          </p>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700 }}>Faça seu pedido</h1>
        </div>
        <button onClick={onComecar} style={{
          background: CONFIG.cor, color: '#fff', border: 'none',
          borderRadius: 12, padding: '20px 0', fontSize: 20, fontWeight: 700,
          cursor: 'pointer', width: '100%', textTransform: 'uppercase', letterSpacing: 2
        }}>Fazer Pedido</button>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#444', fontSize: 11, marginBottom: 10 }}>Aceitamos</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['Visa', 'Mastercard', 'PIX', 'Amex', 'Dinheiro'].map(p => (
              <span key={p} style={{
                background: '#1e1e1e', border: '1px solid #333',
                borderRadius: 6, padding: '4px 12px', color: '#666', fontSize: 11
              }}>{p}</span>
            ))}
          </div>
        </div>
        <button onClick={onAdmin} style={{
          background: 'transparent', border: 'none',
          color: '#222', fontSize: 11, cursor: 'pointer', marginTop: 20
        }}>⚙</button>
      </div>
    </div>
  )
}

function TelaCategorias({ onEscolher, carrinho, onVerCarrinho, onVoltar }) {
  const [categorias, setCategorias] = useState([])
  const [ativa, setAtiva] = useState(null)
  const [produtos, setProdutos] = useState([])
  const total = carrinho.reduce((s, i) => s + i.preco * i.qty, 0)

  useEffect(() => {
    supabase.from('categorias').select('*').eq('ativo', true).order('ordem')
      .then(({ data }) => {
        setCategorias(data || [])
        if (data && data.length > 0) setAtiva(data[0])
      })
  }, [])

  useEffect(() => {
    if (!ativa) return
    supabase.from('produtos').select('*')
      .eq('categoria_id', ativa.id)
      .eq('disponivel', true)
      .order('ordem')
      .then(({ data }) => setProdutos(data || []))
  }, [ativa])

  return (
    <div style={{ minHeight: '100vh', background: CONFIG.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: 130, overflow: 'hidden' }}>
        <img src={CONFIG.heroUrl} alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
        <div style={{
          position: 'absolute', top: 12, left: 16,
          background: '#111', border: `2px solid ${CONFIG.cor}`,
          borderRadius: 8, padding: '6px 12px'
        }}>
          <div style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>SMOKE BURGUER</div>
          <div style={{ color: '#555', fontSize: 9, textTransform: 'uppercase', letterSpacing: 2 }}>delivery</div>
        </div>
        <button onClick={onVoltar} style={{
          position: 'absolute', top: 12, right: 16,
          background: 'rgba(255,255,255,0.1)', color: '#fff',
          border: 'none', borderRadius: 6, padding: '6px 14px',
          fontSize: 13, cursor: 'pointer'
        }}>Cancelar</button>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <div style={{
          width: 110, background: CONFIG.bgSidebar,
          borderRight: '1px solid #222', padding: '16px 0', flexShrink: 0
        }}>
          <div style={{
            color: '#fff', fontSize: 12, fontWeight: 700,
            padding: '0 12px 12px', textTransform: 'uppercase', letterSpacing: 1
          }}>Menu</div>
          {categorias.map(cat => (
            <div key={cat.id} onClick={() => setAtiva(cat)} style={{
              padding: '12px', cursor: 'pointer',
              borderLeft: `3px solid ${ativa?.id === cat.id ? CONFIG.cor : 'transparent'}`,
              color: ativa?.id === cat.id ? '#fff' : '#666',
              fontSize: 12, fontWeight: ativa?.id === cat.id ? 700 : 400,
              lineHeight: 1.3, background: ativa?.id === cat.id ? '#222' : 'transparent'
            }}>{cat.nome}</div>
          ))}
        </div>

        {/* Produtos em grade 3 colunas */}
        <div style={{ flex: 1, padding: 14, overflowY: 'auto' }}>
          <div style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
            {ativa?.nome}
          </div>
          {produtos.length === 0 ? (
            <p style={{ color: '#555', fontSize: 13, textAlign: 'center', marginTop: 40 }}>
              Nenhum produto disponível
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {produtos.map(prod => (
                <div key={prod.id} onClick={() => onEscolher(prod)} style={{
                  background: CONFIG.bgCard, borderRadius: 10,
                  overflow: 'hidden', cursor: 'pointer',
                  border: '1px solid #2a2a2a'
                }}>
                  <div style={{
                    width: '100%', aspectRatio: '1/1',
                    overflow: 'hidden', background: '#2a1500'
                  }}>
                    {prod.imagem_url ? (
                      <img src={prod.imagem_url} alt={prod.nome} style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover', objectPosition: 'center',
                        display: 'block'
                      }} />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 32
                      }}>🍔</div>
                    )}
                  </div>
                  <div style={{ padding: 8 }}>
                    <div style={{ color: '#fff', fontSize: 11, fontWeight: 600, lineHeight: 1.3, marginBottom: 2 }}>
                      {prod.nome}
                    </div>
                    <div style={{ color: '#666', fontSize: 10, marginBottom: 2 }}>a partir de</div>
                    <div style={{ color: CONFIG.cor, fontSize: 12, fontWeight: 700 }}>
                      R$ {prod.preco.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer carrinho */}
      {carrinho.length > 0 && (
        <div style={{
          background: CONFIG.cor, padding: '14px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff', fontSize: 15, fontWeight: 700 }}>
            <div style={{
              background: '#fff', color: CONFIG.cor, borderRadius: '50%',
              width: 22, height: 22, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 12, fontWeight: 700
            }}>{carrinho.reduce((s, i) => s + i.qty, 0)}</div>
            Total: R$ {total.toFixed(2)}
          </div>
          <button onClick={onVerCarrinho} style={{
            background: '#fff', color: CONFIG.cor, border: 'none',
            borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer'
          }}>Ver Carrinho</button>
        </div>
      )}
    </div>
  )
}

function TelaCarrinho({ carrinho, onVoltar, onAvancar, onRemover }) {
  const total = carrinho.reduce((s, i) => s + i.preco * i.qty, 0)

  return (
    <div style={{ minHeight: '100vh', background: CONFIG.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{
        background: CONFIG.cor, padding: '16px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>
          🛒 Total: R$ {total.toFixed(2)}
        </div>
        <button onClick={onVoltar} style={{
          background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none',
          borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer'
        }}>Voltar para o Menu</button>
      </div>

      <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {carrinho.length === 0 && (
          <p style={{ textAlign: 'center', color: '#555', marginTop: 60, fontSize: 16 }}>
            Carrinho vazio
          </p>
        )}
        {carrinho.map((item, i) => (
          <div key={i} style={{
            background: CONFIG.bgCard, borderRadius: 12, padding: 14,
            border: '1px solid #2a2a2a'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 8, overflow: 'hidden',
                  background: '#2a1500', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {item.imagem_url ? (
                    <img src={item.imagem_url} alt={item.nome}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: 24 }}>🍔</span>
                  )}
                </div>
                <div>
                  <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{item.nome}</div>
                  <div style={{ color: CONFIG.cor, fontSize: 13, fontWeight: 700, marginTop: 2 }}>
                    R$ {(item.preco * item.qty).toFixed(2)}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>x{item.qty}</span>
                <button onClick={() => onRemover(i)} style={{
                  background: '#3d1010', color: '#e74c3c', border: 'none',
                  borderRadius: 6, width: 30, height: 30, fontSize: 16, cursor: 'pointer'
                }}>×</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {carrinho.length > 0 && (
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{
            background: CONFIG.bgCard, borderRadius: 12, padding: '14px 16px',
            marginBottom: 12, border: '1px solid #2a2a2a',
            display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700
          }}>
            <span style={{ color: '#888' }}>Total</span>
            <span style={{ color: '#fff' }}>R$ {total.toFixed(2)}</span>
          </div>
          <button onClick={onAvancar} style={{
            width: '100%', background: CONFIG.cor, color: '#fff', border: 'none',
            borderRadius: 12, padding: 18, fontSize: 18, fontWeight: 700,
            cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1
          }}>Pagar R$ {total.toFixed(2)}</button>
        </div>
      )}
    </div>
  )
}

function TelaPagamento({ carrinho, onVoltar, onFinalizar }) {
  const [pagamento, setPagamento] = useState(null)
  const [local, setLocal] = useState(null)
  const total = carrinho.reduce((s, i) => s + i.preco * i.qty, 0)

  const formas = [
    { id: 'cartao_credito', nome: 'Crédito',  icone: '💳' },
    { id: 'cartao_debito',  nome: 'Débito',   icone: '💳' },
    { id: 'pix',            nome: 'PIX',      icone: '📱' },
    { id: 'dinheiro',       nome: 'Dinheiro', icone: '💵' },
  ]

  const locais = [
    { id: 'aqui',   nome: 'Comer Aqui',  icone: '🪑' },
    { id: 'viagem', nome: 'Para Viagem', icone: '🛍️' },
  ]

  const podeFinalizar = pagamento && local

  return (
    <div style={{ minHeight: '100vh', background: CONFIG.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: CONFIG.cor, padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onVoltar} style={{
            background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none',
            borderRadius: 8, padding: '8px 14px', fontSize: 18, cursor: 'pointer'
          }}>←</button>
          <div>
            <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>Finalizar Pedido</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Total: R$ {total.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <div style={{ color: '#fff', fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Para comer onde?</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {locais.map(l => (
              <button key={l.id} onClick={() => setLocal(l.id)} style={{
                background: local === l.id ? '#2a0a0a' : CONFIG.bgCard,
                border: `2px solid ${local === l.id ? CONFIG.cor : '#2a2a2a'}`,
                borderRadius: 12, padding: '16px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
              }}>
                <span style={{ fontSize: 30 }}>{l.icone}</span>
                <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{l.nome}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ color: '#fff', fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Como vai pagar?</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {formas.map(f => (
              <button key={f.id} onClick={() => setPagamento(f.id)} style={{
                background: pagamento === f.id ? '#2a0a0a' : CONFIG.bgCard,
                border: `2px solid ${pagamento === f.id ? CONFIG.cor : '#2a2a2a'}`,
                borderRadius: 12, padding: '16px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
              }}>
                <span style={{ fontSize: 30 }}>{f.icone}</span>
                <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{f.nome}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => podeFinalizar && onFinalizar(pagamento, local)}
          style={{
            width: '100%', background: podeFinalizar ? CONFIG.cor : '#333',
            color: podeFinalizar ? '#fff' : '#666', border: 'none',
            borderRadius: 12, padding: 18, fontSize: 18, fontWeight: 700,
            cursor: podeFinalizar ? 'pointer' : 'not-allowed',
            textTransform: 'uppercase', letterSpacing: 1
          }}
        >
          {podeFinalizar ? 'Confirmar Pedido ✓' : 'Selecione as opções acima'}
        </button>
      </div>
    </div>
  )
}

function TelaConfirmacao({ numero, onNovoPedido }) {
  return (
    <div style={{ minHeight: '100vh', background: CONFIG.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: CONFIG.cor, padding: '16px 20px' }}>
        <div style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>SMOKE BURGUER</div>
      </div>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', gap: 24
      }}>
        <div style={{
          width: 80, height: 80, background: '#1a3a1a',
          borderRadius: '50%', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: 40
        }}>✅</div>
        <div style={{ color: '#fff', fontSize: 26, fontWeight: 700 }}>Pedido Realizado!</div>
        <div style={{
          background: CONFIG.bgCard, border: `2px solid ${CONFIG.cor}`,
          borderRadius: 20, padding: '30px 60px', textAlign: 'center'
        }}>
          <div style={{ color: '#666', fontSize: 14 }}>Sua senha</div>
          <div style={{ fontSize: 72, fontWeight: 700, color: CONFIG.cor, lineHeight: 1 }}>
            #{String(numero).padStart(3, '0')}
          </div>
          <div style={{ color: '#666', fontSize: 14, marginTop: 4 }}>Aguarde ser chamado</div>
        </div>
        <div style={{ color: '#555', fontSize: 14, textAlign: 'center', lineHeight: 1.6 }}>
          Seu pedido foi enviado à cozinha<br />e estará pronto em breve!
        </div>
        <button onClick={onNovoPedido} style={{
          background: CONFIG.bgCard, color: '#fff',
          border: `2px solid ${CONFIG.cor}`, borderRadius: 12,
          padding: '16px 40px', fontSize: 16, fontWeight: 700, cursor: 'pointer'
        }}>Novo Pedido</button>
      </div>
    </div>
  )
}

export default function App() {
  const [tela, setTela] = useState('inicio')
  const [carrinho, setCarrinho] = useState([])
  const [numeroPedido, setNumeroPedido] = useState(null)

  const path = window.location.pathname.replace('/', '')
  if (path === 'admin') return <Admin />
  if (path === 'cozinha') return <Cozinha />

  function adicionarAoCarrinho(produto) {
    setCarrinho(prev => {
      const existe = prev.find(i => i.id === produto.id)
      if (existe) {
        return prev.map(i => i.id === produto.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...produto, qty: 1 }]
    })
  }

  function removerDoCarrinho(index) {
    setCarrinho(prev => prev.filter((_, i) => i !== index))
  }

  async function finalizarPedido(pagamento, local) {
    const total = carrinho.reduce((s, i) => s + i.preco * i.qty, 0)

    const hoje = new Date().toISOString().split('T')[0]
    const { data: pedidosHoje } = await supabase
      .from('pedidos').select('numero')
      .gte('criado_em', hoje)
      .order('numero', { ascending: false })
      .limit(1)

    const proximoNumero = pedidosHoje && pedidosHoje.length > 0
      ? pedidosHoje[0].numero + 1 : 1

    const { data: pedido } = await supabase
      .from('pedidos')
      .insert({
        numero: proximoNumero,
        status: 'pendente',
        forma_pagamento: pagamento,
        local: local,
        total: total
      })
      .select()
      .single()

    await supabase.from('itens_pedido').insert(
      carrinho.map(i => ({
        pedido_id: pedido.id,
        produto_id: i.id,
        nome: i.nome,
        preco: i.preco,
        quantidade: i.qty
      }))
    )

    setNumeroPedido(pedido.numero)
    setCarrinho([])
    setTela('confirmacao')
  }

  if (tela === 'inicio') return (
    <TelaInicio
      onComecar={() => setTela('categorias')}
      onAdmin={() => window.location.href = '/admin'}
    />
  )
  if (tela === 'categorias') return (
    <TelaCategorias
      onEscolher={prod => adicionarAoCarrinho(prod)}
      carrinho={carrinho}
      onVerCarrinho={() => setTela('carrinho')}
      onVoltar={() => setTela('inicio')}
    />
  )
  if (tela === 'carrinho') return (
    <TelaCarrinho
      carrinho={carrinho}
      onVoltar={() => setTela('categorias')}
      onAvancar={() => setTela('pagamento')}
      onRemover={removerDoCarrinho}
    />
  )
  if (tela === 'pagamento') return (
    <TelaPagamento
      carrinho={carrinho}
      onVoltar={() => setTela('carrinho')}
      onFinalizar={finalizarPedido}
    />
  )
  if (tela === 'confirmacao') return (
    <TelaConfirmacao
      numero={numeroPedido}
      onNovoPedido={() => setTela('inicio')}
    />
  )
}