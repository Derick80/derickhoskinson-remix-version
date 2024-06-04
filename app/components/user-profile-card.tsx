import { UserImage } from '@prisma/client';
import {Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './ui/card'
import { SerializeFrom } from '@remix-run/node';
import { UserPlaceHolder } from './avatar-placeholder';

type UserProfile = {
    id: string;
    avatarUrl: string | null;
    userimages: SerializeFrom<UserImage>[] | null;
}


const UserProfileCard = (
    { userProfile } : { userProfile: UserProfile }
) => {




    return (
        <Card
        >
            <CardHeader
                className="flex flex-row  items-center justify-between space-y-4"
                    >

                <div
                    className="flex flex-col space-y-4"
                >
                         <CardTitle>User Profile</CardTitle>
                    <CardDescription>Manage your profile settings</CardDescription>
                </div>

                <UserPrimaryImageCard

                    avatarUrl={userProfile.avatarUrl}
                />

            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-4">
                    <UserImagesCard />
                    <div className="flex flex-col space-y-1">
                        <input
                            type="text"
                            className="input"
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="flex flex-col space-y-1">
                        <input
                            type="email"
                            className="input"
                            placeholder=""
                                />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <button className="btn">Save</button>
            </CardFooter>
            </Card>
    )
}


export default UserProfileCard


const UserPrimaryImageCard = (
    { avatarUrl }: { avatarUrl: string | null }
) => {


    return (
        <div
            className="flex flex-col space-y-4 border-2 border-purple-700"
        >
            { avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="h-20 w-20 rounded-full"
                />
            ) : (
                <div
                    className="h-20 w-20 bg-purple-700 flex items-center justify-center rounded-full"
                >
                    <UserPlaceHolder />
                </div>
                )

            }
        </div>
    )
}


const UserImagesCard = () => {

    return (
        <div
            className="flex flex-col space-y-4"
        >
            <CardTitle>Images</CardTitle>
            <CardContent>
                <div
                    className="grid grid-cols-3 gap-4"
                >
                    <div
                        className="bg-gray-300 h-32"
                    >
                        Image
                    </div>
                    <div
                        className="bg-gray-300 h-32"
                    >
                        Image
                    </div>
                    <div
                        className="bg-gray-300 h-32"
                    >
                        Image
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <button className="btn">Upload</button>
            </CardFooter>
        </div>
    )
}