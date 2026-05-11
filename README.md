# Biblioteca - Gerenciamento de Livros (CRUD)

Aplicativo CRUD para gerenciar uma coleção de livros, desenvolvido em **Next.js** com **Supabase** como banco de dados.

---

## Informações do Aluno

- **Nome:** Mateus Martins Porto

---

## Link do Repositório

[INSERIR LINK DO GITHUB AQUI]

---

## Prints da Aplicação

### 1. Listagem de Livros
![Listagem de Livros](./prints/listagem.png)

### 2. Formulário de Cadastro
![Formulário de Cadastro](./prints/formulario.png)

### 3. API/Banco de Dados
![Banco de Dados Supabase](./prints/banco-dados.png)

---

## Respostas das Questões

### 1. O que é CRUD e qual a sua importância no desenvolvimento de aplicações?

**CRUD** é um acrônimo para as quatro operações básicas de persistência de dados:

- **C**reate (Criar) - Inserir novos registros no banco de dados
- **R**ead (Ler) - Buscar e exibir registros existentes
- **U**pdate (Atualizar) - Modificar registros existentes
- **D**elete (Excluir) - Remover registros do banco de dados

**Importância:** O CRUD é fundamental porque representa as operações essenciais que qualquer aplicação precisa realizar para gerenciar dados. Seja um sistema de e-commerce, rede social, ou gestão empresarial, todas essas aplicações dependem dessas quatro operações para funcionar. Dominar o CRUD é a base para desenvolver qualquer sistema que trabalhe com persistência de dados.

---

### 2. Explique o papel de cada componente criado no projeto

#### **Navbar (components/navbar.tsx)**
Componente de navegação que aparece no topo de todas as páginas. Contém o logo da aplicação e links para navegar entre a lista de livros e o formulário de cadastro. Utiliza o componente `Link` do Next.js para navegação sem recarregar a página.

#### **BookList (components/book-list.tsx)**
Componente responsável por exibir a lista de livros em formato de cards. Suas responsabilidades incluem:
- Buscar os livros do banco de dados usando SWR
- Exibir cada livro com título, autor, descrição, ano e gênero
- Fornecer botões de ação para editar e excluir cada livro
- Gerenciar o diálogo de confirmação de exclusão

#### **BookForm (components/book-form.tsx)**
Componente de formulário reutilizável para criar e editar livros. Características:
- Recebe um `book` opcional como prop (se existir, está em modo edição)
- Gerencia o estado do formulário com `useState`
- Valida os campos obrigatórios (título e autor)
- Envia os dados para o Supabase e redireciona após sucesso

---

### 3. Como funciona a comunicação entre o frontend e o backend (API)?

Neste projeto, a comunicação acontece da seguinte forma:

1. **Cliente Supabase:** Criamos um cliente Supabase no arquivo `lib/supabase/client.ts` que se conecta ao banco de dados usando as credenciais de ambiente.

2. **Operações de Leitura (Read):**
   ```typescript
   const { data, error } = await supabase
     .from('books')
     .select('*')
     .order('created_at', { ascending: false })
   ```
   O Supabase traduz isso para uma query SQL `SELECT * FROM books ORDER BY created_at DESC`

3. **Operações de Escrita (Create/Update):**
   ```typescript
   // Criar
   await supabase.from('books').insert({ title, author, ... })
   
   // Atualizar
   await supabase.from('books').update({ title, author, ... }).eq('id', bookId)
   ```

4. **Operações de Exclusão (Delete):**
   ```typescript
   await supabase.from('books').delete().eq('id', bookId)
   ```

5. **Cache e Revalidação:** Utilizamos a biblioteca SWR para cachear os dados e revalidar automaticamente quando necessário, proporcionando uma experiência mais fluida.

---

### 4. Qual a diferença entre criar um novo livro e editar um existente no contexto do formulário?

| Aspecto | Criar Novo Livro | Editar Livro Existente |
|---------|------------------|------------------------|
| **Rota** | `/books/new` | `/books/[id]/edit` |
| **Prop `book`** | `undefined` | Objeto com dados do livro |
| **Estado inicial** | Campos vazios | Campos preenchidos com dados existentes |
| **Operação Supabase** | `INSERT` - cria novo registro | `UPDATE` - modifica registro existente |
| **Título do formulário** | "Adicionar Novo Livro" | "Editar Livro" |
| **Texto do botão** | "Adicionar Livro" | "Salvar Alterações" |

O componente `BookForm` é inteligente o suficiente para detectar se está em modo de criação ou edição verificando se a prop `book` foi passada:

```typescript
const isEditing = !!book

// Se estiver editando, usa UPDATE; senão, usa INSERT
if (isEditing && book) {
  await supabase.from('books').update(bookData).eq('id', book.id)
} else {
  await supabase.from('books').insert(bookData)
}
```

---

### 5. Por que utilizamos um banco de dados ao invés de armazenamento local?

1. **Persistência Real:** localStorage é limitado ao navegador do usuário. Se ele trocar de dispositivo ou limpar os dados do navegador, tudo é perdido. Um banco de dados mantém os dados seguros no servidor.

2. **Compartilhamento:** Com um banco de dados, múltiplos usuários podem acessar e manipular os mesmos dados simultaneamente.

3. **Escalabilidade:** Bancos de dados são projetados para lidar com grandes volumes de dados e consultas complexas.

4. **Segurança:** O Supabase oferece Row Level Security (RLS), permitindo controlar quem pode acessar ou modificar cada registro.

5. **Backup e Recuperação:** Bancos de dados profissionais oferecem backups automáticos e recuperação de desastres.

---

## Tecnologias Utilizadas

- **Next.js 16** - Framework React com App Router
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes de interface
- **Supabase** - Banco de dados PostgreSQL + API
- **SWR** - Cache e revalidação de dados

---

## Como Executar o Projeto

```bash
# 1. Clonar o repositório
git clone [URL_DO_REPOSITORIO]
cd [NOME_DA_PASTA]

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
# Criar arquivo .env.local com:
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima

# 4. Executar o servidor de desenvolvimento
npm run dev

# 5. Acessar no navegador
# http://localhost:3000
```

---

## Estrutura do Projeto

```
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx             # Página inicial (lista de livros)
│   └── books/
│       ├── new/
│       │   └── page.tsx     # Página de novo livro
│       └── [id]/
│           └── edit/
│               └── page.tsx # Página de edição
├── components/
│   ├── navbar.tsx           # Barra de navegação
│   ├── book-list.tsx        # Lista de livros
│   └── book-form.tsx        # Formulário de livro
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # Cliente Supabase (browser)
│   │   └── server.ts        # Cliente Supabase (server)
│   └── types/
│       └── book.ts          # Tipos TypeScript
└── README.md                # Este arquivo
```

---

## Observações

Este projeto foi desenvolvido como exercício prático de CRUD, adaptando o conceito original (Angular + json-server) para uma stack moderna (Next.js + Supabase), demonstrando que os princípios de CRUD são universais e podem ser aplicados em qualquer tecnologia.
