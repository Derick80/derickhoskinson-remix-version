import { GitHubLogoIcon, ExternalLinkIcon } from "@radix-ui/react-icons"
import { Project } from "content/resources/projects"
import { H3 } from "./layout/typography"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card"

type ProjectCardProps = {
    projects: Project
}

const ProjectCard = (
    { projects }: ProjectCardProps
) => {
    return (
        <Card
            className='h-full flex flex-col'
        >
            <CardHeader>
                <CardTitle>
                    {
                        projects.title
                    }</CardTitle>
                <CardDescription>
                    {
                        projects.description
                    }
                </CardDescription>
            </CardHeader>
            <CardContent
                className='flex flex-col md:flex-row gap-5'
            >
                <div
                    className='flex flex-col gap-5  w-full md:w-1/2 '>
                    <div
                    >
                        <H3

                            className='border-b-2 md:border-none'

                        >
                            Technlogy Stack
                        </H3>
                        <ul
                            className='flex flex-wrap gap-2'
                        >
                            {
                                projects.technologyStacks.map((tech) => {
                                    return (
                                        <li key={ tech.value }>
                                            <Badge>
                                                <a

                                                    href={ tech.url }
                                                    referrerPolicy='no-referrer'
                                                    target='_blank'
                                                >
                                                    { tech.value }
                                                </a>
                                            </Badge>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    <div
                        className='flex flex-col gap-3'
                    >
                        <H3

                            className='border-b-2 md:border-none'

                        >
                            Features
                        </H3>
                        <ul
                            className='flex flex-wrap gap-2 '
                        >
                            {
                                projects.features.map((feature) => {
                                    return (
                                        <li key={ feature.value }>
                                            <Badge
                                                variant='secondary'
                                            >
                                                { feature.value }
                                            </Badge>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>

                </div>
                <div
                    className='md:flex flex-col gap-2  md:w-1/2  hidden'>
                    <H3
                        className='border-b-2 md:border-none'

                    >
                        Preview

                    </H3>
                    <img
                        src={ projects.primaryImage  || '/images/placeholder.png' }
                        alt={ projects.title }
                        width={ 500 }
                        height={ 300 }

                    />
                </div>

            </CardContent>
            <CardFooter
                className='flex flex-col items-baseline gap-3 w-full'
            >
                <H3
                    className='border-b-2'
                >
                    Resources
                </H3>
                <div
                    className='flex w-full justify-between md:justify-normal gap-2'>
                    <a
                        href={ projects.githubUrl }
                        referrerPolicy='no-referrer'
                        target='_blank'
                    >
                        <Button
                            variant='secondary'
                            className='flex gap-2 items-center'
                        >
                            <GitHubLogoIcon />
                            View Code</Button>
                    </a> <a
                        href={ projects.projectUrl }
                        referrerPolicy='no-referrer'
                        target='_blank'
                    >
                        <Button
                            variant='secondary'
                            className='flex gap-2 items-center'
                        >
                            <ExternalLinkIcon />
                            View Project</Button>
                    </a>
                </div>
                <div
                    className='flex flex-col gap-2'>
                    <H3
                        className='border-b-2'

                    >
                        Status
                    </H3>
                    <Badge>

                        { projects.status.toUpperCase() }
                    </Badge>
                </div>

            </CardFooter>

        </Card>

    )
}






export { ProjectCard }