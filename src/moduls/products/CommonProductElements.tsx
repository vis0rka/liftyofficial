interface Props {
    children: React.ReactNode
}

export const ProductsCardsContainer = ({ children }: Props) => {
    return (
        <div className="flex flex-nowrap w-full overflow-hidden overflow-x-auto py-4 gap-4 [&_a]   md:[&_a]:flex-[0_0_25vw] lg:[&_a]:flex-[0_0_20vw]">
            {children}
        </div>
    )
}
