import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../src/store/useStore';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function DashboardScreen() {
  const { user, tasks, events } = useStore();

  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.date === today && !t.completed);
  const todayEvents = events.filter(e => e.date === today);

  const nextEvent = todayEvents.sort((a, b) => a.startTime.localeCompare(b.startTime))[0];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.header}
      >
        <Text style={styles.greeting}>Good Morning,</Text>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
        <Text style={styles.date}>{new Date().toDateString()}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryContainer}>
          <TouchableOpacity style={styles.summaryCard} onPress={() => router.push('/(tabs)/tasks')}>
            <View style={[styles.iconBg, { backgroundColor: '#e3f2fd' }]}>
              <FontAwesome name="check-square-o" size={24} color="#1976d2" />
            </View>
            <Text style={styles.summaryCount}>{todayTasks.length}</Text>
            <Text style={styles.summaryLabel}>Tasks Today</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.summaryCard} onPress={() => router.push('/(tabs)/calendar')}>
            <View style={[styles.iconBg, { backgroundColor: '#e8f5e9' }]}>
              <FontAwesome name="calendar" size={24} color="#388e3c" />
            </View>
            <Text style={styles.summaryCount}>{todayEvents.length}</Text>
            <Text style={styles.summaryLabel}>Events Today</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Up Next</Text>
        {nextEvent ? (
          <View style={styles.eventCard}>
            <View style={styles.eventTime}>
              <Text style={styles.eventStartTime}>{nextEvent.startTime}</Text>
              <Text style={styles.eventEndTime}>{nextEvent.endTime}</Text>
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{nextEvent.title}</Text>
              <Text style={styles.eventCategory}>{nextEvent.category}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No upcoming events today.</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/modal?type=task')}>
            <LinearGradient colors={['#FF9800', '#F57C00']} style={styles.actionGradient}>
              <FontAwesome name="plus" size={20} color="#fff" />
              <Text style={styles.actionText}>Add Task</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/modal?type=event')}>
            <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.actionGradient}>
              <FontAwesome name="calendar-plus-o" size={20} color="#fff" />
              <Text style={styles.actionText}>Add Event</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 30, paddingTop: 60, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  greeting: { color: '#e0e0e0', fontSize: 18 },
  name: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginBottom: 5 },
  date: { color: '#a0c4ff', fontSize: 14 },
  content: { flex: 1 },
  scrollContent: { padding: 20 },
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, marginTop: -30 },
  summaryCard: { backgroundColor: '#fff', width: '48%', padding: 20, borderRadius: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  iconBg: { padding: 10, borderRadius: 15, marginBottom: 10 },
  summaryCount: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  summaryLabel: { fontSize: 14, color: '#666' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  eventCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  eventTime: { marginRight: 20, alignItems: 'center', justifyContent: 'center' },
  eventStartTime: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  eventEndTime: { fontSize: 14, color: '#888' },
  eventInfo: { flex: 1, justifyContent: 'center' },
  eventTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  eventCategory: { fontSize: 14, color: '#007AFF', marginTop: 4, textTransform: 'capitalize' },
  emptyCard: { padding: 20, backgroundColor: '#fff', borderRadius: 15, alignItems: 'center', marginBottom: 20 },
  emptyText: { color: '#888' },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: { width: '48%', borderRadius: 15, overflow: 'hidden' },
  actionGradient: { padding: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  actionText: { color: '#fff', fontWeight: 'bold', marginLeft: 10 },
});
