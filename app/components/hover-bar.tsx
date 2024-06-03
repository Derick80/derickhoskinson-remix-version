
export type HoverBarProps = {
    contentDetails: {
        slug?: string
    }
}
const HoverBar = ({ contentDetails }: HoverBarProps) => {


    return (
        <div className='not-prose fixed left-0 right-0 z-50 flex h-12 w-full justify-center 2xl:h-14 bottom-10'>

        </div>
    )
}

export default HoverBar
