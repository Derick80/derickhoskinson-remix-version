import { Link } from '@remix-run/react'
import { Icon } from './icon-component'

// app/core/not-found.tsx
export default function NotFound() {
  return (
    <div className='m-4 flex flex-col items-center justify-evenly text-gray-100 md:mx-0 md:mb-0 md:mt-8'>
      <p className='max-w-[23ch] text-center text-xl font-normal md:text-2xl md:font-light lg:text-4xl'>
        Oops, this did not work out as planned. uh oh
      </p>
      <Icon
        name='dna'
        className='my-[10vh] inline h-[20vh] w-[20vh] text-burnt-orange'
      />
      <Link
        to='/'
        className='drinks-focusable border-b border-solid pb-1 hover:shadow-[inset_0_-2px_0_0] focus-visible:shadow-[inset_0_-2px_0_0] md:text-xl'
      >
        Back Home
      </Link>
    </div>
  )
}

// need to make this my own
