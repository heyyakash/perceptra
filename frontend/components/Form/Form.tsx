"use client";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React, { useRef } from 'react'
import { useMutation } from '@tanstack/react-query'

interface FormPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any
}

const Form = ({ obj }: FormPageProps) => {
  const format = JSON.parse(obj.form_format);
  const formRef = useRef<HTMLFormElement>(null);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const payload = {
        event_id: obj["event_id"],
        form_id: obj["$id"],
        response: JSON.stringify(Object.fromEntries(formData.entries()))
      }
      const res = await fetch("/api/response", {
        method: "POST",
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        throw new Error('An error occurred while submitting the form')
      }
      return res.json()
    },
  })

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      mutation.mutate(formData)
    }
  };

  return (
    <main className='flex flex-col items-center min-h-[99vh] justify-center gap-6'>
      <div className='flex flex-col items-center '>
        <h3 className='font-semibold'>{format.name}</h3>
        <p className='text-lg text-secondary/70 font-normal'>{format.description}</p>
      </div>
      <form onSubmit={submitForm} ref={formRef} className='flex flex-col gap-3 max-w-[800px] w-full'>
        {format.format.map((field: any) => (
          <div key={field.id} className='flex flex-col gap-3'>
            <Label className='text-md font-semibold'>{field.label}</Label>
            {field.type === 'textarea' ? (
              <Textarea
                name={field.label}
                className='w-full border-secondary/20 rounded-sm h-[250px] focus:bg-secondary/10'
                required
              />
            ) : (
              <Input
                type={field.type}
                name={field.label}
                className='w-full border-secondary/20 text-lg h-[40px] focus:bg-secondary/10 rounded-sn'
                required
              />
            )}
          </div>
        ))}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            type="submit" 
            variant={"secondary"}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Submitting...' : 'Submit'}
          </Button>
          <Button type="reset" disabled={mutation.isPending}>Reset</Button>
        </div>
      </form>
      {mutation.isError && (
        <p className="text-red-500">An error occurred: {mutation.error.message}</p>
      )}
      {mutation.isSuccess && (
        <p className="text-green-500">Form submitted successfully!</p>
      )}
    </main>
  );
};

export default Form;