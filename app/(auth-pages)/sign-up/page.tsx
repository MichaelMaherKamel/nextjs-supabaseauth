import SignupForm from "@/components/signupform"

export default async function Signup(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams

  return <SignupForm searchParams={searchParams} />
}
