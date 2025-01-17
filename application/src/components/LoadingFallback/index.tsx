interface LoadingFallbackProps {
  text?: string
}

export const LoadingFallback = ({ text = '加载中...' }: LoadingFallbackProps) => <p>{text}</p>
