import next from 'eslint-config-next'
import { defineConfig } from 'eslint/config'

export default defineConfig([
    next,
    {
        rules: { '@typescript-eslint/no-explicit-any': 'off' },
    },
])
