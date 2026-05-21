# TASKS — Front-end Viva Digital

Leia o `CLAUDE_FRONTEND.md` antes de começar qualquer task.
Execute as tasks **na ordem definida** — há dependências entre elas.

---

## TASK 01 — Setup do projeto

**Objetivo:** criar o projeto Angular com todas as dependências configuradas.

Passos:
1. Criar projeto Angular com `ng new viva-digital-front --standalone --routing --style=css`
2. Instalar e configurar Tailwind CSS
3. Instalar Poppins via Google Fonts no `index.html`
4. Criar os arquivos `environment.ts` e `environment.prod.ts` com `apiUrl`
5. Configurar `withCredentials: true` globalmente no `provideHttpClient` usando `withInterceptors`
6. Criar a estrutura de pastas conforme o `CLAUDE_FRONTEND.md`
7. Configurar o `tailwind.config.js` com as cores, fontes e espaçamentos do design system

**Tailwind config esperado:**
```js
theme: {
  extend: {
    colors: {
      'orange-primary': '#F97316',
      'orange-dark': '#C2410C',
      'amber-accent': '#FBBF24',
      'bg-light': '#FFFBF5',
      'bg-dark': '#1C1917',
      'surface-dark': '#292524',
      'text-muted': '#78716C',
      'border-base': '#E7E5E4',
    },
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
    borderRadius: {
      'card': '20px',
      'btn': '14px',
      'input': '12px',
    }
  }
}
```

**Critérios:**
- [ ] Projeto compila sem erros (`ng serve`)
- [ ] Poppins carregando na tela
- [ ] Cores do design system disponíveis via Tailwind
- [ ] Estrutura de pastas criada corretamente

---

## TASK 02 — Models e AuthService

**Objetivo:** criar as interfaces TypeScript e o service de autenticação.

Passos:
1. Criar as interfaces em `core/models/`: `Usuario`, `Curso`, `Categoria`, `Aula`, `ApiError`
   — conforme definido no `CLAUDE_FRONTEND.md`
2. Criar `core/services/auth.service.ts`:
   - Signal `usuarioAtual = signal<Usuario | null>(null)`
   - Método `login(email, senha): Observable<Usuario>`
   - Método `cadastro(dados): Observable<Usuario>`
   - Método `logout(): Observable<void>`
   - Método `carregarUsuarioAtual(): Observable<Usuario>` — chama `GET /usuarios/me`
   - Computed `estaAutenticado = computed(() => this.usuarioAtual() !== null)`
3. Criar `core/models/api-error.model.ts` com a interface `ApiError`

**Critérios:**
- [ ] Todas as interfaces criadas e tipadas corretamente
- [ ] `AuthService` sem `any`
- [ ] Signal `usuarioAtual` centraliza o estado de autenticação
- [ ] Todos os métodos retornam `Observable` — sem `subscribe` no service

---

## TASK 03 — AuthGuard e HttpErrorInterceptor

**Objetivo:** proteger rotas e tratar erros globais de HTTP.

Passos:
1. Criar `core/guards/auth.guard.ts`:
   - Verifica se `authService.estaAutenticado()` é verdadeiro
   - Se não: redireciona para `/login`
   - Se sim: permite acesso
2. Criar `core/interceptors/http-error.interceptor.ts`:
   - Intercepta respostas com status 401 → limpa o signal e redireciona para `/login`
   - Intercepta respostas com status 500 → loga o erro (apenas em dev)
   - Não expõe detalhes técnicos ao usuário
3. Registrar o interceptor no `app.config.ts` via `withInterceptors`

**Critérios:**
- [ ] Rota protegida redireciona para `/login` sem token
- [ ] 401 da API limpa o estado e redireciona automaticamente
- [ ] Guard funciona com o signal do `AuthService`

---

## TASK 04 — Roteamento principal

**Objetivo:** configurar todas as rotas com lazy loading.

Criar `app.routes.ts`:

```typescript
[
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component') },
  { path: 'cadastro', loadComponent: () => import('./features/auth/cadastro/cadastro.component') },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component') },
      { path: 'cursos', loadComponent: () => import('./features/cursos/listagem/cursos-listagem.component') },
      { path: 'cursos/:id', loadComponent: () => import('./features/cursos/detalhe/curso-detalhe.component') },
      { path: 'perfil', loadComponent: () => import('./features/perfil/perfil.component') },
    ]
  },
  { path: '**', redirectTo: 'login' }
]
```

**Critérios:**
- [ ] Lazy loading funcionando — cada feature carregada sob demanda
- [ ] Rotas autenticadas bloqueadas pelo guard
- [ ] Rotas públicas acessíveis sem autenticação
- [ ] Wildcard redireciona para login

---

## TASK 05 — Componentes shared

**Objetivo:** criar os componentes reutilizáveis do design system.

Componentes a criar em `shared/components/`:

**`ButtonComponent`**
- Input `label: string`
- Input `type: 'primary' | 'ghost' | 'danger'` (default: primary)
- Input `loading: boolean` (default: false)
- Input `disabled: boolean`
- Quando `loading`, exibe spinner e desabilita o botão
- Estilo conforme design system (gradiente laranja, 56px, border-radius 14px)

**`InputComponent`**
- Input `label: string`
- Input `type: string` (default: text)
- Input `placeholder: string`
- Input `error: string | null`
- Integração com Reactive Forms via `ControlValueAccessor`
- Exibe mensagem de erro abaixo do campo quando `error` não é nulo
- Label sempre visível acima

**`LoadingComponent`**
- Spinner centralizado
- Usado enquanto dados estão sendo carregados

**`CardComponent`**
- Wrapper com estilo de card do design system
- Border-radius 20px, sombra suave, padding 20px

**Critérios:**
- [ ] Componentes standalone e reutilizáveis
- [ ] `InputComponent` integrado corretamente com Reactive Forms
- [ ] `ButtonComponent` desabilita e exibe spinner durante loading
- [ ] Todos seguem o design system (cores, fontes, espaçamentos)

---

## TASK 06 — Tela de Login

**Objetivo:** implementar a tela de login conforme o protótipo.

Passos:
1. Criar `features/auth/login/login.component.ts`:
   - Reactive Form com campos `email` e `senha`
   - Validações: email obrigatório + formato válido, senha obrigatória
   - Signal `loading = signal(false)`
   - Signal `erro = signal<string | null>(null)`
   - Ao submeter: chama `authService.login()`, em sucesso navega para `/dashboard`, em erro exibe mensagem
2. Criar `login.component.html` conforme protótipo:
   - Fundo escuro `#1C1917`
   - Logo "Viva Digital" em laranja
   - Slogan em branco
   - Card branco com formulário subindo da parte inferior
   - Botão "Entrar" com gradiente laranja
   - Link para `/cadastro`

**Critérios:**
- [ ] Validação exibe erros nos campos corretos
- [ ] Loading desabilita o botão durante a requisição
- [ ] Erro da API exibido de forma clara ao usuário
- [ ] Navegação para `/dashboard` após login bem-sucedido
- [ ] Link para cadastro funciona

---

## TASK 07 — Tela de Cadastro

**Objetivo:** implementar a tela de cadastro conforme o protótipo.

Passos:
1. Criar `features/auth/cadastro/cadastro.component.ts`:
   - Reactive Form dividido em duas seções: dados pessoais e contato de emergência
   - Validações: todos os campos obrigatórios, CPF no formato `xxx.xxx.xxx-xx`, email válido, senha mínimo 6 caracteres
   - Signal `loading = signal(false)`
   - Signal `erro = signal<string | null>(null)`
   - Ao submeter: chama `authService.cadastro()`, em sucesso navega para `/dashboard`
2. Criar `cadastro.component.html` conforme protótipo:
   - Top bar com botão voltar
   - Seção "Seus dados" com header laranja
   - Seção "Contato de emergência" com header laranja
   - Botão fixo no rodapé

**Critérios:**
- [ ] Todos os campos validados corretamente
- [ ] CPF com máscara ou validação de formato
- [ ] Erro de CPF/email duplicado exibido com mensagem clara
- [ ] Botão voltar navega para `/login`

---

## TASK 08 — Layout autenticado (shell)

**Objetivo:** criar o shell com bottom navigation para as telas autenticadas.

Passos:
1. Criar `shared/components/bottom-nav/bottom-nav.component.ts`:
   - 4 itens: Início, Cursos, Progresso (desabilitado — fase futura), Perfil
   - Item ativo detectado via `Router` e `url` atual
   - Estilo conforme design system: fundo branco com blur, pílula laranja no item ativo
2. Incluir o `BottomNavComponent` nas telas: dashboard, cursos, perfil

**Critérios:**
- [ ] Item ativo destacado corretamente conforme rota
- [ ] Navegação entre tabs funciona
- [ ] Progresso aparece visualmente mas sem navegação (fase futura)

---

## TASK 09 — Dashboard

**Objetivo:** implementar a tela inicial após login.

Passos:
1. Criar `features/dashboard/dashboard.service.ts`:
   - Método `carregarDados()`: chama `GET /cursos?status=ATIVO` e `GET /categorias?status=ATIVA` em paralelo com `forkJoin`
2. Criar `features/dashboard/dashboard.component.ts`:
   - Signal `cursos = signal<Curso[]>([])`
   - Signal `categorias = signal<Categoria[]>([])`
   - Signal `loading = signal(true)`
   - Carrega dados no `ngOnInit`
   - Exibe o primeiro curso em andamento no card de destaque
3. Criar `dashboard.component.html` conforme protótipo:
   - Header escuro com saudação usando `authService.usuarioAtual()?.nomeCompleto`
   - Card de destaque "Continuar de onde parou"
   - Grid de categorias
   - Bottom navigation

**Critérios:**
- [ ] Saudação exibe o nome real do usuário logado
- [ ] Dados carregados da API
- [ ] Loading exibido enquanto carrega
- [ ] Erro exibido se API falhar
- [ ] Clique no card de destaque navega para `/cursos/:id`

---

## TASK 10 — Listagem de Cursos

**Objetivo:** implementar a tela de listagem de cursos.

Passos:
1. Criar `features/cursos/cursos.service.ts`:
   - Método `listar(): Observable<Curso[]>` — `GET /cursos?status=ATIVO`
   - Método `buscarPorId(id): Observable<Curso>` — `GET /cursos/:id`
2. Criar `features/cursos/listagem/cursos-listagem.component.ts`:
   - Signal `cursos = signal<Curso[]>([])`
   - Signal `categorias = signal<Categoria[]>([])`
   - Signal `filtroAtivo = signal<string>('Todos')`
   - Signal `termoBusca = signal<string>('')`
   - Computed `cursosFiltrados` — filtra por categoria e termo de busca
   - Signal `loading = signal(true)`
3. Criar `cursos-listagem.component.html` conforme protótipo:
   - Top bar com botão voltar
   - Campo de busca
   - Chips de filtro por categoria
   - Lista de cards de curso

**Critérios:**
- [ ] Filtro por categoria funciona
- [ ] Busca por nome funciona (client-side)
- [ ] Clique no card navega para `/cursos/:id`
- [ ] Loading e erro tratados

---

## TASK 11 — Detalhe do Curso

**Objetivo:** implementar a tela de detalhe do curso com lista de aulas.

Passos:
1. Criar `features/cursos/detalhe/curso-detalhe.component.ts`:
   - Lê o `id` da rota via `ActivatedRoute`
   - Carrega `GET /cursos/:id` e `GET /aulas/curso/:id` em paralelo
   - Signal `curso = signal<Curso | null>(null)`
   - Signal `aulas = signal<Aula[]>([])`
   - Signal `loading = signal(true)`
2. Criar `curso-detalhe.component.html` conforme protótipo:
   - Hero escuro com nome do curso
   - Chips de metadados (nível, duração, total de aulas)
   - Descrição
   - Lista de aulas ordenadas por `ordem`
   - Botão fixo no rodapé

**Critérios:**
- [ ] Dados carregados corretamente para o curso da rota
- [ ] Aulas exibidas em ordem
- [ ] Botão voltar navega para `/cursos`
- [ ] Loading e erro tratados

---

## TASK 12 — Perfil

**Objetivo:** implementar a tela de perfil com visualização e edição.

Passos:
1. Criar `features/perfil/perfil.service.ts`:
   - Método `editar(dados): Observable<Usuario>` — `PUT /usuarios/me`
2. Criar `features/perfil/perfil.component.ts`:
   - Lê `authService.usuarioAtual()` para exibir os dados
   - Signal `modoEdicao = signal(false)`
   - Reactive Form preenchido com os dados atuais ao entrar em modo edição
   - Ao salvar: chama `perfilService.editar()` e atualiza o signal `usuarioAtual` no `AuthService`
   - Signal `loading = signal(false)`
3. Criar `perfil.component.html` conforme protótipo:
   - Header escuro com avatar e nome
   - Cards de dados pessoais e contato de emergência
   - Botão "Editar perfil" alterna para modo edição
   - Em modo edição: campos editáveis + botão "Salvar"
   - Botão "Sair" chama `authService.logout()` e navega para `/login`

**Critérios:**
- [ ] Dados do usuário logado exibidos corretamente
- [ ] Edição atualiza o signal global do `AuthService`
- [ ] Logout limpa o estado e redireciona para `/login`
- [ ] Loading e erro tratados

---

## Ordem de execução recomendada

```
01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09 → 10 → 11 → 12
```

Cada task é atômica e entregável. Não avance para a próxima sem os critérios da atual satisfeitos.