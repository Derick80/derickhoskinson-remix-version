
export default function CodeBlock ({ children }: {
    children: any,
    className: string

}) {

    const {className} = children;

    const language = 'typescript'
    return (
            <code className={`language-${language}`}>
                {children}
            </code>
    )


}