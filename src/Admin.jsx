import { useState, useEffect } from 'react'
import { supabase } from './supabase'

const CONFIG = {
  cor: '#c0392b',
  bg: '#111111',
  bgCard: '#1e1e1e',
  bgSidebar: '#1a1a1a',
}

function TelaLogin({ onLogin }) {
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  function entrar() {
    if (senha === 'admin123') {
      onLogin()
    } else {
      setErro('Senha incorreta!')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: CONFIG.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: CONFIG.bgCard, borderRadius: 20, padding: 40,
        width: '100%', maxWidth: 380, textAlign: 'center',
        border: '1px solid #2a2a2a'
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔥</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: '#fff' }}>
          Painel Admin
        </h2>
        <p style={{ color: '#666', marginBottom: 24 }}>Smoke Burguer</p>
        <input
          type="password"
          placeholder="Digite a senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && entrar()}
          style={{
            width: '100%', padding: '14px 16px', borderRadius: 10,
            border: '1px solid #333', fontSize: 16, marginBottom: 12,
            outline: 'none', background: '#1a1a1a', color: '#fff'
          }}
        />
        {erro && <p style={{ color: '#e74c3c', marginBottom: 12 }}>{erro}</p>}
        <button onClick={entrar} style={{
          width: '100%', background: CONFIG.cor, color: '#fff',
          padding: '14px', borderRadius: 10, fontSize: 16, fontWeight: 700,
          border: 'none', cursor: 'pointer'
        }}>Entrar</button>
        <p style={{ color: '#444', fontSize: 12, marginTop: 16 }}>Senha padrão: admin123</p>
      </div>
    </div>
  )
}

function FormProduto({ produto, categorias, onSalvar, onCancelar }) {
  const [form, setForm] = useState(produto || {
    nome: '', descricao: '', preco: '', categoria_id: '', disponivel: true, imagem_url: ''
  })
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(produto?.imagem_url || null)

  function atualizar(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }))
  }

  async function uploadImagem(e) {
    const arquivo = e.target.files[0]
    if (!arquivo) return
    setUploading(true)
    const ext = arquivo.name.split('.').pop()
    const nomeArquivo = `${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('produtos').upload(nomeArquivo, arquivo)
    if (error) { alert('Erro ao fazer upload!'); setUploading(false); return }
    const { data } = supabase.storage.from('produtos').getPublicUrl(nomeArquivo)
    setPreview(data.publicUrl)
    atualizar('imagem_url', data.publicUrl)
    setUploading(false)
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: '1px solid #333', fontSize: 15, outline: 'none',
    background: '#1a1a1a', color: '#fff'
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: 24, overflowY: 'auto'
    }}>
      <div style={{
        background: CONFIG.bgCard, borderRadius: 20, padding: 32,
        width: '100%', maxWidth: 480, border: '1px solid #2a2a2a'
      }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: '#fff' }}>
          {produto ? 'Editar Produto' : 'Novo Produto'}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 6 }}>
              Foto do produto
            </label>
            <div style={{
              border: '2px dashed #333', borderRadius: 12, padding: 16,
              textAlign: 'center', cursor: 'pointer', background: '#1a1a1a'
            }} onClick={() => document.getElementById('input-imagem').click()}>
              {preview ? (
                <img src={preview} alt="preview" style={{
                  width: '100%', height: 160, objectFit: 'cover', borderRadius: 8
                }} />
              ) : (
                <div>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
                  <div style={{ fontSize: 14, color: '#555' }}>
                    {uploading ? 'Enviando...' : 'Toque para adicionar foto'}
                  </div>
                </div>
              )}
            </div>
            <input id="input-imagem" type="file" accept="image/*"
              onChange={uploadImagem} style={{ display: 'none' }} />
            {preview && (
              <button onClick={() => { setPreview(null); atualizar('imagem_url', '') }}
                style={{ marginTop: 8, fontSize: 12, color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer' }}>
                Remover foto
              </button>
            )}
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 6 }}>Nome</label>
            <input value={form.nome} onChange={e => atualizar('nome', e.target.value)}
              placeholder="Ex: Smoke Clássico" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 6 }}>Descrição</label>
            <input value={form.descricao} onChange={e => atualizar('descricao', e.target.value)}
              placeholder="Ex: Blend 180g, cheddar, bacon" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 6 }}>Preço (R$)</label>
            <input type="number" value={form.preco} onChange={e => atualizar('preco', e.target.value)}
              placeholder="Ex: 32.90" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 6 }}>Categoria</label>
            <select value={form.categoria_id} onChange={e => atualizar('categoria_id', e.target.value)}
              style={{ ...inputStyle, background: '#1a1a1a' }}>
              <option value="">Selecione uma categoria</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icone} {cat.nome}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" id="disponivel" checked={form.disponivel}
              onChange={e => atualizar('disponivel', e.target.checked)}
              style={{ width: 20, height: 20, accentColor: CONFIG.cor }} />
            <label htmlFor="disponivel" style={{ fontSize: 15, color: '#888' }}>
              Produto disponível no cardápio
            </label>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button onClick={onCancelar} style={{
            flex: 1, padding: 14, borderRadius: 10,
            border: '1px solid #333', fontSize: 15,
            background: '#1a1a1a', color: '#888', cursor: 'pointer'
          }}>Cancelar</button>
          <button onClick={() => onSalvar(form)} disabled={uploading} style={{
            flex: 2, padding: 14, borderRadius: 10,
            background: uploading ? '#333' : CONFIG.cor,
            color: uploading ? '#666' : '#fff',
            fontSize: 15, fontWeight: 700, border: 'none',
            cursor: uploading ? 'not-allowed' : 'pointer'
          }}>{uploading ? 'Enviando foto...' : 'Salvar Produto'}</button>
        </div>
      </div>
    </div>
  )
}

export default function Admin() {
  const [logado, setLogado] = useState(false)
  const [produtos, setProdutos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [formAberto, setFormAberto] = useState(false)
  const [produtoEditando, setProdutoEditando] = useState(null)
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas')
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    if (logado) carregarDados()
  }, [logado])

  async function carregarDados() {
    setCarregando(true)
    const { data: cats } = await supabase.from('categorias').select('*').order('ordem')
    const { data: prods } = await supabase.from('produtos')
      .select('*, categorias(nome, icone)').order('ordem')
    setCategorias(cats || [])
    setProdutos(prods || [])
    setCarregando(false)
  }

  async function salvarProduto(form) {
    if (!form.nome || !form.preco || !form.categoria_id) {
      alert('Preencha nome, preço e categoria!')
      return
    }
    const dados = {
      nome: form.nome, descricao: form.descricao,
      preco: parseFloat(form.preco), categoria_id: form.categoria_id,
      disponivel: form.disponivel, imagem_url: form.imagem_url || null
    }
    if (form.id) {
      await supabase.from('produtos').update(dados).eq('id', form.id)
      mostrarMensagem('✅ Produto atualizado!')
    } else {
      await supabase.from('produtos').insert(dados)
      mostrarMensagem('✅ Produto criado!')
    }
    setFormAberto(false)
    setProdutoEditando(null)
    carregarDados()
  }

  async function toggleDisponivel(produto) {
    await supabase.from('produtos').update({ disponivel: !produto.disponivel }).eq('id', produto.id)
    mostrarMensagem(produto.disponivel ? '⛔ Produto pausado' : '✅ Produto ativado')
    carregarDados()
  }

  async function excluirProduto(id) {
    if (!confirm('Tem certeza?')) return
    await supabase.from('produtos').delete().eq('id', id)
    mostrarMensagem('🗑️ Produto excluído')
    carregarDados()
  }

  function mostrarMensagem(msg) {
    setMensagem(msg)
    setTimeout(() => setMensagem(''), 3000)
  }

  const produtosFiltrados = categoriaFiltro === 'todas'
    ? produtos : produtos.filter(p => p.categoria_id === categoriaFiltro)

  if (!logado) return <TelaLogin onLogin={() => setLogado(true)} />

  return (
    <div style={{ minHeight: '100vh', background: CONFIG.bg }}>
      <div style={{
        background: CONFIG.cor, padding: '16px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>🔥 Painel Admin</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Smoke Burguer</p>
        </div>
        <button onClick={() => { setProdutoEditando(null); setFormAberto(true) }} style={{
          background: '#fff', color: CONFIG.cor,
          padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 15,
          border: 'none', cursor: 'pointer'
        }}>+ Novo Produto</button>
      </div>

      {mensagem && (
        <div style={{
          background: '#1a3a1a', color: '#2ecc71',
          padding: '12px 24px', fontSize: 15, textAlign: 'center'
        }}>{mensagem}</div>
      )}

      <div style={{
        padding: '16px 24px', display: 'flex', gap: 10,
        overflowX: 'auto', background: CONFIG.bgSidebar,
        borderBottom: '1px solid #222'
      }}>
        <button onClick={() => setCategoriaFiltro('todas')} style={{
          padding: '8px 16px', borderRadius: 20, fontSize: 14, fontWeight: 600,
          background: categoriaFiltro === 'todas' ? CONFIG.cor : '#2a2a2a',
          color: '#fff', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap'
        }}>Todas</button>
        {categorias.map(cat => (
          <button key={cat.id} onClick={() => setCategoriaFiltro(cat.id)} style={{
            padding: '8px 16px', borderRadius: 20, fontSize: 14, fontWeight: 600,
            background: categoriaFiltro === cat.id ? CONFIG.cor : '#2a2a2a',
            color: '#fff', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap'
          }}>{cat.icone} {cat.nome}</button>
        ))}
      </div>

      <div style={{ padding: 24 }}>
        {carregando ? (
          <p style={{ textAlign: 'center', color: '#555', marginTop: 40 }}>Carregando...</p>
        ) : produtosFiltrados.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#555', marginTop: 40 }}>Nenhum produto ainda</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {produtosFiltrados.map(prod => (
              <div key={prod.id} style={{
                background: CONFIG.bgCard, borderRadius: 16, padding: 16,
                display: 'flex', gap: 14, alignItems: 'center',
                border: '1px solid #2a2a2a',
                opacity: prod.disponivel ? 1 : 0.5
              }}>
                <div style={{
                  width: 80, height: 80, borderRadius: 10,
                  background: '#2a1500', flexShrink: 0,
                  overflow: 'hidden', aspectRatio: '1/1'
                }}>
                  {prod.imagem_url ? (
                    <img src={prod.imagem_url} alt={prod.nome}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center center',
                        display: 'block'
                      }} />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 34
                    }}>🍔</div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{prod.nome}</span>
                    {!prod.disponivel && (
                      <span style={{
                        background: '#3d1010', color: '#e74c3c',
                        fontSize: 11, padding: '2px 8px', borderRadius: 20
                      }}>PAUSADO</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>
                    {prod.categorias?.icone} {prod.categorias?.nome}
                    {prod.descricao && ` • ${prod.descricao}`}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: CONFIG.cor, marginTop: 4 }}>
                    R$ {parseFloat(prod.preco).toFixed(2)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => toggleDisponivel(prod)} style={{
                    padding: '8px 12px', borderRadius: 8, fontSize: 18,
                    background: prod.disponivel ? '#1a3a1a' : '#3d1010',
                    border: '1px solid #333', cursor: 'pointer'
                  }}>{prod.disponivel ? '✅' : '⛔'}</button>
                  <button onClick={() => { setProdutoEditando(prod); setFormAberto(true) }} style={{
                    padding: '8px 12px', borderRadius: 8, fontSize: 18,
                    background: '#1a1a2a', border: '1px solid #333', cursor: 'pointer'
                  }}>✏️</button>
                  <button onClick={() => excluirProduto(prod.id)} style={{
                    padding: '8px 12px', borderRadius: 8, fontSize: 18,
                    background: '#3d1010', border: '1px solid #333', cursor: 'pointer'
                  }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {formAberto && (
        <FormProduto
          produto={produtoEditando}
          categorias={categorias}
          onSalvar={salvarProduto}
          onCancelar={() => { setFormAberto(false); setProdutoEditando(null) }}
        />
      )}
    </div>
  )
}