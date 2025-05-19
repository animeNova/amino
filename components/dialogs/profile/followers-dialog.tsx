"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, UserCheck, UserPlus } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"; // Added useEffect
import { getFollowers, getFollowing } from "@/app/actions/follower/action"; // Import server actions
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { useParams } from "next/navigation"; // Import useParams
import FollowButton from "@/components/ui/followButton"

interface User {
  username: string
  name: string
  avatar: string
}

// Updated User interface for the main user of the dialog
interface DialogUser {
  id: string; // Assuming the user object passed to dialog has an ID
  username: string;
  name: string | null;
  avatar: string | null;
}

// Interface for users in followers/following lists
interface FetchedUser {
  id: string;
  name: string | null;
  image?: string | null; // Corresponds to 'avatar'
  // bio?: string | null; // If you need bio
}

interface FollowersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "followers" | "following";
}

export function FollowersDialog({ open, onOpenChange, defaultTab = "followers" }: FollowersDialogProps) {
  const { toast } = useToast();
  const params = useParams(); // Get URL parameters
  const userIdFromParams = params.slug as string; // This is the user ID from the slug

  const [searchQuery, setSearchQuery] = useState("");
  // Updated followState to use string IDs
  const [followState, setFollowState] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState(defaultTab);

  // State for fetched data, loading, and errors
  const [followersList, setFollowersList] = useState<FetchedUser[]>([]);
  const [followingList, setFollowingList] = useState<FetchedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !userIdFromParams) { // Use userIdFromParams
      // Reset lists if dialog is closed or userIdFromParams is not available
      setFollowersList([]);
      setFollowingList([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (activeTab === "followers") {
          const result = await getFollowers(userIdFromParams); // Use userIdFromParams
          if (result.success && result.data) {
            // Assuming result.data matches FetchedUser structure (needs username)
            setFollowersList(result.data.map(u => ({ ...u, username: u.name || 'unknown' }))); // Ensure username exists
          } else {
            setError(result.error || "Failed to load followers.");
            setFollowersList([]);
          }
        } else if (activeTab === "following") {
          const result = await getFollowing(userIdFromParams); // Use userIdFromParams
          if (result.success && result.data) {
            // Assuming result.data matches FetchedUser structure (needs username)
            setFollowingList(result.data.map(u => ({ ...u, username: u.name || 'unknown' }))); // Ensure username exists
          } else {
            setError(result.error || "Failed to load following list.");
            setFollowingList([]);
          }
        }
      } catch (e) {
        console.error("Error fetching follow data:", e);
        setError("An unexpected error occurred.");
        setFollowersList([]);
        setFollowingList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [open, activeTab, userIdFromParams]); // Use userIdFromParams in dependency array

  // Updated to use string ID and new state lists
  const handleFollow = (userId: string) => {
    setFollowState((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));

    const isNowFollowing = !followState[userId]; // State before this click
    const targetUser = getFollowerById(userId);

    toast({
      title: isNowFollowing ? "Following" : "Unfollowed",
      description: isNowFollowing
        ? `You are now following ${targetUser?.name || targetUser?.name}`
        : `You have unfollowed ${targetUser?.name || targetUser?.name}`,
      variant: "default",
    });
    // In a real app, you'd call a server action here to update the follow status in the DB
    // e.g., await followUserAction(userId) or await unfollowUserAction(userId)
    // And then potentially re-fetch or update the list optimistically/realistically.
  };

  // Updated to use string ID and new state lists
  const getFollowerById = (id: string): FetchedUser | undefined => {
    return [...followersList, ...followingList].find((f) => f.id === id);
  };

  const filteredFollowers = followersList.filter(
    (follower) =>
      (follower.name && follower.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      follower.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredFollowing = followingList.filter(
    (follow) =>
      (follow.name && follow.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      follow.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderUserList = (list: FetchedUser[], type: "followers" | "following") => {
    if (isLoading) {
      return (
        <div className="space-y-4 mt-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return <div className="py-8 text-center text-destructive">{error}</div>;
    }

    if (list.length === 0) {
      return (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">
            {searchQuery ? `No ${type} found matching your search.` : `This user has no ${type}.`}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {list.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={item.image ?? undefined} alt={item.name || ''} />
                <AvatarFallback>{(item.name)?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <Link
                  href={`/profile/${item.id}`}
                  className="font-medium hover:underline"
                  onClick={() => onOpenChange(false)}
                >
                  {item.name}
                </Link>
                <p className="text-sm text-muted-foreground">@{item.name}</p>
              </div>
            </div>
            {/* Button logic needs to consider if the current logged-in user is viewing their own profile 
                or someone else's. For simplicity, this example assumes you can always (un)follow.
                Also, the button for the "following" tab should typically be "Unfollow".
            */}
            <FollowButton profileUserId={item.id}  />
             {/* For the "Following" tab, the button should primarily be an "Unfollow" button if already following */}
             {/* This part of the logic might need refinement based on whether the logged-in user is the one being viewed */}
          </div>
        ))}
      </div>
    );
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle> {/* Use profileUsername for title */}
        </DialogHeader>

        <div className="mb-4 mt-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search people..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs
          defaultValue={defaultTab}
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "followers" | "following")}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="followers">
              Followers{" "}
              <Badge variant="secondary" className="ml-2">
                {isLoading && activeTab === 'followers' ? '...' : followersList.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="following">
              Following{" "}
              <Badge variant="secondary" className="ml-2">
                 {isLoading && activeTab === 'following' ? '...' : followingList.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="followers" className="flex-1 overflow-auto mt-4">
            {renderUserList(filteredFollowers, "followers")}
          </TabsContent>

          <TabsContent value="following" className="flex-1 overflow-auto mt-4">
            {renderUserList(filteredFollowing, "following")}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// Remove the mock data arrays:
// const followers = [ ... ]
// const following = [ ... ]

