import { RecadosManager } from '@/components/dashboard/RecadosManager';
import { listRecados } from '@/lib/recados/service';

export default async function DashboardMuralPage() {
  const recados = await listRecados();

  return (
    <section id="mural-recados">
      <RecadosManager
        initialRecados={recados.map((recado) => ({
          id: recado.id,
          nome: recado.nome,
          mensagem: recado.mensagem,
          createdAt: recado.createdAt.toISOString(),
        }))}
      />
    </section>
  );
}