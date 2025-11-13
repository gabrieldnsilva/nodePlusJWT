# nodePlusJWT

API de autenticação em Node.js com MVC, SQLite, bcrypt e JWT. Foco em boas práticas (SOLID, Clean Code) e testes automatizados (Jest + Supertest).

Principais recursos
- Hash de senha com bcrypt (nunca armazena senha em texto puro)
- Emissão de JWT após login
- Arquitetura MVC + Repository + Service + Utils
- SQLite (arquivo local) com bootstrap automático da tabela
- Testes de integração e unidade com banco de teste isolado

Stack
- Node.js, Express
- SQLite3
- bcrypt para hash de senha
- jsonwebtoken (JWT)
- dotenv
- Jest + Supertest

Estrutura do projeto
- src/app.js: bootstrap Express (+ /health)
- src/routes/router.js: rotas de usuário (/register, /validate)
- src/controllers/userController.js: orquestra registro e login
- src/repositories/UserRepository.js: acesso ao SQLite (CRUD)
- src/models/User.js: inicializa tabela (initTable)
- src/services/jwtService.js: assina/verifica JWT
- src/utils/password.js: hash e verificação com bcrypt
- src/config/database.js: conexão SQLite singleton
- src/db/database.sqlite: banco de desenvolvimento
- src/__tests__/*: testes unitários e de integração

Arquitetura e fluxo
- Route → Controller → Repository → DB
- Controller aplica regras (validação, hash, resposta HTTP)
- Repository executa SQL e retorna modelos
- Service (jwtService) encapsula tokens
- Utils (password) isolam detalhes de hash

Regras de segurança
- Senha: sempre hash (bcrypt), não criptografia reversível
- JWT: usado apenas após validar credenciais; nunca para “criptografar” senhas
- Payload mínimo do JWT: { id, email }
- JWT_SECRET deve ser longo e aleatório (≥ 32 bytes)

Gerando um JWT_SECRET (Linux)
- openssl rand -hex 32
- openssl rand -base64 48 | tr -d '\n'
- node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Instalação
- Node 18+ recomendado
- npm install

Configuração (.env)
- Crie .env na raiz
- Exemplo:
  JWT_SECRET=coloque_um_segredo_forte_aqui
  PORT=3000

Execução
- Desenvolvimento: npm run dev (se usar nodemon)
- Produção/local: npm start
- Healthcheck: GET http://localhost:3000/health → { "status": "UP" }

Banco de dados
- Desenvolvimento: src/db/database.sqlite (criado automaticamente)
- Testes: src/db/test/test.sqlite (isolado por NODE_ENV=test)
- A tabela users é criada no primeiro uso via User.initTable()

API
- POST /api/usuarios/register
  Body: { "email": "user@example.com", "password": "123456" }
  Regras: valida email, mínimo 6 chars, rejeita duplicados
  Retorno: 201 { id, email }
- POST /api/usuarios/validate
  Body: { "email": "user@example.com", "password": "123456" }
  Regras: compara senha via bcrypt, retorna JWT (expira em 1h)
  Retorno: 200 { token }

Exemplos com curl
- Registrar:
  curl -X POST http://localhost:3000/api/usuarios/register \
    -H "Content-Type: application/json" \
    -d '{"email":"teste@exemplo.com","password":"123456"}'
- Login:
  curl -X POST http://localhost:3000/api/usuarios/validate \
    -H "Content-Type: application/json" \
    -d '{"email":"teste@exemplo.com","password":"123456"}'

Testes automatizados (Jest + Supertest)
- Rodar testes: npm test
- Modo watch: npm run test:watch
- Características:
  - Banco de teste isolado em src/db/test/test.sqlite
  - Diretório e arquivo de teste são gerenciados nos próprios testes (beforeAll/afterAll)
  - Integração cobre /register, /validate, e /health
  - Unidade cobre utils/password e services/jwtService

Convenções e decisões
- CommonJS (require/module.exports); evite ESM
- Apenas use getConnectionDB() (singleton) para SQLite
- Repository persiste exatamente o que recebe; Controller deve enviar somente hash no register
- Erros: HTTP sem vazar detalhes sensíveis; mensagens curtas e consistentes
- Código pequeno, funções coesas e nomes explícitos