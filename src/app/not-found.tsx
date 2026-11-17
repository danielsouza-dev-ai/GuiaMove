import Link from 'next/link';
import { GuiaMoveHeader } from '@/components/shared/GuiaMoveHeader';

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col bg-[#F0F9FF]">
      <GuiaMoveHeader title="Página não encontrada" backHref="/" />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12 flex flex-col justify-center gap-6">
        <div className="rounded-3xl bg-white border-2 border-[#BAE6FD] p-8 flex flex-col gap-4 shadow-sm">
          <span className="self-start px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-bold">
            Erro 404
          </span>
          <h1 className="text-2xl font-bold text-[#0F172A] text-balance">
            Este endereço não foi encontrado no GuiaMove
          </h1>
          <p className="text-base text-[#475569] text-pretty">
            O caminho acessado não existe ou foi movido. Utilize os links abaixo para voltar às ferramentas ou consultar a documentação e o mapa do site.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 min-h-11 rounded-2xl bg-[#0284C7] text-white font-bold text-sm hover:bg-[#0369A1]"
            >
              Voltar para a página inicial
            </Link>
            <Link
              href="/llms.txt"
              className="inline-flex items-center justify-center px-5 min-h-11 rounded-2xl border border-[#BAE6FD] bg-[#F0F9FF] text-[#0F172A] font-bold text-sm hover:bg-[#E0F2FE]"
            >
              Guia para agentes (llms.txt)
            </Link>
            <Link
              href="/sitemap.xml"
              className="inline-flex items-center justify-center px-5 min-h-11 rounded-2xl border border-[#BAE6FD] bg-white text-[#0F172A] font-bold text-sm hover:bg-[#F0F9FF]"
            >
              Mapa do site (sitemap.xml)
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
