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
  faq?: Array<{ question: { pl: string; ru: string }; answer: { pl: string; ru: string } }>
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
    faq: [
      {
        question: { pl: 'Czy zabieg boli?', ru: 'Это больно?' },
        answer: {
          pl: 'Większość klientek opisuje odczucia jako ciepłe mrowienie. Laser Estera ma system chłodzenia, który czyni zabieg komfortowym. Wrażliwość zależy od strefy i indywidualnego progu.',
          ru: 'Большинство клиенток описывают ощущения как тёплые покалывания. Лазер Estera оснащён системой охлаждения, которая делает процедуру комфортной. Чувствительность зависит от зоны и индивидуального порога.',
        },
      },
      {
        question: { pl: 'Ile potrzeba sesji?', ru: 'Сколько нужно сеансов?' },
        answer: {
          pl: 'Zwykle 6–10 zabiegów: włosy rosną cyklicznie, a laser działa na włosy w aktywnej fazie wzrostu. Dokładna liczba zależy od strefy, typu włosów i gospodarki hormonalnej — ocenimy na bezpłatnej konsultacji.',
          ru: 'Как правило, 6–10 процедур: волосы растут циклами, и лазер действует на волоски в активной фазе роста. Точное число зависит от зоны, типа волос и гормонального фона — оценим на бесплатной консультации.',
        },
      },
      {
        question: { pl: 'Jak często powtarzać?', ru: 'Как часто повторять?' },
        answer: {
          pl: 'Zwykle co 4–6 tygodni. Odstęp dobieramy indywidualnie do strefy i reakcji skóry.',
          ru: 'Обычно раз в 4–6 недель. Интервал подбираем индивидуально по зоне и реакции кожи.',
        },
      },
      {
        question: { pl: 'Czy są przeciwwskazania?', ru: 'Есть ли противопоказания?' },
        answer: {
          pl: 'Tak. Do najważniejszych należą: ciąża i karmienie piersią, świeża opalenizna, przyjmowanie leków fotouczulających, niektóre choroby skóry i ogólne, onkologia. Pełną listę i kwalifikację ocenimy na konsultacji.',
          ru: 'Да. Среди основных: беременность и грудное вскармливание, свежий загар, приём фотосенсибилизирующих препаратов, отдельные кожные и общие заболевания, онкология. Полный список и пригодность оценим на консультации.',
        },
      },
      {
        question: { pl: 'Jak przygotować się do zabiegu?', ru: 'Как подготовиться к процедуре?' },
        answer: {
          pl: 'Dobę wcześniej ogol strefę (nie woskiem ani depilatorem — korzeń włosa musi zostać). Na 2 tygodnie przed unikaj słońca i solarium, nie używaj samoopalacza. W dniu zabiegu — czysta skóra bez kremów i dezodorantu.',
          ru: 'За сутки побрейте зону (не воском и не эпилятором — корень волоса должен остаться). За 2 недели избегайте солнца и солярия, не используйте автозагар. В день процедуры — чистая кожа без кремов и дезодоранта.',
        },
      },
      {
        question: { pl: 'Czego nie robić po zabiegu?', ru: 'Что нельзя делать после?' },
        answer: {
          pl: 'Przez 48 godzin: bez sauny, basenu, gorącej kąpieli i intensywnych treningów. Przez 2 tygodnie — bez bezpośredniego słońca, stosuj SPF. Nie trzyj i nie drap obrobionej strefy.',
          ru: '48 часов: без сауны, бассейна, горячей ванны и интенсивных тренировок. 2 недели — без прямого солнца, используйте SPF. Не трите и не царапайте обработанную зону.',
        },
      },
      {
        question: { pl: 'Czy zabieg pasuje do mojego koloru skóry i włosów?', ru: 'Подойдёт ли мне по цвету кожи и волос?' },
        answer: {
          pl: 'Najlepszy efekt — na ciemnych włosach. Jasne, rude i siwe reagują słabiej, a na ciemnej i opalonej skórze parametry dobieramy ostrożniej. Dokładnie ocenimy na bezpłatnej konsultacji.',
          ru: 'Лучший результат — на тёмных волосах. Светлые, рыжие и седые реагируют слабее, а на смуглой и загорелой коже параметры подбираются осторожнее. Точно скажем на бесплатной консультации.',
        },
      },
      {
        question: { pl: 'Czy można latem?', ru: 'Можно ли летом?' },
        answer: {
          pl: 'Można, jeśli strefa jest zakryta przed słońcem i nie ma świeżej opalenizny. Latem szczególnie ważne są SPF i rezygnacja z solarium 2 tygodnie przed zabiegiem i po nim.',
          ru: 'Можно, если зона закрыта от солнца и нет свежего загара. Летом особенно важны SPF и отказ от солярия за 2 недели до и после.',
        },
      },
      {
        question: { pl: 'Ile trwa sesja?', ru: 'Сколько длится сеанс?' },
        answer: {
          pl: 'Od kilku minut (np. pachy) do pół godziny i dłużej (całe nogi) — zależnie od strefy.',
          ru: 'От нескольких минут (например, подмышки) до получаса и дольше (ноги полностью) — зависит от зоны.',
        },
      },
      {
        question: { pl: 'W jakich językach obsługujecie?', ru: 'На каких языках вы принимаете?' },
        answer: {
          pl: 'Obsługujemy po polsku, ukraińsku i rosyjsku. Pisz lub dzwoń w wygodnym dla Ciebie języku.',
          ru: 'Обслуживаем на польском, украинском и русском. Пишите или звоните на удобном вам языке.',
        },
      },
    ],
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
    faq: [
      {
        question: { pl: 'Czy depilacja laserowa boli mężczyzn bardziej?', ru: 'Мужчинам больнее?' },
        answer: {
          pl: 'Męskie włosy są zwykle grubsze i ciemniejsze, więc odczucia mogą być nieco silniejsze — ale laser Estera ma system chłodzenia, a parametry dobieramy indywidualnie. Większość klientów przechodzi zabieg komfortowo.',
          ru: 'Мужские волосы обычно толще и темнее, поэтому ощущения могут быть чуть сильнее — но лазер Estera оснащён системой охлаждения, а параметры подбираем индивидуально. Большинство клиентов переносит процедуру спокойно.',
        },
      },
      {
        question: { pl: 'Ile sesji potrzebują mężczyźni?', ru: 'Сколько сеансов нужно мужчинам?' },
        answer: {
          pl: 'Zwykle 8–12 zabiegów co 4–6 tygodni: męskie owłosienie jest gęstsze i silniej stymulowane hormonalnie. Dokładny plan ustalimy na bezpłatnej konsultacji.',
          ru: 'Обычно 8–12 процедур раз в 4–6 недель: мужские волосы гуще и сильнее стимулируются гормонами. Точный план составим на бесплатной консультации.',
        },
      },
      {
        question: { pl: 'Czy można tylko przerzedzić włosy, a nie usuwać ich całkowicie?', ru: 'Можно ли просто уменьшить густоту, не удаляя волосы полностью?' },
        answer: {
          pl: 'Tak. Wielu mężczyzn wybiera właśnie redukcję gęstości, np. na klatce piersiowej. Efekt kontrolujemy liczbą sesji — włosy stają się rzadsze i cieńsze.',
          ru: 'Да. Многие мужчины выбирают именно уменьшение густоты, например на груди. Эффект регулируем количеством сеансов — волосы становятся реже и тоньше.',
        },
      },
      {
        question: { pl: 'Jakie strefy są najpopularniejsze?', ru: 'Какие зоны самые популярные?' },
        answer: {
          pl: 'Plecy i kark, klatka piersiowa z brzuchem, kontur brody, pachy i szyja. Robimy też inne strefy — pełną listę i wycenę ustalimy na WhatsApp.',
          ru: 'Спина и задняя часть шеи, грудь с животом, контур бороды, подмышки и шея. Делаем и другие зоны — полный список и цену согласуем в WhatsApp.',
        },
      },
      {
        question: { pl: 'Na czym polega depilacja konturu brody?', ru: 'Как работает эпиляция контура бороды?' },
        answer: {
          pl: 'Precyzyjnie usuwamy włosy poza linią zarostu — na szyi i policzkach. Sama broda pozostaje nietknięta, a kontur jest równy bez codziennego golenia i podrażnień.',
          ru: 'Точечно убираем волосы за линией бороды — на шее и щеках. Сама борода остаётся нетронутой, а контур — ровным без ежедневного бритья и раздражения.',
        },
      },
      {
        question: { pl: 'Jak przygotować się do zabiegu?', ru: 'Как подготовиться к процедуре?' },
        answer: {
          pl: 'Dobę wcześniej ogol strefę (nie woskiem ani depilatorem — korzeń włosa musi zostać). Na 2 tygodnie przed unikaj słońca i solarium. W dniu zabiegu — czysta skóra bez kremów i dezodorantu.',
          ru: 'За сутки побрейте зону (не воском и не эпилятором — корень волоса должен остаться). За 2 недели избегайте солнца и солярия. В день процедуры — чистая кожа без кремов и дезодоранта.',
        },
      },
      {
        question: { pl: 'Czego unikać po zabiegu?', ru: 'Чего избегать после процедуры?' },
        answer: {
          pl: 'Przez 48 godzin: bez sauny, basenu i intensywnych treningów. Przez 2 tygodnie — bez bezpośredniego słońca, stosuj SPF.',
          ru: '48 часов: без сауны, бассейна и интенсивных тренировок. 2 недели — без прямого солнца, используйте SPF.',
        },
      },
      {
        question: { pl: 'Czy zabieg jest dyskretny?', ru: 'Насколько это деликатно?' },
        answer: {
          pl: 'Tak, zabieg odbywa się sam na sam z kosmetologiem, bez pośpiechu i zbędnych pytań. Depilacja męska to u nas codzienność.',
          ru: 'Процедура проходит один на один с косметологом, без спешки и лишних вопросов. Мужская эпиляция для нас — обычная практика.',
        },
      },
      {
        question: { pl: 'W jakich językach obsługujecie?', ru: 'На каких языках вы принимаете?' },
        answer: {
          pl: 'Po polsku, ukraińsku i rosyjsku. Pisz lub dzwoń w wygodnym dla Ciebie języku.',
          ru: 'На польском, украинском и русском. Пишите или звоните на удобном вам языке.',
        },
      },
    ],
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
    faq: [
      {
        question: { pl: 'Czym IPL różni się od lasera?', ru: 'Чем IPL отличается от лазера?' },
        answer: {
          pl: 'IPL to intensywne światło impulsowe o szerokim spektrum: działa jednocześnie na przebarwienia, naczynka i kondycję skóry. Laser ma jedną długość fali i służy głównie do depilacji. Do wyrównania kolorytu i odmładzania wybieramy IPL.',
          ru: 'IPL — интенсивный импульсный свет с широким спектром: он одновременно работает с пигментацией, сосудами и качеством кожи. У лазера одна длина волны, он используется в основном для эпиляции. Для выравнивания тона и омоложения выбираем IPL.',
        },
      },
      {
        question: { pl: 'Czy zabieg boli?', ru: 'Это больно?' },
        answer: {
          pl: 'Impulsy odczuwane są jako krótkie, ciepłe błyski. Zabieg jest bez igieł i nie wymaga znieczulenia.',
          ru: 'Импульсы ощущаются как короткие тёплые вспышки. Процедура без игл и не требует обезболивания.',
        },
      },
      {
        question: { pl: 'Ile zabiegów potrzeba?', ru: 'Сколько нужно процедур?' },
        answer: {
          pl: 'Zwykle 3–5 co 3–4 tygodnie, zależnie od stanu skóry. Plan ustalimy na konsultacji.',
          ru: 'Обычно 3–5 с интервалом 3–4 недели, в зависимости от состояния кожи. План составим на консультации.',
        },
      },
      {
        question: { pl: 'Kiedy widać efekt?', ru: 'Когда виден результат?' },
        answer: {
          pl: 'Przebarwienia najpierw ciemnieją, a w ciągu 7–14 dni stopniowo się złuszczają. Świeższy koloryt widać po 1–2 zabiegach, pełny efekt — po serii.',
          ru: 'Пигментация сначала темнеет, а в течение 7–14 дней постепенно сходит. Более свежий тон виден после 1–2 процедур, полный результат — после курса.',
        },
      },
      {
        question: { pl: 'Czy potrzebna jest rekonwalescencja?', ru: 'Нужно ли восстановление?' },
        answer: {
          pl: 'Nie. Możliwe lekkie zaczerwienienie przez kilka godzin — możesz od razu wrócić do codziennych zajęć. Przez 2 tygodnie stosuj SPF.',
          ru: 'Нет. Возможно лёгкое покраснение на несколько часов — можно сразу вернуться к делам. 2 недели используйте SPF.',
        },
      },
      {
        question: { pl: 'Kiedy najlepiej robić IPL?', ru: 'Когда лучше делать IPL?' },
        answer: {
          pl: 'Optymalnie jesienią i zimą, gdy skóra nie jest opalona. Latem zabieg jest możliwy, jeśli unikasz słońca i stosujesz SPF.',
          ru: 'Оптимально осенью и зимой, когда кожа не загорелая. Летом процедура возможна, если избегать солнца и использовать SPF.',
        },
      },
      {
        question: { pl: 'Czy są przeciwwskazania?', ru: 'Есть ли противопоказания?' },
        answer: {
          pl: 'Tak: ciąża, świeża opalenizna, leki fotouczulające, aktywne zmiany skórne w obszarze zabiegu. Kwalifikację ocenimy na konsultacji.',
          ru: 'Да: беременность, свежий загар, фотосенсибилизирующие препараты, активные высыпания в зоне процедуры. Пригодность оценим на консультации.',
        },
      },
      {
        question: { pl: 'Co to jest protokół Forever Young?', ru: 'Что такое протокол Forever Young?' },
        answer: {
          pl: 'To anti-agingowy protokół fotoodmładzania: seria impulsów stymuluje odnowę skóry i produkcję kolagenu, poprawiając gęstość, koloryt i blask. Dobierzemy go na konsultacji.',
          ru: 'Это anti-age протокол фотоомоложения: серия импульсов стимулирует обновление кожи и выработку коллагена, улучшая плотность, тон и сияние. Подберём его на консультации.',
        },
      },
    ],
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
    faq: [
      {
        question: { pl: 'Jak działa RF-lifting?', ru: 'Как работает RF-лифтинг?' },
        answer: {
          pl: 'Fale radiowe podgrzewają głębsze warstwy skóry, pobudzając kurczenie i odbudowę włókien kolagenowych. Skóra staje się gęstsza, bardziej napięta, a owal twarzy — wyraźniejszy.',
          ru: 'Радиоволны прогревают глубокие слои кожи, стимулируя сокращение и обновление коллагеновых волокон. Кожа становится плотнее и более подтянутой, овал лица — чётче.',
        },
      },
      {
        question: { pl: 'Czy to boli?', ru: 'Это больно?' },
        answer: {
          pl: 'Nie. Zabieg odczuwany jest jako przyjemne ciepło, bez igieł i bez znieczulenia.',
          ru: 'Нет. Процедура ощущается как приятное тепло, без игл и без обезболивания.',
        },
      },
      {
        question: { pl: 'Ile zabiegów potrzeba i jak często?', ru: 'Сколько нужно процедур и как часто?' },
        answer: {
          pl: 'Najlepszy efekt daje kurs 3–4 zabiegów co 4–7 tygodni. Pojedynczy zabieg sprawdza się jako „odświeżenie” przed ważnym wydarzeniem.',
          ru: 'Лучший результат даёт курс из 3–4 процедур с интервалом 4–7 недель. Разовая процедура подходит как «освежение» перед важным событием.',
        },
      },
      {
        question: { pl: 'Kiedy widać efekt i jak długo się utrzymuje?', ru: 'Когда виден эффект и сколько он держится?' },
        answer: {
          pl: 'Lekki efekt napięcia widać od razu, a pełny narasta przez 2–3 miesiące w miarę odbudowy kolagenu. Po serii utrzymuje się wiele miesięcy — warto podtrzymywać go zabiegami przypominającymi.',
          ru: 'Лёгкая подтянутость заметна сразу, а полный эффект нарастает 2–3 месяца по мере обновления коллагена. После курса результат держится многие месяцы — его стоит поддерживать повторными процедурами.',
        },
      },
      {
        question: { pl: 'Czy potrzebna jest przerwa od codziennych zajęć?', ru: 'Нужен ли перерыв в обычных делах?' },
        answer: {
          pl: 'Nie. Możliwe delikatne zaczerwienienie, które znika w ciągu kilku godzin. Od razu wracasz do swoich planów.',
          ru: 'Нет. Возможно лёгкое покраснение, которое проходит за несколько часов. Сразу возвращаетесь к своим планам.',
        },
      },
      {
        question: { pl: 'Czy można robić RF-lifting latem?', ru: 'Можно ли делать RF-лифтинг летом?' },
        answer: {
          pl: 'Tak. RF nie działa na melaninę, więc opalenizna nie jest przeciwwskazaniem — to dobry zabieg na cały rok.',
          ru: 'Да. RF не воздействует на меланин, поэтому загар не является противопоказанием — процедура подходит круглый год.',
        },
      },
      {
        question: { pl: 'Czy są przeciwwskazania?', ru: 'Есть ли противопоказания?' },
        answer: {
          pl: 'Tak: ciąża, rozrusznik serca, metalowe implanty w obszarze zabiegu, aktywne stany zapalne skóry. Kwalifikację ocenimy na konsultacji.',
          ru: 'Да: беременность, кардиостимулятор, металлические импланты в зоне процедуры, активные воспаления кожи. Пригодность оценим на консультации.',
        },
      },
      {
        question: { pl: 'W jakim wieku zacząć?', ru: 'С какого возраста начинать?' },
        answer: {
          pl: 'Najczęściej po 30. roku życia, gdy skóra traci jędrność. RF sprawdza się też profilaktycznie — pobudza kolagen, zanim pojawią się wyraźne oznaki starzenia.',
          ru: 'Чаще всего после 30 лет, когда кожа теряет упругость. RF работает и как профилактика — стимулирует коллаген до появления выраженных признаков старения.',
        },
      },
      {
        question: { pl: 'Czy RF-lifting dłoni naprawdę jest w prezencie?', ru: 'RF-лифтинг кистей действительно в подарок?' },
        answer: {
          pl: 'Tak — do każdego zabiegu RF-liftingu twarzy dodajemy lifting skóry dłoni gratis.',
          ru: 'Да — к каждой процедуре RF-лифтинга лица добавляем лифтинг кожи кистей рук бесплатно.',
        },
      },
    ],
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
      title: { pl: '4× RF-lifting twarz + szyja', ru: '4× RF-лифтинг лицо + шея' },
      desc: {
        pl: 'Pełny kurs w korzystniejszej cenie.',
        ru: 'Полный курс по выгодной цене.',
      },
      nowPrice: { pl: '3060 zł', ru: '3060 zł' },
      wasPrice: { pl: 'zamiast 3600 zł', ru: 'вместо 3600 zł' },
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
    faq: [
      {
        question: { pl: 'Jak usuwacie naczynka?', ru: 'Как вы удаляете сосуды?' },
        answer: {
          pl: 'Energia świetlna podgrzewa i zamyka rozszerzone naczynko, które organizm stopniowo usuwa. Bez igieł i bez nakłuwania skóry.',
          ru: 'Световая энергия нагревает и «запаивает» расширенный сосуд, который организм постепенно выводит. Без игл и без проколов кожи.',
        },
      },
      {
        question: { pl: 'Czy to boli?', ru: 'Это больно?' },
        answer: {
          pl: 'Impulsy odczuwane są jako krótkie ukłucia ciepła. Zabieg trwa krótko i nie wymaga znieczulenia.',
          ru: 'Импульсы ощущаются как короткие тёплые покалывания. Процедура быстрая и не требует обезболивания.',
        },
      },
      {
        question: { pl: 'Ile zabiegów potrzeba?', ru: 'Сколько нужно процедур?' },
        answer: {
          pl: 'Pojedyncze naczynka często znikają po 1–2 zabiegach. Rozległa kuperoza wymaga zwykle serii 3–5 zabiegów. Ocenimy to na konsultacji.',
          ru: 'Единичные сосуды часто исчезают за 1–2 процедуры. Выраженный купероз обычно требует курса из 3–5 процедур. Оценим на консультации.',
        },
      },
      {
        question: { pl: 'Czy naczynko znika od razu?', ru: 'Сосуд исчезает сразу?' },
        answer: {
          pl: 'Nie zawsze. Część naczynek blednie natychmiast, inne zanikają stopniowo w ciągu 2–4 tygodni po zabiegu.',
          ru: 'Не всегда. Часть сосудов бледнеет сразу, другие исчезают постепенно в течение 2–4 недель после процедуры.',
        },
      },
      {
        question: { pl: 'Czy naczynka mogą wrócić?', ru: 'Могут ли сосуды вернуться?' },
        answer: {
          pl: 'Zamknięte naczynko nie wraca, ale przy skłonności do kuperozy mogą pojawiać się nowe. Pomaga profilaktyka: SPF, unikanie przegrzewania i odpowiednia pielęgnacja.',
          ru: 'Закрытый сосуд не возвращается, но при склонности к куперозу могут появляться новые. Помогает профилактика: SPF, избегание перегрева и правильный уход.',
        },
      },
      {
        question: { pl: 'Jakie strefy można obrabiać?', ru: 'Какие зоны можно обрабатывать?' },
        answer: {
          pl: 'Nos, policzki, całą twarz i nogi. Rodzaj i głębokość naczynek ocenimy na konsultacji.',
          ru: 'Нос, щёки, всё лицо и ноги. Тип и глубину сосудов оценим на консультации.',
        },
      },
      {
        question: { pl: 'Co po zabiegu?', ru: 'Что после процедуры?' },
        answer: {
          pl: 'Możliwe zaczerwienienie i lekki obrzęk przez 1–2 dni. Przez 48 godzin unikaj sauny, gorącej kąpieli i intensywnego wysiłku; przez 2 tygodnie stosuj SPF.',
          ru: 'Возможно покраснение и лёгкий отёк на 1–2 дня. 48 часов избегайте сауны, горячей ванны и интенсивных нагрузок; 2 недели используйте SPF.',
        },
      },
      {
        question: { pl: 'Czy można latem?', ru: 'Можно ли летом?' },
        answer: {
          pl: 'Zabieg wymaga skóry bez świeżej opalenizny. Latem jest możliwy, jeśli strefa jest chroniona przed słońcem — optymalnie jednak jesień i zima.',
          ru: 'Для процедуры кожа должна быть без свежего загара. Летом возможно, если зона защищена от солнца, но оптимально — осень и зима.',
        },
      },
      {
        question: { pl: 'Czy są przeciwwskazania?', ru: 'Есть ли противопоказания?' },
        answer: {
          pl: 'Tak: ciąża, świeża opalenizna, leki fotouczulające, niektóre choroby skóry i naczyń. Pełną kwalifikację przeprowadzimy na konsultacji.',
          ru: 'Да: беременность, свежий загар, фотосенсибилизирующие препараты, отдельные заболевания кожи и сосудов. Полную оценку проведём на консультации.',
        },
      },
    ],
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
    faq: [
      {
        question: { pl: 'Jaki rodzaj oczyszczania wybrać?', ru: 'Какую чистку выбрать?' },
        answer: {
          pl: 'Metodę dobieramy po analizie skóry: wodorowe, kombinowane, z peelingiem, ultradźwiękowe z LED lub protokół anti-acne. Jeśli to Twój pierwszy raz — zacznij od delikatnego oczyszczania wodorowego.',
          ru: 'Метод подбираем после анализа кожи: водородная, комбинированная, с пилингом, ультразвуковая с LED или протокол anti-acne. Если вы впервые — начните с мягкой водородной чистки.',
        },
      },
      {
        question: { pl: 'Czy oczyszczanie boli?', ru: 'Чистка — это больно?' },
        answer: {
          pl: 'Większość etapów jest przyjemna. Ekstrakcja zaskórników może być odczuwalna, ale pracujemy delikatnie i dostosowujemy intensywność do skóry.',
          ru: 'Большинство этапов приятные. Экстракция чёрных точек может быть чувствительной, но мы работаем бережно и подстраиваем интенсивность под кожу.',
        },
      },
      {
        question: { pl: 'Czy po zabiegu będą ślady?', ru: 'Будут ли следы после процедуры?' },
        answer: {
          pl: 'Możliwe lekkie zaczerwienienie do 24 godzin, zależnie od metody i wrażliwości skóry. Oczyszczanie wodorowe zwykle nie zostawia śladów.',
          ru: 'Возможно лёгкое покраснение до 24 часов, в зависимости от метода и чувствительности кожи. Водородная чистка обычно не оставляет следов.',
        },
      },
      {
        question: { pl: 'Jak często robić oczyszczanie?', ru: 'Как часто делать чистку?' },
        answer: {
          pl: 'Zwykle co 4–8 tygodni, zależnie od typu cery. Przy protokole anti-acne częstotliwość ustalamy indywidualnie.',
          ru: 'Обычно раз в 4–8 недель, в зависимости от типа кожи. При протоколе anti-acne частоту подбираем индивидуально.',
        },
      },
      {
        question: { pl: 'Czy oczyszczanie pomoże na trądzik?', ru: 'Поможет ли чистка при акне?' },
        answer: {
          pl: 'Tak, protokół anti-acne redukuje niedoskonałości i stany zapalne przy regularnych zabiegach. Przy nasilonym trądziku pracujemy równolegle z leczeniem dermatologicznym.',
          ru: 'Да, протокол anti-acne уменьшает высыпания и воспаления при регулярных процедурах. При выраженном акне работаем параллельно с дерматологическим лечением.',
        },
      },
      {
        question: { pl: 'Czy przy wrażliwej skórze można?', ru: 'Можно ли с чувствительной кожей?' },
        answer: {
          pl: 'Tak — wybieramy wtedy delikatne metody: oczyszczanie wodorowe lub ultradźwiękowe z terapią LED, która łagodzi i regeneruje.',
          ru: 'Да — в этом случае выбираем мягкие методы: водородную чистку или ультразвуковую с LED-терапией, которая успокаивает и восстанавливает кожу.',
        },
      },
      {
        question: { pl: 'Ile trwa zabieg?', ru: 'Сколько длится процедура?' },
        answer: {
          pl: 'Około 60–90 minut, zależnie od metody i stanu skóry.',
          ru: 'Около 60–90 минут, в зависимости от метода и состояния кожи.',
        },
      },
      {
        question: { pl: 'Jak pielęgnować skórę po zabiegu?', ru: 'Как ухаживать за кожей после?' },
        answer: {
          pl: 'Przez dobę bez makijażu, sauny i intensywnego treningu; stosuj SPF. Po zabiegu dostaniesz plan pielęgnacji domowej, by efekt utrzymał się dłużej.',
          ru: 'Сутки без макияжа, сауны и интенсивных тренировок; используйте SPF. После процедуры вы получите план домашнего ухода, чтобы эффект держался дольше.',
        },
      },
    ],
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
    faq: [
      {
        question: { pl: 'Na czym polega mezoterapia?', ru: 'Что такое мезотерапия?' },
        answer: {
          pl: 'To seria mikroiniekcji, którymi dostarczamy w głąb skóry koktajle z kwasem hialuronowym, witaminami i innymi składnikami aktywnymi — dokładnie tam, gdzie skóra ich potrzebuje.',
          ru: 'Это серия микроинъекций, которыми мы доставляем вглубь кожи коктейли с гиалуроновой кислотой, витаминами и другими активными компонентами — именно туда, где они нужны коже.',
        },
      },
      {
        question: { pl: 'Czy to boli?', ru: 'Это больно?' },
        answer: {
          pl: 'Używamy bardzo cienkich igieł, a ukłucia są płytkie i krótkie. Większość klientek przechodzi zabieg komfortowo; wrażliwość zależy od strefy.',
          ru: 'Мы используем очень тонкие иглы, а уколы поверхностные и быстрые. Большинство клиенток переносит процедуру комфортно; чувствительность зависит от зоны.',
        },
      },
      {
        question: { pl: 'Czy po zabiegu będą ślady?', ru: 'Будут ли следы после процедуры?' },
        answer: {
          pl: 'Możliwe drobne grudki i ślady po ukłuciach, które znikają w ciągu 1–3 dni. To normalna reakcja skóry.',
          ru: 'Возможны небольшие папулы и следы от уколов, которые проходят за 1–3 дня. Это нормальная реакция кожи.',
        },
      },
      {
        question: { pl: 'Ile zabiegów potrzeba?', ru: 'Сколько нужно процедур?' },
        answer: {
          pl: 'Zwykle kurs 3–6 zabiegów co 2–4 tygodnie, potem zabiegi podtrzymujące. Plan dobierzemy na konsultacji.',
          ru: 'Обычно курс из 3–6 процедур раз в 2–4 недели, затем поддерживающие процедуры. План подберём на консультации.',
        },
      },
      {
        question: { pl: 'Kiedy widać efekt?', ru: 'Когда виден эффект?' },
        answer: {
          pl: 'Nawilżenie i świeżość widać już po pierwszym zabiegu. Efekt jest kumulacyjny — pełny rezultat pojawia się po serii.',
          ru: 'Увлажнение и свежесть заметны уже после первой процедуры. Эффект накопительный — полный результат появляется после курса.',
        },
      },
      {
        question: { pl: 'Czym różni się biorewitalizacja od mezoterapii?', ru: 'Чем биоревитализация отличается от мезотерапии?' },
        answer: {
          pl: 'Biorewitalizacja opiera się głównie na kwasie hialuronowym i głęboko nawilża, a mezoterapia to koktajle dobierane do konkretnych potrzeb skóry. Na konsultacji doradzimy, co będzie lepsze.',
          ru: 'Биоревитализация основана в первую очередь на гиалуроновой кислоте и глубоко увлажняет, а мезотерапия — это коктейли, подобранные под конкретные потребности кожи. На консультации подскажем, что подойдёт лучше.',
        },
      },
      {
        question: { pl: 'Co to są polinukleotydy i egzosomy?', ru: 'Что такое полинуклеотиды и экзосомы?' },
        answer: {
          pl: 'To nowoczesne preparaty regenerujące: pobudzają odbudowę skóry, poprawiają jej gęstość i jakość. Sprawdzają się m.in. przy skórze zmęczonej, odwodnionej i wokół oczu.',
          ru: 'Это современные регенерирующие препараты: они стимулируют восстановление кожи, улучшают её плотность и качество. Хорошо работают, в том числе, на уставшей, обезвоженной коже и вокруг глаз.',
        },
      },
      {
        question: { pl: 'Czy mezoterapia pomaga na wypadanie włosów?', ru: 'Помогает ли мезотерапия при выпадении волос?' },
        answer: {
          pl: 'Tak. Mezoterapia skóry głowy odżywia mieszki włosowe i wzmacnia włosy. Najlepsze efekty daje seria zabiegów.',
          ru: 'Да. Мезотерапия кожи головы питает волосяные фолликулы и укрепляет волосы. Лучший результат даёт курс процедур.',
        },
      },
      {
        question: { pl: 'Czy są przeciwwskazania?', ru: 'Есть ли противопоказания?' },
        answer: {
          pl: 'Tak: ciąża i karmienie piersią, aktywne stany zapalne w miejscu zabiegu, zaburzenia krzepnięcia krwi, onkologia. Kwalifikację ocenimy na konsultacji.',
          ru: 'Да: беременность и грудное вскармливание, активные воспаления в зоне процедуры, нарушения свёртываемости крови, онкология. Пригодность оценим на консультации.',
        },
      },
      {
        question: { pl: 'Czego unikać po zabiegu?', ru: 'Чего избегать после процедуры?' },
        answer: {
          pl: 'Przez dobę nie nakładaj makijażu i nie dotykaj strefy zabiegu. Przez 48–72 godziny unikaj sauny, basenu i intensywnego wysiłku.',
          ru: 'Сутки не наносите макияж и не трогайте зону процедуры. 48–72 часа избегайте сауны, бассейна и интенсивных нагрузок.',
        },
      },
    ],
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
