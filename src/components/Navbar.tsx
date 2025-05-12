
import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Navbar = () => {
  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link to="/" className="font-bold text-xl">ProcurePro</Link>
        <NavigationMenu className="ml-4">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className={navigationMenuTriggerStyle()}>
                Dashboard
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/create-invoice" className={navigationMenuTriggerStyle()}>
                Create Invoice
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Navbar;
