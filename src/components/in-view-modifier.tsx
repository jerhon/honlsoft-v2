import React, { RefObject, useEffect } from "react"

export interface InViewOptions {
  classesToAdd?: string[]
  classesToRemove?: string[]
  sticky?: boolean
}

function addClasses(element: HTMLElement, classes?: string[])
{
  if (classes) {
    for (let c of classes) {
      if (!element.classList.contains(c)) {
        element.classList.add(c);
      }
    }
  }
}

function removeClasses(element: HTMLElement, classes?: string[])
{
  if (classes) {
    for (let c of classes) {
      if (element.classList.contains(c)) {
        element.classList.remove(c);
      }
    }
  }
}

export function useInView<T>(ref: RefObject<HTMLElement>, options: InViewOptions) {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (ref.current && e.target.isSameNode(ref.current)) {
          if (e.isIntersecting) {
            addClasses(ref.current, options.classesToAdd)
            removeClasses(ref.current, options.classesToRemove)
            if (options.sticky) {
              observer.unobserve(e.target)
            }
          } else {
            if (!options.sticky) {
              addClasses(ref.current, options.classesToRemove)
              removeClasses(ref.current, options.classesToAdd)
            }
          }
        }
      })
    })
    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [ref.current])
}
