import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useStore } from '../src/store/useStore';

export default function ModalScreen() {
  const params = useLocalSearchParams();
  const { addEvent, addTask, user } = useStore();

  const [type, setType] = useState<'event' | 'task'>('event');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSave = () => {
    if (!title) return;

    if (type === 'event') {
      addEvent({
        id: Math.random().toString(),
        userId: user?.uid || 'anonymous',
        title,
        date,
        startTime,
        endTime,
        category: 'meeting'
      });
    } else {
      addTask({
        id: Math.random().toString(),
        userId: user?.uid || 'anonymous',
        title,
        date,
        priority,
        category: 'general',
        completed: false,
        subtasks: []
      });
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[styles.typeButton, type === 'event' && styles.typeButtonActive]}
          onPress={() => setType('event')}
        >
          <Text style={[styles.typeText, type === 'event' && styles.typeTextActive]}>Event</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === 'task' && styles.typeButtonActive]}
          onPress={() => setType('task')}
        >
          <Text style={[styles.typeText, type === 'task' && styles.typeTextActive]}>Task</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>New {type === 'event' ? 'Event' : 'Task'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 10 }]}
          placeholder="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
        />
      </View>

      {type === 'event' ? (
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 10 }]}
            placeholder="Start Time"
            value={startTime}
            onChangeText={setStartTime}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="End Time"
            value={endTime}
            onChangeText={setEndTime}
          />
        </View>
      ) : (
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.priorityBtn, priority === 'low' && { backgroundColor: '#4cd964' }]}
            onPress={() => setPriority('low')}
          >
            <Text style={styles.priorityText}>Low</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.priorityBtn, priority === 'medium' && { backgroundColor: '#ffcc00' }]}
            onPress={() => setPriority('medium')}
          >
            <Text style={styles.priorityText}>Med</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.priorityBtn, priority === 'high' && { backgroundColor: '#ff3b30' }]}
            onPress={() => setPriority('high')}
          >
            <Text style={styles.priorityText}>High</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save {type === 'event' ? 'Event' : 'Task'}</Text>
      </TouchableOpacity>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  typeSelector: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#f0f0f0', borderRadius: 10, padding: 5 },
  typeButton: { flex: 1, padding: 10, alignItems: 'center', borderRadius: 8 },
  typeButtonActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  typeText: { fontWeight: '600', color: '#666' },
  typeTextActive: { color: '#000' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  row: { flexDirection: 'row', marginBottom: 15 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  priorityBtn: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center', marginHorizontal: 5, backgroundColor: '#eee' },
  priorityText: { fontWeight: 'bold', color: '#fff' },
});
