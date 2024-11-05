import React, { useState, useContext, useEffect } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { GiForkKnifeSpoon,GiSteak,GiTable } from "react-icons/gi";
import { FaUtensils,FaPersonBooth } from "react-icons/fa";
import {
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Card,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

import { AdminContext } from "../Admin_main";
import axios from "axios";

function Admin_main_sidebar() {
  const {
    sideBarShow,
    setSideBarShow,
    handleLogOut,
    currectPage,
    setCurrectPage,
  } = useContext(AdminContext);
  const [open, setOpen] = useState(0);
  const [waitingOrderCount, setWaitingOrderCount] = useState(0);
  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };
  async function getWaitingOrderCount() {
    try {
      const response = await axios.get(
        "https://webdev-backend-2e1ad2316dae.herokuapp.com/customer_order/waiting_orderCount"
      );
      setWaitingOrderCount(response.data[0]["count(order_status)"]);
    } catch (error) {
      alert(error.respone.data.error);
    }
  }
  useEffect(() => {
    getWaitingOrderCount();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getWaitingOrderCount();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div
        className={`fixed top-0 left-0  lg:static lg:translate-x-0  duration-300 z-10 bg-gradient-to-r from-green-200 shadow-lg
          ${sideBarShow ? "translate-x-0" : "-translate-x-full"}`}>
        <Card className="min-h-screen w-full max-w-[15rem] p-1 shadow-xl bg-blue-50 rounded-none rounded-r-lg">
          <div className="lg:hidden flex justify-end p-2">
            <button
              onClick={() => setSideBarShow(false)}
              className="p-2 min-h-full bg-blue-gray-200 rounded-full shadow-md hover:bg-blue-gray-300 transition duration-200">
              <IoIosArrowBack className="text-xl" />
            </button>
          </div>
          <List>
            {/* dashboard */}
            {/* <Accordion
              open={open === 1}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${
                    open === 1 ? "rotate-180" : ""
                  }`}
                />
              }>
              <ListItem className="p-0" selected={open === 1}>
                <AccordionHeader
                  onClick={() => handleOpen(1)}
                  className="border-b-0 p-3">
                  <ListItemPrefix></ListItemPrefix>
                  <Typography color="blue-gray" className="mr-auto font-normal">
                    Dashboard
                  </Typography>
                </AccordionHeader>
              </ListItem>
              <AccordionBody className="py-1">
                <List className="p-0">
                  <ListItem>
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                    </ListItemPrefix>
                    Analytics
                  </ListItem>
                  <ListItem>
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                    </ListItemPrefix>
                    Reporting
                  </ListItem>
                  <ListItem>
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                    </ListItemPrefix>
                    Projects
                  </ListItem>
                </List>
              </AccordionBody>
            </Accordion> */}
            {/* dashboard */}
            <ListItem onClick={() => setCurrectPage("Dashboard")}>
              <ListItemPrefix>
                <PresentationChartBarIcon className="h-5 w-5" />
              </ListItemPrefix>
              Dashboard
            </ListItem>
            {/* end dashboard */}

            {/* Menu Management */}
            <Accordion
              open={open === 2}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${
                    open === 2 ? "rotate-180" : ""
                  }`}
                />
              }>
              <ListItem className="p-0" selected={open === 2}>
                <AccordionHeader
                  onClick={() => handleOpen(2)}
                  className="border-b-0 p-3">
                  <ListItemPrefix>
                    <GiForkKnifeSpoon className="h-5 w-5" />
                  </ListItemPrefix>
                  <Typography color="blue-gray" className="mr-auto font-normal">
                    Menu Management
                  </Typography>
                </AccordionHeader>
              </ListItem>
              <AccordionBody className="py-1">
                <List className="p-0">
                  <ListItem onClick={() => setCurrectPage("Categories")}>
                    <ListItemPrefix>
                      <FaUtensils className="h-3 w-5" />
                    </ListItemPrefix>
                    Categories
                  </ListItem>
                  <ListItem onClick={() => setCurrectPage("Foods")}>
                    <ListItemPrefix>
                      <GiSteak className="h-3 w-5" />
                    </ListItemPrefix>
                    Foods
                  </ListItem>
                </List>
              </AccordionBody>
            </Accordion>
            {/*end Menu Management */}

            <hr className="my-2 border-blue-gray-50" />
            <ListItem onClick={() => setCurrectPage("Orders")}>
              <ListItemPrefix>
                <InboxIcon className="h-5 w-5" />
              </ListItemPrefix>
              Orders
              <ListItemSuffix>
                <Chip
                  value={waitingOrderCount}
                  size="sm"
                  variant="ghost"
                  color="blue-gray"
                  className="rounded-full"
                />
              </ListItemSuffix>
            </ListItem>
            <ListItem onClick={() => setCurrectPage("Tables")}>
              <ListItemPrefix>
                <GiTable className="h-5 w-5" />
              </ListItemPrefix>
              Tables
            </ListItem>
            <ListItem onClick={() => setCurrectPage("Customer view")}>
              <ListItemPrefix>
                <FaPersonBooth className="h-5 w-5" />
              </ListItemPrefix>
              Customer view
            </ListItem>
            <ListItem onClick={handleLogOut}>
              <ListItemPrefix>
                <PowerIcon className="h-5 w-5" />
              </ListItemPrefix>
              Log Out
            </ListItem>
          </List>
        </Card>
      </div>
    </>
  );
}

export default Admin_main_sidebar;
