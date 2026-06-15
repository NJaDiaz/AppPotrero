import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  href?: string
  white?: boolean   
}

export default function Logo({ size = 'md', className, href = '/', white }: LogoProps) {
  const dims = { sm: 32, md: 40, lg: 56 }[size]

  const inner = (
    <div className={cn('flex items-center gap-2.5', className)}>
      <Image
        src="/logo-ccta.jpeg"
        alt="CCTA – Cámara de Comercio, Turismo y Afines"
        width={dims}
        height={dims}
        className="rounded-xl object-contain flex-shrink-0"
        priority
      />
      <div className="leading-none">
        <div className={cn(
          'font-display font-black tracking-tight',
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base',
          white ? 'text-white' : 'text-gray-900'
        )}>
          CCTA
        </div>
        <div className={cn(
          'font-semibold leading-tight',
          size === 'sm' ? 'text-[8px]' : 'text-[9px]',
          white ? 'text-white/70' : 'text-brand-500'
        )}>
          Potrero de los Funes
        </div>
      </div>
    </div>
  )

  return href ? <Link href={href}>{inner}</Link> : inner
}
