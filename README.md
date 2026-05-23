# Viva Digital — Front-end

Aplicação mobile-first em Angular para o sistema de inclusão digital Viva Digital.

## Requisitos

- Node.js 20+
- Back-end rodando em `http://localhost:8080`

## Instalação

```bash
npm install
```

## Ambiente

O ambiente de desenvolvimento (`environment.ts`) já está configurado com `http://localhost:8080`.

## Comandos

| Comando | Descrição |
|---|---|
| `npm start` | Servidor de desenvolvimento em `localhost:4200` |
| `npm run build` | Build de produção em `/dist` |
| `npm run watch` | Build em modo watch |
| `npm test` | Testes unitários |

## Stack

- Angular 21 · Standalone Components · Signals
- Tailwind CSS 3
- Angular Router com lazy loading
- Autenticação via Cookie HttpOnly

## Estrutura

```
src/app/
├── core/          # guards, interceptors, services e models globais
├── shared/        # componentes reutilizáveis (Button, Input, Card, Loading, BottomNav)
└── features/      # login, cadastro, dashboard, cursos, perfil
```

## Observações

- O back-end precisa ter CORS configurado com `allowCredentials: true` para a origem do front
- `environment.prod.ts` está no `.gitignore` — não commitar
