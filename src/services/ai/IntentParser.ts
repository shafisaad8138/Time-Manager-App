export interface AIAction {
    action: 'create_event' | 'create_task' | 'update_event' | 'delete_event' | 'daily_briefing' | 'unknown';
    payload?: any;
}

export const parseIntent = async (text: string): Promise<AIAction> => {
    const lower = text.toLowerCase();

    // Simple heuristic for demonstration
    if (lower.includes('meeting') || lower.includes('appointment')) {
        return {
            action: 'create_event',
            payload: {
                title: 'New Meeting',
                date: new Date().toISOString().split('T')[0],
                time: '10:00', // Default mock time
                category: 'meeting'
            }
        };
    }

    if (lower.includes('task') || lower.includes('remind')) {
        return {
            action: 'create_task',
            payload: {
                title: 'New Task',
                priority: 'medium',
                date: new Date().toISOString().split('T')[0]
            }
        };
    }

    if (lower.includes('briefing') || lower.includes('summary') || lower.includes('plan my day')) {
        return { action: 'daily_briefing' };
    }

    return { action: 'unknown' };
};
