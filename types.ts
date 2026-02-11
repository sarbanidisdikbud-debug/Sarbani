
export type LetterType = 'MASUK' | 'KELUAR';

export interface Letter {
  id: string;
  number: string;
  title: string;
  sender: string;
  receiver: string;
  date: string;
  category: string;
  type: LetterType;
  description: string;
  content: string; // The full text content of the letter
  aiSummary?: string;
  tags: string[];
}

export interface Statistics {
  totalMasuk: number;
  totalKeluar: number;
  categoryDistribution: { name: string; value: number }[];
}
