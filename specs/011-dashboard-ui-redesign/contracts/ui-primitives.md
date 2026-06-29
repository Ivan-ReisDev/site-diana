# UI Contract: Primitivos compartilhados do painel

Contrato de interface (UI) dos primitivos de apresentação. Como é uma feature de front-end, o "contrato" é a API dos componentes e as garantias visuais/acessíveis que cada um oferece. Nenhum endpoint, rota ou schema de dados é criado ou alterado.

## Garantias transversais (todos os primitivos)

- **G1**: Renderizam apenas com tema claro (sem modo escuro).
- **G2**: Todo controle interativo tem foco visível por teclado (`focus:ring-2 focus:ring-[#f3d3dd]` ou equivalente). (FR-002, SC-005)
- **G3**: Contraste de texto/fundo adequado (reaproveitando paleta já validada). (FR-010)
- **G4**: Responsivos; não causam rolagem horizontal de 360px a 1280px+. (FR-008, SC-004)

## FormField

```
<FormField id="phone" label="Telefone" type="tel"
  value={phone} onChange={...} placeholder="(21) 99999-9999" />
<FormField id="status" label="Status" as="select" value={status} onChange={...}>
  <option value="all">Todos</option>
</FormField>
```

- **C1**: `label` é renderizado e associado ao controle (`<label htmlFor>` + `id`). (FR-010, Princípio 3)
- **C2**: Campo usa tokens do convite: `bg-[#ffe9f0] rounded-xl h-11 px-4 text-[15px]` + placeholder `#cf93a7`.
- **C3**: `as='select'` aplica o mesmo estilo de campo ao `<select>` e renderiza `children` como opções.
- **C4**: `disabled` reduz opacidade e bloqueia interação.

## Button

```
<Button variant="primary" loading={isSubmitting}>Salvar grupo</Button>
<Button variant="secondary" type="button">Limpar formulário</Button>
<Button variant="ghost" icon={<Plus/>}>Adicionar adulto</Button>
<Button variant="danger" icon={<Trash2/>} aria-label="Remover" />
```

- **C5**: Quatro variantes com aparência consistente em todo o painel. (FR-003)
- **C6**: `loading` mostra rótulo de progresso (ex.: "Salvando…") e desabilita o botão.
- **C7**: Estados `hover` e `disabled` visíveis e consistentes.
- **C8**: Botão somente-ícone exige `aria-label`.

## SectionCard

- **C9**: Cantos, sombra e respiro internos padronizados em todas as páginas. (FR-005)

## SectionHeader

```
<SectionHeader eyebrow="Cadastro manual" title="Adicionar ou atualizar grupo"
  description="Use o telefone para atualizar um grupo existente…" />
```

- **C10**: Hierarquia eyebrow → título → descrição idêntica entre páginas. (FR-004)

## EmptyState

```
<EmptyState message="Nenhum recado no mural ainda." />
```

- **C11**: Visual amigável e único para estados vazios. (FR-007)

## Mensagens de feedback (uso nos formulários)

- **C12**: Erro/sucesso exibidos com `role="alert"`/`aria-live` e ícone, não apenas cor. (FR-006)

## Garantias de não-regressão (comportamento preservado — FR-009)

- **C13**: Cadastro manual continua: validar nome/telefone, add/remove adultos e crianças, enviar a `/api/rsvp`, feedback de adicionado/atualizado, limpar formulário, `router.refresh()`.
- **C14**: Filtros continuam submetendo `q` e `status` via GET.
- **C15**: Mural continua removendo recado via `DELETE /api/recados/:id` com feedback de processamento.
- **C16**: Tabela continua distinguindo confirmados × não-confirmados. (FR-011)
- **C17**: Sidebar mantém item ativo e navegação. (FR-012)

> Verificação: a suíte Vitest existente do painel deve permanecer verde; novos primitivos têm testes próprios (`FormField.test.tsx`, `Button.test.tsx`).
