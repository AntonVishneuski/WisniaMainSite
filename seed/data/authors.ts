export interface AuthorRow {
  key: string
  name: { pl: string; ru: string }
  jobTitle: { pl: string; ru: string }
  credentials: { pl: string; ru: string }
  bio: { pl: string; ru: string }
  photoFile: string | null
}

// PLACEHOLDER credentials — owner to replace with a real named specialist + reviewer in /admin.
export const authors: AuthorRow[] = [
  {
    key: 'olga',
    name: { pl: 'Olga — Wiśnia Beauty', ru: 'Ольга — Wiśnia Beauty' },
    jobTitle: {
      pl: 'Kosmetolog, specjalista depilacji laserowej',
      ru: 'Косметолог, специалист по лазерной эпиляции',
    },
    credentials: {
      pl: 'Wieloletnie doświadczenie w kosmetologii estetycznej.',
      ru: 'Многолетний опыт в эстетической косметологии.',
    },
    bio: {
      pl: 'Prowadzi zabiegi laserowe i pielęgnacyjne w Wiśnia Beauty Studio w Warszawie.',
      ru: 'Проводит лазерные и уходовые процедуры в Wiśnia Beauty Studio в Варшаве.',
    },
    photoFile: null,
  },
  {
    key: 'reviewer',
    name: { pl: 'Zespół merytoryczny Wiśnia', ru: 'Научная редакция Wiśnia' },
    jobTitle: { pl: 'Recenzja merytoryczna', ru: 'Научная редактура' },
    credentials: {
      pl: 'Treści weryfikowane pod kątem aktualności i bezpieczeństwa.',
      ru: 'Материалы проверяются на актуальность и безопасность.',
    },
    bio: { pl: '', ru: '' },
    photoFile: null,
  },
]
