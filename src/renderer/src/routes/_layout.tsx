import BaseLayout from '@renderer/layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout')({
  component: BaseLayout
})
