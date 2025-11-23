import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { useStore } from '../../src/store/useStore';
import { router } from 'expo-router';

export default function CalendarScreen() {
    const events = useStore((state) => state.events);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Transform events for Agenda
    const items = events.reduce((acc: any, event) => {
        const date = event.date;
        if (!acc[date]) acc[date] = [];
        acc[date].push({ name: event.title, height: 50, ...event });
        return acc;
    }, {});

    return (
        <View style={styles.container}>
            <Agenda
                items={items}
                selected={selectedDate}
                renderItem={(item: any) => (
                    <TouchableOpacity style={styles.item} onPress={() => router.push(`/modal?id=${item.id}`)}>
                        <Text style={styles.itemText}>{item.name}</Text>
                        <Text style={styles.itemTime}>{item.startTime} - {item.endTime}</Text>
                    </TouchableOpacity>
                )}
                renderEmptyDate={() => (
                    <View style={styles.emptyDate}>
                        <Text>No events</Text>
                    </View>
                )}
                theme={{
                    selectedDayBackgroundColor: '#007AFF',
                    todayTextColor: '#007AFF',
                    dotColor: '#007AFF',
                    agendaDayTextColor: '#888',
                    agendaDayNumColor: '#888',
                    agendaTodayColor: '#007AFF',
                    agendaKnobColor: '#007AFF'
                }}
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/modal')}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    itemText: { fontSize: 16, fontWeight: 'bold' },
    itemTime: { fontSize: 14, color: '#888', marginTop: 5 },
    emptyDate: { height: 15, flex: 1, paddingTop: 30 },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    fabText: { color: '#fff', fontSize: 30, fontWeight: 'bold' },
});
