import { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useStore } from '../../src/store/useStore';
import { parseIntent } from '../../src/services/ai/IntentParser';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Speech from 'expo-speech';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: number;
}

export default function AIChatScreen() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Hello! I can help you schedule meetings, create tasks, or plan your day. What would you like to do?', sender: 'ai', timestamp: Date.now() }
    ]);
    const [loading, setLoading] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const { addEvent, addTask, user, tasks, events } = useStore();

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user', timestamp: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const intent = await parseIntent(userMsg.text);
            let responseText = "I'm not sure how to help with that yet.";

            if (intent.action === 'create_event') {
                addEvent({
                    id: Math.random().toString(),
                    userId: user?.uid || 'anonymous',
                    ...intent.payload
                });
                responseText = `I've scheduled "${intent.payload.title}" for ${intent.payload.date} at ${intent.payload.time}.`;
            } else if (intent.action === 'create_task') {
                addTask({
                    id: Math.random().toString(),
                    userId: user?.uid || 'anonymous',
                    category: 'general',
                    completed: false,
                    subtasks: [],
                    ...intent.payload
                });
                responseText = `I've added "${intent.payload.title}" to your tasks.`;
            } else if (intent.action === 'daily_briefing') {
                const today = new Date().toISOString().split('T')[0];
                const todayTasks = tasks.filter(t => t.date === today && !t.completed);
                const todayEvents = events.filter(e => e.date === today);

                responseText = `Good morning! You have ${todayEvents.length} meetings and ${todayTasks.length} tasks today.`;
                if (todayEvents.length > 0) {
                    responseText += ` Your first meeting is "${todayEvents[0].title}" at ${todayEvents[0].startTime}.`;
                }
                if (todayTasks.length > 0) {
                    responseText += ` Top priority: ${todayTasks[0].title}.`;
                }
            }

            const aiMsg: Message = { id: (Date.now() + 1).toString(), text: responseText, sender: 'ai', timestamp: Date.now() };
            setMessages(prev => [...prev, aiMsg]);
            Speech.speak(responseText);
        } catch (error) {
            const errorMsg: Message = { id: (Date.now() + 1).toString(), text: "Sorry, something went wrong.", sender: 'ai', timestamp: Date.now() };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleVoiceInput = () => {
        setLoading(true);
        setTimeout(() => {
            setInput("Schedule a meeting with Team tomorrow at 2 PM");
            setLoading(false);
        }, 1500);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                renderItem={({ item }) => (
                    <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
                        <Text style={[styles.messageText, item.sender === 'user' ? styles.userText : styles.aiText]}>{item.text}</Text>
                    </View>
                )}
            />

            {loading && (
                <View style={styles.loading}>
                    <ActivityIndicator size="small" color="#007AFF" />
                    <Text style={styles.loadingText}>Thinking...</Text>
                </View>
            )}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a command..."
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={handleSend}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <FontAwesome name="send" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.sendButton, { backgroundColor: '#34C759', marginLeft: 10 }]} onPress={handleVoiceInput}>
                    <FontAwesome name="microphone" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    list: { padding: 20 },
    messageBubble: { padding: 15, borderRadius: 20, maxWidth: '80%', marginBottom: 10 },
    userBubble: { backgroundColor: '#007AFF', alignSelf: 'flex-end', borderBottomRightRadius: 5 },
    aiBubble: { backgroundColor: '#fff', alignSelf: 'flex-start', borderBottomLeftRadius: 5, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    messageText: { fontSize: 16 },
    userText: { color: '#fff' },
    aiText: { color: '#333' },
    loading: { flexDirection: 'row', alignItems: 'center', padding: 10, marginLeft: 20 },
    loadingText: { marginLeft: 10, color: '#888' },
    inputContainer: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'center' },
    input: { flex: 1, backgroundColor: '#f0f0f0', padding: 12, borderRadius: 20, marginRight: 10, fontSize: 16 },
    sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center' },
});
