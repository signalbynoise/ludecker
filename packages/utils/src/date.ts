const DEFAULT_LOCALE = 'en-US';

export interface FormatDateOptions {
  locale?: string;
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
}

export function formatDate(
  value: string | Date,
  options: FormatDateOptions = {},
): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const { locale = DEFAULT_LOCALE, dateStyle = 'long' } = options;

  return new Intl.DateTimeFormat(locale, { dateStyle }).format(date);
}
