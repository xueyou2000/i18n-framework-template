import { PropsWithChildren } from 'react'
import { Helmet } from 'react-helmet'

interface RootProps {
  lang: string
}

export function Root(props: PropsWithChildren<RootProps>) {
  const { lang, children } = props
  // TODO: 注入一些context全局上下文
  return (
    <>
      <Helmet>
        <html lang={lang} data-lang={lang} />
      </Helmet>
      {children}
    </>
  )
}
