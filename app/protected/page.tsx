import { InfoIcon, UserIcon } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import RoleSelector from '@/components/role-selector'

export default async function ProtectedPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  // Extract user metadata
  const metadata = user.user_metadata || {}
  const userRole = metadata?.role || 'No role assigned'

  return (
    <div className='flex-1 w-full flex flex-col gap-12'>
      <div className='w-full'>
        <div className='bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center'>
          <InfoIcon size='16' strokeWidth={2} />
          This is a protected page that you can only see as an authenticated user
        </div>
      </div>

      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-2 items-start'>
          <h2 className='font-bold text-2xl mb-2'>Your user details</h2>
          <pre className='text-xs font-mono p-3 rounded border max-h-32 overflow-auto w-full'>
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className='flex flex-col gap-2 items-start'>
          <h2 className='font-bold text-2xl mb-2'>Your metadata</h2>
          <div className='bg-accent/30 p-4 rounded-md w-full'>
            <div className='flex items-center gap-2 mb-2'>
              <UserIcon size='18' />
              <span className='font-semibold'>Role:</span>
              <span className='px-2 py-1 bg-primary/10 text-primary rounded-md'>{userRole}</span>
            </div>
            {metadata &&
              Object.entries(metadata)
                .filter(([key]) => key !== 'role')
                .map(([key, value]) => (
                  <div key={key} className='flex items-start gap-2 mt-2'>
                    <span className='font-semibold'>{key}:</span>
                    <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                  </div>
                ))}
            {(!metadata || Object.keys(metadata).length <= 1) && (
              <p className='text-sm text-foreground/70 mt-2'>No additional metadata found for this user.</p>
            )}
          </div>
        </div>

        {/* Role Selector Component */}
        <RoleSelector currentRole={userRole as 'mentor' | 'individual' | 'organization' | 'No role assigned' | ''} />
      </div>
    </div>
  )
}
