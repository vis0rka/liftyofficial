import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

export default function usePortalTarget(getTarget: () => HTMLElement | null = () => document.body) {
    const isHydrated = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)

    if (!isHydrated) return null

    return getTarget()
}
