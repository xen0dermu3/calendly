import { format } from 'date-fns';

export function formatDate(date: Date | string) {
  return format(new Date(date), 'yyyy-MM-dd');
}

export function firstToUpperCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
