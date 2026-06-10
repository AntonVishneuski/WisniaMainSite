export interface PriceRow {
  tab: 'kosmetologia' | 'laser' | 'cialo' | 'pakiety'
  category?: { pl: string; ru: string }
  categorySubtitle?: { pl: string; ru: string }
  name: { pl: string; ru: string }
  subline?: { pl: string; ru: string }
  price?: { pl: string; ru: string }
  priceWas?: { pl: string; ru: string }
  isPackage?: boolean
  isGift?: boolean
  order: number
}

export const prices: PriceRow[] = [
  // ============================================================
  // TAB: KOSMETOLOGIA
  // ============================================================

  // Category: Oczyszczanie twarzy
  {
    tab: 'kosmetologia',
    category: { pl: 'Oczyszczanie twarzy', ru: 'Очищение лица' },
    name: { pl: 'Wodorowe oczyszczanie', ru: 'Водородное очищение' },
    price: { pl: '250 zł', ru: '250 zł' },
    order: 0,
  },
  {
    tab: 'kosmetologia',
    category: { pl: 'Oczyszczanie twarzy', ru: 'Очищение лица' },
    name: { pl: 'Oczyszczanie kombinowane', ru: 'Комбинированная чистка' },
    price: { pl: '350 zł', ru: '350 zł' },
    order: 1,
  },
  {
    tab: 'kosmetologia',
    category: { pl: 'Oczyszczanie twarzy', ru: 'Очищение лица' },
    name: { pl: 'Oczyszczanie + peeling', ru: 'Чистка + пилинг' },
    price: { pl: '450 zł', ru: '450 zł' },
    order: 2,
  },
  {
    tab: 'kosmetologia',
    category: { pl: 'Oczyszczanie twarzy', ru: 'Очищение лица' },
    name: { pl: 'Protokół Anti-Acne', ru: 'Протокол Anti-Acne' },
    price: { pl: '450 zł', ru: '450 zł' },
    order: 3,
  },
  {
    tab: 'kosmetologia',
    category: { pl: 'Oczyszczanie twarzy', ru: 'Очищение лица' },
    name: { pl: 'Oczyszczanie ultradźwiękowe + LED', ru: 'УЗ-чистка + LED' },
    price: { pl: '250 zł', ru: '250 zł' },
    order: 4,
  },

  // Category: Peelingi
  {
    tab: 'kosmetologia',
    category: { pl: 'Peelingi', ru: 'Пилинги' },
    categorySubtitle: { pl: 'wszystkie po 300 zł', ru: 'все по 300 zł' },
    name: { pl: 'Peelingi medyczne', ru: 'Медицинские пилинги' },
    subline: {
      pl: 'migdałowy · azelainowy · ferulowy · glikolowy · Jessnera · PRX-T33 · BioRePeel',
      ru: 'миндальный · азелаиновый · феруловый · гликолевый · Джесснера · PRX-T33 · BioRePeel',
    },
    price: { pl: '300 zł', ru: '300 zł' },
    order: 5,
  },

  // Category: RF-lifting twarzy i ciała
  {
    tab: 'kosmetologia',
    category: { pl: 'RF-lifting twarzy i ciała', ru: 'RF-лифтинг лица и тела' },
    name: { pl: 'Twarz + podbródek', ru: 'Лицо + подбородок' },
    price: { pl: '800 zł', ru: '800 zł' },
    order: 6,
  },
  {
    tab: 'kosmetologia',
    category: { pl: 'RF-lifting twarzy i ciała', ru: 'RF-лифтинг лица и тела' },
    name: { pl: 'Twarz + szyja', ru: 'Лицо + шея' },
    price: { pl: '900 zł', ru: '900 zł' },
    order: 7,
  },
  {
    tab: 'kosmetologia',
    category: { pl: 'RF-lifting twarzy i ciała', ru: 'RF-лифтинг лица и тела' },
    name: { pl: 'Twarz + szyja + dekolt', ru: 'Лицо + шея + декольте' },
    price: { pl: '1000 zł', ru: '1000 zł' },
    order: 8,
  },
  {
    tab: 'kosmetologia',
    category: { pl: 'RF-lifting twarzy i ciała', ru: 'RF-лифтинг лица и тела' },
    name: { pl: 'RF-lifting dłoni w prezencie', ru: 'RF-лифтинг кистей рук в подарок' },
    isGift: true,
    order: 9,
  },

  // Category: IPL-fotoodmładzanie
  {
    tab: 'kosmetologia',
    category: { pl: 'IPL-fotoodmładzanie', ru: 'IPL-фотоомоложение' },
    categorySubtitle: {
      pl: 'naczynka · pigmentacja · post-acne',
      ru: 'сосуды · пигментация · постакне',
    },
    name: { pl: 'Twarz', ru: 'Лицо' },
    price: { pl: '550 zł', ru: '550 zł' },
    order: 10,
  },
  {
    tab: 'kosmetologia',
    category: { pl: 'IPL-fotoodmładzanie', ru: 'IPL-фотоомоложение' },
    categorySubtitle: {
      pl: 'naczynka · pigmentacja · post-acne',
      ru: 'сосуды · пигментация · постакне',
    },
    name: { pl: 'Twarz + szyja', ru: 'Лицо + шея' },
    price: { pl: '750 zł', ru: '750 zł' },
    order: 11,
  },
  {
    tab: 'kosmetologia',
    category: { pl: 'IPL-fotoodmładzanie', ru: 'IPL-фотоомоложение' },
    categorySubtitle: {
      pl: 'naczynka · pigmentacja · post-acne',
      ru: 'сосуды · пигментация · постакне',
    },
    name: { pl: 'Twarz + szyja + dekolt', ru: 'Лицо + шея + декольте' },
    price: { pl: '900 zł', ru: '900 zł' },
    order: 12,
  },
  {
    tab: 'kosmetologia',
    category: { pl: 'IPL-fotoodmładzanie', ru: 'IPL-фотоомоложение' },
    categorySubtitle: {
      pl: 'naczynka · pigmentacja · post-acne',
      ru: 'сосуды · пигментация · постакне',
    },
    name: { pl: 'Forever Young Protocol', ru: 'Forever Young Protocol' },
    price: { pl: '1000 zł', ru: '1000 zł' },
    order: 13,
  },
  {
    tab: 'kosmetologia',
    category: { pl: 'IPL-fotoodmładzanie', ru: 'IPL-фотоомоложение' },
    categorySubtitle: {
      pl: 'naczynka · pigmentacja · post-acne',
      ru: 'сосуды · пигментация · постакне',
    },
    name: { pl: 'RF-lifting dłoni w prezencie', ru: 'RF-лифтинг кистей рук в подарок' },
    isGift: true,
    order: 14,
  },

  // Category: Mezoterapia
  {
    tab: 'kosmetologia',
    category: { pl: 'Mezoterapia', ru: 'Мезотерапия' },
    name: { pl: 'Okolice oczu', ru: 'Зона вокруг глаз' },
    price: { pl: '390 zł', ru: '390 zł' },
    order: 15,
  },
  {
    tab: 'kosmetologia',
    category: { pl: 'Mezoterapia', ru: 'Мезотерапия' },
    name: { pl: 'Biorewitalizacja', ru: 'Биоревитализация' },
    price: { pl: 'od 650 zł', ru: 'от 650 zł' },
    order: 16,
  },
  {
    tab: 'kosmetologia',
    category: { pl: 'Mezoterapia', ru: 'Мезотерапия' },
    name: { pl: 'Biorewitalizacja ust', ru: 'Биоревитализация губ' },
    price: { pl: '650 zł', ru: '650 zł' },
    order: 17,
  },
  {
    tab: 'kosmetologia',
    category: { pl: 'Mezoterapia', ru: 'Мезотерапия' },
    name: { pl: 'Polinukleotydy', ru: 'Полинуклеотиды' },
    price: { pl: '750 zł', ru: '750 zł' },
    order: 18,
  },
  {
    tab: 'kosmetologia',
    category: { pl: 'Mezoterapia', ru: 'Мезотерапия' },
    name: { pl: 'Egzosomy', ru: 'Экзосомы' },
    price: { pl: '750 zł', ru: '750 zł' },
    order: 19,
  },
  {
    tab: 'kosmetologia',
    category: { pl: 'Mezoterapia', ru: 'Мезотерапия' },
    name: { pl: 'Dermapen', ru: 'Dermapen' },
    price: { pl: '450 zł', ru: '450 zł' },
    order: 20,
  },
  {
    tab: 'kosmetologia',
    category: { pl: 'Mezoterapia', ru: 'Мезотерапия' },
    name: { pl: 'Mezoterapia skóry głowy', ru: 'Мезотерапия кожи головы' },
    price: { pl: '500 zł', ru: '500 zł' },
    order: 21,
  },

  // Category: Usuwanie naczynek
  {
    tab: 'kosmetologia',
    category: { pl: 'Usuwanie naczynek', ru: 'Удаление сосудов' },
    categorySubtitle: { pl: 'kuperoza · zaczerwienienia', ru: 'купероз · покраснения' },
    name: { pl: 'Nos', ru: 'Нос' },
    price: { pl: '300 zł', ru: '300 zł' },
    order: 22,
  },
  {
    tab: 'kosmetologia',
    category: { pl: 'Usuwanie naczynek', ru: 'Удаление сосудов' },
    categorySubtitle: { pl: 'kuperoza · zaczerwienienia', ru: 'купероз · покраснения' },
    name: { pl: 'Policzki', ru: 'Щёки' },
    price: { pl: '350 zł', ru: '350 zł' },
    order: 23,
  },
  {
    tab: 'kosmetologia',
    category: { pl: 'Usuwanie naczynek', ru: 'Удаление сосудов' },
    categorySubtitle: { pl: 'kuperoza · zaczerwienienia', ru: 'купероз · покраснения' },
    name: { pl: 'Cała twarz', ru: 'Всё лицо' },
    price: { pl: '450 zł', ru: '450 zł' },
    order: 24,
  },
  {
    tab: 'kosmetologia',
    category: { pl: 'Usuwanie naczynek', ru: 'Удаление сосудов' },
    categorySubtitle: { pl: 'kuperoza · zaczerwienienia', ru: 'купероз · покраснения' },
    name: { pl: 'Nogi', ru: 'Ноги' },
    price: { pl: '450 zł', ru: '450 zł' },
    order: 25,
  },

  // ============================================================
  // TAB: LASER
  // ============================================================

  // Category: Depilacja laserowa dla kobiet
  {
    tab: 'laser',
    category: { pl: 'Depilacja laserowa dla kobiet', ru: 'Лазерная эпиляция для женщин' },
    categorySubtitle: { pl: 'system Estera', ru: 'система Estera' },
    name: { pl: 'Bikini głębokie', ru: 'Бикини глубокое' },
    price: { pl: '260 zł', ru: '260 zł' },
    order: 26,
  },
  {
    tab: 'laser',
    category: { pl: 'Depilacja laserowa dla kobiet', ru: 'Лазерная эпиляция для женщин' },
    categorySubtitle: { pl: 'system Estera', ru: 'система Estera' },
    name: { pl: 'Bikini extra', ru: 'Бикини extra' },
    price: { pl: '320 zł', ru: '320 zł' },
    order: 27,
  },
  {
    tab: 'laser',
    category: { pl: 'Depilacja laserowa dla kobiet', ru: 'Лазерная эпиляция для женщин' },
    categorySubtitle: { pl: 'system Estera', ru: 'система Estera' },
    name: { pl: 'Bikini klasyczne', ru: 'Бикини классическое' },
    price: { pl: '160 zł', ru: '160 zł' },
    order: 28,
  },
  {
    tab: 'laser',
    category: { pl: 'Depilacja laserowa dla kobiet', ru: 'Лазерная эпиляция для женщин' },
    categorySubtitle: { pl: 'system Estera', ru: 'система Estera' },
    name: { pl: 'Pachy', ru: 'Подмышки' },
    price: { pl: '110 zł', ru: '110 zł' },
    order: 29,
  },
  {
    tab: 'laser',
    category: { pl: 'Depilacja laserowa dla kobiet', ru: 'Лазерная эпиляция для женщин' },
    categorySubtitle: { pl: 'system Estera', ru: 'система Estera' },
    name: { pl: 'Ręce całe (+ palce)', ru: 'Руки полностью (+ пальцы)' },
    price: { pl: '260 zł', ru: '260 zł' },
    order: 30,
  },
  {
    tab: 'laser',
    category: { pl: 'Depilacja laserowa dla kobiet', ru: 'Лазерная эпиляция для женщин' },
    categorySubtitle: { pl: 'system Estera', ru: 'система Estera' },
    name: { pl: 'Palce rąk i nóg', ru: 'Пальцы рук и ног' },
    price: { pl: '110 zł', ru: '110 zł' },
    order: 31,
  },
  {
    tab: 'laser',
    category: { pl: 'Depilacja laserowa dla kobiet', ru: 'Лазерная эпиляция для женщин' },
    categorySubtitle: { pl: 'system Estera', ru: 'система Estera' },
    name: { pl: 'Ręce do/od łokcia', ru: 'Руки до/от локтя' },
    price: { pl: '220 zł', ru: '220 zł' },
    order: 32,
  },
  {
    tab: 'laser',
    category: { pl: 'Depilacja laserowa dla kobiet', ru: 'Лазерная эпиляция для женщин' },
    categorySubtitle: { pl: 'system Estera', ru: 'система Estera' },
    name: { pl: 'Nogi całe', ru: 'Ноги полностью' },
    price: { pl: '450 zł', ru: '450 zł' },
    order: 33,
  },
  {
    tab: 'laser',
    category: { pl: 'Depilacja laserowa dla kobiet', ru: 'Лазерная эпиляция для женщин' },
    categorySubtitle: { pl: 'system Estera', ru: 'система Estera' },
    name: { pl: 'Nogi do/od kolan (+ kolana)', ru: 'Ноги до/от колен (+ колени)' },
    price: { pl: '300 zł', ru: '300 zł' },
    order: 34,
  },
  {
    tab: 'laser',
    category: { pl: 'Depilacja laserowa dla kobiet', ru: 'Лазерная эпиляция для женщин' },
    categorySubtitle: { pl: 'system Estera', ru: 'система Estera' },
    name: { pl: 'Plecy całe', ru: 'Спина полностью' },
    price: { pl: '450 zł', ru: '450 zł' },
    order: 35,
  },
  {
    tab: 'laser',
    category: { pl: 'Depilacja laserowa dla kobiet', ru: 'Лазерная эпиляция для женщин' },
    categorySubtitle: { pl: 'system Estera', ru: 'система Estera' },
    name: { pl: 'Plecy (część)', ru: 'Спина (часть)' },
    price: { pl: '220-260 zł', ru: '220-260 zł' },
    order: 36,
  },

  // Category: Depilacja laserowa dla mężczyzn
  {
    tab: 'laser',
    category: { pl: 'Depilacja laserowa dla mężczyzn', ru: 'Лазерная эпиляция для мужчин' },
    categorySubtitle: { pl: 'nowość', ru: 'новинка' },
    name: { pl: 'Plecy całe', ru: 'Спина' },
    price: { pl: '550 zł', ru: '550 zł' },
    order: 37,
  },
  {
    tab: 'laser',
    category: { pl: 'Depilacja laserowa dla mężczyzn', ru: 'Лазерная эпиляция для мужчин' },
    categorySubtitle: { pl: 'nowość', ru: 'новинка' },
    name: { pl: 'Klatka + brzuch', ru: 'Грудь + живот' },
    price: { pl: '500 zł', ru: '500 zł' },
    order: 38,
  },
  {
    tab: 'laser',
    category: { pl: 'Depilacja laserowa dla mężczyzn', ru: 'Лазерная эпиляция для мужчин' },
    categorySubtitle: { pl: 'nowość', ru: 'новинка' },
    name: { pl: 'Kontur brody', ru: 'Контур бороды' },
    price: { pl: '220 zł', ru: '220 zł' },
    order: 39,
  },
  {
    tab: 'laser',
    category: { pl: 'Depilacja laserowa dla mężczyzn', ru: 'Лазерная эпиляция для мужчин' },
    categorySubtitle: { pl: 'nowość', ru: 'новинка' },
    name: { pl: 'Pachy', ru: 'Подмышки' },
    price: { pl: '160 zł', ru: '160 zł' },
    order: 40,
  },
  {
    tab: 'laser',
    category: { pl: 'Depilacja laserowa dla mężczyzn', ru: 'Лазерная эпиляция для мужчин' },
    categorySubtitle: { pl: 'nowość', ru: 'новинка' },
    name: { pl: 'Szyja', ru: 'Шея' },
    price: { pl: '150 zł', ru: '150 zł' },
    order: 41,
  },

  // Category: Wybielanie okolic intymnych
  {
    tab: 'laser',
    category: { pl: 'Wybielanie okolic intymnych', ru: 'Интимное отбеливание' },
    name: { pl: 'Pachy', ru: 'Подмышки' },
    price: { pl: '250 zł', ru: '250 zł' },
    order: 42,
  },
  {
    tab: 'laser',
    category: { pl: 'Wybielanie okolic intymnych', ru: 'Интимное отбеливание' },
    name: { pl: 'Bikini', ru: 'Бикини' },
    price: { pl: '350 zł', ru: '350 zł' },
    order: 43,
  },

  // ============================================================
  // TAB: CIAŁO
  // ============================================================

  // Category: Masaże
  {
    tab: 'cialo',
    category: { pl: 'Masaże', ru: 'Массажи' },
    name: { pl: 'Masaż ciała 60 min', ru: 'Массаж тела 60 мин' },
    price: { pl: '200 zł', ru: '200 zł' },
    order: 44,
  },
  {
    tab: 'cialo',
    category: { pl: 'Masaże', ru: 'Массажи' },
    name: { pl: 'Masaż ciała 90 min', ru: 'Массаж тела 90 мин' },
    price: { pl: '250 zł', ru: '250 zł' },
    order: 45,
  },
  {
    tab: 'cialo',
    category: { pl: 'Masaże', ru: 'Массажи' },
    name: { pl: 'Kobido Premium', ru: 'Kobido Premium' },
    price: { pl: '240 zł', ru: '240 zł' },
    order: 46,
  },
  {
    tab: 'cialo',
    category: { pl: 'Masaże', ru: 'Массажи' },
    name: { pl: 'Ciało + twarz', ru: 'Тело + лицо' },
    price: { pl: '280 zł', ru: '280 zł' },
    order: 47,
  },

  // Category: Usuwanie zmian skórnych
  {
    tab: 'cialo',
    category: { pl: 'Usuwanie zmian skórnych', ru: 'Удаление новообразований' },
    categorySubtitle: {
      pl: 'brodawki · papilloma · keratozy · naczyniaki · prosaki (milia)',
      ru: 'бородавки · папилломы · кератомы · ангиомы · милиумы',
    },
    name: {
      pl: 'Pracuję z dermatoskopem: każdą zmianę oceniam przed zabiegiem',
      ru: 'Работаю с дерматоскопом: каждое образование осматриваю перед процедурой',
    },
    isGift: true,
    order: 48,
  },
  {
    tab: 'cialo',
    category: { pl: 'Usuwanie zmian skórnych', ru: 'Удаление новообразований' },
    categorySubtitle: {
      pl: 'brodawki · papilloma · keratozy · naczyniaki · prosaki (milia)',
      ru: 'бородавки · папилломы · кератомы · ангиомы · милиумы',
    },
    name: { pl: '1-5 elementów', ru: '1-5 элементов' },
    price: { pl: '150 zł', ru: '150 zł' },
    order: 49,
  },
  {
    tab: 'cialo',
    category: { pl: 'Usuwanie zmian skórnych', ru: 'Удаление новообразований' },
    categorySubtitle: {
      pl: 'brodawki · papilloma · keratozy · naczyniaki · prosaki (milia)',
      ru: 'бородавки · папилломы · кератомы · ангиомы · милиумы',
    },
    name: { pl: '6-10 elementów', ru: '6-10 элементов' },
    price: { pl: '250 zł', ru: '250 zł' },
    order: 50,
  },
  {
    tab: 'cialo',
    category: { pl: 'Usuwanie zmian skórnych', ru: 'Удаление новообразований' },
    categorySubtitle: {
      pl: 'brodawki · papilloma · keratozy · naczyniaki · prosaki (milia)',
      ru: 'бородавки · папилломы · кератомы · ангиомы · милиумы',
    },
    name: { pl: '11-25 elementów', ru: '11-25 элементов' },
    price: { pl: '350 zł', ru: '350 zł' },
    order: 51,
  },

  // ============================================================
  // TAB: PAKIETY
  // ============================================================

  // Category: Combo depilacji
  {
    tab: 'pakiety',
    category: { pl: 'Combo depilacji', ru: 'Комбо эпиляции' },
    categorySubtitle: { pl: 'za wizytę · -15%', ru: 'за визит · -15%' },
    name: { pl: 'Bikini głębokie + pachy', ru: 'Бикини глубокое + подмышки' },
    price: { pl: '330 zł', ru: '330 zł' },
    priceWas: { pl: 'zamiast 370 zł', ru: 'вместо 370 zł' },
    isPackage: true,
    order: 52,
  },
  {
    tab: 'pakiety',
    category: { pl: 'Combo depilacji', ru: 'Комбо эпиляции' },
    categorySubtitle: { pl: 'za wizytę · -15%', ru: 'за визит · -15%' },
    name: { pl: 'Bikini głębokie + pachy + nogi całe', ru: 'Бикини глубокое + подмышки + ноги полностью' },
    price: { pl: '690 zł', ru: '690 zł' },
    priceWas: { pl: 'zamiast 820 zł', ru: 'вместо 820 zł' },
    isPackage: true,
    order: 53,
  },
  {
    tab: 'pakiety',
    category: { pl: 'Combo depilacji', ru: 'Комбо эпиляции' },
    categorySubtitle: { pl: 'za wizytę · -15%', ru: 'за визит · -15%' },
    name: { pl: '«Całe ciało»', ru: '«Всё тело»' },
    subline: { pl: 'bikini extra + pachy + nogi + ręce', ru: 'бикини extra + подмышки + ноги + руки' },
    price: { pl: '950 zł', ru: '950 zł' },
    priceWas: { pl: 'zamiast 1140 zł', ru: 'вместо 1140 zł' },
    isPackage: true,
    order: 54,
  },

  // Category: Kursy
  {
    tab: 'pakiety',
    category: { pl: 'Kursy', ru: 'Курсы' },
    categorySubtitle: { pl: 'płatność z góry · -15%', ru: 'предоплата · -15%' },
    name: { pl: 'Kurs 6 zabiegów depilacji', ru: 'Курс 6 процедур эпиляции' },
    subline: { pl: 'dowolna strefa lub combo', ru: 'любая зона или комбо' },
    price: { pl: '-15%', ru: '-15%' },
    isPackage: true,
    order: 55,
  },
  {
    tab: 'pakiety',
    category: { pl: 'Kursy', ru: 'Курсы' },
    categorySubtitle: { pl: 'płatność z góry · -15%', ru: 'предоплата · -15%' },
    name: { pl: '5× masaż ciała 60 min', ru: '5× массаж тела 60 мин' },
    price: { pl: '850 zł', ru: '850 zł' },
    priceWas: { pl: 'zamiast 1000 zł', ru: 'вместо 1000 zł' },
    isPackage: true,
    order: 56,
  },
  {
    tab: 'pakiety',
    category: { pl: 'Kursy', ru: 'Курсы' },
    categorySubtitle: { pl: 'płatność z góry · -15%', ru: 'предоплата · -15%' },
    name: { pl: '5× Kobido Premium', ru: '5× Kobido Premium' },
    price: { pl: '1020 zł', ru: '1020 zł' },
    priceWas: { pl: 'zamiast 1200 zł', ru: 'вместо 1200 zł' },
    isPackage: true,
    order: 57,
  },
  {
    tab: 'pakiety',
    category: { pl: 'Kursy', ru: 'Курсы' },
    categorySubtitle: { pl: 'płatność z góry · -15%', ru: 'предоплата · -15%' },
    name: { pl: '4× peeling', ru: '4× пилинг' },
    price: { pl: '1020 zł', ru: '1020 zł' },
    priceWas: { pl: 'zamiast 1200 zł', ru: 'вместо 1200 zł' },
    isPackage: true,
    order: 58,
  },
  {
    tab: 'pakiety',
    category: { pl: 'Kursy', ru: 'Курсы' },
    categorySubtitle: { pl: 'płatność z góry · -15%', ru: 'предоплата · -15%' },
    name: { pl: '4× protokół Anti-Acne', ru: '4× протокол Anti-Acne' },
    price: { pl: '1530 zł', ru: '1530 zł' },
    priceWas: { pl: 'zamiast 1800 zł', ru: 'вместо 1800 zł' },
    isPackage: true,
    order: 59,
  },
  {
    tab: 'pakiety',
    category: { pl: 'Kursy', ru: 'Курсы' },
    categorySubtitle: { pl: 'płatność z góry · -15%', ru: 'предоплата · -15%' },
    name: { pl: '3× IPL twarz', ru: '3× IPL лицо' },
    price: { pl: '1400 zł', ru: '1400 zł' },
    priceWas: { pl: 'zamiast 1650 zł', ru: 'вместо 1650 zł' },
    isPackage: true,
    order: 60,
  },
  {
    tab: 'pakiety',
    category: { pl: 'Kursy', ru: 'Курсы' },
    categorySubtitle: { pl: 'płatność z góry · -15%', ru: 'предоплата · -15%' },
    name: { pl: '6× RF-lifting twarz + szyja', ru: '6× RF-лифтинг лицо + шея' },
    price: { pl: '4590 zł', ru: '4590 zł' },
    priceWas: { pl: 'zamiast 5400 zł', ru: 'вместо 5400 zł' },
    isPackage: true,
    order: 61,
  },
]
