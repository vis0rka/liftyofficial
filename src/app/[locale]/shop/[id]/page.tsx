type Props = {
    params: Promise<{ id: string }>
}

export default async function ProductDetailsPage({ params }: Props) {
    const { id } = await params

    return <section className="container mx-auto flex flex-col my-10">{id}</section>
}
