import { redirect } from 'next/navigation';

export default function Page({ params }: { params: { id: string } }) {
  redirect(`http://localhost:8080/url/${params.id}`);
}
