"use client";
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import React from 'react';
import FormList from '@/components/Form/FormList';
import CreateForm from '@/components/Sheets/CreateForm';
import { Separator } from '@/components/ui/separator';

const fetchProjectData = async (id: string) => {
  if (!id) return null;
  const response = await fetch(`/api/eventid/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch project data');
  }
  return response.json();
};

const Project = () => {
  const { id } = useParams() as { id: string | string[] };
  const { data: session } = useSession();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['projectData', id],
    queryFn: () => fetchProjectData(Array.isArray(id) ? id[0] : id),
    enabled: !!id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className='w-full h-full'>
      <h4 className='text-xl font-light'>
        <span className='font-semibold'>Perceptra</span> /{' '}
        <span className='text-primary/70'>{session?.user?.name}</span> /{' '}
        {data && data.event_name}
      </h4>
      <div className='mt-10'>
        <div className='flex items-center justify-between'>
          <h3>{data && data.event_name}</h3>
          <CreateForm id={Array.isArray(id) ? id[0] : id} />
        </div>
        <Separator className='bg-primary/10 my-2' />
        <div>
          <FormList id={Array.isArray(id) ? id[0] : id} />
        </div>
      </div>
    </div>
  );
};

export default Project;