import { useState } from 'react';
import RuleForm from '@/components/rules/RuleForm';
import RuleList from '@/components/rules/RuleList';

export default function DeliverableRulesPage({ deliverableId }: { deliverableId: string }) {
    const [refresh, setRefresh] = useState(0);
    return (
        <div className="max-w-2xl mx-auto my-8">
            <h1 className="text-2xl font-bold mb-4">Définir les règles de vérification automatique</h1>
            <RuleForm deliverableId={deliverableId} onRuleCreated={() => setRefresh(r => r + 1)} />
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">Règles existantes</h2>
                <RuleList deliverableId={deliverableId + refresh} />
            </div>
        </div>
    );
}
