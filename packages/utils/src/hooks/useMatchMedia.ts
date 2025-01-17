import { useState, useEffect } from 'react'

type MediaQueries = 'mobile' | 'tablet' | 'laptop' | 'desktop' | 'widescreen'

const screenTypes: MediaQueries[] = ['mobile', 'tablet', 'laptop', 'desktop', 'widescreen']

const queries: Record<MediaQueries, string> = {
  mobile: '(max-width: 720px)',
  tablet: '(min-width: 721px) and (max-width: 1024px)',
  laptop: '(min-width: 1025px) and (max-width: 1440px)',
  desktop: '(min-width: 1441px) and (max-width: 1920px)',
  widescreen: '(min-width: 1921px)'
}

function useMatchMedia(): MediaQueries {
  const [matches, setMatches] = useState<MediaQueries>(getCurrentMatchMedia())

  useEffect(() => {
    window.addEventListener('resize', updateMatchMedia)
    return () => {
      window.removeEventListener('resize', updateMatchMedia)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * 计算并得出当前的 matchMedia 结果
   * @returns mobile | desktop | ...
   */
  function getCurrentMatchMedia(): MediaQueries {
    const newMatches: Partial<Record<MediaQueries, boolean>> = {}
    Object.keys(queries).forEach((key: string) => (newMatches[key as MediaQueries] = isMatchMedia(queries[key as MediaQueries])))

    return getMatchType(newMatches as Record<MediaQueries, boolean>)
  }

  /**
   * 更新 state 中的最新结果
   */
  function updateMatchMedia(): void {
    setMatches(getCurrentMatchMedia())
  }

  /**
   * 返回是否符合当前宽度范围
   * @requires query 如 `(max-width: 600px)`
   * @returns boolean
   */
  function isMatchMedia(query: string): boolean {
    if (typeof window === 'object' && window.matchMedia) {
      return window.matchMedia(query).matches
    }

    return false
  }

  /**
   * 获取当前媒体查询结果
   * @requires matchResult 如 `{ mobile: true, desktop: false }`
   * @returns mobile | desktop | ...
   */
  function getMatchType(matchResult: Record<MediaQueries, boolean>): MediaQueries {
    return (Object.keys(matchResult) as MediaQueries[]).find((el) => matchResult[el]) || 'widescreen'
  }

  return matches
}

export { useMatchMedia, type MediaQueries, queries as matchQueries, screenTypes }
