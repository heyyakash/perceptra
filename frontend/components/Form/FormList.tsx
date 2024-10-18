import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';
import { Badge } from '../ui/badge';

const fetchForms = async (id: string) => {
  const response = await fetch(`/api/form/list/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch forms');
  }
  const data = await response.json();
  return data.documents || [];
};

const useForms = (id: string) => {
  return useQuery({
    queryKey: ['forms', id],
    queryFn: () => fetchForms(id),
    enabled: !!id,
  });
};

interface CardProps {
  name: string;
  id: string;
  date: string;
  desc: string;
}

const Card: React.FC<CardProps> = ({ name, id, date, desc }) => {
  return (
    <Link href={`/dashboard/form/${id}`} className='p-4 bg-secondary rounded-md'>
      <p className='font-medium text-2xl'>{name}</p>
      <p className='my-2 text-primary/70'>{desc}</p>
      <Badge>{new Date(date).toDateString()}</Badge>
    </Link>
  );
};

const FormList: React.FC<{ id: string }> = ({ id }) => {
  const { data: forms, isLoading, isError, error } = useForms(id);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className='grid grid-cols-6 gap-4'>
      {forms.map((form: { $id: string; form_name: string; $createdAt: string; form_desc: string }) => (
        <Card
          key={form["$id"]}
          name={form["form_name"]}
          id={form["$id"]}
          date={form["$createdAt"]}
          desc={form["form_desc"]}
        />
      ))}
    </div>
  );
};

export default FormList;