import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { autorService, livroService } from '../services/api';

const VAZIO = { titulo: '', isbn: '', anoPublicacao: '', genero: '', autorId: '' };

export default function LivroForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [livro, setLivro] = useState(VAZIO);
  const [autores, setAutores] = useState([]);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Carrega os autores para o <select> (igual ao select de contatos do CompromissoForm)
  useEffect(() => {
    autorService
      .listar()
      .then((resp) => setAutores(resp.data))
      .catch(() => setErro('Não foi possível carregar os autores.'));
  }, []);

  // Modo edição: carrega o livro existente
  useEffect(() => {
    if (!id) return;
    livroService
      .buscar(id)
      .then((resp) => {
        const l = resp.data;
        setLivro({
          titulo: l.titulo || '',
          isbn: l.isbn || '',
          anoPublicacao: l.anoPublicacao ?? '',
          genero: l.genero || '',
          autorId: l.autor ? String(l.autor.id) : '',
        });
      })
      .catch(() => setErro('Livro não encontrado.'));
  }, [id]);

  const alterar = (e) => setLivro({ ...livro, [e.target.name]: e.target.value });

  const salvar = async (e) => {
    e.preventDefault();
    setErro('');
    if (!livro.autorId) {
      setErro('Escolha o autor do livro.');
      return;
    }
    setSalvando(true);
    // O autor vai só com o id: "autor": { "id": 1 }
    const payload = {
      titulo: livro.titulo.trim(),
      isbn: livro.isbn.trim() || null,
      anoPublicacao: livro.anoPublicacao === '' ? null : Number(livro.anoPublicacao),
      genero: livro.genero.trim() || null,
      autor: { id: Number(livro.autorId) },
    };
    try {
      if (id) {
        await livroService.atualizar(id, payload);
      } else {
        await livroService.criar(payload);
      }
      navigate('/livros');
    } catch (err) {
      setErro('Não foi possível salvar. Confira os campos e tente de novo.');
      setSalvando(false);
    }
  };

  return (
    <section>
      <div className="cabecalho-pagina">
        <h2>{id ? 'Editar livro' : 'Novo livro'}</h2>
      </div>

      <form className="formulario" onSubmit={salvar}>
        {erro && <div className="mensagem-erro" role="alert">{erro}</div>}

        <div className="campo">
          <label htmlFor="titulo">Título</label>
          <input id="titulo" name="titulo" value={livro.titulo} onChange={alterar} required maxLength={200} />
        </div>

        <div className="campo">
          <label htmlFor="autorId">Autor</label>
          <select id="autorId" name="autorId" value={livro.autorId} onChange={alterar} required>
            <option value="">Selecione um autor</option>
            {autores.map((a) => (
              <option key={a.id} value={a.id}>{a.nome}</option>
            ))}
          </select>
          {autores.length === 0 && (
            <small>Nenhum autor cadastrado. <Link to="/autores/novo">Cadastre um autor</Link> primeiro.</small>
          )}
        </div>

        <div className="campo">
          <label htmlFor="genero">Gênero</label>
          <input id="genero" name="genero" value={livro.genero} onChange={alterar} maxLength={50} />
        </div>

        <div className="campo">
          <label htmlFor="anoPublicacao">Ano de publicação</label>
          <input id="anoPublicacao" name="anoPublicacao" type="number" value={livro.anoPublicacao} onChange={alterar} />
        </div>

        <div className="campo">
          <label htmlFor="isbn">ISBN</label>
          <input id="isbn" name="isbn" value={livro.isbn} onChange={alterar} maxLength={20} />
        </div>

        <div className="botoes">
          <button type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar livro'}</button>
          <Link className="botao secundario" to="/livros">Cancelar</Link>
        </div>
      </form>
    </section>
  );
}
