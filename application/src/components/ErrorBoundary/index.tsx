import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router'
import { FaHome, FaRedo } from 'react-icons/fa'
import './styles.scss'

export interface ErrorBoundaryProps {
  pageNotFound?: boolean
}

export function ErrorBoundary({ pageNotFound = false }: ErrorBoundaryProps) {
  const error = useRouteError()
  const navigate = useNavigate()

  const getErrorContent = () => {
    if (isRouteErrorResponse(error)) {
      return {
        title: 'Oops!',
        description: 'Sorry, an unexpected error has occurred.',
        details: error.statusText,
        status: error.status
      }
    } else if (error instanceof Error) {
      return {
        title: 'Some thing went wrong',
        description: error.message,
        details: error.stack
      }
    }
    if (pageNotFound) {
      return {
        title: 'Page Not Found',
        description: 'The page you are looking for does not exist.'
      }
    }
    return {
      title: 'Error',
      description: 'An unexpected error occurred.'
    }
  }

  function onReset() {
    window.location.reload()
  }

  const errorContent = getErrorContent()

  return (
    <div className='error-boundary-content'>
      <h1>{errorContent.title}</h1>
      {errorContent.status && <h2 className='error-status'>({errorContent.status})</h2>}
      <p className='error-description'>{errorContent.description}</p>

      {errorContent.details && (
        <div className='error-boundary-details'>
          <p>The stack trace is:</p>
          <pre>{errorContent.details}</pre>
        </div>
      )}

      <div className='error-boundary-actions'>
        <button type='button' onClick={() => navigate('/')}>
          <FaHome style={{ marginRight: '5px' }} /> 返回首页
        </button>
        <button type='button' onClick={onReset}>
          <FaRedo style={{ marginRight: '5px' }} /> 重试
        </button>
      </div>
    </div>
  )
}
