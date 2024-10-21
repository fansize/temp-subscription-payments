'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { updateName } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NameForm({ userName }: { userName: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // Check if the new name is the same as the old name
    if (e.currentTarget.fullName.value === userName) {
      e.preventDefault();
      setIsSubmitting(false);
      return;
    }
    handleRequest(e, updateName, router);
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>您的姓名</CardTitle>
        <CardDescription>请输入您的全名，或您觉得舒适的显示名称。</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="nameForm" onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            name="fullName"
            className="w-1/2 p-3 rounded-md bg-zinc-800"
            defaultValue={userName}
            placeholder="您的姓名"
            maxLength={64}
          />
        </form>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center w-full">
          <p className="pb-4 sm:pb-0">最多64个字符</p>
          <Button
            variant="outline"
            type="submit"
            form="nameForm"
            disabled={isSubmitting}
          >
            更新姓名
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
