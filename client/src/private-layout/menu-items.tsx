import LogoutButton from "@/components/functional/logout-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import usersGlobalStore, { type IUsersStore } from "@/store/users-store";
import {
  LayoutDashboardIcon,
  List,
  ListCheck,
  UserSearch,
  UsersIcon,
} from "lucide-react";
import { useNavigate, useResolvedPath } from "react-router-dom";

interface IMenuItemsProps {
  openMenuItems: boolean;
  setOpenMenuItems: (open: boolean) => void;
}

function MenuItems({ openMenuItems, setOpenMenuItems }: IMenuItemsProps) {
  const { user } = usersGlobalStore() as IUsersStore;
  const pathname = useResolvedPath("").pathname;
  const navigate = useNavigate()

  const iconSize = 15;

  const userMenuItems = [
    {
      name: "Dashboard",
      path: "/user/dashboard",
      icon: <LayoutDashboardIcon size={iconSize} />,
    },
    {
      name: "Salons & Spas",
      path: "/user/salons",
      icon: <ListCheck size={iconSize} />,
    },
    {
      name: "Appointments",
      path: "/user/appointments",
      icon: <List size={iconSize} />,
    },
    {
      name: "Profile",
      path: "/user/profile",
      icon: <UsersIcon size={iconSize} />,
    },
  ];

  const ownerMenuItems = [
    {
      name: "Dashboard",
      path: "/owner/dashboard",
      icon: <LayoutDashboardIcon size={iconSize} />,
    },
    {
      name: "Register and Manage Salons",
      path: "/owner/salons",
      icon: <ListCheck size={iconSize} />,
    },
    {
      name: "Appointments",
      path: "/owner/appointments",
      icon: <List size={iconSize} />,
    },
    {
      name: "Customers",
      path: "/owner/customers",
      icon: <UserSearch size={iconSize} />,
    },
    {
      name: "Profile",
      path: "/owner/profile",
      icon: <UsersIcon size={iconSize} />,
    },
  ];

  const menuItems = user?.role === "user" ? userMenuItems : ownerMenuItems;

  return (
    <Sheet open={openMenuItems} onOpenChange={setOpenMenuItems}>
      <SheetTrigger asChild></SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle></SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-7 mt-10 px-7">
          {menuItems.map((item) => (
            <div
              className={`p-3 flex items-center gap-3 cursor-pointer ${
                pathname === item.path
                  ? "bg-gray-100 border border-primary rounded"
                  : ""
              }`}
              key={item.name}
              onClick={() => {
                navigate(item.path);
                setOpenMenuItems(false);
              }}
            >
              {item.icon}
              <h1 className="text-sm">{item.name}</h1>
            </div>
          ))}

          <LogoutButton />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MenuItems;
