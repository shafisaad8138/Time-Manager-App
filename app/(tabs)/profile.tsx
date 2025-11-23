import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useStore } from '../../src/store/useStore';
import { auth } from '../../src/services/firebase/config';
import { signOut } from 'firebase/auth';

export default function ProfileScreen() {
    const { user, settings, updateSettings, setUser } = useStore();

    const handleLogout = async () => {
        await signOut(auth);
        setUser(null);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || 'U'}</Text>
                </View>
                <Text style={styles.name}>{user?.name || 'User'}</Text>
                <Text style={styles.email}>{user?.email}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Settings</Text>

                <View style={styles.row}>
                    <Text style={styles.label}>Dark Mode</Text>
                    <Switch
                        value={settings.theme === 'dark'}
                        onValueChange={(v) => updateSettings({ theme: v ? 'dark' : 'light' })}
                    />
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Notifications</Text>
                    <Switch
                        value={settings.notificationsEnabled}
                        onValueChange={(v) => updateSettings({ notificationsEnabled: v })}
                    />
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Working Hours</Text>
                    <Text style={styles.value}>{settings.workingHours.start} - {settings.workingHours.end}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { alignItems: 'center', padding: 30, backgroundColor: '#fff', marginBottom: 20 },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
    name: { fontSize: 24, fontWeight: 'bold' },
    email: { fontSize: 16, color: '#666' },
    section: { backgroundColor: '#fff', padding: 20, marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    label: { fontSize: 16 },
    value: { fontSize: 16, color: '#888' },
    logoutButton: { margin: 20, backgroundColor: '#ff3b30', padding: 15, borderRadius: 10, alignItems: 'center' },
    logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
