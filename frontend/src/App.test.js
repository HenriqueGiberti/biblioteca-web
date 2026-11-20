import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { autorService } from './services/api';

// Evita carregar o axios (e chamadas HTTP reais) no Jest
jest.mock('./services/api', () => ({
  autorService: { listar: jest.fn() },
  livroService: { listar: jest.fn() },
}));

beforeEach(() => {
  autorService.listar.mockResolvedValue({ data: [] });
});

test('mostra o menu e a lista de autores vazia na página inicial', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByRole('link', { name: 'Autores' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Livros' })).toBeInTheDocument();
  expect(await screen.findByText(/Nenhum autor cadastrado/i)).toBeInTheDocument();
});
