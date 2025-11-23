import { create } from 'zustand';

export interface Task {
    id: string;
    userId: string;
    title: string;
    description?: string;
    date: string; // ISO Date YYYY-MM-DD
    time?: string; // ISO Time HH:mm
    priority: 'low' | 'medium' | 'high';
    category: string;
    completed: boolean;
    subtasks: { id: string; title: string; completed: boolean }[];
}

export interface Event {
    id: string;
    userId: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    location?: string;
    category: 'meeting' | 'work' | 'personal' | 'other';
    participants?: string[];
}

interface UserSettings {
    theme: 'light' | 'dark' | 'system';
    notificationsEnabled: boolean;
    workingHours: { start: string; end: string };
}

interface Store {
    user: { uid: string; name: string; email: string } | null;
    settings: UserSettings;
    tasks: Task[];
    events: Event[];

    setUser: (user: Store['user']) => void;
    updateSettings: (settings: Partial<UserSettings>) => void;

    addTask: (task: Task) => void;
    updateTask: (id: string, task: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    toggleTask: (id: string) => void;

    addEvent: (event: Event) => void;
    updateEvent: (id: string, event: Partial<Event>) => void;
    deleteEvent: (id: string) => void;
}

export const useStore = create<Store>((set) => ({
    user: null,
    settings: {
        theme: 'system',
        notificationsEnabled: true,
        workingHours: { start: '09:00', end: '17:00' },
    },
    tasks: [],
    events: [],

    setUser: (user) => set({ user }),
    updateSettings: (newSettings) =>
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),

    addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
    updateTask: (id, updatedTask) =>
        set((state) => ({
            tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updatedTask } : t)),
        })),
    deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
    toggleTask: (id) =>
        set((state) => ({
            tasks: state.tasks.map((t) =>
                t.id === id ? { ...t, completed: !t.completed } : t
            ),
        })),

    addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
    updateEvent: (id, updatedEvent) =>
        set((state) => ({
            events: state.events.map((e) => (e.id === id ? { ...e, ...updatedEvent } : e)),
        })),
    deleteEvent: (id) =>
        set((state) => ({ events: state.events.filter((e) => e.id !== id) })),
}));
