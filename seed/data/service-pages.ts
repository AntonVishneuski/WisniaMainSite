export interface ServicePageRow {
  slug: string
  order: number
  title: { pl: string; ru: string }
  heading: { pl: string; ru: string }
  intro: { pl: string; ru: string }
  priceFrom?: { pl: string; ru: string }
  about: { pl: string; ru: string }
  forWhom: { pl: string; ru: string } | null
  results: { pl: string; ru: string } | null
  steps: Array<{ title: { pl: string; ru: string }; text: { pl: string; ru: string } }>
  priceNames: string[]
  packagePromo: {
    enabled: boolean
    badge: string
    title: { pl: string; ru: string }
    desc: { pl: string; ru: string }
    nowPrice: { pl: string; ru: string }
    wasPrice: { pl: string; ru: string }
    link: string
  }
  reviews: Array<{
    quote: { pl: string; ru: string }
    author: string
    initial: string
    avatarColor: string
    rating: number
    source: 'Google' | 'Booksy'
    date: { pl: string; ru: string }
  }>
  beforeAfter: Array<{
    beforeFile: string
    afterFile: string
    caption: { pl: string; ru: string }
  }>
  heroFile: string | null
  crossLinks: string[]
  metaTitle: { pl: string; ru: string }
  metaDescription: { pl: string; ru: string }
}

export const servicePages: ServicePageRow[] = [
  // 0 — Depilacja laserowa (kobiety)
  {
    slug: 'depilacja-laserowa-warszawa',
    order: 0,
    title: {
      pl: 'Depilacja laserowa',
      ru: 'Лазерная эпиляция',
    },
    heading: {
      pl: 'Depilacja laserowa w Warszawie',
      ru: 'Лазерная эпиляция в Варшаве',
    },
    intro: {
      pl: 'Gładka skóra na długo. Pracujemy na laserze Estera, jednym z najskuteczniejszych w Warszawie, bezpiecznie dla różnych typów skóry.',
      ru: 'Гладкая кожа надолго. Работаем на лазере Estera, одном из самых эффективных в Варшаве, безопасно для разных типов кожи.',
    },
    about: {
      pl: 'Laser oddziałuje na mieszek włosowy i stopniowo ogranicza odrastanie włosów. Zabieg jest komfortowy dzięki systemowi chłodzenia, a efekt narasta z każdą sesją.',
      ru: 'Лазер воздействует на волосяной фолликул и постепенно сокращает рост волос. Процедура комфортна благодаря системе охлаждения, а эффект нарастает с каждым сеансом.',
    },
    forWhom: {
      pl: 'Owłosienie na nogach, bikini, pachach, twarzy i dłoniach\n\nWrastające włosy i podrażnienia po goleniu\n\nOsoby, które chcą zrezygnować z golenia i woskowania\n\nSkóra jasna i średnio pigmentowana (dobór parametrów na konsultacji)',
      ru: 'Волосы на ногах, бикини, подмышках, лице и руках\n\nВросшие волосы и раздражение после бритья\n\nТе, кто хочет отказаться от бритья и воска\n\nСветлая и средняя кожа (параметры подбираем на консультации)',
    },
    results: {
      pl: 'Trwałe ograniczenie owłosienia, gładka skóra bez podrażnień i wrastających włosów. Liczba sesji zależy od strefy i indywidualnych cech.',
      ru: 'Стойкое сокращение волос, гладкая кожа без раздражений и вросших волос. Число сеансов зависит от зоны и индивидуальных особенностей.',
    },
    steps: [
      {
        title: { pl: 'Konsultacja', ru: 'Консультация' },
        text: {
          pl: 'Oceniamy skórę i typ owłosienia, ustalamy plan i liczbę sesji.',
          ru: 'Оцениваем кожу и тип волос, составляем план и число сеансов.',
        },
      },
      {
        title: { pl: 'Zabieg', ru: 'Процедура' },
        text: {
          pl: 'Ogol strefę dobę wcześniej. Sesja trwa od kilku do kilkudziesięciu minut.',
          ru: 'Побрейте зону за сутки. Сеанс длится от нескольких до десятков минут.',
        },
      },
      {
        title: { pl: 'Seria', ru: 'Курс' },
        text: {
          pl: 'Najlepszy efekt daje seria zabiegów w odstępach dobranych indywidualnie.',
          ru: 'Лучший результат даёт курс процедур с индивидуальными интервалами.',
        },
      },
    ],
    priceNames: [
      'Bikini głębokie',
      'Pachy',
      'Nogi całe',
      'Ręce całe (+ palce)',
      'Plecy całe',
    ],
    packagePromo: {
      enabled: true,
      badge: '-15%',
      title: { pl: '«Całe ciało»', ru: '«Всё тело»' },
      desc: {
        pl: 'Combo: bikini extra + pachy + nogi + ręce.',
        ru: 'Комбо: бикини extra + подмышки + ноги + руки.',
      },
      nowPrice: { pl: '950 zł', ru: '950 zł' },
      wasPrice: { pl: 'zamiast 1140 zł', ru: 'вместо 1140 zł' },
      link: '#pakiety',
    },
    reviews: [
      {
        quote: {
          pl: '„Robiłam depilację laserową w różnych salonach, ale najlepsze efekty osiągnęłam w Wiśnia Beauty. Już po pierwszym zabiegu włosów prawie nie zostało. Mają jeden z najlepszych laserów w Warszawie, różnica w rezultatach jest ogromna."',
          ru: '«Делала лазерную эпиляцию в разных салонах, но лучших результатов добилась в Wiśnia Beauty. Уже после первой процедуры волос почти не осталось. Здесь один из лучших лазеров в Варшаве, разница в результатах огромная.»',
        },
        author: 'Kitnormal Kit',
        initial: 'K',
        avatarColor: '#8B1A3A',
        rating: 5,
        source: 'Google',
        date: { pl: 'miesiąc temu', ru: 'месяц назад' },
      },
      {
        quote: {
          pl: '„Byłam na depilacji laserowej u Pani Olgi, zabieg przeszedł zupełnie bezboleśnie i komfortowo. Miło było porozmawiać przy pysznej herbacie. Bardzo polecam!"',
          ru: '«Делала лазерную эпиляцию у мастера Ольги, процедура прошла абсолютно безболезненно и комфортно. Было приятно побеседовать за вкусным чаем. Очень рекомендую!»',
        },
        author: 'Oksana Nadieieva',
        initial: 'O',
        avatarColor: '#C9956C',
        rating: 5,
        source: 'Google',
        date: { pl: '8 miesięcy temu', ru: '8 месяцев назад' },
      },
    ],
    beforeAfter: [
      {
        beforeFile: 'wisnia-beauty/design_handoff/source/assets/ba1-before.jpg',
        afterFile: 'wisnia-beauty/design_handoff/source/assets/ba1-after.jpg',
        caption: {
          pl: 'Redukcja zaczerwienień i ujednolicenie kolorytu skóry',
          ru: 'Уменьшение покраснений и выравнивание тона кожи',
        },
      },
    ],
    heroFile: 'wisnia-beauty/design_handoff/source/assets/hero-laser.jpg',
    crossLinks: [
      'depilacja-laserowa-mezczyzni-warszawa',
      'ipl-fotoodmladzanie-warszawa',
      'usuwanie-naczynek-warszawa',
    ],
    metaTitle: {
      pl: 'Depilacja laserowa Warszawa | Wiśnia Beauty Studio',
      ru: 'Лазерная эпиляция Варшава | Wiśnia Beauty Studio',
    },
    metaDescription: {
      pl: 'Depilacja laserowa w centrum Warszawy na laserze Estera. Skuteczne, trwałe usuwanie owłosienia dla kobiet. Bezpłatna konsultacja.',
      ru: 'Лазерная эпиляция в центре Варшавы на лазере Estera. Эффективное, стойкое удаление волос для женщин. Бесплатная консультация.',
    },
  },

  // 1 — Depilacja laserowa dla mężczyzn
  {
    slug: 'depilacja-laserowa-mezczyzni-warszawa',
    order: 1,
    title: {
      pl: 'Depilacja dla mężczyzn',
      ru: 'Эпиляция для мужчин',
    },
    heading: {
      pl: 'Depilacja laserowa dla mężczyzn',
      ru: 'Лазерная эпиляция для мужчин',
    },
    intro: {
      pl: 'Mniej owłosienia, mniej podrażnień. Depilacja laserowa dla mężczyzn na laserze Estera, w komfortowych i dyskretnych warunkach.',
      ru: 'Меньше волос, меньше раздражения. Лазерная эпиляция для мужчин на лазере Estera, в комфортных и деликатных условиях.',
    },
    about: {
      pl: 'Laser rozwiązuje problem gęstego owłosienia i wrastających włosów na dużych partiach ciała. To wygodna alternatywa dla golenia, które bywa czasochłonne i podrażnia skórę.',
      ru: 'Лазер решает проблему густых волос и врастания на больших участках тела. Это удобная альтернатива бритью, которое отнимает время и раздражает кожу.',
    },
    forWhom: {
      pl: 'Plecy i kark\n\nKlatka piersiowa i brzuch\n\nKontur brody\n\nPachy i szyja',
      ru: 'Спина и шея сзади\n\nГрудь и живот\n\nКонтур бороды\n\nПодмышки и шея',
    },
    results: {
      pl: 'Gładsza skóra, mniej wrastających włosów i podrażnień. Pełną listę stref i wycenę ustalamy indywidualnie, napisz na WhatsApp.',
      ru: 'Более гладкая кожа, меньше врастания и раздражения. Полный список зон и цену согласуем индивидуально, напишите в WhatsApp.',
    },
    steps: [
      {
        title: { pl: 'Konsultacja', ru: 'Консультация' },
        text: {
          pl: 'Dobieramy strefy i parametry pod typ skóry i owłosienia.',
          ru: 'Подбираем зоны и параметры под тип кожи и волос.',
        },
      },
      {
        title: { pl: 'Zabieg', ru: 'Процедура' },
        text: {
          pl: 'Ogol strefę dobę wcześniej. Chłodzenie zapewnia komfort podczas sesji.',
          ru: 'Побрейте зону за сутки. Охлаждение обеспечивает комфорт во время сеанса.',
        },
      },
      {
        title: { pl: 'Seria', ru: 'Курс' },
        text: {
          pl: 'Efekt utrwala seria zabiegów w dobranych odstępach.',
          ru: 'Эффект закрепляет курс процедур с подобранными интервалами.',
        },
      },
    ],
    priceNames: [
      'Plecy całe [mężczyźni]',
      'Klatka + brzuch',
      'Kontur brody',
      'Pachy [mężczyźni]',
      'Szyja',
    ],
    packagePromo: {
      enabled: true,
      badge: '-15%',
      title: { pl: 'Kurs 6 zabiegów −15%', ru: 'Курс 6 процедур −15%' },
      desc: {
        pl: 'Wykup kurs depilacji wybranej strefy i zapłać mniej.',
        ru: 'Курс эпиляции выбранной зоны выгоднее.',
      },
      nowPrice: { pl: '-15%', ru: '-15%' },
      wasPrice: { pl: '', ru: '' },
      link: '#pakiety',
    },
    reviews: [
      {
        quote: {
          pl: '„Robiłam depilację laserową w różnych salonach, ale najlepsze efekty osiągnęłam w Wiśnia Beauty. Już po pierwszym zabiegu włosów prawie nie zostało. Mają jeden z najlepszych laserów w Warszawie, różnica w rezultatach jest ogromna."',
          ru: '«Делала лазерную эпиляцию в разных салонах, но лучших результатов добилась в Wiśnia Beauty. Уже после первой процедуры волос почти не осталось. Здесь один из лучших лазеров в Варшаве, разница в результатах огромная.»',
        },
        author: 'Kitnormal Kit',
        initial: 'K',
        avatarColor: '#8B1A3A',
        rating: 5,
        source: 'Google',
        date: { pl: 'miesiąc temu', ru: 'месяц назад' },
      },
      {
        quote: {
          pl: '„Byłam na depilacji laserowej u Pani Olgi, zabieg przeszedł zupełnie bezboleśnie i komfortowo. Miło było porozmawiać przy pysznej herbacie. Bardzo polecam!"',
          ru: '«Делала лазерную эпиляцию у мастера Ольги, процедура прошла абсолютно безболезненно и комфортно. Было приятно побеседовать за вкусным чаем. Очень рекомендую!»',
        },
        author: 'Oksana Nadieieva',
        initial: 'O',
        avatarColor: '#C9956C',
        rating: 5,
        source: 'Google',
        date: { pl: '8 miesięcy temu', ru: '8 месяцев назад' },
      },
    ],
    beforeAfter: [],
    heroFile: null,
    crossLinks: ['depilacja-laserowa-warszawa', 'usuwanie-naczynek-warszawa'],
    metaTitle: {
      pl: 'Depilacja laserowa dla mężczyzn Warszawa | Wiśnia Beauty',
      ru: 'Лазерная эпиляция для мужчин Варшава | Wiśnia Beauty',
    },
    metaDescription: {
      pl: 'Depilacja laserowa dla mężczyzn w centrum Warszawy: plecy, klatka, kark, broda. Laser Estera, dyskretnie i skutecznie.',
      ru: 'Лазерная эпиляция для мужчин в центре Варшавы: спина, грудь, шея, борода. Лазер Estera, дискретно и эффективно.',
    },
  },

  // 2 — IPL fotoodmładzanie
  {
    slug: 'ipl-fotoodmladzanie-warszawa',
    priceFrom: { pl: 'od 550 zł', ru: 'от 550 zł' },
    order: 2,
    title: {
      pl: 'IPL fotoodmładzanie',
      ru: 'IPL фотоомоложение',
    },
    heading: {
      pl: 'IPL fotoodmładzanie',
      ru: 'IPL фотоомоложение',
    },
    intro: {
      pl: 'Równy koloryt bez przesady. IPL redukuje przebarwienia, naczynka i drobne oznaki fotostarzenia, przywracając skórze świeży wygląd.',
      ru: 'Ровный тон без перебора. IPL уменьшает пигментацию, сосуды и мелкие признаки фотостарения, возвращая коже свежий вид.',
    },
    about: {
      pl: 'Intensywne światło impulsowe (IPL) działa na przebarwienia i rozszerzone naczynka, a także pobudza skórę do odnowy. To zabieg bez igieł i bez długiej rekonwalescencji.',
      ru: 'Интенсивный импульсный свет (IPL) воздействует на пигментацию и расширенные сосуды, а также стимулирует обновление кожи. Процедура без игл и без долгого восстановления.',
    },
    forWhom: {
      pl: 'Przebarwienia i nierówny koloryt\n\nNaczynka i zaczerwienienia\n\nOznaki fotostarzenia\n\nSkóra po lecie, zmęczona i matowa',
      ru: 'Пигментация и неровный тон\n\nСосуды и покраснения\n\nПризнаки фотостарения\n\nКожа после лета, уставшая и тусклая',
    },
    results: {
      pl: 'Bardziej jednolity koloryt, mniej przebarwień i naczynek, świeższa i rozświetlona skóra. Efekty są indywidualne i zależą od stanu skóry.',
      ru: 'Более ровный тон, меньше пигментации и сосудов, свежая и сияющая кожа. Результаты индивидуальны и зависят от состояния кожи.',
    },
    steps: [
      {
        title: { pl: 'Konsultacja', ru: 'Консультация' },
        text: {
          pl: 'Analiza skóry i dobór protokołu, np. Forever Young.',
          ru: 'Анализ кожи и подбор протокола, например Forever Young.',
        },
      },
      {
        title: { pl: 'Zabieg', ru: 'Процедура' },
        text: {
          pl: 'Krótka, komfortowa sesja. Możesz wrócić do codziennych zajęć.',
          ru: 'Короткий комфортный сеанс. Можно вернуться к делам.',
        },
      },
      {
        title: { pl: 'Seria', ru: 'Курс' },
        text: {
          pl: 'Najlepszy efekt daje seria zabiegów co kilka tygodni.',
          ru: 'Лучший результат даёт курс процедур раз в несколько недель.',
        },
      },
    ],
    priceNames: [
      'Twarz', // IPL category
      'Twarz + szyja', // IPL category
      'Twarz + szyja + dekolt', // IPL category
      'Forever Young Protocol',
    ],
    packagePromo: {
      enabled: true,
      badge: '-15%',
      title: { pl: '3× IPL twarz', ru: '3× IPL лицо' },
      desc: {
        pl: 'Pakiet 3 zabiegów w korzystniejszej cenie.',
        ru: 'Пакет из 3 процедур по выгодной цене.',
      },
      nowPrice: { pl: '1400 zł', ru: '1400 zł' },
      wasPrice: { pl: 'zamiast 1650 zł', ru: 'вместо 1650 zł' },
      link: '#pakiety',
    },
    reviews: [
      {
        quote: {
          pl: '„Właścicielka Olga jest bardzo sympatyczna i dużo wie o tym, jak najlepiej pomóc Twojej skórze. Była dokładna, bardzo się cieszę z wizyty. Serdecznie polecam!"',
          ru: '«Владелица Ольга очень приятная и прекрасно знает, как лучше помочь вашей коже. Была внимательна, я очень довольна визитом. Сердечно рекомендую!»',
        },
        author: 'Dominika',
        initial: 'D',
        avatarColor: '#8B1A3A',
        rating: 5,
        source: 'Booksy',
        date: { pl: 'maj 2023', ru: 'май 2023' },
      },
      {
        quote: {
          pl: '„Od kilku lat regularnie korzystam z usług Pani Olgi i zawsze wychodzę w pełni zadowolona. Efekt wygląda naturalnie i utrzymuje się długo. Atmosfera jest przyjemna, a Pani Olga miła i pomocna. Miejsce, które szczerze polecam każdemu."',
          ru: '«Уже несколько лет регулярно пользуюсь услугами пани Ольги и всегда ухожу полностью довольной. Эффект выглядит естественно и держится долго. Атмосфера приятная, а пани Ольга милая и внимательная. Место, которое искренне рекомендую каждому.»',
        },
        author: 'Sylwia Kanciała',
        initial: 'S',
        avatarColor: '#C9956C',
        rating: 5,
        source: 'Google',
        date: { pl: '9 miesięcy temu', ru: '9 месяцев назад' },
      },
    ],
    beforeAfter: [
      {
        beforeFile: 'wisnia-beauty/design_handoff/source/assets/ba2-before.jpg',
        afterFile: 'wisnia-beauty/design_handoff/source/assets/ba2-after.jpg',
        caption: {
          pl: 'IPL (fotoodmładzanie): redukcja przebarwień i odświeżenie skóry twarzy',
          ru: 'IPL (фотоомоложение): уменьшение пигментации и обновление кожи лица',
        },
      },
      {
        beforeFile: 'wisnia-beauty/design_handoff/source/assets/ba4-before.jpg',
        afterFile: 'wisnia-beauty/design_handoff/source/assets/ba4-after.jpg',
        caption: {
          pl: 'IPL (fotoodmładzanie): rozjaśnienie skóry i wyrównanie kolorytu',
          ru: 'IPL (фотоомоложение): осветление кожи и выравнивание тона',
        },
      },
    ],
    heroFile: null,
    crossLinks: [
      'rf-lifting-warszawa',
      'usuwanie-naczynek-warszawa',
      'oczyszczanie-twarzy-warszawa',
    ],
    metaTitle: {
      pl: 'IPL fotoodmładzanie Warszawa | Wiśnia Beauty Studio',
      ru: 'IPL фотоомоложение Варшава | Wiśnia Beauty Studio',
    },
    metaDescription: {
      pl: 'IPL fotoodmładzanie w Warszawie: redukcja przebarwień, naczynek i oznak fotostarzenia. Równy koloryt i świeża skóra.',
      ru: 'IPL фотоомоложение в Варшаве: уменьшение пигментации, сосудов и признаков фотостарения. Ровный тон и свежая кожа.',
    },
  },

  // 3 — RF-lifting
  {
    slug: 'rf-lifting-warszawa',
    order: 3,
    title: {
      pl: 'RF-lifting',
      ru: 'RF-лифтинг',
    },
    heading: {
      pl: 'RF-lifting twarzy i ciała',
      ru: 'RF-лифтинг лица и тела',
    },
    intro: {
      pl: 'Napięta i jędrniejsza skóra bez igieł. RF-lifting pobudza produkcję kolagenu, poprawiając owal twarzy i kondycję skóry.',
      ru: 'Подтянутая и упругая кожа без игл. RF-лифтинг стимулирует выработку коллагена, улучшая овал лица и состояние кожи.',
    },
    about: {
      pl: 'Fale radiowe podgrzewają głębsze warstwy skóry, pobudzając kurczenie i odbudowę włókien kolagenowych. Skóra staje się gęstsza, bardziej napięta i sprężysta.',
      ru: 'Радиоволны прогревают глубокие слои кожи, стимулируя сокращение и обновление коллагеновых волокон. Кожа становится плотнее, более подтянутой и упругой.',
    },
    forWhom: {
      pl: 'Wiotkość i utrata jędrności skóry\n\nNieostry owal twarzy\n\nDrobne zmarszczki\n\nProfilaktyka oznak starzenia',
      ru: 'Дряблость и потеря упругости\n\nНечёткий овал лица\n\nМелкие морщинки\n\nПрофилактика признаков старения',
    },
    results: {
      pl: 'Bardziej napięta, jędrna skóra i wyraźniejszy owal twarzy. Do zabiegu twarzy dodajemy RF-lifting dłoni w prezencie.',
      ru: 'Более подтянутая, упругая кожа и чёткий овал лица. К процедуре для лица RF-лифтинг кистей рук в подарок.',
    },
    steps: [
      {
        title: { pl: 'Konsultacja', ru: 'Консультация' },
        text: {
          pl: 'Oceniamy kondycję skóry i ustalamy obszar zabiegu.',
          ru: 'Оцениваем состояние кожи и определяем зону.',
        },
      },
      {
        title: { pl: 'Zabieg', ru: 'Процедура' },
        text: {
          pl: 'Przyjemne ciepło, bez bólu i bez przerwy w codziennych zajęciach.',
          ru: 'Приятное тепло, без боли и без перерыва в делах.',
        },
      },
      {
        title: { pl: 'Seria', ru: 'Курс' },
        text: {
          pl: 'Efekt narasta i utrzymuje się dzięki serii zabiegów.',
          ru: 'Эффект нарастает и держится благодаря курсу.',
        },
      },
    ],
    priceNames: [
      'Twarz + podbródek',
      'Twarz + szyja',
      'Twarz + szyja + dekolt',
    ],
    packagePromo: {
      enabled: true,
      badge: '-15%',
      title: { pl: '6× RF-lifting twarz + szyja', ru: '6× RF-лифтинг лицо + шея' },
      desc: {
        pl: 'Pełny kurs w korzystniejszej cenie.',
        ru: 'Полный курс по выгодной цене.',
      },
      nowPrice: { pl: '4590 zł', ru: '4590 zł' },
      wasPrice: { pl: 'zamiast 5400 zł', ru: 'вместо 5400 zł' },
      link: '#pakiety',
    },
    reviews: [
      {
        quote: {
          pl: '„Od kilku lat regularnie korzystam z usług Pani Olgi i zawsze wychodzę w pełni zadowolona. Efekt wygląda naturalnie i utrzymuje się długo. Atmosfera jest przyjemna, a Pani Olga miła i pomocna. Miejsce, które szczerze polecam każdemu."',
          ru: '«Уже несколько лет регулярно пользуюсь услугами пани Ольги и всегда ухожу полностью довольной. Эффект выглядит естественно и держится долго. Атмосфера приятная, а пани Ольга милая и внимательная. Место, которое искренне рекомендую каждому.»',
        },
        author: 'Sylwia Kanciała',
        initial: 'S',
        avatarColor: '#C9956C',
        rating: 5,
        source: 'Google',
        date: { pl: '9 miesięcy temu', ru: '9 месяцев назад' },
      },
      {
        quote: {
          pl: '„Właścicielka Olga jest bardzo sympatyczna i dużo wie o tym, jak najlepiej pomóc Twojej skórze. Była dokładna, bardzo się cieszę z wizyty. Serdecznie polecam!"',
          ru: '«Владелица Ольга очень приятная и прекрасно знает, как лучше помочь вашей коже. Была внимательна, я очень довольна визитом. Сердечно рекомендую!»',
        },
        author: 'Dominika',
        initial: 'D',
        avatarColor: '#8B1A3A',
        rating: 5,
        source: 'Booksy',
        date: { pl: 'maj 2023', ru: 'май 2023' },
      },
    ],
    beforeAfter: [
      {
        beforeFile: 'wisnia-beauty/design_handoff/source/assets/ba1-before.jpg',
        afterFile: 'wisnia-beauty/design_handoff/source/assets/ba1-after.jpg',
        caption: {
          pl: 'Poprawa tonu i kondycji skóry',
          ru: 'Улучшение тона и состояния кожи',
        },
      },
      {
        beforeFile: 'wisnia-beauty/design_handoff/source/assets/ba5-before.jpg',
        afterFile: 'wisnia-beauty/design_handoff/source/assets/ba5-after.jpg',
        caption: {
          pl: 'Redukcja zaczerwienień',
          ru: 'Уменьшение покраснений',
        },
      },
    ],
    heroFile: null,
    crossLinks: [
      'ipl-fotoodmladzanie-warszawa',
      'mezoterapia-warszawa',
      'oczyszczanie-twarzy-warszawa',
    ],
    metaTitle: {
      pl: 'RF-lifting Warszawa | Wiśnia Beauty Studio',
      ru: 'RF-лифтинг Варшава | Wiśnia Beauty Studio',
    },
    metaDescription: {
      pl: 'RF-lifting twarzy i ciała w centrum Warszawy: ujędrnienie i napięcie skóry bez igieł i bez rekonwalescencji.',
      ru: 'RF-лифтинг лица и тела в центре Варшавы: подтяжка и упругость кожи без игл и без восстановления.',
    },
  },

  // 4 — Usuwanie naczynek
  {
    slug: 'usuwanie-naczynek-warszawa',
    order: 4,
    title: {
      pl: 'Usuwanie naczynek',
      ru: 'Удаление сосудов',
    },
    heading: {
      pl: 'Usuwanie naczynek',
      ru: 'Удаление сосудов',
    },
    intro: {
      pl: 'Koniec z zaczerwienieniem i pajączkami. Skutecznie redukujemy widoczne naczynka i kuperozę na twarzy oraz ciele.',
      ru: 'Конец покраснениям и сосудистым звёздочкам. Эффективно убираем видимые сосуды и купероз на лице и теле.',
    },
    about: {
      pl: 'Energia świetlna zamyka rozszerzone naczynka, które stopniowo zanikają. Zabieg jest precyzyjny i bezpieczny, bez nakłuwania skóry.',
      ru: 'Световая энергия закрывает расширенные сосуды, которые постепенно исчезают. Процедура точная и безопасная, без проколов кожи.',
    },
    forWhom: {
      pl: 'Pajączki i naczynka na nosie i policzkach\n\nKuperoza i skłonność do zaczerwienień\n\nNaczynka na nogach\n\nRumień i nierówny koloryt',
      ru: 'Звёздочки и сосуды на носу и щеках\n\nКупероз и склонность к покраснениям\n\nСосуды на ногах\n\nЭритема и неровный тон',
    },
    results: {
      pl: 'Mniej widocznych naczynek, równiejszy koloryt i mniejsze zaczerwienienie. Liczba zabiegów zależy od nasilenia zmian.',
      ru: 'Меньше видимых сосудов, ровнее тон и меньше покраснений. Число процедур зависит от выраженности.',
    },
    steps: [
      {
        title: { pl: 'Konsultacja', ru: 'Консультация' },
        text: {
          pl: 'Oceniamy rodzaj i głębokość naczynek.',
          ru: 'Оцениваем тип и глубину сосудов.',
        },
      },
      {
        title: { pl: 'Zabieg', ru: 'Процедура' },
        text: {
          pl: 'Precyzyjne impulsy na obszar zmian, komfortowo i krótko.',
          ru: 'Точные импульсы на зону, комфортно и быстро.',
        },
      },
      {
        title: { pl: 'Efekt', ru: 'Результат' },
        text: {
          pl: 'Naczynka zanikają stopniowo, czasem potrzebna jest seria.',
          ru: 'Сосуды исчезают постепенно, иногда нужен курс.',
        },
      },
    ],
    priceNames: [
      'Nos',
      'Policzki',
      'Cała twarz',
      'Nogi',
    ],
    packagePromo: {
      enabled: true,
      badge: '-15%',
      title: { pl: 'Kurs zabiegów −15%', ru: 'Курс процедур −15%' },
      desc: {
        pl: 'Przy serii zabiegów proponujemy korzystniejszą cenę.',
        ru: 'При курсе процедур предлагаем выгодную цену.',
      },
      nowPrice: { pl: '-15%', ru: '-15%' },
      wasPrice: { pl: '', ru: '' },
      link: '#pakiety',
    },
    reviews: [
      {
        quote: {
          pl: '„Jestem bardzo zadowolona z usuwania pajączków na nosie, zabieg przebiegł świetnie. Na pewno wrócę, żeby usunąć naczynka także na innych partiach ciała."',
          ru: '«Очень довольна удалением сосудиков на носу, всё прошло отлично. Обязательно вернусь, чтобы убрать сосуды и на других участках тела.»',
        },
        author: 'Katy',
        initial: 'K',
        avatarColor: '#8B1A3A',
        rating: 5,
        source: 'Google',
        date: { pl: 'styczeń 2026', ru: 'январь 2026' },
      },
      {
        quote: {
          pl: '„Robiłam depilację laserową w różnych salonach, ale najlepsze efekty osiągnęłam w Wiśnia Beauty. Już po pierwszym zabiegu włosów prawie nie zostało. Mają jeden z najlepszych laserów w Warszawie, różnica w rezultatach jest ogromna."',
          ru: '«Делала лазерную эпиляцию в разных салонах, но лучших результатов добилась в Wiśnia Beauty. Уже после первой процедуры волос почти не осталось. Здесь один из лучших лазеров в Варшаве, разница в результатах огромная.»',
        },
        author: 'Kitnormal Kit',
        initial: 'K',
        avatarColor: '#C9956C',
        rating: 5,
        source: 'Google',
        date: { pl: 'miesiąc temu', ru: 'месяц назад' },
      },
    ],
    beforeAfter: [
      {
        beforeFile: 'wisnia-beauty/design_handoff/source/assets/ba3-before.jpg',
        afterFile: 'wisnia-beauty/design_handoff/source/assets/ba3-after.jpg',
        caption: {
          pl: 'Usuwanie naczynek na nosie (kuperoza)',
          ru: 'Удаление сосудов на носу (купероз)',
        },
      },
      {
        beforeFile: 'wisnia-beauty/design_handoff/source/assets/ba6-before.jpg',
        afterFile: 'wisnia-beauty/design_handoff/source/assets/ba6-after.jpg',
        caption: {
          pl: 'Redukcja naczynek na nosie (zbliżenie)',
          ru: 'Уменьшение сосудов на носу (крупный план)',
        },
      },
    ],
    heroFile: null,
    crossLinks: [
      'ipl-fotoodmladzanie-warszawa',
      'oczyszczanie-twarzy-warszawa',
      'depilacja-laserowa-warszawa',
    ],
    metaTitle: {
      pl: 'Usuwanie naczynek Warszawa | Wiśnia Beauty Studio',
      ru: 'Удаление сосудов Варшава | Wiśnia Beauty Studio',
    },
    metaDescription: {
      pl: 'Usuwanie naczynek i kuperozy w centrum Warszawy: nos, policzki, twarz, nogi. Mniej zaczerwienień, równy koloryt.',
      ru: 'Удаление сосудов и купероза в центре Варшавы: нос, щёки, лицо, ноги. Меньше покраснений, ровный тон.',
    },
  },

  // 5 — Oczyszczanie twarzy
  {
    slug: 'oczyszczanie-twarzy-warszawa',
    order: 5,
    title: {
      pl: 'Oczyszczanie twarzy',
      ru: 'Чистка лица',
    },
    heading: {
      pl: 'Oczyszczanie twarzy',
      ru: 'Чистка лица',
    },
    intro: {
      pl: 'Czysta, zdrowa i dotleniona skóra. Dobieramy rodzaj oczyszczania do potrzeb cery, od delikatnego wodorowego po protokół anti-acne.',
      ru: 'Чистая, здоровая кожа, насыщенная кислородом. Подбираем тип чистки под потребности кожи, от мягкой водородной до протокола anti-acne.',
    },
    about: {
      pl: 'Oferujemy oczyszczanie wodorowe, kombinowane, z peelingiem, ultradźwiękowe z terapią LED oraz protokół anti-acne. Metodę dobieramy po analizie skóry.',
      ru: 'Предлагаем водородную, комбинированную чистку, чистку с пилингом, ультразвуковую с LED-терапией и протокол anti-acne. Метод подбираем после анализа кожи.',
    },
    forWhom: {
      pl: 'Cera tłusta i mieszana ze skłonnością do niedoskonałości\n\nZaskórniki i rozszerzone pory\n\nSkóra szara, zmęczona i odwodniona\n\nPielęgnacja profilaktyczna i regularna',
      ru: 'Жирная и комбинированная кожа со склонностью к высыпаниям\n\nЧёрные точки и расширенные поры\n\nТусклая, уставшая и обезвоженная кожа\n\nПрофилактический и регулярный уход',
    },
    results: {
      pl: 'Oczyszczona, gładsza i rozświetlona skóra, zwężone pory i zdrowy koloryt. Pierwszy raz? Zacznij od wodorowego oczyszczania.',
      ru: 'Очищенная, гладкая и сияющая кожа, сужённые поры и здоровый тон. Впервые? Начните с водородной чистки.',
    },
    steps: [
      {
        title: { pl: 'Analiza', ru: 'Анализ' },
        text: {
          pl: 'Oceniamy typ cery i dobieramy metodę oczyszczania.',
          ru: 'Оцениваем тип кожи и подбираем метод чистки.',
        },
      },
      {
        title: { pl: 'Zabieg', ru: 'Процедура' },
        text: {
          pl: 'Oczyszczanie, ekstrakcja i pielęgnacja dopasowana do skóry.',
          ru: 'Чистка, экстракция и уход под вашу кожу.',
        },
      },
      {
        title: { pl: 'Pielęgnacja', ru: 'Уход' },
        text: {
          pl: 'Dajemy plan pielęgnacji domowej, by efekt utrzymał się dłużej.',
          ru: 'Даём план домашнего ухода, чтобы эффект держался дольше.',
        },
      },
    ],
    priceNames: [
      'Wodorowe oczyszczanie',
      'Oczyszczanie kombinowane',
      'Oczyszczanie + peeling',
      'Protokół Anti-Acne',
    ],
    packagePromo: {
      enabled: true,
      badge: '-15%',
      title: { pl: '4× peeling', ru: '4× пилинг' },
      desc: {
        pl: 'Kurs 4 zabiegów w korzystniejszej cenie.',
        ru: 'Курс из 4 процедур по выгодной цене.',
      },
      nowPrice: { pl: '1020 zł', ru: '1020 zł' },
      wasPrice: { pl: 'zamiast 1200 zł', ru: 'вместо 1200 zł' },
      link: '#pakiety',
    },
    reviews: [
      {
        quote: {
          pl: '„Właścicielka Olga jest bardzo sympatyczna i dużo wie o tym, jak najlepiej pomóc Twojej skórze. Była dokładna, bardzo się cieszę z wizyty. Serdecznie polecam!"',
          ru: '«Владелица Ольга очень приятная и прекрасно знает, как лучше помочь вашей коже. Была внимательна, я очень довольна визитом. Сердечно рекомендую!»',
        },
        author: 'Dominika',
        initial: 'D',
        avatarColor: '#8B1A3A',
        rating: 5,
        source: 'Booksy',
        date: { pl: 'maj 2023', ru: 'май 2023' },
      },
      {
        quote: {
          pl: '„Od kilku lat regularnie korzystam z usług Pani Olgi i zawsze wychodzę w pełni zadowolona. Efekt wygląda naturalnie i utrzymuje się długo. Atmosfera jest przyjemna, a Pani Olga miła i pomocna. Miejsce, które szczerze polecam każdemu."',
          ru: '«Уже несколько лет регулярно пользуюсь услугами пани Ольги и всегда ухожу полностью довольной. Эффект выглядит естественно и держится долго. Атмосфера приятная, а пани Ольга милая и внимательная. Место, которое искренне рекомендую каждому.»',
        },
        author: 'Sylwia Kanciała',
        initial: 'S',
        avatarColor: '#C9956C',
        rating: 5,
        source: 'Google',
        date: { pl: '9 miesięcy temu', ru: '9 месяцев назад' },
      },
    ],
    beforeAfter: [
      {
        beforeFile: 'wisnia-beauty/design_handoff/source/assets/ba1-before.jpg',
        afterFile: 'wisnia-beauty/design_handoff/source/assets/ba1-after.jpg',
        caption: {
          pl: 'Poprawa tonu i kondycji skóry',
          ru: 'Улучшение тона и состояния кожи',
        },
      },
      {
        beforeFile: 'wisnia-beauty/design_handoff/source/assets/ba5-before.jpg',
        afterFile: 'wisnia-beauty/design_handoff/source/assets/ba5-after.jpg',
        caption: {
          pl: 'Redukcja zaczerwienień',
          ru: 'Уменьшение покраснений',
        },
      },
    ],
    heroFile: null,
    crossLinks: [
      'mezoterapia-warszawa',
      'ipl-fotoodmladzanie-warszawa',
      'rf-lifting-warszawa',
    ],
    metaTitle: {
      pl: 'Oczyszczanie twarzy Warszawa | Wiśnia Beauty Studio',
      ru: 'Чистка лица Варшава | Wiśnia Beauty Studio',
    },
    metaDescription: {
      pl: 'Profesjonalne oczyszczanie twarzy w centrum Warszawy: wodorowe, kombinowane, anti-acne. Czysta, dotleniona skóra.',
      ru: 'Профессиональная чистка лица в центре Варшавы: водородная, комбинированная, anti-acne. Чистая, насыщенная кислородом кожа.',
    },
  },

  // 6 — Mezoterapia
  {
    slug: 'mezoterapia-warszawa',
    order: 6,
    title: {
      pl: 'Mezoterapia',
      ru: 'Мезотерапия',
    },
    heading: {
      pl: 'Mezoterapia rewitalizująca',
      ru: 'Мезотерапия ревитализация',
    },
    intro: {
      pl: 'Odżywiona, nawilżona i wypoczęta skóra. Mezoterapia dostarcza składniki aktywne dokładnie tam, gdzie skóra ich potrzebuje.',
      ru: 'Питательная, увлажнённая и отдохнувшая кожа. Мезотерапия доставляет активные вещества именно туда, где они нужны коже.',
    },
    about: {
      pl: 'To zabieg, w którym koktajle z kwasem hialuronowym, witaminami i innymi składnikami dostarczamy w głąb skóry, aby ją nawilżyć, odżywić i zrewitalizować od wewnątrz.',
      ru: 'Это процедура, при которой коктейли с гиалуроновой кислотой, витаминами и другими компонентами доставляются вглубь кожи, чтобы увлажнить, напитать и ревитализировать её изнутри.',
    },
    forWhom: {
      pl: 'Odwodnienie i utrata blasku\n\nCienie i drobne zmarszczki wokół oczu\n\nSkóra dojrzała wymagająca rewitalizacji\n\nWypadanie włosów (mezoterapia skóry głowy)',
      ru: 'Обезвоживание и потеря сияния\n\nТёмные круги и морщинки вокруг глаз\n\nЗрелая кожа, нуждающаяся в ревитализации\n\nВыпадение волос (мезотерапия кожи головы)',
    },
    results: {
      pl: 'Skóra nawilżona, gęstsza i bardziej promienna, wygładzone drobne zmarszczki. Oferujemy m.in. biorewitalizację, polinukleotydy i egzosomy.',
      ru: 'Кожа увлажнённая, плотнее и сияющая, разглаженные мелкие морщинки. Предлагаем биоревитализацию, полинуклеотиды и экзосомы.',
    },
    steps: [
      {
        title: { pl: 'Konsultacja', ru: 'Консультация' },
        text: {
          pl: 'Dobieramy preparat do potrzeb skóry.',
          ru: 'Подбираем препарат под потребности кожи.',
        },
      },
      {
        title: { pl: 'Zabieg', ru: 'Процедура' },
        text: {
          pl: 'Precyzyjne podanie preparatu w głąb skóry, komfortowo i dokładnie.',
          ru: 'Точное введение препарата вглубь кожи, комфортно и аккуратно.',
        },
      },
      {
        title: { pl: 'Seria', ru: 'Курс' },
        text: {
          pl: 'Najlepszy efekt daje seria zabiegów dobrana indywidualnie.',
          ru: 'Лучший результат даёт индивидуально подобранный курс.',
        },
      },
    ],
    priceNames: [
      'Okolice oczu',
      'Biorewitalizacja',
      'Polinukleotydy',
      'Egzosomy',
    ],
    packagePromo: {
      enabled: true,
      badge: '-15%',
      title: { pl: 'Kurs zabiegów −15%', ru: 'Курс процедур −15%' },
      desc: {
        pl: 'Przy serii zabiegów proponujemy korzystniejszą cenę.',
        ru: 'При курсе процедур предлагаем выгодную цену.',
      },
      nowPrice: { pl: '-15%', ru: '-15%' },
      wasPrice: { pl: '', ru: '' },
      link: '#pakiety',
    },
    reviews: [
      {
        quote: {
          pl: '„Od kilku lat regularnie korzystam z usług Pani Olgi i zawsze wychodzę w pełni zadowolona. Efekt wygląda naturalnie i utrzymuje się długo. Atmosfera jest przyjemna, a Pani Olga miła i pomocna. Miejsce, które szczerze polecam każdemu."',
          ru: '«Уже несколько лет регулярно пользуюсь услугами пани Ольги и всегда ухожу полностью довольной. Эффект выглядит естественно и держится долго. Атмосфера приятная, а пани Ольга милая и внимательная. Место, которое искренне рекомендую каждому.»',
        },
        author: 'Sylwia Kanciała',
        initial: 'S',
        avatarColor: '#C9956C',
        rating: 5,
        source: 'Google',
        date: { pl: '9 miesięcy temu', ru: '9 месяцев назад' },
      },
      {
        quote: {
          pl: '„Właścicielka Olga jest bardzo sympatyczna i dużo wie o tym, jak najlepiej pomóc Twojej skórze. Była dokładna, bardzo się cieszę z wizyty. Serdecznie polecam!"',
          ru: '«Владелица Ольга очень приятная и прекрасно знает, как лучше помочь вашей коже. Была внимательна, я очень довольна визитом. Сердечно рекомендую!»',
        },
        author: 'Dominika',
        initial: 'D',
        avatarColor: '#8B1A3A',
        rating: 5,
        source: 'Booksy',
        date: { pl: 'maj 2023', ru: 'май 2023' },
      },
    ],
    beforeAfter: [
      {
        beforeFile: 'wisnia-beauty/design_handoff/source/assets/ba1-before.jpg',
        afterFile: 'wisnia-beauty/design_handoff/source/assets/ba1-after.jpg',
        caption: {
          pl: 'Poprawa tonu i kondycji skóry',
          ru: 'Улучшение тона и состояния кожи',
        },
      },
      {
        beforeFile: 'wisnia-beauty/design_handoff/source/assets/ba5-before.jpg',
        afterFile: 'wisnia-beauty/design_handoff/source/assets/ba5-after.jpg',
        caption: {
          pl: 'Redukcja zaczerwienień',
          ru: 'Уменьшение покраснений',
        },
      },
    ],
    heroFile: null,
    crossLinks: [
      'rf-lifting-warszawa',
      'oczyszczanie-twarzy-warszawa',
      'ipl-fotoodmladzanie-warszawa',
    ],
    metaTitle: {
      pl: 'Mezoterapia Warszawa | Wiśnia Beauty Studio',
      ru: 'Мезотерапия Варшава | Wiśnia Beauty Studio',
    },
    metaDescription: {
      pl: 'Mezoterapia w centrum Warszawy: nawilżenie, odżywienie i rewitalizacja skóry. Okolice oczu, twarz, usta, skóra głowy.',
      ru: 'Мезотерапия в центре Варшавы: увлажнение, питание и ревитализация кожи. Зона вокруг глаз, лицо, губы, кожа головы.',
    },
  },
]
