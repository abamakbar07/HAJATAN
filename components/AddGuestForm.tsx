'use client';

import { useState, useEffect } from 'react';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
  status: z.enum(['pending', 'attending', 'not-attending']),
  group: z.string().optional(),
  numberOfGuests: z.coerce.number().min(1).max(10),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddGuestFormProps {
  weddingId: string;
  guestData?: any;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  className?: string;
}

export default function AddGuestForm({ 
  weddingId, 
  guestData, 
  isOpen, 
  onOpenChange,
  onSuccess 
}: AddGuestFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isEditMode = !!guestData;

  useEffect(() => {
    if (isOpen !== undefined) {
      setOpen(isOpen);
    }
  }, [isOpen]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      weddingId,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      group: formData.get('group'),
      status: isEditMode ? guestData.status : 'pending',
      numberOfGuests: Number(formData.get('numberOfGuests')) || 1,
    };

    try {
      const url = isEditMode 
        ? `/api/guests/${guestData._id}`
        : '/api/guests';
      
      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`Failed to ${isEditMode ? 'update' : 'add'} guest`);

      toast({
        title: 'Success',
        description: `Guest ${isEditMode ? 'updated' : 'added'} successfully`,
      });

      handleOpenChange(false);
      if (onSuccess) onSuccess();
      e.currentTarget.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${isEditMode ? 'update' : 'add'} guest. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {!isEditMode && (
          <Button size="sm" className="bg-rose-500 hover:bg-rose-600">
            Add Guest
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Guest' : 'Add New Guest'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the guest details.' : 'Enter the guest details. You can modify these later.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Guest name"
                defaultValue={guestData?.name}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="guest@example.com"
                defaultValue={guestData?.email}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1234567890"
                defaultValue={guestData?.phone}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="group" className="text-right">
                Group
              </Label>
              <Select name="group" defaultValue={guestData?.group}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="colleague">Colleague</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="numberOfGuests" className="text-right">
                Guests
              </Label>
              <Input
                id="numberOfGuests"
                name="numberOfGuests"
                type="number"
                defaultValue={guestData?.numberOfGuests || 1}
                min="1"
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isEditMode ? ( 
                isLoading ? 'Updating...' : 'Update Guest'
              ) : ( 
                isLoading ? 'Adding...' : 'Add Guest'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}