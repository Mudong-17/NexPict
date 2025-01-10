import album from '@renderer/views/album'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/album/')({
  component: album
})
