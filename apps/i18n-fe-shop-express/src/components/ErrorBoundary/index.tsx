import React from 'react'
import { useRouteError } from 'react-router-dom'

export function ErrorBoundary() {
  const error = useRouteError()
  console.error(error)
  // Uncaught ReferenceError: path is not defined
  return <div>Dang!</div>
}
