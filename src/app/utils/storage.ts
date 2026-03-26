// Local Storage utilities para BarberFlow

import type { Service, Attendance, Goals, User } from '../types';

const KEYS = {
  USER: 'barberflow_user',
  SERVICES: 'barberflow_services',
  ATTENDANCES: 'barberflow_attendances',
  GOALS: 'barberflow_goals',
  AUTH_TOKEN: 'barberflow_token',
};

// User
export const getUser = (): User | null => {
  const data = localStorage.getItem(KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const setUser = (user: User): void => {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
};

export const clearUser = (): void => {
  localStorage.removeItem(KEYS.USER);
  localStorage.removeItem(KEYS.AUTH_TOKEN);
};

// Auth Token
export const getAuthToken = (): string | null => {
  return localStorage.getItem(KEYS.AUTH_TOKEN);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(KEYS.AUTH_TOKEN, token);
};

// Services
export const getServices = (): Service[] => {
  const data = localStorage.getItem(KEYS.SERVICES);
  return data ? JSON.parse(data) : [];
};

export const setServices = (services: Service[]): void => {
  localStorage.setItem(KEYS.SERVICES, JSON.stringify(services));
};

export const addService = (service: Service): void => {
  const services = getServices();
  services.push(service);
  setServices(services);
};

export const updateService = (id: string, updates: Partial<Service>): void => {
  const services = getServices();
  const index = services.findIndex(s => s.id === id);
  if (index !== -1) {
    services[index] = { ...services[index], ...updates };
    setServices(services);
  }
};

export const deleteService = (id: string): void => {
  const services = getServices().filter(s => s.id !== id);
  setServices(services);
};

// Attendances
export const getAttendances = (): Attendance[] => {
  const data = localStorage.getItem(KEYS.ATTENDANCES);
  return data ? JSON.parse(data) : [];
};

export const setAttendances = (attendances: Attendance[]): void => {
  localStorage.setItem(KEYS.ATTENDANCES, JSON.stringify(attendances));
};

export const addAttendance = (attendance: Attendance): void => {
  const attendances = getAttendances();
  attendances.push(attendance);
  setAttendances(attendances);
};

export const getAttendancesByDate = (date: string): Attendance[] => {
  return getAttendances().filter(a => a.date === date);
};

export const getTodayAttendances = (): Attendance[] => {
  const today = new Date().toISOString().split('T')[0];
  return getAttendancesByDate(today);
};

// Goals
export const getGoals = (): Goals => {
  const data = localStorage.getItem(KEYS.GOALS);
  return data ? JSON.parse(data) : { daily: 0, monthly: 0 };
};

export const setGoals = (goals: Goals): void => {
  localStorage.setItem(KEYS.GOALS, JSON.stringify(goals));
};

// Initialize with mock data
export const initializeMockData = (): void => {
  // Check if already initialized
  if (getServices().length > 0) return;

  // Mock services
  const mockServices: Service[] = [
    {
      id: '1',
      name: 'Corte Simples',
      price: 35,
      category: 'Avulso',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Corte + Barba',
      price: 55,
      category: 'Avulso',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Barba',
      price: 25,
      category: 'Avulso',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Pacote Mensal',
      price: 120,
      category: 'Recorrência',
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      name: 'Pomada',
      price: 45,
      category: 'Produto',
      createdAt: new Date().toISOString(),
    },
  ];
  setServices(mockServices);

  // Mock goals
  setGoals({ daily: 300, monthly: 7000 });

  // Mock some attendances for today
  const today = new Date().toISOString().split('T')[0];
  const mockAttendances: Attendance[] = [
    {
      id: 'att1',
      date: today,
      items: [
        {
          serviceId: '1',
          serviceName: 'Corte Simples',
          price: 35,
          quantity: 1,
          category: 'Avulso',
        },
      ],
      total: 35,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'att2',
      date: today,
      items: [
        {
          serviceId: '2',
          serviceName: 'Corte + Barba',
          price: 55,
          quantity: 1,
          category: 'Avulso',
        },
      ],
      total: 55,
      createdAt: new Date().toISOString(),
    },
  ];
  setAttendances(mockAttendances);
};
