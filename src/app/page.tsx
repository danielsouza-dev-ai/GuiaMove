import Link from 'next/link';
import { Clock, ListChecks, Thermometer } from 'lucide-react';
import { GuiaMoveHeader } from '@/components/shared/GuiaMoveHeader';

interface HubAppItem {
  id: string;
  href: string;
  name: string;
  shortLabel: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  customIconSrc?: string; // Ready for future custom SVG/PNG app icons
  Icon: typeof Clock;
}

const HUB_APPS: HubAppItem[] = [
  {
    id: 'temporizador',
    href: '/temporizador',
    name: 'Temporizador Visual',
    shortLabel: 'Tempo e transições',
    iconBg: 'bg-[#E0F2FE]',
    iconBorder: 'border-[#7DD3FC]',
    iconColor: 'text-[#0284C7]',
    Icon: Clock,
  },
  {
    id: 'termometro',
    href: '/termometro',
    name: 'Termômetro Sensorial',
    shortLabel: 'Emoções e calma',
    iconBg: 'bg-[#FEF3C7]',
    iconBorder: 'border-[#FCD34D]',
    iconColor: 'text-[#B45309]',
    Icon: Thermometer,
  },
  {
    id: 'rotinas',
    href: '/rotinas',
    name: 'Rotinas & Primeiro/Depois',
    shortLabel: 'Passo a passo visual',
    iconBg: 'bg-[#D1FAE5]',
    iconBorder: 'border-[#6EE7B7]',
    iconColor: 'text-[#047857]',
    Icon: ListChecks,
  },
];

const JSON_LD_GRAPH = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://guiamove.vercel.app/#organization',
      name: 'GuiaMove',
      url: 'https://guiamove.vercel.app',
      description:
        'Ferramentas visuais gratuitas de rotina infantil, autonomia e regulação sensorial criadas por Daniel Souza (@dansouza.move) para crianças autistas, com TDAH e típicas.',
      knowsAbout: [
        'Ferramentas visuais de rotina infantil',
        'Temporizador visual para autismo',
        'Termômetro sensorial Zones of Regulation',
        'Quadro Primeiro e Depois com pictogramas ARASAAC',
      ],
      sameAs: ['https://www.instagram.com/dansouza.move/'],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'contato@guiamove.vercel.app',
        telephone: '+55-11-99999-0000',
        contactType: 'customer support',
        availableLanguage: ['Portuguese'],
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'São Paulo',
        addressRegion: 'SP',
        addressCountry: 'BR',
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://guiamove.vercel.app/#app',
      name: 'GuiaMove',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web, iOS, Android',
      url: 'https://guiamove.vercel.app',
      description:
        'Portal PWA gratuito com Temporizador Visual Infantil, Termômetro Sensorial (Zones of Regulation) e Rotinas Visuais Primeiro/Depois integradas aos pictogramas ARASAAC.',
      keywords:
        'ferramentas visuais de rotina infantil, temporizador visual autismo, termômetro sensorial, quadro primeiro e depois ARASAAC',
      serviceType:
        'Ferramentas visuais de rotina infantil e regulação sensorial',
      author: {
        '@id': 'https://guiamove.vercel.app/#organization',
      },
      publisher: {
        '@id': 'https://guiamove.vercel.app/#organization',
      },
      offers: {
        '@type': 'Offer',
        name: 'Ferramentas visuais de rotina infantil e regulação sensorial',
        price: '0',
        priceCurrency: 'BRL',
      },
    },
  ],
};

export default function HomePage() {
  return (
    <div className="min-h-dvh flex flex-col bg-[#F0F9FF]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_GRAPH) }}
      />

      <GuiaMoveHeader subtitle="Ferramentas gratuitas de rotina, autonomia e movimento por @dansouza.move" />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-10 flex flex-col gap-8">
        <section className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] leading-tight text-balance">
            GuiaMove: ferramentas visuais de rotina infantil e regulação sensorial
          </h1>
          <p className="text-base text-[#475569] text-pretty">
            Apoio prático para a rotina de casa, da escola e da clínica com crianças autistas (TEA) e com TDAH. Direto no navegador, sem cadastro, sem anúncios e com dados salvos apenas no seu aparelho.
          </p>
        </section>

        <section
          aria-label="Ferramentas disponíveis"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5"
        >
          {HUB_APPS.map((app) => {
            const IconComponent = app.Icon;
            return (
              <Link
                key={app.id}
                href={app.href}
                className="group rounded-3xl bg-white border-2 border-b-4 border-[#BAE6FD] hover:border-[#0284C7] p-4 sm:p-6 flex flex-row sm:flex-col items-center justify-start sm:justify-center text-left sm:text-center gap-4 sm:gap-3.5 shadow-sm transition duration-150 ease-out active:translate-y-0.5 active:scale-[0.99] touch-manipulation"
              >
                <div
                  className={`size-16 sm:size-24 rounded-2xl sm:rounded-3xl border-2 ${app.iconBg} ${app.iconBorder} ${app.iconColor} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-150 ease-out`}
                >
                  {app.customIconSrc ? (
                    <img
                      src={app.customIconSrc}
                      alt=""
                      className="size-11 sm:size-16 object-contain"
                    />
                  ) : (
                    <IconComponent
                      className="size-8 sm:size-11 stroke-[2.2]"
                      aria-hidden="true"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-[#0F172A] leading-snug text-balance">
                    {app.name}
                  </h2>
                  <span className="text-xs font-medium text-[#475569]">
                    {app.shortLabel}
                  </span>
                </div>
              </Link>
            );
          })}
        </section>

        <section
          aria-label="Como funciona o GuiaMove"
          className="rounded-3xl bg-white border border-[#BAE6FD] p-5 sm:p-6 flex flex-col gap-4"
        >
          <h2 className="text-lg font-bold text-[#0F172A] text-balance">
            Como cada ferramenta ajuda na autonomia diária
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-[#475569] text-pretty">
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-[#0F172A]">
                Temporizador Visual Infantil
              </h3>
              <p>
                Substitui a contagem abstrata do relógio por uma sequência visual com personagem e alimento, configurável de 10 segundos a 60 minutos para facilitar transições tranquilas.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-[#0F172A]">
                Termômetro Sensorial Zones of Regulation
              </h3>
              <p>
                Ajuda a criança a apontar como se sente entre quatro zonas de cor e abrir em um toque a estratégia combinada: respiração guiada, som suave de chuva, pausa ou movimentos calmantes.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-[#0F172A]">
                Rotinas Visuais e Quadro Primeiro/Depois
              </h3>
              <p>
                Organiza rotinas fixas como banheiro e higiene, quadro Primeiro/Depois e trilhas com pictogramas ARASAAC onde a criança escolhe a ordem das atividades do dia.
              </p>
            </div>
          </div>
        </section>

        <section
          aria-label="Próximas ferramentas"
          className="rounded-2xl bg-white/75 border border-[#BAE6FD] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-[#475569]"
        >
          <span className="font-semibold text-[#0F172A]">Em desenvolvimento:</span>
          <span className="text-pretty">Sequenciamento Lógico do Dia</span>
        </section>
      </main>

      <footer className="py-5 px-4 text-center text-xs text-[#475569] border-t border-[#BAE6FD]/60 bg-white/60 flex flex-col items-center gap-2">
        <div>
          GuiaMove por <span className="font-semibold text-[#0F172A]">@dansouza.move</span> · Acadêmico de Fisioterapia, ABA e IA
        </div>
        <nav aria-label="Links institucionais" className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/about" className="hover:text-[#0F172A] underline">
            Sobre
          </Link>
          <Link href="/contact" className="hover:text-[#0F172A] underline">
            Contato
          </Link>
          <Link href="/privacy" className="hover:text-[#0F172A] underline">
            Privacidade
          </Link>
          <Link href="/llms.txt" className="hover:text-[#0F172A] underline">
            Para Agentes (llms.txt)
          </Link>
        </nav>
      </footer>
    </div>
  );
}
