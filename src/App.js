import React from "react";
import "./App.css";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import useMediaQuery from "@material-ui/core/useMediaQuery";

/*
  Use Material UI for its nice composibility api and hooks
    Noeably I wanted the userMediaQuery hook
    SwipeableViews used to make the different tabs swipeable on mobile.
*/

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper
  },
  secondaryTab: {
    display: "initial",
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  }
}));

function App() {
  const classes = useStyles();
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));
  const md = useMediaQuery(theme.breakpoints.up("md"));
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    if (xs && index > 0 && index < 6) {
      // Override index switching logic for mobile views.
      if (value === 0) {
        setValue(6);
      } else if (value === 6) {
        setValue(0);
      } else if (value > index) {
        setValue(0);
      } else {
        setValue(6);
      }
    } else {
      setValue(index);
    }
  };

  let tabs = [
    <Tab label="Flights" />,
    <Tab label="Vacations" className={classes.secondaryTab} />,
    <Tab label="Flight Passes" className={classes.secondaryTab} />,
    <Tab label="Hotels" className={classes.secondaryTab} />,
    <Tab label="Cars" className={classes.secondaryTab} />,
    <Tab label="My Bookings" className={classes.secondaryTab} />,
    <Tab label="Check in" />,
    <Tab label="Flight Status" />
  ];

  let tabPanels = [
    <TabPanel value={value} index={0} dir={theme.direction}>
      Pick your flight
    </TabPanel>,
    <TabPanel value={value} index={1} dir={theme.direction}>
      Vacations
    </TabPanel>,
    <TabPanel value={value} index={2} dir={theme.direction}>
      Flight Passes
    </TabPanel>,
    <TabPanel value={value} index={3} dir={theme.direction}>
      Hotels
    </TabPanel>,
    <TabPanel value={value} index={4} dir={theme.direction}>
      Cars
    </TabPanel>,
    <TabPanel value={value} index={5} dir={theme.direction}>
      My bookings
    </TabPanel>,
    <TabPanel value={value} index={6} dir={theme.direction}>
      Check in
    </TabPanel>,
    <TabPanel value={value} index={7} dir={theme.direction}>
      Flight Status
    </TabPanel>
  ];

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="Search Tabs"
        >
          {tabs}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        {tabPanels}
      </SwipeableViews>
    </div>
  );
}

export default App;
