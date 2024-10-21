'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { updateEmail } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EmailForm({
  userEmail
}: {
  userEmail: string | undefined;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // Check if the new email is the same as the old email
    if (e.currentTarget.newEmail.value === userEmail) {
      e.preventDefault();
      setIsSubmitting(false);
      return;
    }
    handleRequest(e, updateEmail, router);
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>您的邮箱</CardTitle>
        <CardDescription>请输入您想用于登录的电子邮件地址。</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="emailForm" onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            name="newEmail"
            className="w-1/2 p-3 rounded-md bg-zinc-800"
            defaultValue={userEmail ?? ''}
            placeholder="您的邮箱"
            maxLength={64}
          />
        </form>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center w-full">
          <p className="pb-4 sm:pb-0">
            我们将向您发送电子邮件以验证更改。
          </p>
          <Button
            variant="outline"
            type="submit"
            form="emailForm"
            disabled={isSubmitting}
          >
            更新邮箱
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
