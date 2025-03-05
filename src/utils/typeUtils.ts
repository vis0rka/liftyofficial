export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
    ? ElementType
    : never

export interface IFuncWithChild {
    children?: React.ReactNode
}

export type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T
}

export type PickEnum<T, K extends T> = {
    [P in keyof K]: P extends K ? P : never
}

export function nonNullable<T>(value: T): value is NonNullable<T> {
    return value !== null && value !== undefined
}
