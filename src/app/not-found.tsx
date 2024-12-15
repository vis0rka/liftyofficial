import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CircleAlert } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function NotFound() {
    const t = await getTranslations('NotFoundPage')
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CircleAlert className="h-6 w-6 text-destructive" />
                        <span>{t('page_not_found')}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{t('not_found_desc')}</p>
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href="/">{t('home')}</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
