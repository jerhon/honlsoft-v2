import React from "react"

interface WaveDividerProps {
  color?: string
  direction?: 'top' | 'bottom'
  variant?: 1 | 2 | 3
}

export function WaveDivider({ color = '#f1f5f9', direction = 'bottom', variant = 1 }: WaveDividerProps) {
  
  const waves = {
    1: (
      <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" fill={color} />
    ),
    2: (
      <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" fill={color} />
    ),
    3: (
      <path d="M0,160L48,165.3C96,171,192,181,288,170.7C384,160,480,128,576,128C672,128,768,160,864,165.3C960,171,1056,149,1152,144C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" fill={color} />
    )
  }

  const transform = direction === 'top' ? 'scaleY(-1)' : 'scaleY(1)'
  
  return (
    <div className="w-full overflow-hidden leading-none" style={{ transform }}>
      <svg 
        className="relative block w-full h-[60px] desktop:h-[80px]" 
        viewBox="0 0 1440 320" 
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {waves[variant]}
      </svg>
    </div>
  )
}
