
import notesData from '../assets/notes_backup.json';

export const getMobisleNotes = () => {
    if (!notesData || !notesData.lists) return [];

    return notesData.lists.map((note, index) => {
        const content = note.rows ? note.rows.map(row => row.text).join('\n') : '';
        const title = (note.rows && note.rows[0] && note.rows[0].text)
            ? (note.rows[0].text.substring(0, 50) + (note.rows[0].text.length > 50 ? '...' : ''))
            : `Note from ${note.folder || 'Mobisle'}`;

        return {
            id: `mobisle-${index}`,
            title: title,
            content: content,
            folder: note.folder || 'Unsorted',
            createdAt: note.created ? new Date(note.created).toISOString() : new Date().toISOString(),
            updatedAt: note.last_edited ? new Date(note.last_edited).toISOString() : new Date().toISOString(),
            isMobisle: true
        };
    });
};
