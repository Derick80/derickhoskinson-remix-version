import { CheckIcon, CopyIcon } from '@radix-ui/react-icons'
import { clsx } from 'clsx'
import * as React from 'react'
import { Button } from './ui/button'

async function copyToClipboard(value: string) {
  try {
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(value)
      return true
    }

    const element = document.createElement('textarea')
    element.value = value
    document.body.append(element)
    element.select()
    document.execCommand('copy')
    element.remove()

    return true
  } catch {
    return false
  }
}

enum State {
  Idle = 'idle',
  Copy = 'copy',
  Copied = 'copied'
}

export function ClipboardCopyButton({
  value,
  className
}: {
  value: string
  className?: string
}) {
  const [state, setState] = React.useState<State>(State.Idle)

  React.useEffect(() => {
    async function transition() {
      switch (state) {
        case State.Copy: {
          const res = await copyToClipboard(value)
          console.info('copied', res)
          setState(State.Copied)
          break
        }
        case State.Copied: {
          setTimeout(() => {
            setState(State.Idle)
          }, 2000)
          break
        }
        default:
          break
      }
    }
    void transition()
  }, [state, value])

  return (
    <Button
      variant='default'
      onClick={() => setState(State.Copy)}
      className={clsx(

        className
      )}
    >
      <span className='sr-only lg:not-sr-only lg:inline'>
        {state === State.Copied ? 'Copied to clipboard' : 'Click to copy url'}
      </span>
      <span className='inline lg:sr-only'>
        {state === State.Copied ? <CheckIcon /> : <CopyIcon />}
      </span>
    </Button>
  )
}
