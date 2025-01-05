'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RoastingSession, Bean } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';

interface EditFormProps {
  session: RoastingSession;
  beans: Bean[];
}

export function EditForm({ session, beans }: EditFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    beanId: session.beanId || '',
    inputWeight: session.inputWeight?.toString() || '',
    outputWeight: session.outputWeight?.toString() || '',
    notes: session.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/roasting-sessions/${session.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          inputWeight: parseFloat(formData.inputWeight),
          outputWeight: parseFloat(formData.outputWeight),
          status: 'COMPLETED',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "更新に失敗しました。";
        
        if (data.error === 'Validation error') {
          errorMessage = "入力内容に誤りがあります。";
          if (data.details) {
            const details = data.details.map((err: any) => err.message).join('\n');
            errorMessage = `入力内容に誤りがあります：\n${details}`;
          }
        }

        toast({
          title: "エラー",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "更新完了",
        description: "焙煎セッションの情報を更新しました。",
        className: "bg-green-50 border-green-200 text-green-900",
      });

      router.push(`/roasting/sessions/${session.id}`);
      router.refresh();
    } catch (error) {
      console.error('Error updating session:', error);
      toast({
        title: "エラー",
        description: "サーバーとの通信に失敗しました。",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="beanId">豆の選択</Label>
          <Select
            value={formData.beanId}
            onValueChange={(value) => setFormData(prev => ({ ...prev, beanId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="豆を選択してください" />
            </SelectTrigger>
            <SelectContent>
              {beans.map((bean) => (
                <SelectItem key={bean.id} value={bean.id}>
                  {bean.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="inputWeight">投入量 (g)</Label>
            <Input
              id="inputWeight"
              type="number"
              step="0.1"
              value={formData.inputWeight}
              onChange={(e) => setFormData(prev => ({ ...prev, inputWeight: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="outputWeight">焼き上がり量 (g)</Label>
            <Input
              id="outputWeight"
              type="number"
              step="0.1"
              value={formData.outputWeight}
              onChange={(e) => setFormData(prev => ({ ...prev, outputWeight: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">備考</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="備考を入力してください"
            className="h-32"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push(`/roasting/sessions/${session.id}`)}
        >
          キャンセル
        </Button>
        <Button type="submit">更新する</Button>
      </div>
    </form>
  );
} 