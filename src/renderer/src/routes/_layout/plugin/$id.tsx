import pluginConfig from '@renderer/views/plugin/config'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/plugin/$id')({
  component: pluginConfig
})
