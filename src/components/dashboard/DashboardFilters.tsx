import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { SectionCard } from '@/components/ui/SectionCard';
import type { DashboardStatusFilter } from '@/lib/rsvp/service';

export function DashboardFilters({
  q,
  status,
}: {
  q: string;
  status: DashboardStatusFilter;
}) {
  return (
    <SectionCard as="form" method="GET">
      <div className="grid gap-4 md:grid-cols-[1fr_220px_auto] md:items-end">
        <FormField
          id="dashboard-filter-q"
          label="Buscar por nome ou telefone"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Ex.: Família Reis"
        />

        <FormField
          id="dashboard-filter-status"
          label="Status de presença"
          as="select"
          name="status"
          defaultValue={status}
        >
          <option value="all">Todos</option>
          <option value="yes">Confirmados</option>
          <option value="no">Não irão</option>
        </FormField>

        <div>
          <Button variant="primary" type="submit">Aplicar filtros</Button>
        </div>
      </div>
    </SectionCard>
  );
}