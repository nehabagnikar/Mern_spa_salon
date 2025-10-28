import usersGlobalStore, { type IUsersStore } from "@/store/users-store";
import { getDateTimeFormat } from "@/utils";

function UserProfileCard() {
  const { user } = usersGlobalStore() as IUsersStore;
  if (!user) {
    return <></>;
  }

  const renderUserProperty = (label: string, value: string | number) => {
    return (
      <div>
        <span className="text-xs text-gray-600">{label}</span>
        <p className="text-sm font-bold">{value}</p>
      </div>
    );
  };

  return (
    <div className="mt-7 grid lg:grid-cols-3 gap-5 p-5 border border-gray-300 rounded-lg shadow-sm">
      {renderUserProperty("User ID", user._id)}
      {renderUserProperty("Name", user.name)}
      {renderUserProperty("Email", user.email)}
      {renderUserProperty("Role", user.role)}
      {renderUserProperty("Created At", getDateTimeFormat(user.createdAt))}
    </div>
  );
}

export default UserProfileCard;
