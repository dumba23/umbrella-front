import { type MutableRefObject, useEffect } from 'react'

const useOutsideClick = <T extends Node>(
  ref: MutableRefObject<T | null>,
  callback: () => void
): void => {
  const handleClick = (e: MouseEvent): void => {
    if (e.target instanceof Node && !((ref.current?.contains(e.target)) ?? false)) {
      callback()
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  })
}

export default useOutsideClick