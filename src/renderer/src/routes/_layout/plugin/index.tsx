import plugin from '@renderer/views/plugin'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/plugin/')({
  component: plugin
})
