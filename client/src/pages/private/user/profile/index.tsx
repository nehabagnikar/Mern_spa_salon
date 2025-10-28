import UserProfileCard from "@/components/functional/user-profile-card"
import PageTitle from "@/components/ui/page-title"

function UserProfilePage() {
  return (
    <div>
      <PageTitle title="User Profile" />

      <UserProfileCard />
    </div>
  )
}

export default UserProfilePage