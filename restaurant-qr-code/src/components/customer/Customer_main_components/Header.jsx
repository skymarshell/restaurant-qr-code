import Shabu from "/Shabu.png";
import React, { useContext } from "react";

// import style
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Bars4Icon,
  GlobeAmericasIcon,
  NewspaperIcon,
  PhoneIcon,
  RectangleGroupIcon,
  SquaresPlusIcon,
  SunIcon,
  TagIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
// dataContext
import { DataContext } from "../Customer_main";

import moment from "moment";
//nav
function NavList() {
  const { viewOrdersHistory, setViewOrdersHistory } = useContext(DataContext);
  return (
    <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
      <Typography
        as="a"
        href="#"
        variant="small"
        color="blue-gray"
        className="font-medium">
        <ListItem
          onClick={() => setViewOrdersHistory(true)}
          className="flex items-center gap-2 py-2 pr-4 text-center">
          Orders history
        </ListItem>
      </Typography>
    </List>
  );
}

export default function Header() {
  const { id, time, isAdmin, viewOrdersHistory, setViewOrdersHistory } =
    useContext(DataContext);
  const timeFormat = moment(time).add(543, "year").format("DD/MM/YYYY HH:MM");
  const [openNav, setOpenNav] = React.useState(false);
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  return (
    <Navbar>
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          variant="h6"
          className="mr-4 cursor-pointer py-1.5 lg:ml-2">
          <div className="lg:flex lg:justify-center lg:items-center gap-2 text-center">
<<<<<<< HEAD
            <img src="https://static.vecteezy.com/system/resources/thumbnails/008/513/899/small_2x/blue-diamond-illustration-png.png" alt="shabu logo" width="100px" />
=======
            <img src={Shabu} alt="shabu logo" width="100px" />
>>>>>>> 5b6cad0b7c22caab0f440c1da601c6e76b3469c3
          </div>
        </Typography>
        <p>{isAdmin == true ? "Admin" : `โต๊ะ ${id} เวลา ${timeFormat}น.`}</p>
        <NavList />
      </div>
    </Navbar>
  );
}
