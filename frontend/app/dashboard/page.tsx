'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import CreateProject from '@/components/Sheets/CreateProject';
import { Badge } from '@/components/ui/badge';

const fetchEvents = async () => {
  const response = await fetch("/api/event");
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  const data = await response.json();
  return data.documents || [];
};

const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });
};

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: events, isLoading, isError, error } = useEvents();

  if (status === "unauthenticated") {
    router.push('/auth');
    return null;
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className='w-full h-full'>
      <h4 className='text-xl font-light'>
        <span className='font-semibold'>Perceptra</span> /{' '}
        <span className='text-primary/70'>{session?.user?.name}</span>
      </h4>
      <div className='mt-10'>
        <div className='flex items-center justify-between'>
          <h3>Your Events</h3>
          <CreateProject />
        </div>
        <Separator className='bg-primary/10 my-2' />
        <div className='grid grid-cols-6 gap-4 my-4'>
          {events.map((event: { [x: string]: string; }) => (
            <GlassmorphismCard
              key={event["$id"]}
              event_name={event["event_name"]}
              date={event["$createdAt"]}
              desc={event["event_desc"]}
              id={event["$id"]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface EventCardProps {
  event_name: string;
  id: string;
  date: string;
  desc: string;
}

const GlassmorphismCard: React.FC<EventCardProps> = ({ event_name, id, date, desc }) => {
  return (
    <Link href={`dashboard/project/${id}`} className='relative overflow-hidden'>
      <div className='absolute text-[8rem] font-extrabold text-secondary z-[-1]'>{event_name}</div>
      <div className='flex flex-col bg-secondary/70 p-6 rounded-md items-start gap-2 w-full'>
        <h4 className='font-medium'>{event_name}</h4>
        <Badge>{new Date(date).toDateString()}</Badge>
        <p className='text-primary/80 font-medium'>{desc}</p>
      </div>
    </Link>
  );
};

export default Page;