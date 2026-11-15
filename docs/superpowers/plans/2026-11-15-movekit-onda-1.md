# GuiaMove Onda 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir a Onda 1 do portal PWA **GuiaMove** (`/` Hub, `/temporizador` migrado e corrigido, `/termometro` Sensorial e de Emoções) em Next.js App Router + React + Tailwind CSS, 100% client-side e pronto para deploy gratuito na Vercel.

**Architecture:** Aplicação Next.js (App Router) com rotas isoladas por ferramenta, componentes compartilhados (`GuiaMoveHeader`, `ParentalLock`, `SoundToggle`, `BigActionButton`), persistência local em `src/utils/storage.ts` (`IndexedDB` com fallback para `localStorage`) e assets em SVG modular sem moldura transparente. O botão de iniciar do `/temporizador` executa transição e contagem de forma síncrona/não-bloqueante para funcionar no iPad Safari.

**Tech Stack:** Next.js 15+ (App Router), React 19, TypeScript, Tailwind CSS, `lucide-react`, Vitest + `@testing-library/react` + `jsdom`.

**Spec:** `docs/superpowers/specs/2026-11-15-guiamove-design.md`

## Global Constraints

- Paleta oficial **Céu & Clareza**: fundos `#F0F9FF` e `#FFFFFF` (borda `#BAE6FD`), texto `#0F172A`, destaque 1 `#0284C7`, destaque 2 `#F59E0B`.
- Tipografia: `Outfit` / `Montserrat` (com `Fredoka` opcional em títulos lúdicos).
- 100% client-side: zero backend, zero login, zero envio de fotos/dados de crianças para servidores externos.
- Assinatura obrigatória no Hub: *"Ferramentas gratuitas de rotina, autonomia e movimento por @dansouza.move"* (identificação ética: Acadêmico de Fisioterapia / `@dansouza.move`, sem alegações clínicas proibidas).
- Temporizador: estágio de aproximação (`anticipation`) = `1000ms` antes da contagem e a cada transição de alimento (10s); ciclo `mouth_open` → `bite` → `chewing` completo dentro de `1000ms` (~333ms cada) durante a contagem.

## Review Focus

- **iPad Safari — Botão "Iniciar" do Temporizador travando:** `requestFullscreen`, `AudioContext.resume()` e `WakeLock` não existem ou rejeitam/travam no iPadOS Safari; nenhum deles pode ser aguardado (`await`) antes da troca de tela e do `timerEngine.start()`.
- **Boneco cortado na 1ª coluna ou sobrepondo células:** O cálculo de posição do `CharacterAvatar` deve considerar margem esquerda segura no palco e ancorar na borda da boca, avançando conforme o alimento diminui.
- **Modo privado / falha de `IndexedDB`:** Em abas privadas ou browsers restritos onde `indexedDB.open` falha, `storage.ts` deve cair graciosamente para `localStorage` sem quebrar perfis ou configurações.
- **Toque acidental da criança na trava parental:** `ParentalLock` deve usar `pointerdown`/`pointerup`/`pointercancel` (2 segundos de pressão contínua) e cancelar corretamente se o dedo sair ou levantar antes.
- **Termômetro em crise:** Tocar em uma das 4 zonas deve abrir imediatamente a 1ª estratégia configurada (sem modal intermediário) e `SpeechSynthesis` no cartão personalizado deve falhar silenciosamente se o navegador não tiver vozes PT-BR.

---

### Task 1: Bootstrap Next.js, Tailwind (Céu & Clareza), Vitest e Manifesto PWA

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`, `vitest.setup.ts`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/manifest.ts`
- Create: `public/icons/icon-192.svg`, `public/icons/icon-512.svg`

**Interfaces:**
- Produces: Projeto Next.js App Router funcional com tokens CSS `--bg-sky: #F0F9FF`, `--card-white: #FFFFFF`, `--card-border: #BAE6FD`, `--text-ink: #0F172A`, `--accent-blue: #0284C7`, `--accent-amber: #F59E0B`, comando `npm test` (Vitest) e `npm run build`.

- [ ] **Step 1: Inicializar projeto Next.js + dependências**

Executar na raiz `c:\Python\build-pages\GuiaMove`:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes
npm install lucide-react
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 2: Configurar `vitest.config.ts` e script `"test": "vitest run"` no `package.json`**

Criar `vitest.config.ts` com `environment: 'jsdom'` e alias `@` apontando para `./src`. Criar `vitest.setup.ts` importando `@testing-library/jest-dom/vitest`.

- [ ] **Step 3: Configurar paleta Céu & Clareza em `src/app/globals.css` e fontes (`Outfit` + `Fredoka`) em `src/app/layout.tsx`**

Definir variáveis CSS da paleta oficial, `background-color: #F0F9FF`, `color: #0F172A`, e `viewport` adequado para toque móvel (`user-scalable=no` evitado para acessibilidade; `touch-action: manipulation` nos botões).

- [ ] **Step 4: Criar `src/app/manifest.ts` e ícones SVG em `public/icons/`**

Configurar PWA com `name: "GuiaMove — @dansouza.move"`, `short_name: "GuiaMove"`, `display: "standalone"`, `theme_color: "#0284C7"`, `background_color: "#F0F9FF"`.

- [ ] **Step 5: Verificar build e runner de testes**

Run: `npm run build` e `npm test`
Expected: `npm run build` conclui sem erros; `vitest` executa (0 testes ou smoke test passando).

- [ ] **Step 6: Commit**

```bash
git init
git add .
git commit -m "chore: bootstrap Next.js GuiaMove with Ceu e Clareza palette and PWA manifest"
```

---

### Task 2: Camada de Persistência Local (`src/utils/storage.ts`)

**Files:**
- Create: `src/utils/storage.ts`
- Test: `tests/storage.test.ts`

**Interfaces:**
- Produces:
  - `interface ChildProfile { id: string; name: string; photoData?: string; avatarConfig: AvatarConfig; createdAt: number }`
  - `interface AvatarConfig { skinTone: string; hairStyle: 'short' | 'curly' | 'long' | 'bun'; hairColor: string; bodyBuild: 'slim' | 'medium' | 'sturdy' }`
  - `getProfiles(): Promise<ChildProfile[]>`
  - `saveProfile(profile: ChildProfile): Promise<void>`
  - `deleteProfile(id: string): Promise<void>`
  - `getLocalJson<T>(key: string, fallback: T): T`
  - `setLocalJson<T>(key: string, value: T): void`

- [ ] **Step 1: Escrever testes falhando em `tests/storage.test.ts`**

Testar:
1. `getLocalJson` retorna `fallback` quando chave não existe ou JSON é inválido.
2. `setLocalJson` + `getLocalJson` persistem objetos no `localStorage`.
3. `saveProfile` / `getProfiles` / `deleteProfile` funcionam via fallback `localStorage` quando `indexedDB` está indisponível (`globalThis.indexedDB = undefined`).

- [ ] **Step 2: Rodar testes para confirmar falha**

Run: `npm test -- tests/storage.test.ts`
Expected: FAIL ("Cannot find module '@/utils/storage'").

- [ ] **Step 3: Implementar `src/utils/storage.ts`**

Implementar store `guiamove-db` (`profiles` objectStore) em `IndexedDB` com fallback automático e transparente para `localStorage` caso `indexedDB` lance erro ou não exista (ex.: navegação privada no Safari).

- [ ] **Step 4: Rodar testes para verificar aprovação**

Run: `npm test -- tests/storage.test.ts`
Expected: PASS (todos os cenários passando).

- [ ] **Step 5: Commit**

```bash
git add src/utils/storage.ts tests/storage.test.ts
git commit -m "feat: add local storage and IndexedDB persistence layer with Safari fallback"
```

---

### Task 3: Componentes Compartilhados (`src/components/shared/`)

**Files:**
- Create: `src/components/shared/GuiaMoveHeader.tsx`
- Create: `src/components/shared/SoundToggle.tsx`
- Create: `src/components/shared/ParentalLock.tsx`
- Create: `src/components/shared/BigActionButton.tsx`
- Test: `tests/shared.test.tsx`

**Interfaces:**
- Consumes: `getLocalJson`, `setLocalJson` de `@/utils/storage`
- Produces:
  - `GuiaMoveHeader({ title?: string; backHref?: string; rightSlot?: React.ReactNode })`
  - `SoundToggle({ muted: boolean; onToggle: () => void })`
  - `ParentalLock({ onUnlock: () => void; label?: string; holdMs?: number })` (default `holdMs = 2000`)
  - `BigActionButton({ children, onClick, variant?: 'primary' | 'amber' | 'outline', className?: string })`

- [ ] **Step 1: Escrever testes falhando em `tests/shared.test.tsx`**

Testar com `vi.useFakeTimers()`:
1. `ParentalLock` NÃO chama `onUnlock` se `pointerup` acontecer após `1000ms` (antes dos `2000ms`).
2. `ParentalLock` chama `onUnlock` após `2000ms` de pressão contínua (`pointerdown` + `advanceTimersByTime(2000)`).
3. `ParentalLock` cancela o timer se `pointercancel` disparar no meio.
4. `GuiaMoveHeader` renderiza link de retorno quando `backHref` é passado.

- [ ] **Step 2: Rodar testes para confirmar falha**

Run: `npm test -- tests/shared.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementar os 4 componentes em `src/components/shared/`**

Usar paleta Céu & Clareza (`#FFFFFF`, borda `#BAE6FD`, `#0284C7`, `#F59E0B`, `#0F172A`) e `touch-action: none` + `select-none` no `ParentalLock` para evitar menu de contexto ao segurar no iPad/celular.

- [ ] **Step 4: Rodar testes para verificar aprovação**

Run: `npm test -- tests/shared.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/shared tests/shared.test.tsx
git commit -m "feat: add shared accessible UI components and ParentalLock"
```

---

### Task 4: Hub GuiaMove (`src/app/page.tsx`)

**Files:**
- Create: `src/app/page.tsx`
- Test: `tests/hub.test.tsx`

**Interfaces:**
- Consumes: `GuiaMoveHeader` de `@/components/shared/GuiaMoveHeader`
- Produces: Rota `/` com marca `GuiaMove`, subtítulo `@dansouza.move` e cards grandes clicáveis para `/temporizador` e `/termometro` (+ cards informativos "Em breve" para Sequenciamento e Rotinas ARASAAC sem poluição visual).

- [ ] **Step 1: Escrever teste falhando em `tests/hub.test.tsx`**

Verificar que a página inicial renderiza o título `GuiaMove`, a assinatura `@dansouza.move`, link para `/temporizador` e link para `/termometro`.

- [ ] **Step 2: Rodar teste para confirmar falha**

Run: `npm test -- tests/hub.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementar `src/app/page.tsx`**

Grid responsivo (1 coluna no mobile, 2 no tablet/desktop), cards brancos `#FFFFFF` com borda `#BAE6FD`, ícones `lucide-react` (`Timer`, `Thermometer`), contraste alto `#0F172A`.

- [ ] **Step 4: Rodar teste para verificar aprovação**

Run: `npm test -- tests/hub.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx tests/hub.test.tsx
git commit -m "feat: build GuiaMove Hub home page with Ceu e Clareza design"
```

---

### Task 5: Engine de Tempo e Áudio do Temporizador (`src/lib/temporizador/`)

**Files:**
- Create: `src/lib/temporizador/timerEngine.ts`
- Create: `src/lib/temporizador/soundEngine.ts`
- Test: `tests/timerEngine.test.ts`

**Interfaces:**
- Produces:
  - `type AvatarPhase = 'anticipation' | 'mouth_open' | 'bite' | 'chewing' | 'celebration'`
  - `interface TimerSnapshot { status: 'idle' | 'approaching' | 'running' | 'paused' | 'finished'; totalSeconds: number; remainingSeconds: number; totalChips: number; activeChipIndex: number; chipProgress: number; avatarPhase: AvatarPhase }`
  - `createTimerEngine(onUpdate: (snap: TimerSnapshot) => void)` com métodos `configure(seconds: number)`, `start()`, `pause()`, `resume()`, `reset()`, `destroy()`.
  - `soundEngine` com `init(): void` (síncrono/try-catch, nunca trava), `playBite(): void`, `playCelebration(): void`, `setMuted(muted: boolean): void`.

- [ ] **Step 1: Escrever testes falhando em `tests/timerEngine.test.ts`**

Testar com `vi.useFakeTimers()`:
1. `configure(20)` cria `totalChips = 2` (10s por batata).
2. Ao chamar `start()`, entra imediatamente em `status: 'approaching'` e `avatarPhase: 'anticipation'` por `1000ms` sem descontar `remainingSeconds`.
3. Após `1000ms`, entra em `status: 'running'`; dentro do segundo seguinte (`0..999ms`), passa pelos 3 estágios `mouth_open` → `bite` → `chewing` completos dentro de `1000ms` (~333ms cada).
4. Ao completar 10s (fim da 1ª batata quando `totalChips = 2`), entra em `approaching` (`1000ms`) para se aproximar da 2ª batata antes de retomar a mordida.
5. Ao zerar a última batata, entra em `status: 'finished'` e `avatarPhase: 'celebration'`.
6. `soundEngine.init()` não lança erro mesmo se `AudioContext` não existir ou `resume()` rejeitar.

- [ ] **Step 2: Rodar testes para confirmar falha**

Run: `npm test -- tests/timerEngine.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implementar `timerEngine.ts` e `soundEngine.ts`**

Usar ticks curtos (ex.: `100ms` via `setInterval` baseado em `Date.now()`) para calcular sub-fases de `333ms` sem drift. Garantir `soundEngine.init()` 100% síncrono com `try/catch` e `Promise.resolve(ctx.resume()).catch(() => {})` para nunca travar o iPad Safari.

- [ ] **Step 4: Rodar testes para verificar aprovação**

Run: `npm test -- tests/timerEngine.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/temporizador tests/timerEngine.test.ts
git commit -m "feat: implement timer engine with 1s anticipation, sub-second chewing cycle, and iPad-safe audio"
```

---

### Task 6: Assets SVG Modulares do Temporizador (`CharacterAvatar`, Batata Chips Ondulada e Chocolate)

**Files:**
- Create: `src/components/temporizador/CharacterAvatar.tsx`
- Create: `src/components/temporizador/FoodSprites.tsx`
- Test: `tests/temporizadorSprites.test.tsx`

**Interfaces:**
- Consumes: `AvatarConfig` de `@/utils/storage`, `AvatarPhase` de `@/lib/temporizador/timerEngine`
- Produces:
  - `CharacterAvatar({ phase: AvatarPhase; config: AvatarConfig; photoData?: string; size?: number })` — SVG com `viewBox` justo (zero moldura transparente), boca alinhada na borda direita para encostar no alimento, personalizável em pele (`#FDE2C8`, `#E0AC69`, `#8D5524`, `#4A2912`), cabelo (`short`, `curly`, `long`, `bun` + cor) e porte (`slim`, `medium`, `sturdy`). Se `photoData` existir, renderiza o rosto recortado dentro da cabeça do personagem.
  - `WavyChipSvg({ bitesTaken: number; maxBites?: number })` — batata chips ondulada em SVG nítido com mordidas progressivas da esquerda para a direita.
  - `ChocolateRewardSvg({ size?: number })` — barra de chocolate ilustrada em SVG para o estágio `celebration`.

- [ ] **Step 1: Escrever testes falhando em `tests/temporizadorSprites.test.tsx`**

Verificar que `CharacterAvatar` renderiza nas 5 fases (`anticipation`, `mouth_open`, `bite`, `chewing`, `celebration`) aplicando cor de pele/cabelo do `AvatarConfig`, que `WavyChipSvg` renderiza com redução progressiva conforme `bitesTaken` aumenta, e que `ChocolateRewardSvg` renderiza o SVG do chocolate.

- [ ] **Step 2: Rodar testes para confirmar falha**

Run: `npm test -- tests/temporizadorSprites.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementar `CharacterAvatar.tsx` e `FoodSprites.tsx`**

Construir SVGs limpos, sem padding transparente externo, garantindo que a boca do boneco fique na extremidade direita (`x ≈ 95%` do `viewBox`) para encostar exatamente na borda esquerda do alimento.

- [ ] **Step 4: Rodar testes para verificar aprovação**

Run: `npm test -- tests/temporizadorSprites.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/temporizador/CharacterAvatar.tsx src/components/temporizador/FoodSprites.tsx tests/temporizadorSprites.test.tsx
git commit -m "feat: add customizable modular SVG character, wavy potato chip, and chocolate reward"
```

---

### Task 7: Página & Palco do Temporizador (`/temporizador`) com Fix do iPad Safari

**Files:**
- Create: `src/components/temporizador/TimerStage.tsx`
- Create: `src/components/temporizador/ProfileModal.tsx`
- Create: `src/app/temporizador/page.tsx`
- Test: `tests/temporizadorPage.test.tsx`

**Interfaces:**
- Consumes: `GuiaMoveHeader`, `SoundToggle`, `ParentalLock`, `BigActionButton`, `storage.ts`, `timerEngine.ts`, `soundEngine.ts`, `CharacterAvatar`, `WavyChipSvg`, `ChocolateRewardSvg`
- Produces: Rota `/temporizador` completa.
  - Posicionamento no `TimerStage`: margem esquerda mínima garantida (`paddingLeft >= avatarWidth`) para nunca cortar na 1ª coluna; deslocamento horizontal dinâmico (`biteOffset = chipProgress * (chipWidth * 0.65)`) fazendo o boneco avançar conforme a batata diminui.
  - Botão **Iniciar Temporizador**: dispara `soundEngine.init()`, `requestFullscreen` e `wakeLock` de forma **não-bloqueante** (`try/catch`, sem `await` antes da troca de tela), garantindo execução imediata no iPad Safari.

- [ ] **Step 1: Escrever testes falhando em `tests/temporizadorPage.test.tsx`**

Testar:
1. Selecionar duração (ex.: 1 min) e clicar no botão "Iniciar" muda imediatamente para a tela do timer ativo **mesmo quando `document.documentElement.requestFullscreen` rejeita ou é `undefined`** (simulação de iPad Safari).
2. `CharacterAvatar` recebe deslocamento positivo conforme `chipProgress` avança (acompanha a mordida) e nunca fica com coordenada `left < 0` na 1ª coluna.
3. Tela final exibe `ChocolateRewardSvg` quando `status === 'finished'`.

- [ ] **Step 2: Rodar testes para confirmar falha**

Run: `npm test -- tests/temporizadorPage.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementar `TimerStage.tsx`, `ProfileModal.tsx` e `src/app/temporizador/page.tsx`**

Incluir seleção rápida de tempo (30s, 1m, 2m, 3m, 5m, 10m), perfis de criança salvos em `IndexedDB` (com cropper simples de foto + customizador de `AvatarConfig`), trava parental para pausar/sair durante a contagem e paleta **Céu & Clareza**.

- [ ] **Step 4: Rodar testes para verificar aprovação**

Run: `npm test -- tests/temporizadorPage.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/temporizador src/app/temporizador tests/temporizadorPage.test.tsx
git commit -m "feat: migrate Temporizador to Next.js with Ceu e Clareza palette and iPad Safari start fix"
```

---

### Task 8: Termômetro Sensorial e de Emoções (`/termometro`)

**Files:**
- Create: `src/lib/termometro/zones.ts`
- Create: `src/components/termometro/RegulationView.tsx`
- Create: `src/components/termometro/ParentalEditorModal.tsx`
- Create: `src/app/termometro/page.tsx`
- Test: `tests/termometro.test.tsx`

**Interfaces:**
- Consumes: `GuiaMoveHeader`, `SoundToggle`, `ParentalLock`, `BigActionButton`, `getLocalJson`, `setLocalJson`
- Produces:
  - 4 zonas padrão **Zones of Regulation** (`blue`, `green`, `yellow`, `red`) com cores acessíveis, expressões simples e 1 estratégia principal configurável por zona:
    - `'breathing'` (Respiração Guiada com círculo animado CSS 4s-4s-4s)
    - `'calm_sound'` (Som Ambiente Suave gerado localmente via Web Audio API — ruído rosa/chuva filtrada)
    - `'pause_button'` (Botão Gigante de "Preciso de Pausa" com confirmação visual)
    - `'custom_text'` (Cartão de Regulação com ícone escolhido + texto dos pais + leitura opcional via `window.speechSynthesis` em `pt-BR`)
  - Chave no `localStorage`: `'guiamove_termometro_config_v1'`.

- [ ] **Step 1: Escrever testes falhando em `tests/termometro.test.tsx`**

Testar:
1. Renderiza exatamente as 4 zonas (Azul, Verde, Amarelo, Vermelho).
2. Clicar em uma zona abre **diretamente** a tela de regulação da estratégia principal configurada (sem etapa intermediária).
3. Configurar uma estratégia `'custom_text'` (ex.: `"Abraçar o urso"`) via editor e salvar persiste no `localStorage` e exibe o Cartão de Regulação ao tocar na zona.
4. Clicar em "Ouvir" no cartão personalizado não quebra quando `window.speechSynthesis` não está disponível.

- [ ] **Step 2: Rodar testes para confirmar falha**

Run: `npm test -- tests/termometro.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementar `zones.ts`, `RegulationView.tsx`, `ParentalEditorModal.tsx` e `src/app/termometro/page.tsx`**

Proteger a abertura do `ParentalEditorModal` com `ParentalLock` (segurar 2s). Manter alto contraste (`#0F172A` sobre `#FFFFFF`) e zero sobrecarga visual.

- [ ] **Step 4: Rodar testes para verificar aprovação**

Run: `npm test -- tests/termometro.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/termometro src/components/termometro src/app/termometro tests/termometro.test.tsx
git commit -m "feat: add Sensory and Emotion Thermometer with Zones of Regulation and custom parent cards"
```

---

### Task 9: Service Worker Offline & Verificação Final da Onda 1

**Files:**
- Create: `public/sw.js`
- Create: `src/components/shared/PwaRegister.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Criar `public/sw.js` e `PwaRegister.tsx`**

Registrar Service Worker com cache de shell estático para `/`, `/temporizador` e `/termometro` (estratégia network-first para páginas e cache-first para assets estáticos), sem bloquear navegação.

- [ ] **Step 2: Rodar suíte completa de testes e build de produção**

Run: `npm test` e `npm run build` e `npm run lint`
Expected: Todos os testes passando, build Next.js limpo sem erros de TypeScript ou ESLint.

- [ ] **Step 3: Commit final da Onda 1**

```bash
git add public/sw.js src/components/shared/PwaRegister.tsx src/app/layout.tsx
git commit -m "chore: add offline PWA service worker and verify Wave 1 build"
```
