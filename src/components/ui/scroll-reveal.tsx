import React, { useEffect, useRef, useState, ReactNode } from "react"

interface ScrollRevealProps {
  children: ReactNode
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'zoom-in'
  delay?: number
  className?: string
}

export function ScrollReveal({ 
  children, 
  animation = 'fade-up', 
  delay = 0,
  className = '' 
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px 0px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const animations = {
    'fade-up': 'opacity-0 translate-y-10',
    'fade-in': 'opacity-0',
    'slide-left': 'opacity-0 translate-x-10',
    'slide-right': 'opacity-0 -translate-x-10',
    'zoom-in': 'opacity-0 scale-95'
  }

  const visibleClass = 'opacity-100 translate-y-0 translate-x-0 scale-100'

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? visibleClass : animations[animation]
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
