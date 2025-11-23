import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useStore } from '../../src/store/useStore';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TasksScreen() {
    const { tasks, toggleTask, deleteTask } = useStore();

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => toggleTask(item.id)} style={styles.checkbox}>
                {item.completed && <FontAwesome name="check" size={16} color="#fff" />}
            </TouchableOpacity>

            <View style={styles.taskContent}>
                <Text style={[styles.taskTitle, item.completed && styles.completedText]}>{item.title}</Text>
                <Text style={styles.taskDate}>{item.date} • {item.priority.toUpperCase()}</Text>
            </View>

            <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteBtn}>
                <FontAwesome name="trash" size={20} color="#ff3b30" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={tasks}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No tasks yet. Add one!</Text>
                    </View>
                }
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
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    list: { padding: 20 },
    taskItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#007AFF',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    taskContent: { flex: 1 },
    taskTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
    completedText: { textDecorationLine: 'line-through', color: '#aaa' },
    taskDate: { fontSize: 12, color: '#888', marginTop: 4 },
    deleteBtn: { padding: 5 },
    empty: { alignItems: 'center', marginTop: 50 },
    emptyText: { color: '#888', fontSize: 16 },
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
