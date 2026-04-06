import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RangeSelector = ({ start, end, setStart, setEnd }) => {
  return (
    <div className="flex gap-4 mt-4 flex-wrap">

      <div>
        <label>Start Date:</label>
        <DatePicker
          selected={start}
          onChange={(d) => setStart(d)}
          maxDate={new Date()}
          className="p-2 border rounded"
        />
      </div>

      <div>
        <label>End Date:</label>
        <DatePicker
          selected={end}
          onChange={(d) => setEnd(d)}
          maxDate={new Date()}
          className="p-2 border rounded"
        />
      </div>

    </div>
  );
};

export default RangeSelector;