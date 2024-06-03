import { Link } from '@remix-run/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '~/components/ui/card'

const ProjectCard = () => {
  return (
    <Card className='shadow-2xl bg-primary/10 w-full p-2 md:w-1/2'>
      <CardHeader>
        <CardTitle>ACMG Variant Classification</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          A web app for ACMG Variant Classification
        </CardDescription>
      </CardContent>
      <CardFooter className='flex gap-2'>
        <Link to='https://github.com/Derick80/genes_23 '>Github</Link>

        <Link to={`https://main--jovial-platypus-2a8460.netlify.app/`}>
          Demo
        </Link>
      </CardFooter>
    </Card>
  )
}

export default ProjectCard
