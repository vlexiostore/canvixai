
import NanoBananaEditorPage from '@/components/tools/NanoBananaEditor';

export default function EditorPage() {
    // Mock user for now
    const user = {
        name: 'Guest User',
        credits: { total: 500, used: 0 }
    };

    return <NanoBananaEditorPage user={user} />;
}
