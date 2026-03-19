'use client';
import AuthModal from '@/components/AuthModal';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  return <AuthModal mode="login" onClose={() => router.push('/')} />;
}
