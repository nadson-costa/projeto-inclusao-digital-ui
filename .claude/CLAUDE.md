# CLAUDE.md — Viva Digital (Front-end)

## Visão geral

Aplicação web mobile-first em Angular para o sistema de inclusão digital Viva Digital.
Consome a API REST do back-end Spring Boot via HTTP com autenticação por Cookie HttpOnly.

## Stack

- Angular 19+ (standalone components)
- Tailwind CSS 3.x
- Angular Signals (gerenciamento de estado)
- Angular HTTP Client
- Angular Router com lazy loading

## Design System

Baseado no protótipo aprovado. Tom: caloroso e familiar.

### Paleta
```
--orange-primary: #F97316
--orange-dark:    #C2410C
--amber-accent:   #FBBF24
--bg-light:       #FFFBF5
--bg-dark:        #1C1917
--surface-light:  #FFFFFF
--surface-dark:   #292524
--text-light:     #1C1917
--text-dark:      #FAFAF9
--text-muted:     #78716C
--border:         #E7E5E4
```

### Tipografia
- Fonte: Poppins (Google Fonts)
- Corpo base: 20px / line-height 1.7
- Fonte mínima: 16px (acessibilidade)

### Componentes base
- Botão primário: gradiente laranja, height 56px, border-radius 14px
- Inputs: height 56px, border-radius 12px, border 2px, label visível acima
- Cards: border-radius 20px, sombra `0 4px 20px rgba(0,0,0,0.08)`
- Chips: border-radius 999px, fonte 14px peso 700
- Touch targets mínimos: 48x48px (acessibilidade)

## Arquitetura

Organização **por feature**, com lazy loading em cada módulo.
Standalone components — sem NgModules desnecessários.

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interceptors/
│   │   └── http-error.interceptor.ts
│   ├── services/
│   │   └── auth.service.ts
│   └── models/
│       └── api-error.model.ts
├── shared/
│   ├── components/
│   │   ├── button/
│   │   ├── input/
│   │   ├── card/
│   │   └── loading/
│   └── pipes/
├── features/
│   ├── auth/
│   │   ├── login/
│   │   │   ├── login.component.ts
│   │   │   └── login.component.html
│   │   └── cadastro/
│   │       ├── cadastro.component.ts
│   │       └── cadastro.component.html
│   ├── dashboard/
│   │   ├── dashboard.component.ts
│   │   └── dashboard.component.html
│   ├── cursos/
│   │   ├── listagem/
│   │   │   ├── cursos-listagem.component.ts
│   │   │   └── cursos-listagem.component.html
│   │   └── detalhe/
│   │       ├── curso-detalhe.component.ts
│   │       └── curso-detalhe.component.html
│   └── perfil/
│       ├── perfil.component.ts
│       └── perfil.component.html
└── app.routes.ts
```

## Rotas

```
/login           → AuthFeature (pública)
/cadastro        → AuthFeature (pública)
/dashboard       → DashboardFeature (autenticada)
/cursos          → CursosFeature (autenticada)
/cursos/:id      → CursosFeature (autenticada)
/perfil          → PerfilFeature (autenticada)
```

Rotas autenticadas protegidas pelo `AuthGuard`.
Redirect padrão: `/login`.
Após login bem-sucedido: redirect para `/dashboard`.

## Autenticação

- Token JWT armazenado em **Cookie HttpOnly** — o JavaScript não acessa o token diretamente
- O `AuthService` mantém o estado do usuário logado via `Signal<Usuario | null>`
- O `AuthGuard` verifica se há usuário no signal — se não, redireciona para `/login`
- O `HttpErrorInterceptor` captura respostas 401 e redireciona para `/login`
- Logout limpa o signal e chama `POST /auth/logout` para invalidar o cookie no servidor
- Nenhum token é lido ou manipulado pelo JavaScript — o cookie é enviado automaticamente pelo browser

## Contrato com a API

Base URL configurada via environment: `environment.apiUrl`

### Auth
```
POST /auth/cadastro     → body: CadastroRequest    → seta cookie + retorna UsuarioResponse
POST /auth/login        → body: LoginRequest        → seta cookie + retorna UsuarioResponse
POST /auth/logout       → (sem body)                → remove cookie
```

### Usuário
```
GET  /usuarios/me       → retorna UsuarioResponse do usuário logado
PUT  /usuarios/me       → body: UsuarioEditRequest  → retorna UsuarioResponse atualizado
```

### Cursos
```
GET  /cursos            → query: ?status=ATIVO       → retorna CursoResponse[]
GET  /cursos/:id        → retorna CursoResponse com CategoriaResponse embutida
```

### Categorias
```
GET  /categorias        → query: ?status=ATIVA       → retorna CategoriaResponse[]
```

### Aulas
```
GET  /aulas/curso/:id   → query: ?status=ATIVA       → retorna AulaResponse[]
GET  /aulas/:id         → retorna AulaResponse
```

### Endpoints futuros (não implementar agora)
```
POST /matriculas
GET  /matriculas/me
POST /aulas/:id/concluir
GET  /badges/me
```

## Models (interfaces TypeScript)

```typescript
// Usuário
interface Usuario {
  id: number;
  nomeCompleto: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  foto: string;
  status: 'ATIVO' | 'INATIVO' | 'SUSPENSO';
  nivelProgresso: number;
  dataCadastro: string;
  emergenciaNome: string;
  emergenciaTelefone: string;
  emergenciaParentesco: string;
}

// Categoria
interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  icone: string;
  status: 'ATIVA' | 'INATIVA';
}

// Curso
interface Curso {
  id: number;
  nome: string;
  descricao: string;
  categoria: Categoria;
  cargaHoraria: number;
  nivel: 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';
  thumbnail: string;
  status: 'ATIVO' | 'INATIVO' | 'EM_ELABORACAO';
  dataCadastro: string;
}

// Aula
interface Aula {
  id: number;
  titulo: string;
  descricao: string;
  cursoId: number;
  cursoNome: string;
  ordem: number;
  formato: 'VIDEO' | 'TEXTO_IMAGENS' | 'SIMULACAO_INTERATIVA';
  conteudo: string;
  duracao: number;
  status: 'ATIVA' | 'INATIVA' | 'EM_ELABORACAO';
}

// Erro da API
interface ApiError {
  status: number;
  erro: string;
  mensagem: string;
  timestamp: string;
}
```

## Princípios de desenvolvimento

### O que seguir
- **Standalone components**: sem NgModules — padrão moderno do Angular 19
- **Signals para estado**: `signal()`, `computed()` e `effect()` — sem BehaviorSubject
- **Services simples**: um service por feature, sem camadas extras
- **Tipagem forte**: interfaces TypeScript para todos os modelos — sem `any`
- **Reactive Forms**: para formulários com validação (login, cadastro, edição de perfil)
- **Lazy loading**: cada feature carregada sob demanda via `loadComponent`
- **Separação de responsabilidades**: componente cuida da view, service cuida da lógica HTTP
- **Variáveis de ambiente**: `apiUrl` em `environment.ts` — nunca hardcoded
- **Feedback ao usuário**: loading, erro e sucesso visíveis em toda operação assíncrona
- **Nomes em português**: variáveis e propriedades de domínio (ex: `nomeCompleto`, `dataCadastro`)
- **Nomes em inglês**: estruturas técnicas (ex: `AuthService`, `HttpErrorInterceptor`)

### O que evitar
- Não use `any` — sempre tipar corretamente
- Não faça chamadas HTTP direto no componente — sempre via service
- Não use NgModules — projeto usa standalone components
- Não use `subscribe` sem `takeUntilDestroyed` ou gestão de ciclo de vida
- Não crie abstrações desnecessárias — sem `BaseComponent`, sem `GenericService<T>`
- Não duplique lógica de validação — centralize nos Reactive Forms
- Não ignore erros da API — trate sempre com mensagem visível ao usuário
- Não hardcode URLs — use sempre `environment.apiUrl`

## Configuração de ambiente

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.vivadigital.com'
};
```

## Padrão de tratamento de erros

Todo service deve capturar erros e retornar mensagem legível:

```typescript
catchError((error: HttpErrorResponse) => {
  const mensagem = error.error?.mensagem ?? 'Erro inesperado. Tente novamente.';
  return throwError(() => new Error(mensagem));
})
```

O componente exibe a mensagem ao usuário — nunca console.log em produção.

## Acessibilidade

- Contraste mínimo 4.5:1
- Touch targets mínimos 48x48px
- Labels visíveis em todos os inputs
- Feedback de erro associado ao campo via `aria-describedby`
- Imagens com `alt` descritivo

## Observações

- `withCredentials: true` obrigatório em todas as requisições HTTP para enviar o cookie
- O back-end deve estar configurado com CORS permitindo a origem do front e `allowCredentials: true`
- `.env` e `environment.prod.ts` sempre no `.gitignore`
- Módulos futuros (progresso, badges, matrícula) não devem ser implementados agora