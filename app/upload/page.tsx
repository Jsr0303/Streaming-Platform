'use client';
import UploadModal from '@/components/UploadModal';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();
  return <UploadModal onClose={() => router.push('/')} />;
}
