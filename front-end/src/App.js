import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import  'react-datepicker/dist/react-datepicker.css'
import axios from 'axios'

/* 

  Market cap is the total value of all the coins that have been mined. 
  Price is the current value of a single bitcoin
  Total volumes mean a value for traded bitcoins total in euros

*/

function App() {

  const [ startDate, setStartDate ] = useState(null)
  const [ endDate, setEndDate ] = useState(null)

  const checkPriceDropStreak = (data) => {

    console.log(data)
    let decreaseStreak = 0
    let currentStreak = 0
    let numberToCompare = 0

    data.forEach(data => {
      if (data[1] < numberToCompare) {
        currentStreak ++
        console.log(currentStreak)
        if (decreaseStreak === 0) {
          decreaseStreak ++
        }
        if (decreaseStreak < currentStreak) {
          decreaseStreak = currentStreak
        }
      } else {
        currentStreak = 0
      }
      numberToCompare = data[1]
      console.log(numberToCompare)
    })
    return `The maximum amount of days bitcoin’s price was decreasing ${decreaseStreak} days in a row`
  }

  const checkDataGranularity = (timeDifference) => {
    if (timeDifference > 90) {
      return 'daily'
    } else {
      return 'hourly'
    }
  }

  const createTableFromHours = (datas, differenceInMinutes) => {

    const granularity = checkDataGranularity(differenceInMinutes)
    // console.log(granularity)
    
    switch(granularity) {
      case 'hourly':
        let newDataTable = []
        let sortedDatesTable = []
        let finalTable = []
    
        datas.prices.forEach(data => {
          let dateAndTime = []
          let converted = new Date(data[0])
          dateAndTime.push(converted, data[1])
          newDataTable.push(dateAndTime)
        })
    
        let dates = []
    
        newDataTable.forEach(date => {
          if (!dates.includes(date[0].toString().slice(4,15))) {
            dates.push(date[0].toString().slice(4,15))
          }
        })
    
        dates.forEach(date => {
          let temporary = newDataTable.filter(item => item.toString().includes(date))
          sortedDatesTable.push(temporary)
        })
    
        sortedDatesTable.forEach(item => {
          finalTable.push(item[0])
        })
    
        // console.log(finalTable)
        console.log(checkPriceDropStreak(finalTable))
        break;
      case 'daily':
        console.log(checkPriceDropStreak(datas.prices))
        break;
      default:
        console.log("Something went wrong")
    } 
  }

  const handleGetData = () => {

    const urlStartDate = startDate.getTime() / 1000
    const urlEndDate = endDate.getTime() / 1000 + 86400
    const differenceInMinutes = (urlEndDate - urlStartDate) / 86400

    axios.get(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${urlStartDate}&to=${urlEndDate}`)
      .then(response => {
        createTableFromHours(response.data, differenceInMinutes)
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
    <div className="App">
      <h1>Test Application</h1>
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
  );
}

export default App;
