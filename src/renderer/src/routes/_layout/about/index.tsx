import about from '@renderer/views/about'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/about/')({
  component: about
})
