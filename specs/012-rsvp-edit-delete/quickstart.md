# Quickstart — Validar excluir/editar confirmações

Pré-requisitos: banco com pelo menos 2 confirmações cadastradas; admin autenticado no painel.

## 1. Subir e autenticar
```bash
npm run dev
```
Acesse `/dashboard`, faça login e vá em **Lista de confirmações** (`/dashboard/confirmacoes`).

## 2. Testes automatizados
```bash
npm run test
```
Cobrir:
- `service.test.ts`: `deleteRsvp` (encontrado/não encontrado), `updateRsvp` (sucesso, `P2025` não encontrado, `P2002` conflito de telefone).
- `api/rsvp/[id]/route.test.ts`: 401 sem sessão, 200/404 no DELETE, 200/400/404/409 no PATCH.
- `RsvpRowActions.test.tsx` / `RsvpEditForm.test.tsx`: exibição das ações, confirmação obrigatória, validação de campos.

## 3. Validação manual — Excluir (User Story 1)
1. Em uma linha, clique em **Excluir** → surge o diálogo de confirmação.
2. Clique **Cancelar** → nada muda (AS-2).
3. Clique **Excluir** novamente → confirme → a linha some e os totais na Visão geral caem (AS-1, AS-3, SC-001/SC-004).
4. Exclua o último registro restante → aparece "Nenhuma confirmação encontrada" sem erro (edge case).

## 4. Validação manual — Editar (User Story 2)
1. Clique em **Editar** numa linha → formulário abre **pré-preenchido** (AS-1).
2. Corrija o telefone e mude adultos/crianças → **Salvar** → a lista mostra os novos valores e as estatísticas recalculam (AS-2, AS-3, SC-002/SC-004).
3. Abra a edição, altere presença de "confirmado" → "não irá", salve → registro migra de categoria nas estatísticas (AS-5).
4. Abra a edição e **Cancele** → nada muda (AS-4).

## 5. Validação manual — Erros (User Story 3)
1. Editar deixando **nome vazio** → salvar bloqueado com aviso do campo (AS-2, SC-005).
2. Editar o telefone para um que **já pertence a outro registro** → salvar → mensagem de conflito, sem sobrescrever (AS-3, FR-012, edge case).
3. (Opcional) Com sessão expirada, tentar excluir/editar → 401, sem alterar dados (SC-006).

## 6. Filtros ativos (FR-016)
Aplique um filtro (status/busca), edite/exclua um item e confirme que o filtro atual é preservado e o resultado reflete a mudança.

## Build final
```bash
npm run build
```
