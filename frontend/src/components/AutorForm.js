import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { autorService } from '../services/api';

const VAZIO = { nome: '', nacionalidade: '', dataNascimento: '' };

export default function AutorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [autor, setAutor] = useState(VAZIO);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Modo edição: carrega o autor existente
  useEffect(() => {
    if (!id) return;
    autorService
      .buscar(id)
      .then((resp) =>
        setAutor({
          nome: resp.data.nome || '',
          nacionalidade: resp.data.nacionalidade || '',
          dataNascimento: resp.data.dataNascimento || '',
        })
      )
      .catch(() => setErro('Autor não encontrado.'));
  }, [id]);

  const alterar = (e) => setAutor({ ...autor, [e.target.name]: e.target.value });

  const salvar = async (e) => {
    e.preventDefault();
    setErro('');
    setSalvando(true);
    // campos vazios viram null (a data precisa ser AAAA-MM-DD ou null)
    const payload = {
      nome: autor.nome.trim(),
      nacionalidade: autor.nacionalidade.trim() || null,
      dataNascimento: autor.dataNascimento || null,
    };
    try {
      if (id) {
        await autorService.atualizar(id, payload);
      } else {
        await autorService.criar(payload);
      }
      navigate('/autores');
    } catch (err) {
      setErro('Não foi possível salvar. Confira os campos e tente de novo.');
      setSalvando(false);
    }
  };

  return (
    <section>
      <div className="cabecalho-pagina">
        <h2>{id ? 'Editar autor' : 'Novo autor'}</h2>
      </div>

      <form className="formulario" onSubmit={salvar}>
        {erro && <div className="mensagem-erro" role="alert">{erro}</div>}

        <div className="campo">
          <label htmlFor="nome">Nome</label>
          <input id="nome" name="nome" value={autor.nome} onChange={alterar} required maxLength={100} />
        </div>

        <div className="campo">
          <label htmlFor="nacionalidade">Nacionalidade</label>
          <input id="nacionalidade" name="nacionalidade" value={autor.nacionalidade} onChange={alterar} maxLength={50} />
        </div>

        <div className="campo">
          <label htmlFor="dataNascimento">Data de nascimento</label>
          <input id="dataNascimento" name="dataNascimento" type="date" value={autor.dataNascimento} onChange={alterar} />
        </div>

        <div className="botoes">
          <button type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar autor'}</button>
          <Link className="botao secundario" to="/autores">Cancelar</Link>
        </div>
      </form>
    </section>
  );
}
