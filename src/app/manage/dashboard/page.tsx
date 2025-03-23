import accountApiRequest from '@/apiRequests/account'
import { cookies } from 'next/headers';

export default async function Dashboard() {
  const cookieStore =  cookies();
  const accessToken = (await cookieStore).get("accessToken")?.value!;
  const result =  accountApiRequest.sMe(accessToken);
  return (
    <div>
      Dashboard
    </div>
  )
}
