import { useEffect } from 'react'
import { useSelector } from 'react-redux'

export const useScrollRestoration = () => {
  const location = useSelector(state => state.router.location)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
}
