import upload from '@renderer/views/upload'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/upload/')({
  component: upload
})
