"use client";
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import React from 'react';
import FormBuilder from '@/components/Form/FormBuilder';
import { Separator } from '@/components/ui/separator';

const fetchFormData = async (id: string | string[]) => {
  const res = await fetch(`/api/form/${id}`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

const FormBuilderContainer = () => {
  const { id } = useParams();
  const { data: session } = useSession();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['formData', id],
    queryFn: () => fetchFormData(id),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className='w-full h-full'>
      <h4 className='text-xl font-light'>
        <span className='font-semibold'>Perceptra</span> /{' '}
        <span className='text-primary/70'>{session?.user?.name}</span> / Forms /{' '}
        {data && data["form_name"]}
      </h4>
      <div className='mt-10'>
        <div className='flex items-center justify-between'>
          <h3>Form Builder</h3>
          {/* <CreateForm id={id} /> */}
        </div>
        <Separator className='bg-primary/10 my-2' />
        {data && <FormBuilder data={data} />}
      </div>
    </div>
  );
};

export default FormBuilderContainer;