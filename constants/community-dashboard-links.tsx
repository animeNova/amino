import { Flag, Globe, Home, NotepadText, Settings, TagsIcon, Users } from "lucide-react";

export const getCommunitySideBarLinks = (communityId: string) => [
    {
        title: "Dashboard",
        href: `${communityId}/admin`,
        icon: <Home className="h-4 w-4" />,
    },
    {
        title: "Posts",
        href: `${communityId}/posts`,
        icon: <NotepadText className="h-4 w-4" />,
    },
    {
        title: "Members",
        href: `${communityId}/members`,
        icon: <Users className="h-4 w-4" />,
    },
    {
        title: 'Reports',
        href: `${communityId}/reports`,
        icon: <Flag className="h-4 w-4" />
    },
    {
        title: 'Settings',
        href: `${communityId}/settings`,
        icon: <Settings className="h-4 w-4" />
    }
];