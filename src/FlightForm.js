import React from "react";
import { format } from "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Card from "@material-ui/core/Card";

import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

/*
  Couldn't find a nice date range picker though would fill the whole screen on mobile, opted for separate date pickers instead.
  Store itinerary in a single state and add to it based on the trip type.
  Upon submission, the data is filtered depending on the trip type.
*/

function ItineraryItem({
  selectedDate,
  handleDateChange,
  from,
  to,
  handleItinChange,
  children
}) {
  return (
    <Card style={{ padding: "16px", marginBottom: "30px" }}>
      <Grid container>
        <Grid item xs={6} md={3}>
          <TextField
            label="FROM"
            value={from}
            name="from"
            onChange={handleItinChange}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            label="TO"
            value={to}
            name="to"
            onChange={handleItinChange}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <DatePicker
            margin="normal"
            label="Departure Date"
            format="MM/dd/yyyy"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </Grid>
        {children}
      </Grid>
    </Card>
  );
}

function ItineraryConfirmationRow({ from, to, date }) {
  return (
    <p>
      {from} to {to} on {date && format(date, "yyyy-MM-dd")}
    </p>
  );
}

export default function FlightForm() {
  // Hooks
  const [itinerary, setItinerary] = React.useState({
    0: {
      id: 0,
      from: "",
      to: "",
      date: null
    },
    1: {
      id: 1,
      from: "",
      to: "",
      date: null
    }
  });
  const [showItinModal, setItinModal] = React.useState(false);
  const [tripType, setTripType] = React.useState("roundTrip");

  // Handlers
  const handleTripTypeChange = ev => {
    setTripType(ev.target.value);
  };

  const handleDateChange = index => date => {
    setItinerary({
      ...itinerary,
      [index]: {
        ...itinerary[index],
        date: date
      }
    });
  };

  const handleItineraryChange = index => ev => {
    const nextItinerary = {
      ...itinerary,
      [index]: {
        ...itinerary[index],
        [ev.target.name]: ev.target.value
      }
    };
    if (tripType === "roundTrip") {
      nextItinerary[1][ev.target.name === "to" ? "from" : "to"] =
        ev.target.value;
    }
    setItinerary(nextItinerary);
  };

  const handleMultiCityAdd = () => {
    const itinLen = Object.keys(itinerary).length;
    setItinerary({
      ...itinerary,
      [itinLen]: {
        id: itinLen,
        from: "",
        to: "",
        date: null
      }
    });
  };

  const openModal = () => {
    setItinModal(true);
  };

  const closeModal = () => {
    setItinModal(false);
  };

  // Helpers
  const multiCityItems = () =>
    Object.values(itinerary).filter(itin => itin.id !== 0);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div>
        {/* Radios */}
        <Grid container>
          <Grid item xs={12} sm="auto">
            <FormControlLabel
              value="oneWay"
              control={<Radio color="primary" />}
              label="One Way"
              labelPlacement="end"
              checked={tripType === "oneWay"}
              onChange={handleTripTypeChange}
            />
          </Grid>
          <Grid item xs={12} sm="auto">
            <FormControlLabel
              value="roundTrip"
              control={<Radio color="primary" />}
              label="Round Trip"
              labelPlacement="end"
              checked={tripType === "roundTrip"}
              onChange={handleTripTypeChange}
            />
          </Grid>
          <Grid item xs={12} sm="auto">
            <FormControlLabel
              value="multiCity"
              control={<Radio color="primary" />}
              label="Multi City"
              labelPlacement="end"
              checked={tripType === "multiCity"}
              onChange={handleTripTypeChange}
            />
          </Grid>
        </Grid>
        {/* Itinerary Items */}
        <Grid container direction="column">
          <ItineraryItem
            from={itinerary[0].from}
            to={itinerary[0].to}
            selectedDate={itinerary[0].date}
            handleDateChange={handleDateChange(0)}
            handleItinChange={handleItineraryChange(0)}
          >
            {tripType === "roundTrip" && (
              <Grid item xs={6} md={3}>
                <DatePicker
                  margin="normal"
                  label="Return date"
                  format="MM/dd/yyyy"
                  value={itinerary[1].date}
                  onChange={handleDateChange(1)}
                />
              </Grid>
            )}
          </ItineraryItem>

          {tripType === "multiCity" &&
            multiCityItems().map(itin => {
              return (
                <ItineraryItem
                  key={itin.id}
                  from={itin.from}
                  to={itin.to}
                  selectedDate={itin.date}
                  handleDateChange={handleDateChange(itin.id)}
                  handleItinChange={handleItineraryChange(itin.id)}
                />
              );
            })}
        </Grid>
        {/* Action buttons */}
        <Grid container justify="space-between" direction="row-reverse">
          <Grid item>
            <Button color="primary" variant="contained" onClick={openModal}>
              Search for Flights
            </Button>
          </Grid>
          {tripType === "multiCity" && (
            <Grid item>
              <Button onClick={handleMultiCityAdd}>Add city</Button>
            </Grid>
          )}
        </Grid>
        {/* Submit Modal */}
        <Dialog open={showItinModal} onClose={closeModal}>
          <DialogContent>
            <Typography variant="h2">Your Itinerary</Typography>
            <br />
            <ItineraryConfirmationRow
              from={itinerary[0].from}
              to={itinerary[0].to}
              date={itinerary[0].date}
            />
            {tripType === "roundTrip" && (
              <ItineraryConfirmationRow
                from={itinerary[0].to}
                to={itinerary[0].from}
                date={itinerary[1].date}
              />
            )}
            {tripType === "multiCity" &&
              multiCityItems().map(itin => {
                return (
                  <ItineraryConfirmationRow
                    from={itin.from}
                    to={itin.to}
                    date={itin.date}
                  />
                );
              })}
          </DialogContent>
        </Dialog>
      </div>
    </MuiPickersUtilsProvider>
  );
}
