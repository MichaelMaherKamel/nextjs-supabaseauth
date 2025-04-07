'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { CheckIcon, Loader2Icon, RefreshCwIcon } from 'lucide-react'

// Define role type as a string union
type UserRole = 'mentor' | 'individual' | 'organization' | '' | 'No role assigned'

interface RoleSelectorProps {
  currentRole: UserRole
}

interface RoleOption {
  id: UserRole
  label: string
  description: string
}

export default function RoleSelector({ currentRole }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const roles: RoleOption[] = [
    { id: 'mentor', label: 'Mentor', description: 'Someone offering mentorship/coaching' },
    { id: 'individual', label: 'Individual User', description: 'A person seeking 1:1 mentorship or attending events' },
    {
      id: 'organization',
      label: 'Organization User',
      description: 'A representative of a company/school enrolling as a team',
    },
  ]

  const supabase = createClient()

  const updateUserRole = async (role: UserRole) => {
    if (role === selectedRole) return

    setIsUpdating(true)
    setError(null)
    setUpdateSuccess(false)

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { role },
      })

      if (error) {
        throw error
      }

      setSelectedRole(role)
      setUpdateSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false)
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to update role')
    } finally {
      setIsUpdating(false)
    }
  }

  const refreshPage = () => {
    window.location.reload()
  }

  return (
    <div className='mt-8 bg-accent/20 p-6 rounded-lg'>
      <h2 className='font-bold text-2xl mb-4'>Update Your Role</h2>
      <div className='space-y-4'>
        {roles.map((role) => (
          <div
            key={role.id}
            className={`border p-4 rounded-md cursor-pointer transition-all 
              ${selectedRole === role.id ? 'border-primary bg-primary/5' : 'hover:bg-accent/50'}`}
            onClick={() => !isUpdating && updateUserRole(role.id)}
          >
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-medium text-lg'>{role.label}</h3>
                <p className='text-sm text-foreground/70'>{role.description}</p>
              </div>
              {selectedRole === role.id && (
                <div className='h-6 w-6 rounded-full bg-primary flex items-center justify-center'>
                  <CheckIcon className='h-4 w-4 text-white' />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isUpdating && (
        <div className='mt-4 flex items-center text-sm text-primary'>
          <Loader2Icon className='h-4 w-4 mr-2 animate-spin' />
          Updating role...
        </div>
      )}

      {updateSuccess && (
        <div className='mt-4 flex items-center gap-2'>
          <div className='flex items-center text-sm text-green-600'>
            <CheckIcon className='h-4 w-4 mr-2' />
            Role updated successfully!
          </div>
          <button
            onClick={refreshPage}
            className='text-sm flex items-center gap-1 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 rounded-md transition-colors'
          >
            <RefreshCwIcon size={14} />
            Refresh page
          </button>
        </div>
      )}

      {error && <div className='mt-4 text-sm text-red-500'>Error: {error}</div>}
    </div>
  )
}
