export interface Contest {
  id: string;
  title: string;
  description: string;
  prize: number;
  createdDate: number;
  initialDate: number;
  endDate: number;
  tags: string[];
}
