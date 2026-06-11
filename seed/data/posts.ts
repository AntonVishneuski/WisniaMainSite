import type { CATEGORY_VALUES } from '../../src/collections/Posts'

export type Block = { kind: 'h2' | 'h3' | 'p'; text: string }

export type Category = (typeof CATEGORY_VALUES)[number]

export interface PostRow {
  slug: string
  category: Category
  publishedAt: string // ISO date
  lastReviewed?: string
  authorKey: string
  reviewerKey?: string
  relatedServiceSlug?: string
  relatedSlugs?: string[]
  coverFile: string | null
  title: { pl: string; ru: string }
  excerpt: { pl: string; ru: string }
  body: { pl: Block[]; ru: Block[] }
  metaTitle: { pl: string; ru: string }
  metaDescription: { pl: string; ru: string }
}

export const posts: PostRow[] = [
  {
    slug: 'depilacja-laserowa-latem',
    category: 'depilacja-laserowa',
    publishedAt: '2026-05-20',
    lastReviewed: '2026-05-20',
    authorKey: 'olga',
    reviewerKey: 'reviewer',
    relatedServiceSlug: 'depilacja-laserowa-warszawa',
    relatedSlugs: ['ipl-czy-rf-lifting', 'jak-usunac-naczynka-na-twarzy'],
    coverFile: null,
    title: {
      pl: 'Kiedy robić depilację laserową latem',
      ru: 'Когда делать лазерную эпиляцию летом',
    },
    excerpt: {
      pl: 'Depilację laserową można wykonywać przez cały rok, także latem, jeśli przestrzega się kilku zasad. Kluczowa jest ochrona skóry przed słońcem.',
      ru: 'Лазерную эпиляцию можно делать круглый год, в том числе летом, если соблюдать несколько правил. Главное защита кожи от солнца.',
    },
    body: {
      pl: [
        {
          kind: 'p',
          text: 'Depilację laserową można wykonywać przez cały rok, także latem, jeśli przestrzega się kilku zasad. Kluczowa jest ochrona skóry przed słońcem.',
        },
        { kind: 'h2', text: 'Dlaczego słońce ma znaczenie' },
        {
          kind: 'p',
          text: 'Opalona skóra zawiera więcej melaniny, co może wpływać na komfort i bezpieczeństwo zabiegu. Dlatego unikamy lasera na świeżo opaloną skórę.',
        },
        { kind: 'h2', text: 'Jak przygotować się latem' },
        { kind: 'p', text: 'Unikaj opalania i solarium na 2 tygodnie przed i po zabiegu.' },
        { kind: 'p', text: 'Stosuj krem z filtrem SPF 50 na odsłonięte partie.' },
        { kind: 'p', text: 'Ogol strefę dobę przed wizytą.' },
        { kind: 'p', text: 'Nie używaj samoopalacza przed zabiegiem.' },
        { kind: 'h2', text: 'Najlepszy moment' },
        {
          kind: 'p',
          text: 'Wieczorne wizyty i strefy zwykle zakryte ubraniem to dobry wybór latem. Pełny plan ustalimy na konsultacji.',
        },
      ],
      ru: [
        {
          kind: 'p',
          text: 'Лазерную эпиляцию можно делать круглый год, в том числе летом, если соблюдать несколько правил. Главное защита кожи от солнца.',
        },
        { kind: 'h2', text: 'Почему важно солнце' },
        {
          kind: 'p',
          text: 'Загорелая кожа содержит больше меланина, что может влиять на комфорт и безопасность. Поэтому мы не работаем лазером по свежему загару.',
        },
        { kind: 'h2', text: 'Как подготовиться летом' },
        { kind: 'p', text: 'Избегайте загара и солярия 2 недели до и после процедуры.' },
        { kind: 'p', text: 'Наносите SPF 50 на открытые участки.' },
        { kind: 'p', text: 'Побрейте зону за сутки до визита.' },
        { kind: 'p', text: 'Не используйте автозагар перед процедурой.' },
        { kind: 'h2', text: 'Лучшее время' },
        {
          kind: 'p',
          text: 'Вечерние визиты и зоны, обычно скрытые одеждой, хороший выбор летом. Полный план составим на консультации.',
        },
      ],
    },
    metaTitle: {
      pl: 'Depilacja laserowa latem | Wiśnia Beauty',
      ru: 'Лазерная эпиляция летом | Wiśnia Beauty',
    },
    metaDescription: {
      pl: 'Czy można robić depilację laserową latem? Wyjaśniamy zasady bezpieczeństwa i jak przygotować skórę.',
      ru: 'Можно ли делать лазерную эпиляцию летом? Объясняем правила безопасности и как подготовить кожу.',
    },
  },
  {
    slug: 'dlaczego-pojawiaja-sie-przebarwienia',
    category: 'czyszczenie-pielegnacja',
    publishedAt: '2026-04-22',
    lastReviewed: '2026-04-22',
    authorKey: 'olga',
    reviewerKey: 'reviewer',
    relatedServiceSlug: 'oczyszczanie-twarzy-warszawa',
    relatedSlugs: ['jak-usunac-naczynka-na-twarzy', 'ipl-czy-rf-lifting'],
    coverFile: null,
    title: {
      pl: 'Dlaczego pojawiają się przebarwienia',
      ru: 'Почему появляются пигментные пятна',
    },
    excerpt: {
      pl: 'Przebarwienia to miejscowy nadmiar melaniny. Pojawiają się z różnych powodów, a kluczem do równego kolorytu jest połączenie ochrony i zabiegów.',
      ru: 'Пигментация это локальный избыток меланина. Появляется по разным причинам, а ключ к ровному тону это сочетание защиты и процедур.',
    },
    body: {
      pl: [
        {
          kind: 'p',
          text: 'Przebarwienia to miejscowy nadmiar melaniny. Pojawiają się z różnych powodów, a kluczem do równego kolorytu jest połączenie ochrony i zabiegów.',
        },
        { kind: 'h2', text: 'Najczęstsze przyczyny' },
        { kind: 'p', text: 'Promieniowanie UV i fotostarzenie.' },
        { kind: 'p', text: 'Zmiany hormonalne (np. melasma).' },
        { kind: 'p', text: 'Pozostałości po stanach zapalnych i trądziku.' },
        { kind: 'p', text: 'Wiek i kumulacja uszkodzeń słonecznych.' },
        { kind: 'h2', text: 'Jak redukować przebarwienia' },
        {
          kind: 'p',
          text: 'Dobre efekty daje IPL oraz peelingi dobrane do rodzaju przebarwień. Plan zabiegowy zawsze ustalamy indywidualnie po analizie skóry.',
        },
        { kind: 'h2', text: 'Profilaktyka' },
        {
          kind: 'p',
          text: 'Codzienna ochrona przeciwsłoneczna SPF to podstawa, bez niej przebarwienia będą wracać. To najprostszy sposób, by chronić efekt zabiegów.',
        },
      ],
      ru: [
        {
          kind: 'p',
          text: 'Пигментация это локальный избыток меланина. Появляется по разным причинам, а ключ к ровному тону это сочетание защиты и процедур.',
        },
        { kind: 'h2', text: 'Самые частые причины' },
        { kind: 'p', text: 'УФ-излучение и фотостарение.' },
        { kind: 'p', text: 'Гормональные изменения (например, мелазма).' },
        { kind: 'p', text: 'Следы после воспалений и акне.' },
        { kind: 'p', text: 'Возраст и накопление солнечных повреждений.' },
        { kind: 'h2', text: 'Как уменьшать пигментацию' },
        {
          kind: 'p',
          text: 'Хорошие результаты дают IPL и пилинги, подобранные под тип пигментации. План процедур всегда составляем индивидуально после анализа кожи.',
        },
        { kind: 'h2', text: 'Профилактика' },
        {
          kind: 'p',
          text: 'Ежедневная защита SPF это основа, без неё пигментация будет возвращаться. Это самый простой способ сохранить результат процедур.',
        },
      ],
    },
    metaTitle: {
      pl: 'Przebarwienia na twarzy — przyczyny | Wiśnia Beauty',
      ru: 'Пигментные пятна на лице — причины | Wiśnia Beauty',
    },
    metaDescription: {
      pl: 'Przebarwienia na twarzy: przyczyny powstawania i skuteczne metody na równy koloryt skóry.',
      ru: 'Пигментные пятна на лице: причины появления и эффективные методы для ровного тона кожи.',
    },
  },
  {
    slug: 'jak-usunac-naczynka-na-twarzy',
    category: 'zabiegi-specjalistyczne',
    publishedAt: '2026-05-06',
    lastReviewed: '2026-05-06',
    authorKey: 'olga',
    reviewerKey: 'reviewer',
    relatedServiceSlug: 'usuwanie-naczynek-warszawa',
    relatedSlugs: ['dlaczego-pojawiaja-sie-przebarwienia', 'ipl-czy-rf-lifting'],
    coverFile: null,
    title: {
      pl: 'Jak usunąć naczynka na twarzy',
      ru: 'Как убрать сосуды на лице',
    },
    excerpt: {
      pl: 'Naczynka to rozszerzone, widoczne naczynka krwionośne, najczęściej na nosie i policzkach. Same kremy ich nie usuną, ale można je skutecznie zredukować zabiegowo.',
      ru: 'Сосуды это расширенные, видимые кровеносные сосуды, чаще на носу и щеках. Одни кремы их не уберут, но их можно эффективно сократить процедурами.',
    },
    body: {
      pl: [
        {
          kind: 'p',
          text: 'Naczynka to rozszerzone, widoczne naczynka krwionośne, najczęściej na nosie i policzkach. Same kremy ich nie usuną, ale można je skutecznie zredukować zabiegowo.',
        },
        { kind: 'h2', text: 'Skąd się biorą' },
        { kind: 'p', text: 'Predyspozycje genetyczne i kuperoza.' },
        { kind: 'p', text: 'Słońce, mróz i gwałtowne zmiany temperatury.' },
        { kind: 'p', text: 'Ostre jedzenie, alkohol i gorące napoje.' },
        { kind: 'p', text: 'Niewłaściwa, podrażniająca pielęgnacja.' },
        { kind: 'h2', text: 'Co realnie pomaga' },
        {
          kind: 'p',
          text: 'Najskuteczniejsze jest zamykanie naczynek energią świetlną oraz IPL przy rozległym zaczerwienieniu. Zabiegi są precyzyjne i nie wymagają nakłuwania skóry.',
        },
        { kind: 'h2', text: 'Pielęgnacja wspierająca' },
        {
          kind: 'p',
          text: 'Łagodna pielęgnacja, ochrona przeciwsłoneczna i unikanie czynników nasilających zaczerwienienie pomagają utrzymać efekt na dłużej.',
        },
      ],
      ru: [
        {
          kind: 'p',
          text: 'Сосуды это расширенные, видимые кровеносные сосуды, чаще на носу и щеках. Одни кремы их не уберут, но их можно эффективно сократить процедурами.',
        },
        { kind: 'h2', text: 'Откуда берутся' },
        { kind: 'p', text: 'Генетика и купероз.' },
        { kind: 'p', text: 'Солнце, мороз и резкие перепады температуры.' },
        { kind: 'p', text: 'Острая еда, алкоголь и горячие напитки.' },
        { kind: 'p', text: 'Неправильный, раздражающий уход.' },
        { kind: 'h2', text: 'Что реально помогает' },
        {
          kind: 'p',
          text: 'Самое эффективное это закрытие сосудов световой энергией и IPL при обширном покраснении. Процедуры точные и не требуют проколов кожи.',
        },
        { kind: 'h2', text: 'Поддерживающий уход' },
        {
          kind: 'p',
          text: 'Мягкий уход, защита от солнца и отказ от провоцирующих факторов помогают сохранить результат дольше.',
        },
      ],
    },
    metaTitle: {
      pl: 'Jak usunąć naczynka na twarzy | Wiśnia Beauty',
      ru: 'Как убрать сосуды на лице | Wiśnia Beauty',
    },
    metaDescription: {
      pl: 'Naczynka i kuperoza na twarzy: skąd się biorą i jak je skutecznie usunąć. Praktyczny poradnik.',
      ru: 'Сосуды и купероз на лице: откуда берутся и как их эффективно убрать. Практический гид.',
    },
  },
  {
    slug: 'ipl-czy-rf-lifting',
    category: 'odmlodzenie-twarzy',
    publishedAt: '2026-05-14',
    lastReviewed: '2026-05-14',
    authorKey: 'olga',
    reviewerKey: 'reviewer',
    relatedServiceSlug: 'rf-lifting-warszawa',
    relatedSlugs: ['depilacja-laserowa-latem', 'dlaczego-pojawiaja-sie-przebarwienia'],
    coverFile: null,
    title: {
      pl: 'IPL czy RF-lifting? Co wybrać',
      ru: 'IPL или RF-лифтинг? Что выбрать',
    },
    excerpt: {
      pl: 'IPL i RF-lifting bywają mylone, bo oba poprawiają wygląd skóry. Działają jednak inaczej i rozwiązują inne problemy.',
      ru: 'IPL и RF-лифтинг часто путают, ведь оба улучшают вид кожи. Но работают они по-разному и решают разные задачи.',
    },
    body: {
      pl: [
        {
          kind: 'p',
          text: 'IPL i RF-lifting bywają mylone, bo oba poprawiają wygląd skóry. Działają jednak inaczej i rozwiązują inne problemy.',
        },
        { kind: 'h2', text: 'IPL: koloryt i naczynka' },
        {
          kind: 'p',
          text: 'IPL to intensywne światło impulsowe. Najlepiej sprawdza się przy przebarwieniach, naczynkach i oznakach fotostarzenia. Wyrównuje koloryt i rozświetla skórę.',
        },
        { kind: 'h2', text: 'RF-lifting: jędrność i owal' },
        {
          kind: 'p',
          text: 'RF-lifting wykorzystuje fale radiowe, które pobudzają produkcję kolagenu. To wybór, gdy zależy nam na ujędrnieniu skóry i poprawie owalu twarzy.',
        },
        { kind: 'h2', text: 'Jak wybrać' },
        { kind: 'p', text: 'Przebarwienia i naczynka: IPL.' },
        { kind: 'p', text: 'Wiotkość i owal twarzy: RF-lifting.' },
        { kind: 'p', text: 'Często najlepszy efekt daje połączenie obu w planie zabiegowym.' },
        {
          kind: 'p',
          text: 'Najprościej ustalić to na bezpłatnej konsultacji, na której ocenimy stan skóry i dobierzemy plan.',
        },
      ],
      ru: [
        {
          kind: 'p',
          text: 'IPL и RF-лифтинг часто путают, ведь оба улучшают вид кожи. Но работают они по-разному и решают разные задачи.',
        },
        { kind: 'h2', text: 'IPL: тон и сосуды' },
        {
          kind: 'p',
          text: 'IPL это интенсивный импульсный свет. Лучше всего работает с пигментацией, сосудами и признаками фотостарения. Выравнивает тон и придаёт сияние.',
        },
        { kind: 'h2', text: 'RF-лифтинг: упругость и овал' },
        {
          kind: 'p',
          text: 'RF-лифтинг использует радиоволны, стимулирующие выработку коллагена. Это выбор, когда нужна упругость кожи и улучшение овала лица.',
        },
        { kind: 'h2', text: 'Как выбрать' },
        { kind: 'p', text: 'Пигментация и сосуды: IPL.' },
        { kind: 'p', text: 'Дряблость и овал лица: RF-лифтинг.' },
        { kind: 'p', text: 'Часто лучший результат даёт сочетание обоих в плане процедур.' },
        {
          kind: 'p',
          text: 'Проще всего решить это на бесплатной консультации, где мы оценим кожу и подберём план.',
        },
      ],
    },
    metaTitle: {
      pl: 'IPL czy RF-lifting? | Wiśnia Beauty',
      ru: 'IPL или RF-лифтинг? | Wiśnia Beauty',
    },
    metaDescription: {
      pl: 'IPL czy RF-lifting? Wyjaśniamy różnice, wskazania i to, jak wybrać zabieg dla swojej skóry.',
      ru: 'IPL или RF-лифтинг? Объясняем разницу, показания и как выбрать процедуру для своей кожи.',
    },
  },
]
