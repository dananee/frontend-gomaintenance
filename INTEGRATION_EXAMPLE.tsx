// Example integration code for adding Parts tab to Work Order detail page
// Add this to your existing Work Order detail component

import { PartsTab } from '@/features/parts/components/PartsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';

// In your WorkOrderDetailPage component:
export default function WorkOrderDetailPage({ params }: { params: { id: string } }) {
    // ... existing code ...
    const t = useTranslations('integrationExample');

    return (
        <div className="container mx-auto py-8">
            {/* ... existing header and content ... */}

            <Tabs defaultValue="details" className="mt-6">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="details">{t('tabs.details')}</TabsTrigger>
                    <TabsTrigger value="tasks">{t('tabs.tasks')}</TabsTrigger>
                    <TabsTrigger value="parts">{t('tabs.parts')}</TabsTrigger>
                    <TabsTrigger value="comments">{t('tabs.comments')}</TabsTrigger>
                    <TabsTrigger value="costs">{t('tabs.costs')}</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                    {/* Existing details content */}
                </TabsContent>

                <TabsContent value="tasks">
                    {/* Existing tasks content */}
                </TabsContent>

                {/* NEW: Parts Tab */}
                <TabsContent value="parts">
                    <PartsTab workOrderId={params.id} />
                </TabsContent>

                <TabsContent value="comments">
                    {/* Existing comments content */}
                </TabsContent>

                <TabsContent value="costs">
                    {/* Existing costs content */}
                </TabsContent>
            </Tabs>
        </div>
    );
}
