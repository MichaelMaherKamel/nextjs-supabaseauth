import { createClient } from '@/utils/supabase/server'
import AuthButtonWrapper from './authbutton'
export default async function AuthButton() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <AuthButtonWrapper user={user} />
}
