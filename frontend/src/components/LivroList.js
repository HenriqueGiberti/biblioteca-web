import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { livroService } from '../services/api';

export default function LivroList() {
  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    livroService
      .listar()
      .then((resp) => setLivros(resp.data))
      .catch(() => setErro('Não foi possível carregar os livros. Verifique se o backend está no ar.'))
      .finally(() => setCarregando(false));
  }, []);

  const excluir = async (livro) => {
    if (!window.confirm(`Excluir o livro "${livro.titulo}"?`)) return;
    setErro('');
    try {
      await livroService.deletar(livro.id);
      setLivros((atual) => atual.filter((l) => l.id !== livro.id));
    } catch (e) {
      setErro('Não foi possível excluir o livro.');
    }
  };

  return (
    <section>
      <div className="cabecalho-pagina">
        <h2>Livros</h2>
        <Link className="botao" to="/livros/novo">Novo livro</Link>
      </div>

      {erro && <div className="mensagem-erro" role="alert">{erro}</div>}

      {carregando ? (
        <p className="vazio">Carregando livros...</p>
      ) : livros.length === 0 ? (
        <p className="vazio">Nenhum livro cadastrado. Cadastre um autor e depois clique em “Novo livro”.</p>
      ) : (
        <div className="tabela-wrap">
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Gênero</th>
                <th>Ano</th>
                <th>ISBN</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {livros.map((livro) => (
                <tr key={livro.id}>
                  <td>{livro.titulo}</td>
                  <td>{livro.autor ? livro.autor.nome : '—'}</td>
                  <td>{livro.genero || '—'}</td>
                  <td>{livro.anoPublicacao ?? '—'}</td>
                  <td>{livro.isbn || '—'}</td>
                  <td className="acoes">
                    <Link className="botao secundario" to={`/livros/editar/${livro.id}`}>Editar</Link>
                    <button type="button" className="perigo" onClick={() => excluir(livro)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
