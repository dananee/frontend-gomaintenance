import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

export default function TechnicianTasksPage() {
    const t = useTranslations('workOrders');

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Wrench className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t('checklist.title')}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('checklist.subtitle')}
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>My Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">Task list functionality coming soon...</p>
                </CardContent>
            </Card>
        </div>
    );
}
