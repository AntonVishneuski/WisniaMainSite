export interface ReviewRow {
  quote: { pl: string; ru: string }
  author: string
  initial: string
  avatarColor: string
  rating: number
  source: 'Google' | 'Booksy'
  date: { pl: string; ru: string }
  order: number
}

export const reviews: ReviewRow[] = [
  {
    quote: {
      pl: '„Robiłam depilację laserową w różnych salonach, ale najlepsze efekty osiągnęłam w Wiśnia Beauty. Już po pierwszym zabiegu włosów prawie nie zostało. Mają jeden z najlepszych laserów w Warszawie, różnica w rezultatach jest ogromna."',
      ru: '«Делала лазерную эпиляцию в разных салонах, но лучших результатов добилась в Wiśnia Beauty. Уже после первой процедуры волос почти не осталось. Здесь один из лучших лазеров в Варшаве, разница в результатах огромная.»',
    },
    author: 'Kitnormal Kit',
    initial: 'K',
    avatarColor: '#6E4B3A',
    rating: 5,
    source: 'Google',
    date: { pl: 'miesiąc temu', ru: 'месяц назад' },
    order: 0,
  },
  {
    quote: {
      pl: '„Ogromne podziękowania dla masażystki studia. Przyszłam z częstymi migrenami, a po pierwszym zabiegu ból zniknął. Profesjonalizm czuć w każdym ruchu, a atmosfera to troska i ciepło."',
      ru: '«Огромная благодарность массажистке студии. Пришла с частыми мигренями, а после первого сеанса боль исчезла. Профессионализм чувствуется в каждом движении, а атмосфера это забота и тепло.»',
    },
    author: 'Darya Ascheulova',
    initial: 'D',
    avatarColor: '#8B1A3A',
    rating: 5,
    source: 'Google',
    date: { pl: '9 miesięcy temu', ru: '9 месяцев назад' },
    order: 1,
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
    order: 2,
  },
  {
    quote: {
      pl: '„Od kilku lat regularnie korzystam z usług Pani Olgi i zawsze wychodzę w pełni zadowolona. Efekt wygląda naturalnie i utrzymuje się długo. Atmosfera jest przyjemna, a Pani Olga miła i pomocna. Miejsce, które szczerze polecam każdemu."',
      ru: '«Уже несколько лет регулярно пользуюсь услугами пани Ольги и всегда ухожу полностью довольной. Эффект выглядит естественно и держится долго. Атмосфера приятная, а пани Ольга милая и внимательная. Место, которое искренне рекомендую каждому.»',
    },
    author: 'Sylwia Kanciała',
    initial: 'S',
    avatarColor: '#A8324F',
    rating: 5,
    source: 'Google',
    date: { pl: '9 miesięcy temu', ru: '9 месяцев назад' },
    order: 3,
  },
  {
    quote: {
      pl: '„Jestem bardzo zadowolona z usuwania pajączków na nosie, zabieg przebiegł świetnie. Na pewno wrócę, żeby usunąć naczynka także na innych partiach ciała."',
      ru: '«Очень довольна удалением сосудиков на носу, всё прошло отлично. Обязательно вернусь, чтобы убрать сосуды и на других участках тела.»',
    },
    author: 'Katy',
    initial: 'K',
    avatarColor: '#6E122C',
    rating: 5,
    source: 'Booksy',
    date: { pl: 'styczeń 2026', ru: 'январь 2026' },
    order: 4,
  },
  {
    quote: {
      pl: '„Właścicielka Olga jest bardzo sympatyczna i dużo wie o tym, jak najlepiej pomóc Twojej skórze. Była dokładna, bardzo się cieszę z wizyty. Serdecznie polecam!"',
      ru: '«Владелица Ольга очень приятная и прекрасно знает, как лучше помочь вашей коже. Была внимательна, я очень довольна визитом. Сердечно рекомендую!»',
    },
    author: 'Dominika',
    initial: 'D',
    avatarColor: '#B07E55',
    rating: 5,
    source: 'Booksy',
    date: { pl: 'maj 2023', ru: 'май 2023' },
    order: 5,
  },
]
