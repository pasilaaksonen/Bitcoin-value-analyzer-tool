import React from 'react'
import DatePicker from 'react-datepicker'
import  'react-datepicker/dist/react-datepicker.css'

function DateInputs({ startDate, endDate, setStartDate, setEndDate, handleGetData }) {
    return (
        <div>
            <h1>Bitcoin value analyzer tool</h1>
            Start date:
            <DatePicker 
                selected={startDate} 
                onChange={date => setStartDate(date)} 
            />
            End date:
            <DatePicker 
                selected={endDate} 
                onChange={date => setEndDate(date)}
                maxDate={new Date()}
            />
            <button onClick={() => handleGetData()}>Submit</button>
        </div>
    )
}

export default DateInputs
