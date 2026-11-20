import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { autorService } from '../services/api';

function formatarData(iso) {
  if (!iso) return '—';
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

export default function AutorList() {
  const [autores, setAutores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    autorService
      .listar()
      .then((resp) => setAutores(resp.data))
      .catch(() => setErro('Não foi possível carregar os autores. Verifique se o backend está no ar.'))
      .finally(() => setCarregando(false));
  }, []);

  const excluir = async (autor) => {
    if (!window.confirm(`Excluir o autor "${autor.nome}"?`)) return;
    setErro('');
    try {
      await autorService.deletar(autor.id);
      setAutores((atual) => atual.filter((a) => a.id !== autor.id));
    } catch (e) {
      if (e.response && e.response.status === 409) {
        setErro(`"${autor.nome}" tem livros cadastrados. Exclua os livros antes de excluir o autor.`);
      } else {
        setErro('Não foi possível excluir o autor.');
      }
    }
  };

  return (
    <section>
      <div className="cabecalho-pagina">
        <h2>Autores</h2>
        <Link className="botao" to="/autores/novo">Novo autor</Link>
      </div>

      {erro && <div className="mensagem-erro" role="alert">{erro}</div>}

      {carregando ? (
        <p className="vazio">Carregando autores...</p>
      ) : autores.length === 0 ? (
        <p className="vazio">Nenhum autor cadastrado. Clique em “Novo autor” para começar.</p>
      ) : (
        <div className="tabela-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Nacionalidade</th>
                <th>Nascimento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {autores.map((autor) => (
                <tr key={autor.id}>
                  <td>{autor.nome}</td>
                  <td>{autor.nacionalidade || '—'}</td>
                  <td>{formatarData(autor.dataNascimento)}</td>
                  <td className="acoes">
                    <Link className="botao secundario" to={`/autores/editar/${autor.id}`}>Editar</Link>
                    <button type="button" className="perigo" onClick={() => excluir(autor)}>Excluir</button>
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
