import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateSelector = ({ date, setDate }) => {
  return (
    <div className="mt-4">
      <label>Select Date: </label>
      <DatePicker
        selected={date}
        onChange={(d) => setDate(d)}
        maxDate={new Date()}
        className="p-2 rounded border"
      />
    </div>
  );
};

export default DateSelector;