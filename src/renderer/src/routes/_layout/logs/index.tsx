import logs from '@renderer/views/logs'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/logs/')({
  component: logs
})
