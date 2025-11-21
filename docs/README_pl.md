# アバターデモ

<img style="max-width: 100%;" src="../public/ogp.png">

**Ogłoszenie: Od wersji v2.0.0 projekt ten przyjął niestandardową licencję. W przypadku użytku komercyjnego prosimy o zapoznanie się z sekcją [Warunki użytkowania](#warunki-użytkowania).**


<div align="center">
   <h3>
      📚 Queue株式会社 Dokumentacja 📚
   </h3>
</div>

<h3 align="center">
   <a href="../README.md">日本語</a>｜
   <a href="./README_en.md">English</a>｜
   <a href="./README_zh.md">中文</a>｜
   <a href="./README_ko.md">한국어</a>
</h3>

## Przegląd

アバターデモ to zestaw narzędzi open source, który pozwala każdemu łatwo zbudować aplikację internetową do czatowania z postaciami AI.<br>
Obsługuje różnorodne usługi AI, modele postaci i silniki syntezy mowy, oferując różne tryby rozszerzeń, koncentrując się na funkcjach dialogowych i streamingowych z wysokim stopniem personalizacji.

<img src="./images/architecture_en.svg" alt="アバターデモ Architecture">

Szczegółowe instrukcje użytkowania i konfiguracji można znaleźć w dokumentacji Queue株式会社.

## Główne funkcje

### 1. Interakcja z postaciami AI

- Łatwa rozmowa z postaciami AI przy użyciu kluczy API różnych LLM
- Obsługa multimodalna z rozpoznawaniem obrazów z kamery i przesłanych zdjęć
- Zachowywanie ostatnich rozmów w pamięci

### 2. YouTube Streaming

- Automatyczne odpowiedzi postaci AI na komentarze ze streamów YouTube
- Tryb ciągłej rozmowy umożliwiający spontaniczne wypowiedzi nawet bez komentarzy
- Funkcja pomijania komentarzy rozpoczynających się od "#"

### 3. Inne funkcje

- **Tryb integracji zewnętrznej**: Zaawansowane funkcje poprzez połączenie WebSocket z aplikacją serwerową
- **Tryb prezentacji**: Tryb automatycznej prezentacji slajdów przez postać AI
- **API czasu rzeczywistego**: Rozmowy i wykonywanie funkcji z niskim opóźnieniem przy użyciu OpenAI Realtime API
- **Tryb audio**: Naturalna konwersacja głosowa wykorzystująca OpenAI Audio API
- **Funkcja odbierania wiadomości**: Możliwość wydawania poleceń postaci AI poprzez dedykowane API

## Obsługiwane modele i usługi

### Modele postaci

- **Modele 3D**: Pliki VRM
- **Modele 2D**: Pliki Live2D (Cubism 3 i nowsze)

### Obsługiwane LLM

- OpenAI
- Anthropic
- Google Gemini
- Azure OpenAI
- Groq
- Cohere
- Mistral AI
- Perplexity
- Fireworks
- Lokalne LLM
- Dify

### Obsługiwane silniki syntezy mowy

- VOICEVOX
- Koeiromap
- Google Text-to-Speech
- Style-Bert-VITS2
- AivisSpeech
- GSVI TTS
- ElevenLabs
- OpenAI
- Azure OpenAI
- Nijivoice

## Szybki start

### Środowisko programistyczne

- Node.js: ^20.0.0
- npm: ^10.0.0

### Instrukcje instalacji

1. Zainstaluj pakiety.

```bash
npm install
```

4. Uruchom aplikację w trybie deweloperskim.

```bash
npm run dev
```

5. Otwórz URL: [http://localhost:3000](http://localhost:3000)

6. W razie potrzeby utwórz plik .env.

```bash
cp .env.example .env
```

Szczegółowe instrukcje konfiguracji i użytkowania można znaleźć w dokumentacji Queue株式会社.

## ⚠️ Ważne uwagi dotyczące bezpieczeństwa

To repozytorium jest przeznaczone zarówno do użytku osobistego i rozwoju w środowisku lokalnym, jak i do użytku komercyjnego z odpowiednimi środkami bezpieczeństwa. Jednak podczas wdrażania w środowisku internetowym należy zwrócić uwagę na następujące punkty:

- **Obsługa kluczy API**: Ponieważ system jest zaprojektowany do wywoływania API usług AI (OpenAI, Anthropic itp.) i usług TTS poprzez serwer backendowy, wymagane jest odpowiednie zarządzanie kluczami API.

### Użycie w środowisku produkcyjnym

W przypadku użycia w środowisku produkcyjnym zalecane jest jedno z następujących podejść:

1. **Implementacja serwera backendowego**: Zarządzanie kluczami API po stronie serwera i unikanie bezpośredniego dostępu do API z klienta
2. **Odpowiednie instrukcje dla użytkowników**: W przypadku gdy użytkownicy używają własnych kluczy API, wyjaśnienie kwestii bezpieczeństwa
3. **Implementacja kontroli dostępu**: W razie potrzeby wdrożenie odpowiednich mechanizmów uwierzytelniania i autoryzacji

## Warunki użytkowania

### Licencja

Od wersji v2.0.0 projekt ten przyjął **niestandardową licencję**.

- **Bezpłatne użytkowanie**

  - Dozwolone jest bezpłatne użytkowanie do celów osobistych (niekomercyjnych), edukacyjnych i non-profit.

- **Licencja komercyjna**
  - Do użytku komercyjnego wymagane jest uzyskanie oddzielnej licencji komercyjnej.
  - Szczegóły można znaleźć w [informacjach o licencji](./license_en.md).

### Inne

- [Warunki użytkowania logo](./logo_licence_pl.md)
- [Warunki użytkowania modeli VRM i Live2D](./character_model_licence_pl.md)

## Priorytetowa implementacja

W tym projekcie oferujemy płatną priorytetową implementację funkcji.

- Możliwa jest priorytetowa implementacja funkcji na życzenie firm lub osób prywatnych.
- Zaimplementowane funkcje będą publicznie dostępne jako część tego projektu open source.
- Opłaty są wyceniane indywidualnie w zależności od złożoności funkcji i czasu potrzebnego na implementację.
- Ta priorytetowa implementacja jest oddzielna od licencji komercyjnej. Do komercyjnego wykorzystania zaimplementowanych funkcji nadal wymagane jest uzyskanie oddzielnej licencji komercyjnej.

Aby uzyskać więcej informacji, prosimy o kontakt pod adresem queue@queue-tech.jp.
