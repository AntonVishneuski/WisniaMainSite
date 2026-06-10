export interface BeforeAfterRow {
  beforeFile: string
  afterFile: string
  caption: { pl: string; ru: string }
  order: number
}

export const beforeAfter: BeforeAfterRow[] = [
  {
    beforeFile: 'wisnia-beauty/design_handoff/source/assets/ba1-before.jpg',
    afterFile: 'wisnia-beauty/design_handoff/source/assets/ba1-after.jpg',
    caption: {
      pl: 'Redukcja zaczerwienień i ujednolicenie kolorytu skóry',
      ru: 'Уменьшение покраснений и выравнивание тона кожи',
    },
    order: 0,
  },
  {
    beforeFile: 'wisnia-beauty/design_handoff/source/assets/ba2-before.jpg',
    afterFile: 'wisnia-beauty/design_handoff/source/assets/ba2-after.jpg',
    caption: {
      pl: 'IPL (fotoodmładzanie): redukcja przebarwień i odświeżenie skóry twarzy',
      ru: 'IPL (фотоомоложение): уменьшение пигментации и обновление кожи лица',
    },
    order: 1,
  },
  {
    beforeFile: 'wisnia-beauty/design_handoff/source/assets/ba3-before.jpg',
    afterFile: 'wisnia-beauty/design_handoff/source/assets/ba3-after.jpg',
    caption: {
      pl: 'Usuwanie naczynek na nosie (kuperoza)',
      ru: 'Удаление сосудов на носу (купероз)',
    },
    order: 2,
  },
  {
    beforeFile: 'wisnia-beauty/design_handoff/source/assets/ba4-before.jpg',
    afterFile: 'wisnia-beauty/design_handoff/source/assets/ba4-after.jpg',
    caption: {
      pl: 'IPL (fotoodmładzanie): rozjaśnienie skóry i wyrównanie kolorytu',
      ru: 'IPL (фотоомоложение): осветление кожи и выравнивание тона',
    },
    order: 3,
  },
  {
    beforeFile: 'wisnia-beauty/design_handoff/source/assets/ba5-before.jpg',
    afterFile: 'wisnia-beauty/design_handoff/source/assets/ba5-after.jpg',
    caption: {
      pl: 'Redukcja zaczerwienień i poprawa kondycji skóry',
      ru: 'Уменьшение покраснений и улучшение состояния кожи',
    },
    order: 4,
  },
  {
    beforeFile: 'wisnia-beauty/design_handoff/source/assets/ba6-before.jpg',
    afterFile: 'wisnia-beauty/design_handoff/source/assets/ba6-after.jpg',
    caption: {
      pl: 'Redukcja naczynek na nosie (zbliżenie)',
      ru: 'Уменьшение сосудов на носу (крупный план)',
    },
    order: 5,
  },
]
