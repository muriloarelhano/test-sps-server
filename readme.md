# Como rodar 

Primeiramente o projeto está no formado ESM não CJS como antes, atente-se ao package json, use o YARN para instalar as dependências do projeto antes de tudo.

1. Use o docker compose `docker compose up -d` para iniciar o banco de dados
2. Aplique as migrações do banco usando a ferramenta do drizzle `yarn drizzle-kit push`
3. Apenas rodar o `yarn dev`

# Teste NODE Server

- Criar um CRUD (API REST) em node para cadastro de usuários
- Para a criação do teste utilizar um repositório fake dos usuários. (Pode ser em memória)

## Regras

- Deve existir um usuário admin previamente cadastrado para utilizar autenticação (não precisa criptografar a senha);
  {
    name: "admin",
    email: "admin@spsgroup.com.br",
    type: "admin"
    password: "1234"
  }

- Criar rota de autenticação (Jwt token)
- As rotas da API só podem ser executadas se estiver autenticada
- Deve ser possível adicionar usuários. Campos: email, nome, type, password
- Não deve ser possível cadastrar o e-mail já cadastrado
- Deve ser possível remover usuário
- Deve ser possível alterar os dados do usuário

