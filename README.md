# Biblioteca Web

Sistema web para cadastro de **Autores** e **Livros** (CRUD completo dos dois).
Cada livro é escrito por um autor e um autor pode ter vários livros (relacionamento **1 : N**).
Projeto da disciplina de Engenharia de Software (Prof. Sandro Laudares), no mesmo fluxo do projeto Agenda Web.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Backend | Java 17 + Spring Boot 3.2 (Web, Data JPA, Validation, Lombok) + Maven |
| Frontend | React 18 + React Router 6 + Axios • Node.js 20 + npm |
| Banco de dados | PostgreSQL 15 (testes: H2 em memória) |
| Testes | JUnit 5 + Mockito (`@WebMvcTest`, `@MockBean`, MockMvc) • `@SpringBootTest` • Jest • JaCoCo |
| Versão e CI | Git + GitHub • GitHub Actions |
| Containers | Docker + Docker Compose |

## Modelo de dados

```
AUTORES (id PK, nome, nacionalidade, data_nascimento, criado_em)
   1 ──< escreve >── N
LIVROS  (id PK, titulo, isbn, ano_publicacao, genero, autor_id FK, criado_em)
```

## Estrutura de pastas

```
biblioteca-web/
├── backend/
│   ├── pom.xml e Dockerfile
│   └── src/
│       ├── main/java/com/biblioteca/{model, repository, controller}
│       ├── main/resources/application.properties
│       └── test/ (AutorControllerTest, LivroControllerTest, IntegracaoTest, application-test.properties)
├── frontend/
│   ├── package.json, Dockerfile, nginx.conf, public/
│   └── src/{components, services, App.js, App.css, index.js}
├── docker-compose.yml
├── .github/workflows/ci-cd.yml
└── README.md
```

## Endpoints REST

| Verbo | URL | Ação | Status |
|---|---|---|---|
| POST | `/api/autores` | Criar autor | 201 |
| GET | `/api/autores` | Listar (ordem: nome) | 200 |
| GET | `/api/autores/{id}` | Buscar um | 200 / 404 |
| PUT | `/api/autores/{id}` | Atualizar | 200 / 404 |
| DELETE | `/api/autores/{id}` | Remover | 200 / 404 / 409 (tem livros) |
| POST | `/api/livros` | Criar livro ligado a um autor | 201 |
| GET | `/api/livros` | Listar (ordem: título) | 200 |
| GET | `/api/livros/{id}` | Buscar um | 200 / 404 |
| PUT | `/api/livros/{id}` | Atualizar (inclusive o autor) | 200 / 404 |
| DELETE | `/api/livros/{id}` | Remover | 200 / 404 |
| GET | `/api/livros/autor/{autorId}` | Livros de um autor (extra) | 200 |

Exemplo de JSON para criar um livro (o autor vai só com o id):

```json
{ "titulo": "Dom Casmurro", "isbn": "978-8535910667", "anoPublicacao": 1899,
  "genero": "Romance", "autor": { "id": 1 } }
```

Swagger: http://localhost:8080/swagger-ui.html

## Como executar

### Tudo com Docker (recomendado)

```bash
docker-compose up -d --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8080/api/autores
- PostgreSQL: `localhost:5432` (banco `biblioteca_db`, usuário/senha `postgres`/`postgres`)

Para parar: `docker-compose down` (use `-v` para apagar também os dados).

### Em modo de desenvolvimento

```bash
# 1) só o banco
docker-compose up -d postgres

# 2) backend (porta 8080)
cd backend && mvn spring-boot:run

# 3) frontend (porta 3000)
cd frontend && npm install && npm start
```

## Como rodar os testes

```bash
# Backend: unitários (controllers) + integração (H2, perfil "test")
cd backend
mvn test -Dtest="*ControllerTest"      # só unitários
mvn test -Dtest="IntegracaoTest"       # só integração
mvn test                               # todos (+ relatório JaCoCo em target/site/jacoco)

# Frontend
cd frontend
npm test -- --watchAll=false
```

## Testes de aceitação (curl)

```bash
curl -X POST http://localhost:8080/api/autores -H "Content-Type: application/json" \
  -d '{"nome":"Machado de Assis","nacionalidade":"Brasileira","dataNascimento":"1839-06-21"}'

curl -X POST http://localhost:8080/api/livros -H "Content-Type: application/json" \
  -d '{"titulo":"Dom Casmurro","isbn":"978-8535910667","anoPublicacao":1899,"genero":"Romance","autor":{"id":1}}'
```

## CI (GitHub Actions)

A cada push ou Pull Request na `main`: testes do backend (Java 17 + JaCoCo), testes e build do frontend (Node 20)
e, como extra, subida dos containers com testes de aceitação via curl.

## Divisão do trabalho

| Integrante | Responsabilidade | Branch |
|---|---|---|
| Augusto Stambassi – DEV 1 | CRUD de Autores: `Autor`, `AutorRepository`, `AutorController`, `AutorControllerTest`, `AutorList.js`, `AutorForm.js` | `feature/autores` |
| Henrique Giberti – DEV 2 | CRUD de Livros: `Livro`, `LivroRepository`, `LivroController`, `LivroControllerTest`, `LivroList.js`, `LivroForm.js` | `feature/livros` |

Arquivos comuns (`api.js`, `App.js`, `docker-compose.yml`, CI, README) foram divididos entre a dupla.
Cada integrante revisou o Pull Request do outro.

**Integrantes:** _(preencher nomes)_
