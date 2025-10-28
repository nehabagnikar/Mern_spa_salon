import usersGlobalStore, { type IUsersStore } from "@/store/users-store";
import { Menu } from "lucide-react";
import { useState } from "react";
import MenuItems from "./menu-items";

function Header() {
  const [openMenuItems, setOpenMenuItems] = useState<boolean>(false);
  const { user } = usersGlobalStore() as IUsersStore;
  return (
    <div className="px-5 py-6 bg-primary flex justify-between items-center">
      <h1 className="text-xl font-bold text-white">Bare Bliss - Glow Up Lounge</h1>
      <div className="flex items-center gap-5">
        <h1 className="text-sm text-white">{user?.name}</h1>

        <Menu
          className="text-white cursor-pointer"
          size={16}
          onClick={() => setOpenMenuItems(true)}
        />
      </div>

      {openMenuItems && (
        <MenuItems
          openMenuItems={openMenuItems}
          setOpenMenuItems={setOpenMenuItems}
        />
      )}
    </div>
  );
}

export default Header;
