'use client';

import { Button } from '@repo/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog';

export default function DashboardPage() {
  return (
    <main className="flex flex-col gap-4">
      <h1 className="font-bold text-4xl">Dashboard</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Hello World</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hello World!</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
