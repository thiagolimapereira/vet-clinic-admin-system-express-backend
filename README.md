# Sistema de Gerenciamento de Clínicas Veterinárias

## 1. Introdução

Este projeto consiste em um **Sistema de Gerenciamento Administrativo para Clínicas Veterinárias**, agora desenvolvido em **Node.js** com **Express.js**. O objetivo é manter um backend capaz de organizar o ciclo completo de operações da clínica.

O sistema cobre as seguintes áreas de negócio:

- **Gestão de Pessoas e Clientes:** Controle de cadastro de tutores e veterinários.
- **Gestão de Pets:** Cadastro detalhado de animais, incluindo dados biométricos e de identificação.
- **Gestão de Atendimentos:** Marcação e acompanhamento de consultas.
- **Gestão de Prontuários:** Manutenção de históricos clínicos detalhados.
- **Gestão Financeira:** Registro e controle de pagamentos e serviços.

A primeira entrega foca na solidez do modelo de dados e na exposição de **CRUDs REST** para as principais entidades do domínio.

---

## 2. Tecnologias e Dependências

- **Node.js** e **Express.js** para o servidor HTTP e roteamento.
- **Prisma** (`prisma` e `@prisma/client`) para modelagem e acesso ao banco.
- **SQLite** (por padrão via `DATABASE_URL`) como banco local de desenvolvimento.
- **dotenv** para carregamento de variáveis de ambiente.
- **cors** para habilitar o consumo do backend por aplicações front-end.
- **ts-node-dev** e **typescript** para desenvolvimento em TypeScript com recarga automática.

Consulte `package.json` para a lista completa de dependências e scripts disponíveis.

---

## 3. Estrutura do Projeto

A aplicação segue uma organização inspirada em **MVC**: rotas direcionam requisições para **controllers** que orquestram regras de negócio e persistência através do Prisma.

```
.
├── prisma/
│   ├── schema.prisma        # Modelo de dados (Prisma) e configuração do datasource
│   ├── dev.db               # Banco SQLite usado em desenvolvimento
│   └── migrations/          # Migrações geradas pelo Prisma
├── src/
│   ├── app.ts               # Configuração do Express (middlewares, CORS, rotas)
│   ├── server.ts            # Ponto de entrada do servidor HTTP
│   ├── controllers/         # Lógica de negócio de cada entidade
│   │   ├── appointments.ts
│   │   ├── people.ts
│   │   ├── pets.ts
│   │   └── vets.ts
│   ├── routes/              # Definição das rotas REST e mapeamento para controllers
│   │   ├── appointments.ts
│   │   ├── people.ts
│   │   ├── pets.ts
│   │   └── vets.ts
│   ├── middlewares/         # Tratamento de erros e rotas inexistentes
│   │   ├── errorHandlerMiddleware.ts
│   │   └── notFoundMiddleware.ts
│   └── errors/              # Classes de erro customizadas
│       └── custom-error.ts
├── package.json             # Scripts NPM e dependências
├── tsconfig.json            # Configuração do TypeScript
└── README.md
```

---

## 4. Instalação e Execução

### Pré-requisitos
- Node.js (>= 18) e NPM instalados.

### Passos
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure as variáveis de ambiente em um arquivo `.env` na raiz do projeto:
   ```env
   DATABASE_URL="file:./prisma/dev.db"   # URL do banco (SQLite por padrão)
   PORT=3000                             # Opcional: porta HTTP
   ```
   > Ajuste `DATABASE_URL` conforme o banco desejado (PostgreSQL, MySQL, etc.).
3. Gere o client do Prisma (necessário após mudanças em `schema.prisma` ou em um ambiente novo):
   ```bash
   npx prisma generate
   ```
4. Execute as migrações (opcional se já estiver usando `dev.db` existente):
   ```bash
   npx prisma migrate dev
   ```
5. Suba o servidor em modo desenvolvimento com recarga automática:
   ```bash
   npm run dev
   ```
   Para ambiente de produção, faça o build e execute a versão compilada:
   ```bash
   npm run build
   npm start
   ```

O servidor fica acessível em `http://localhost:<PORT>` (padrão `3000`).

---

## 5. Funcionalidades e Rotas Principais

As rotas são expostas em formato REST e retornam JSON. Cada entidade oferece operações de **CRUD**:

### Pessoas (Tutores e base de Veterinários)
- `GET /people` — lista todas as pessoas cadastradas.
- `GET /people/:id` — consulta pessoa pelo ID.
- `POST /people` — cria uma nova pessoa.
- `PUT /people/:id` — atualiza dados da pessoa.
- `DELETE /people/:id` — remove uma pessoa.

### Veterinários
- `GET /vets` — lista veterinários com dados pessoais e atendimentos.
- `GET /vets/:id` — consulta veterinário pelo ID.
- `POST /vets` — cria um veterinário a partir de uma pessoa existente (usa `id` da pessoa).
- `PUT /vets/:id` — atualiza dados do veterinário.
- `DELETE /vets/:id` — remove um veterinário.

### Pets
- `GET /pets` — lista pets com tutor e histórico de atendimentos.
- `GET /pets/:id` — consulta pet pelo ID.
- `POST /pets` — cria pet vinculado a um tutor (`personId`).
- `PUT /pets/:id` — atualiza dados do pet (inclui troca de tutor).
- `DELETE /pets/:id` — remove um pet.

### Atendimentos (Appointments)
- `GET /appointments` — lista consultas com dados de pet e veterinário.
- `GET /appointments/:id` — consulta atendimento específico.
- `POST /appointments` — cria um novo atendimento.
- `PUT /appointments/:id` — atualiza um atendimento.
- `DELETE /appointments/:id` — exclui um atendimento.

---

## 6. Observações Finais

- O middleware de **CORS** está configurado para permitir acesso de `http://localhost:8080`. Ajuste conforme o front-end que consumirá a API.
- O middleware de erros padroniza respostas para exceções conhecidas (`CustomAPIError`) e retorna `500` para falhas não tratadas.
- O `schema.prisma` contém enums e relacionamentos que refletem o domínio (pessoas, veterinários, pets e atendimentos). Atualize-o conforme novas necessidades do negócio e regenere o client do Prisma após mudanças.
