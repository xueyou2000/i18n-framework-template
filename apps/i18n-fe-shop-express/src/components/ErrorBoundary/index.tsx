import React from 'react'
import { useRouteError, isRouteErrorResponse } from 'react-router-dom'

export function ErrorBoundary() {
  const error = useRouteError()
  console.error(error)

  if (isRouteErrorResponse(error)) {
    return (
      <div id="error-page">
        <h1>Oops!</h1>
        <h2>{error.status}</h2>
        <p>Sorry, an unexpected error has occurred.</p>
        {error.statusText && <p>{error.statusText}</p>}
      </div>
    )
  }
  return (
    <div id="error-page">
      <h1>Oops!</h1>
    </div>
  )
}
