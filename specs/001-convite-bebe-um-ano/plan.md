# Plano de Implementação: Site convite bebê 1 ano

## Technical Context

- Projeto: Next.js App Router com TypeScript e Tailwind CSS.
- Interface: landing page single-page responsiva.
- Estado: RSVP e Pix copy controlados no cliente.
- Persistência: não há persistência real nesta primeira versão.
- Imagens: URLs externas permitidas, com fallback visual via gradientes/shapes.

## Constitution Check

- Valor para convidados: aprovado; fluxo simples e informativo.
- Privacidade: usar placeholders, sem dados reais.
- Acessibilidade: labels, contraste, foco e semântica.
- Performance/SEO: metadata e layout otimizado.
- Design emocional: paleta suave, moderna e infantil.
- Validação: build + screenshots.

## Estrutura

- `src/app/page.tsx`: página principal.
- `src/app/layout.tsx`: metadata.
- `src/app/globals.css`: base visual e animações.
- `src/app/page.test.tsx`: testes de conteúdo/fluxos com React Testing Library.

## Artifacts

- `research.md`
- `data-model.md`
- `contracts/rsvp.md`
- `quickstart.md`
- `tasks.md`
