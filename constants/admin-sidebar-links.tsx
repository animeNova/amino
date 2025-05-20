import { Flag, Globe, Home, NotepadText, Pen, TagsIcon, User } from "lucide-react";

export const AdminSideBarLinks = [
    {
        title : "Dashboard",
        href : "/dashboard/admin",
        icon : <Home className="h-4 w-4" />,
    },
    {
        title : "Users",
        href : "/dashboard/admin/users",
        icon : <User className="h-4 w-4" />,
    } ,
    {
        title : "Communities",
        href : "/dashboard/admin/communities",
        icon : <Globe className="h-4 w-4" />,
    },
    {
        title : "Moderators",
        href : "/dashboard/admin/moderators",
        icon : <Pen className="h-4 w-4" />,
    },
    {
        title : "Posts",
        href : "/dashboard/admin/posts",
        icon : <NotepadText className="h-4 w-4" />,
    },
    {
        title : "Genres",
        href : "/dashboard/admin/genres",
        icon : <TagsIcon className="h-4 w-4" />,
    }
]