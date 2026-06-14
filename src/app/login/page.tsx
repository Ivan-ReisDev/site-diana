import { LoginForm } from '@/components/auth/LoginForm';
import { getCurrentAdminSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await getCurrentAdminSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-[#fff8f6] px-5 py-12 text-[#745b58] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-md rounded-[2rem] bg-white/80 p-8 shadow-[0_18px_60px_rgba(185,75,105,.12)]">
        <p className="text-sm font-semibold uppercase tracking-[.3em] text-[#d36f8a]">Área privada</p>
        <h1 className="mt-3 font-serif text-4xl font-black text-[#b85f78]">Dashboard de presença</h1>
        <p className="mt-4 text-base leading-7 text-[#806562]">
          Entre com as credenciais administrativas para acompanhar confirmações, ausências e totais da festa.
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
