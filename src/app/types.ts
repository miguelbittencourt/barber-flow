// Types para o BarberFlow

export interface Service {
  id: string;
  name: string;
  price: number;
  category: 'Avulso' | 'Recorrência' | 'Extra' | 'Produto';
  createdAt: string;
}

export interface AttendanceItem {
  serviceId: string;
  serviceName: string;
  price: number;
  quantity: number;
  category: 'Avulso' | 'Recorrência' | 'Extra' | 'Produto';
}

export interface Attendance {
  id: string;
  date: string; // YYYY-MM-DD
  items: AttendanceItem[];
  total: number;
  clientName?: string;
  createdAt: string;
}

export interface Goals {
  daily: number;
  monthly: number;
}

export interface User {
  name: string;
  email: string;
  pin?: string;
}

export interface DailySummary {
  date: string;
  total: number;
  attendanceCount: number;
  avgTicket: number;
  byCategory: {
    Avulso: number;
    Recorrência: number;
    Extra: number;
    Produto: number;
  };
}
