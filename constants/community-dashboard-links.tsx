import { Flag, Home, Inbox, NotepadText, Settings, Users } from "lucide-react";

export const getCommunitySideBarLinks =  [
    {
        title: "Dashboard",
        href: `admin`,
        icon: <Home className="h-4 w-4" />,
    },
    {
        title: "Posts",
        href: `posts`,
        icon: <NotepadText className="h-4 w-4" />,
    },
    {
        title: "Members",
        href: `members`,
        icon: <Users className="h-4 w-4" />,
    },
    {
        title: "Join Requests",
        href: `join-requests`,
        icon: <Inbox className="h-4 w-4" />,
    },
    {
        title: 'Reports',
        href: `reports`,
        icon: <Flag className="h-4 w-4" />
    },
    {
        title: 'Settings',
        href: `settings`,
        icon: <Settings className="h-4 w-4" />
    }
];