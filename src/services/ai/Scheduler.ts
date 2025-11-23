import { Event } from '../../store/useStore';

export const findFreeSlot = (events: Event[], durationMinutes: number = 60, date: string): string | null => {
    // Simple logic: Check 9am to 5pm
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
        const slotStart = `${hour.toString().padStart(2, '0')}:00`;
        const slotEnd = `${(hour + 1).toString().padStart(2, '0')}:00`;

        const hasConflict = events.some(e =>
            e.date === date &&
            ((e.startTime >= slotStart && e.startTime < slotEnd) ||
                (e.endTime > slotStart && e.endTime <= slotEnd) ||
                (e.startTime <= slotStart && e.endTime >= slotEnd))
        );

        if (!hasConflict) {
            return slotStart;
        }
    }
    return null;
};

export const checkConflicts = (newEvent: Event, existingEvents: Event[]): boolean => {
    return existingEvents.some(e =>
        e.date === newEvent.date &&
        ((e.startTime >= newEvent.startTime && e.startTime < newEvent.endTime) ||
            (e.endTime > newEvent.startTime && e.endTime <= newEvent.endTime) ||
            (e.startTime <= newEvent.startTime && e.endTime >= newEvent.endTime))
    );
};
