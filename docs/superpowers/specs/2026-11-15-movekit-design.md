# Design Spec: GuiaMove (`@dansouza.move`)

**Data:** 2026-11-15  
**Autor:** Daniel Souza (`@dansouza.move`) + Antigravity  
**Workspace:** `c:\Python\build-pages\GuiaMove`

---

## 1. Intenção e Porquê

O **GuiaMove** é um portal web único, gratuito e instalável (PWA) que reúne ferramentas práticas de rotina, regulação sensorial, desenvolvimento motor e cognitivo para crianças autistas (e típicas).

O projeto resolve dois objetivos conectados:
1. **Utilidade real para famílias e terapeutas:** resolver gargalos do dia a dia em casa ou na rua sem paywalls, sem necessidade de login e sem excesso de estímulos visuais.
2. **Estratégia de conteúdo e autoridade (`@dansouza.move`):** servir de destino único para os Reels semanais no Instagram (ex.: *"Comenta KIT"*), fortalecendo a marca pessoal do Daniel e criando base de distribuição para futuras ferramentas próprias.

---

## 2. Objetivos, Não-Objetivos e Anti-Objetivos

### Objetivos
- Portal único hospedado gratuitamente na Vercel (plano Hobby), acessível em um só endereço e instalável via PWA ("Adicionar à tela inicial") com funcionamento offline.
- Lançamento em **ondas incrementais**, permitindo publicar o portal rápido e lançar novas ferramentas em sincronia com conteúdos no Instagram.
- **Onda 1 (MVP de lançamento):**
  1. **Hub GuiaMove (`/`)** com identidade visual **Céu & Clareza** e assinatura `@dansouza.move`.
  2. **Temporizador Visual (`/temporizador`)**, migrado de `C:\Python\build-pages\Temporizador` para React, já adaptado à paleta oficial e com ajustes visuais solicitados (posição do boneco e ilustração da batata).
  3. **Termômetro Sensorial e de Emoções (`/termometro`)** interativo, com estratégias de regulação configuráveis pelos pais.

### Não-Objetivos (nesta fase)
- Backend próprio, banco de dados em nuvem ou sistema de contas/login.
- Monetização, paywall ou assinatura dentro do portal.
- Publicação nativa na App Store ou Google Play.
- Construir todas as ferramentas do backlog antes do primeiro lançamento.

### Anti-Objetivos
- **Sobrecarga sensorial:** interfaces poluídas, cores berrantes desnecessárias ou sons agressivos que possam desregular a criança.
- **Exposição de dados infantis:** nenhuma foto, áudio ou dado de uso deve sair do dispositivo do usuário (tudo permanece em `localStorage` / `IndexedDB`).
- **Infantilização excessiva da marca:** evitar estética que afaste terapeutas; o portal deve transmitir clareza clínica, movimento e tecnologia.
- **Inconformidade ética/CREFITO:** identificar sempre como Acadêmico de Fisioterapia / `@dansouza.move`, nunca como fisioterapeuta formado nem com promessas clínicas de "antes e depois".

---

## 3. Restrições

- **Custo zero de infraestrutura:** 100% client-side no plano gratuito da Vercel (sem consumo relevante de Serverless Functions e dentro da cota de 100 GB/mês de banda).
- **Privacidade e LGPD:** persistência exclusivamente local (`localStorage` para configurações e estados leves; `IndexedDB` nas ondas futuras que envolverem fotos/áudios).
- **Paleta oficial — Céu & Clareza** (definida em `daniel-souza-dansouza-move.md`):
  - Fundo claro / cards: `#F0F9FF` (azul-céu suave) e `#FFFFFF` (branco limpo, borda `#BAE6FD`)
  - Texto principal: `#0F172A` (azul-marinho profundo)
  - Destaque 1 (tecnologia / movimento / clareza): `#0284C7` (azul-céu vibrante)
  - Destaque 2 (alegria / palavras-chave / energia): `#F59E0B` (amarelo-sol)
  - Tipografia: sans-serif bold geométrica (`Outfit`, `Montserrat`, com `Fredoka` opcional para toques lúdicos pontuais).

---

## 4. Abordagens Consideradas

Durante a análise do projeto existente em `C:\Python\build-pages\Temporizador`, constatou-se que o Temporizador atual foi construído em **HTML, CSS e JavaScript puros** (`src/app.js`, `timer.js`, `avatar.js`, `audio.js`, `chips.js`, `cropper.js`, `grid.js`, `storage.js`, `sw.js`). Foram avaliadas duas abordagens para o GuiaMove:

1. **Abordagem A — Next.js (App Router) + React + Tailwind CSS (Escolhida)**
   - **Como funciona:** Projeto único em Next.js com rotas isoladas por ferramenta (`/`, `/temporizador`, `/termometro`) e pasta `components/shared/` para elementos reutilizáveis (botões grandes acessíveis, trava parental, controle de som, navegação limpa) + PWA único.
   - **Trade-offs:** Exige portar o Temporizador atual de JS puro para React na Onda 1, mas viabiliza de forma limpa e escalável todas as ondas seguintes (API da ARASAAC, `@dnd-kit/core`, `<canvas>`, `IndexedDB`, `MediaRecorder` e MediaPipe).
2. **Abordagem B — Web App Estático Multi-página (HTML/CSS/JS puro)**
   - **Como funciona:** Manter o padrão sem framework do Temporizador, criando uma subpasta estática para cada ferramenta.
   - **Trade-offs:** Migração imediata do Temporizador, porém alto acoplamento e duplicação de código ao construir ferramentas mais complexas nas próximas ondas.

**Decisão:** Seguir com a **Abordagem A (Next.js App Router + React + Tailwind CSS)**.

---

## 5. Escopo e Arquitetura da Onda 1 + Roadmap

### Estrutura de Pastas Alvo
```text
src/
├── app/
│   ├── page.tsx                 # Hub GuiaMove (cards grandes + assinatura @dansouza.move)
│   ├── temporizador/page.tsx    # Temporizador migrado e ajustado
│   └── termometro/page.tsx      # Termômetro Sensorial e de Emoções
├── components/
│   ├── shared/                  # Header, botões grandes, trava parental, controle de som
│   ├── temporizador/            # Componentes do Temporizador portado
│   └── termometro/              # Seletor de estado, tela de regulação e editor parental
└── utils/
    └── storage.ts               # Helpers padronizados para localStorage / IndexedDB
```

### Detalhamento da Onda 1
1. **Hub GuiaMove (`/`):**
   - Cabeçalho limpo com nome **GuiaMove** na paleta Céu & Clareza e subtítulo *"Ferramentas gratuitas de rotina, autonomia e movimento por @dansouza.move"*.
   - Grid de cards grandes, fáceis de tocar no celular, dando acesso ao **Temporizador** e ao **Termômetro Sensorial**.
   - Manifesto PWA configurado para instalação em tela inicial e uso offline das rotas da Onda 1.

2. **Temporizador (`/temporizador`):**
   - Portar todas as funcionalidades existentes em `C:\Python\build-pages\Temporizador` (timer visual, avatar, chips de tempo, áudio, grade, cropper de imagem e persistência local via `IndexedDB` com fallback para `localStorage` em `utils/storage.ts`, mantendo os perfis com foto escopados ao `/temporizador` na Onda 1).
   - Aplicar integralmente a paleta **Céu & Clareza**.
   - **Personagens personalizáveis e correção de enquadramento:**
     - Construir um **avatar SVG modular** (`CharacterAvatar`) com `viewBox` exato (sem moldura transparente) permitindo aos pais personalizar características (tom de pele, cabelo/cor, menino/menina, porte físico) nos 5 estados (`anticipation`, `mouth_open`, `bite`, `chewing`, `celebration`). Opcionalmente, manter o boneco PNG atual com auto-recorte de transparência como preset extra.
     - Posicionamento ancorado pela borda da boca em relação à célula do alimento, com margem de segurança no palco para nunca cortar na primeira coluna nem sobrepor células vizinhas.
   - **Ciclo de animação e mordida:**
     - Estágio de aproximação (`anticipation`): dura **1 segundo** antes de iniciar a contagem e na transição entre alimentos (a cada 10 segundos).
     - Durante a contagem: os 3 estágios (`mouth_open` → `bite` → `chewing`) ocorrem completos **dentro de 1 segundo** (~333 ms cada), repetindo a cada segundo.
     - Conforme o alimento diminui de tamanho, o boneco avança progressivamente para acompanhar a borda restante do alimento.
   - **Alimentos em SVG limpo:** substituir a batata atual por **batata chips ondulada** em SVG bem definida e incluir o **chocolate** em SVG como recompensa ao final de cada contagem.

3. **Termômetro Sensorial e de Emoções (`/termometro`):**
   - **4 níveis no padrão Zones of Regulation:** Azul (Triste/Cansado/Desanimado), Verde (Calmo/Focado/Pronto), Amarelo (Agitado/Frustrado/Alerta) e Vermelho (Sobrecarregado/Explosivo), com cores suaves e alto contraste legível dentro da estética Céu & Clareza.
   - **Ação imediata (1 clique):** ao tocar em um nível, abre **1 estratégia principal direto** (sem tela intermediária).
   - **Estratégias prontas + personalizadas em texto:**
     - Estratégias interativas do sistema: Respiração Guiada (círculo expansivo), Som Ambiente Suave e Botão Gigante de "Pausa".
     - Estratégia personalizada dos pais: **Cartão de Regulação** com ícone simples escolhido pelos pais + texto grande de alto contraste (ex.: *"Ir para o cantinho da calma e abraçar o urso"*) + botão opcional de leitura em voz alta (`SpeechSynthesis` PT-BR) + botão grande de voltar/concluir.
   - Modo de personalização protegido por **trava parental simples** para escolher qual estratégia (pronta ou personalizada em texto) fica como principal em cada uma das 4 zonas, salvo no `localStorage`.

### Roadmap das Próximas Ondas (Pós-Onda 1)
- **Onda 2:** Sequenciamento Lógico do Dia a Dia (drag-and-drop touch com `@dnd-kit/core`).
- **Onda 3:** Sistema de Rotinas Personalizável + Quadro Primeiro/Depois integrado à **API da ARASAAC**.
- **Onda 4 (Nível 2):** Labirinto de Traçado/Pinça (`<canvas>`) e Pareamento com Fotos Reais + Voz dos Pais (`IndexedDB` + `MediaRecorder`).
- **Onda 5 (Nível 3):** Semáforo de Volume (microfone + `AnalyserNode`) e Jogo de Equilíbrio (`DeviceOrientationEvent` com fluxo de permissão iOS).
- **Onda 6 (Nível 4):** Caça ao Tesouro por Cores (câmera + análise HSL) e Espelho de Movimentos (`@mediapipe/tasks-vision`).
- **Onda 7 (Nível 5):** Gerador de Kits Imprimíveis (Bingo, Trilha Social e Dominó de Emoções em A4 via `@media print` / PDF).

---

## 6. O que fica a cargo do implementador

- Inicialização do projeto Next.js (App Router), TypeScript, Tailwind CSS e configuração de PWA (ex.: `manifest.ts` / Service Worker) em `c:\Python\build-pages\GuiaMove`.
- Escolha exata das bibliotecas de apoio da Onda 1 (ex.: ícones `lucide-react`, utilitário de PWA compatível com Next.js App Router).
- Detalhes visuais do componente de respiração guiada, sons de feedback (Web Audio API ou áudios leves) e mecânica exata da trava parental (ex.: segurar por 2 segundos ou conta simples).
- Organização da suíte de testes automatizados equivalente aos cenários atuais do Temporizador.
