'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'

type ExitIntentOptions = {
    key?: string
    minTimeMs?: number
    minScrollPercent?: number
    disabled?: boolean
    enableMouseExit?: boolean
    enableVisibilityExit?: boolean
    enableTimeBasedTrigger?: boolean
    timeBasedTriggerMs?: number
    maxTimes?: number
    periodDays?: number
    shouldTrigger?: () => boolean
}

type PopupHistory = {
    timestamps: number[]
}

function getScrollPercent(): number {
    const doc = document.documentElement
    const scrollTop = window.scrollY || doc.scrollTop || 0
    const scrollHeight = doc.scrollHeight || 0
    const clientHeight = doc.clientHeight || 0
    const maxScroll = Math.max(1, scrollHeight - clientHeight)
    return (scrollTop / maxScroll) * 100
}

const DEFAULT_EXIT_INTENT_KEY = 'lifty_exit_intent_fired'

export function useExitIntent(onTrigger: () => void, options: ExitIntentOptions = {}) {
    const {
        key = DEFAULT_EXIT_INTENT_KEY,
        minTimeMs = 1000,
        minScrollPercent = 0,
        disabled = false,
        enableMouseExit = true,
        enableVisibilityExit = true,
        enableTimeBasedTrigger = true,
        timeBasedTriggerMs = 60000, // 1 minute default
        maxTimes = 3,
        periodDays = 30,
        shouldTrigger,
    } = options

    const startTimeRef = useRef<number>(0)
    const firedRef = useRef<boolean>(false)
    const onTriggerRef = useRef(onTrigger)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const optionsRef = useRef({
        key,
        minTimeMs,
        minScrollPercent,
        disabled,
        enableTimeBasedTrigger,
        timeBasedTriggerMs,
        maxTimes,
        periodDays,
        shouldTrigger,
    })

    // Keep refs in sync with latest values
    useEffect(() => {
        onTriggerRef.current = onTrigger
    }, [onTrigger])

    useEffect(() => {
        optionsRef.current = {
            key,
            minTimeMs,
            minScrollPercent,
            disabled,
            enableTimeBasedTrigger,
            timeBasedTriggerMs,
            maxTimes,
            periodDays,
            shouldTrigger,
        }
    }, [
        key,
        minTimeMs,
        minScrollPercent,
        disabled,
        enableTimeBasedTrigger,
        timeBasedTriggerMs,
        maxTimes,
        periodDays,
        shouldTrigger,
    ])

    const canUseLocalStorage = useMemo(() => {
        try {
            return typeof window !== 'undefined' && !!window.localStorage
        } catch {
            return false
        }
    }, [])

    const getPopupHistory = useCallback((): PopupHistory => {
        if (!canUseLocalStorage) return { timestamps: [] }
        try {
            const stored = window.localStorage.getItem(optionsRef.current.key)
            if (!stored) return { timestamps: [] }
            const parsed = JSON.parse(stored) as PopupHistory
            return parsed.timestamps ? parsed : { timestamps: [] }
        } catch {
            return { timestamps: [] }
        }
    }, [canUseLocalStorage])

    const hasExceededMaxTimes = useCallback((): boolean => {
        if (!canUseLocalStorage) return false

        const opts = optionsRef.current
        const history = getPopupHistory()
        const now = Date.now()
        const periodMs = opts.periodDays * 24 * 60 * 60 * 1000
        const cutoffTime = now - periodMs

        // Filter out timestamps outside the period
        const recentTimestamps = history.timestamps.filter(ts => ts > cutoffTime)

        // Check if we've exceeded the max times
        return recentTimestamps.length >= opts.maxTimes
    }, [canUseLocalStorage, getPopupHistory])

    const markFired = useCallback(() => {
        if (!canUseLocalStorage) return

        const opts = optionsRef.current
        const history = getPopupHistory()
        const now = Date.now()
        const periodMs = opts.periodDays * 24 * 60 * 60 * 1000
        const cutoffTime = now - periodMs

        // Add current timestamp
        const updatedTimestamps = [...history.timestamps, now]

        // Clean up old timestamps outside the period
        const recentTimestamps = updatedTimestamps.filter(ts => ts > cutoffTime)

        try {
            const updatedHistory: PopupHistory = { timestamps: recentTimestamps }
            window.localStorage.setItem(opts.key, JSON.stringify(updatedHistory))
        } catch {
            // Ignore storage errors
        }
    }, [canUseLocalStorage, getPopupHistory])

    const guardsPass = useCallback(() => {
        const opts = optionsRef.current

        if (opts.disabled) return false
        if (firedRef.current) return false
        if (hasExceededMaxTimes()) return false

        const elapsed = Date.now() - startTimeRef.current
        if (elapsed < opts.minTimeMs) return false

        if (opts.minScrollPercent > 0) {
            const scrolled = getScrollPercent()
            if (scrolled < opts.minScrollPercent) return false
        }

        if (opts.shouldTrigger && !opts.shouldTrigger()) return false

        return true
    }, [hasExceededMaxTimes])

    const fire = useCallback(() => {
        if (!guardsPass()) return

        // Clear timer if it exists to prevent duplicate triggers
        if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
        }

        firedRef.current = true
        markFired()
        onTriggerRef.current()
    }, [guardsPass, markFired])

    useEffect(() => {
        if (disabled) return

        startTimeRef.current = Date.now()

        // Set up time-based trigger
        if (enableTimeBasedTrigger) {
            timerRef.current = setTimeout(() => {
                fire()
            }, timeBasedTriggerMs)
        }

        const onMouseOut = (e: MouseEvent) => {
            if (!enableMouseExit) return

            // relatedTarget === null means mouse is leaving the window
            if (e.relatedTarget !== null) return

            // Only trigger when mouse exits at the top (towards address/tab bar)
            if (e.clientY <= 0) {
                fire()
            }
        }

        const onVisibilityChange = () => {
            if (!enableVisibilityExit) return

            // 'hidden' state can occur before tab switch/minimize/close
            if (document.visibilityState === 'hidden') {
                fire()
            }
        }

        document.addEventListener('mouseout', onMouseOut)
        document.addEventListener('visibilitychange', onVisibilityChange)

        return () => {
            // Clear timer if component unmounts or effect re-runs
            if (timerRef.current) {
                clearTimeout(timerRef.current)
                timerRef.current = null
            }
            document.removeEventListener('mouseout', onMouseOut)
            document.removeEventListener('visibilitychange', onVisibilityChange)
        }
    }, [disabled, enableMouseExit, enableVisibilityExit, enableTimeBasedTrigger, timeBasedTriggerMs, fire])
}
