# Quickstart — Validar Dashboard em páginas separadas

**Feature**: 009-dashboard-separate-pages

## Pré-requisitos

- Banco com admin populado (`npm run db:seed`) e app rodando (`npm run dev`).
- Login em `/login` com as credenciais do `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## Roteiro de validação (após implementação)

1. **Entrada padrão**: acesse `http://localhost:3000/dashboard` → deve mostrar **apenas** a Visão geral (cabeçalho + cartões de totais), com "Visão geral" destacado no menu.
2. **Navegação por páginas**: clique em cada item do menu e confirme que a URL muda para uma rota distinta exibindo só a seção:
   - "Cadastro manual" → `/dashboard/cadastro-manual` (form de grupo)
   - "Lista de confirmações" → `/dashboard/confirmacoes` (filtros + tabela)
   - "Mural de recados" → `/dashboard/mural` (gestão de recados)
3. **Item ativo**: em cada página, o item correspondente do menu aparece destacado (`aria-current="page"`); os demais não.
4. **Recarregar (F5)** em cada rota → permanece na mesma seção (não volta ao topo de uma página única).
5. **Deep-link de filtro**: em `/dashboard/confirmacoes`, aplique um filtro/busca, copie a URL, abra em nova aba → abre já filtrado; recarregar preserva os parâmetros.
6. **Proteção de auth**: abra qualquer rota (ex.: `/dashboard/mural`) em aba anônima/sem sessão → redireciona para `/login`.
7. **Compatibilidade de âncora**: abra `/dashboard#confirmacoes` autenticado → cai na Visão geral válida, sem tela quebrada.
8. **Mobile**: reduza a janela; abra o menu colapsado, toque em uma seção → o menu fecha e navega para a página certa.

## Testes automatizados

- `npm test` — testes de componentes existentes do dashboard continuam verdes (lógica inalterada).
- Novo `Sidebar.test.tsx` — verifica `aria-current="page"` por rota (mockando `usePathname`).
- `npm run build` — sem erros de tipo/rota nas novas páginas (Princípio 6).

## Critérios de aceite (resumo)

- 4 seções acessíveis por endereços distintos, cada uma exibindo só sua seção (SC-001).
- Reload mantém a seção (SC-002); item de menu ativo correto (SC-003).
- Nenhuma funcionalidade perdida (SC-004); raiz `/dashboard` válida (SC-005).
