import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { UserPlaceHolder } from './avatar-placeholder'
import { useOptionalUser } from '~/lib/misc'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const UserMenu = () => {
  const user = useOptionalUser()

  return (
    <DropdownMenu
    >
      <DropdownMenuTrigger asChild>

          <Avatar>
            <AvatarImage
              src='https://res.cloudinary.com/dch-photo/image/upload/c_fit,h_400,w_400/v1675678833/Japan_2023/Kanazawa/PXL_20230201_023514635_upzfrv.jpg'
              alt='User profile'
            ></AvatarImage>
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
          <DropdownMenuContent

      >
        <DropdownMenuLabel>Profile</DropdownMenuLabel>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
    </DropdownMenu>
  )
}

export default UserMenu
