import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { PageSection } from '@/components/ui/page-section'
import { getTranslations } from 'next-intl/server'

export default async function FaqPage() {
    const t = await getTranslations()

    const carrierKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13']
    const shopKeys = [
        'q1',
        'q2',
        'q3',
        'q4',
        'q5',
        'q6',
        'q7',
        'q8',
        'q9',
        'q10',
        'q11',
        'q12',
        'q13',
        'q14',
        'q15',
        'q16',
        'q17',
    ]

    return (
        <PageSection className="space-y-12 max-w-xl max-auto">
            <h1 className="heading-1 text-center">{t('FAQ.title')}</h1>

            <div className="space-y-4">
                <h2 className="heading-3">{t('FAQ.carriers.title')}</h2>
                <Accordion type="single" collapsible>
                    {carrierKeys.map(key => (
                        <AccordionItem key={key} value={`carrier-${key}`}>
                            <AccordionTrigger>{t(`FAQ.carriers.${key}.question`)}</AccordionTrigger>
                            <AccordionContent>{t(`FAQ.carriers.${key}.answer`)}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            <div className="space-y-4">
                <h2 className="heading-3">{t('FAQ.shop.title')}</h2>
                <Accordion type="single" collapsible>
                    {shopKeys.map(key => (
                        <AccordionItem key={key} value={`shop-${key}`}>
                            <AccordionTrigger>{t(`FAQ.shop.${key}.question`)}</AccordionTrigger>
                            <AccordionContent>{t(`FAQ.shop.${key}.answer`)}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </PageSection>
    )
}
