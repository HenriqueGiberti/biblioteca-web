# Guia da dupla – roteiro de Git e entrega (apague este arquivo antes de entregar, se quiser)

## Passo 1 – DEV 1: repositório e estrutura
```bash
cd biblioteca-web
npm install --prefix frontend          # gera frontend/package-lock.json (OBRIGATÓRIO para o npm ci do CI)
git init
git add .
git commit -m "chore: estrutura inicial da Biblioteca Web"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/biblioteca-web.git
git push -u origin main
```
DEV 2: `git clone https://github.com/SEU_USUARIO/biblioteca-web.git`

## Passo 2 – Branches
- DEV 1: `git checkout -b feature/autores`
- DEV 2: `git checkout -b feature/livros`

## Quem faz o quê (os arquivos já estão prontos – cada um commita a sua parte)
**DEV 1 – feature/autores**
```bash
git add backend/src/main/java/com/biblioteca/model/Autor.java backend/src/main/java/com/biblioteca/repository/AutorRepository.java
git commit -m "feat: Autor entity + repository"
git add backend/src/main/java/com/biblioteca/controller/AutorController.java
git commit -m "feat: AutorController (CRUD)"
git add backend/src/test/java/com/biblioteca/controller/AutorControllerTest.java
git commit -m "test: AutorControllerTest"
git add frontend/src/components/AutorList.js frontend/src/components/AutorForm.js
git commit -m "feat: telas de Autores (lista e formulario)"
git push origin feature/autores
```
**DEV 2 – feature/livros**
```bash
git add backend/src/main/java/com/biblioteca/model/Livro.java backend/src/main/java/com/biblioteca/repository/LivroRepository.java
git commit -m "feat: Livro entity + repository"
git add backend/src/main/java/com/biblioteca/controller/LivroController.java
git commit -m "feat: LivroController (CRUD)"
git add backend/src/test/java/com/biblioteca/controller/LivroControllerTest.java
git commit -m "test: LivroControllerTest"
git add frontend/src/components/LivroList.js frontend/src/components/LivroForm.js
git commit -m "feat: telas de Livros (lista e formulario com select de autor)"
git push origin feature/livros
```
> Dica: para o histórico ficar realista, o DEV 1 deve deixar na `main` apenas a estrutura base
> (pom, package.json, Dockerfiles, App.js, api.js etc.) e cada dev adiciona na sua branch os arquivos da sua parte.
> `Autor.java` e `Livro.java` precisam existir juntos para compilar: faça o merge do PR de Autores primeiro e
> dê `git pull origin main` na branch de Livros antes de rodar `mvn test`.

## Passo 10 – Pull Requests
1. No GitHub, abra o PR de cada branch para `main`.
2. O colega deixa **pelo menos 1 comentário de revisão** e faz o merge.
3. Os dois: `git checkout main && git pull origin main`.

## Checklist de prints para entregar
- [ ] `mvn test` com BUILD SUCCESS
- [ ] Telas: lista e formulário de Autores; lista e formulário de Livros (com select de autor)
- [ ] curl/Postman/Swagger criando livro vinculado a autor
- [ ] Aba Actions do GitHub com o CI verde
- [ ] Link do repositório (com branches feature/autores e feature/livros e 2 PRs revisados)
