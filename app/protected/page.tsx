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
    <div className='flex-1 w-full flex flex-col gap-8 px-4 sm:px-6 md:px-8 py-6 max-w-7xl mx-auto'>
      <div className='w-full'>
        <div className='bg-accent text-sm p-3 px-4 sm:px-5 rounded-md text-foreground flex flex-wrap gap-2 sm:gap-3 items-center'>
          <InfoIcon size='16' strokeWidth={2} className='flex-shrink-0' />
          <span>This is a protected page that you can only see as an authenticated user</span>
        </div>
      </div>

      <div className='flex flex-col gap-6'>
        {/* User Details Section */}
        <div className='flex flex-col gap-2 items-start'>
          <h2 className='font-bold text-xl sm:text-2xl mb-2'>Your user details</h2>
          <div className='w-full overflow-hidden'>
            <pre className='text-xs font-mono p-3 rounded border max-h-32 overflow-auto w-full whitespace-pre-wrap break-all'>
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>

        {/* Metadata Section */}
        <div className='flex flex-col gap-2 items-start'>
          <h2 className='font-bold text-xl sm:text-2xl mb-2'>Your metadata</h2>
          <div className='bg-accent/30 p-3 sm:p-4 rounded-md w-full'>
            <div className='flex flex-wrap items-center gap-2 mb-2'>
              <UserIcon size='18' className='flex-shrink-0' />
              <span className='font-semibold'>Role:</span>
              <span className='px-2 py-1 bg-primary/10 text-primary rounded-md break-all'>{userRole}</span>
            </div>

            {metadata &&
              Object.entries(metadata)
                .filter(([key]) => key !== 'role')
                .map(([key, value]) => (
                  <div key={key} className='flex flex-wrap items-start gap-2 mt-2'>
                    <span className='font-semibold min-w-[80px] sm:min-w-0'>{key}:</span>
                    <span className='break-all'>
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}

            {(!metadata || Object.keys(metadata).length <= 1) && (
              <p className='text-sm text-foreground/70 mt-2'>No additional metadata found for this user.</p>
            )}
          </div>
        </div>

        {/* Role Selector Component */}
        <div className='w-full'>
          <RoleSelector currentRole={userRole as 'mentor' | 'individual' | 'organization' | 'No role assigned' | ''} />
        </div>
      </div>
    </div>
  )
}
