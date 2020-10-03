import React, { useEffect, useRef } from "react"

export interface InViewModifierProperties {
  children?: JSX.Element | JSX.Element[]
  className?: string
  inViewClassName: string
  sticky?: boolean
}

export function InViewModifier({
  children,
  className,
  inViewClassName,
  sticky,
}: InViewModifierProperties) {
  let ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (ref.current && e.target.isSameNode(ref.current)) {
          if (e.isIntersecting) {
            if (!ref.current.classList.contains(inViewClassName)) {
              ref.current.classList.add(inViewClassName)
              if (sticky) {
                observer.unobserve(e.target)
              }
            }
          } else {
            if (ref.current.classList.contains(inViewClassName)) {
              if (!sticky) {
                ref.current.classList.remove(inViewClassName)
              }
            }
          }
        }
      })
    })
    if (ref.current) {
      observer.observe(ref.current)
    }
  }, [ref.current])

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  )
}
