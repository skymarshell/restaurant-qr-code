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

export default function Header() {
  const {
    id,
    time,
    isAdmin,
    viewOrdersHistory,
    setViewOrdersHistory,
    adminInput,
    setAdminInput,
  } = useContext(DataContext);
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
      <div className="flex  justify-between text-blue-gray-900">
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
        <div className="flex flex-col">
          <p>{isAdmin == true ? <Admin_table /> : `โต๊ะ ${id}.`}</p>
          <button
            onClick={() => setViewOrdersHistory(true)}
            className="my-2 underline text-end">
            Orders history
          </button>
        </div>
      </div>
    </Navbar>
  );
}

function Admin_table() {
  const {
    id,
    time,
    isAdmin,
    viewOrdersHistory,
    setViewOrdersHistory,
    adminInput,
    setAdminInput,
  } = useContext(DataContext);
  return (
    <>
      <label htmlFor="admin-table">โต๊ะ</label>
      <input
        type="text"
        id="admin-table"
        placeholder="ระบุเลขโต๊ะ"
        value={adminInput}
        onChange={(e) => setAdminInput(e.target.value)}
        className="border border-black p-2 rounded-xl ms-2"
      />
    </>
  );
}
