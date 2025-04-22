'use client';

import { useQuery} from '@tanstack/react-query';

import { isCommunityMember } from '@/utils/permissions';
import { useSession } from '@/lib/auth/client';

type UseMemberOptions = {
communityId: string;
}

export function useMembers(options: UseMemberOptions) {
  const { communityId } = options;
  const {data} = useSession();
  // Query to fetch likes with the current userId
  const MemberQuery = useQuery({
    queryKey: ['member', communityId],
    queryFn: () => isCommunityMember(data?.user.id!,communityId),
    enabled: !!data?.user && !!communityId,
  });

  return {
       // List-related properties and methods
       isMember: MemberQuery.data,
  };
}
