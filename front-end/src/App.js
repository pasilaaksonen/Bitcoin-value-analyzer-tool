import React, { useState } from 'react'
import axios from 'axios'
import { createTableFromDatas } from './functions/decreasingStreak'
import { dateWithHighestTradingVolume } from './functions/highestTradingVolume'
import { bestDatesForBuyingAndSelling } from './functions/timeMachine'
import DateInputs from './components/DateInputs'
import DecreasingStreak from './components/DecreasingStreak'
import HighestTradingVolume from './components/HighestTradingVolume'
import TimeMachine from './components/TimeMachine'
import './index.css'

function App() {

  const [ startingMessage, setStartingMessage ] = useState("Select starting and ending dates")
  const [ startDate, setStartDate ] = useState(null)
  const [ endDate, setEndDate ] = useState(null)
  const [ differenceInMinutes, setDifferenceInMinutes ] = useState(null)
  const [ decreasingStreak, setDecreasingStreak ] = useState('')
  const [ highestTradingVolume, setHighestTradingVolume ] = useState('')
  const [ timeMachine, setTimeMachine ] = useState('')

  const handleDifferentParts = (data) => {
      setDecreasingStreak(createTableFromDatas(data, differenceInMinutes))
      setHighestTradingVolume(dateWithHighestTradingVolume(data, differenceInMinutes))
      setTimeMachine(bestDatesForBuyingAndSelling(data, differenceInMinutes))
  }

  const handleGetData = () => {

    const urlStartDate = startDate.getTime() / 1000
    const urlEndDate = endDate.getTime() / 1000 + 86400
    setDifferenceInMinutes((urlEndDate - urlStartDate) / 86400)

    axios.get(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${urlStartDate}&to=${urlEndDate}`)
      .then(response => {
        handleDifferentParts(response.data)
      })
      .catch(error => {
        console.log(error)
      })
    setStartingMessage('')
  }

  return (
    <div className='page'>
      <DateInputs 
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        handleGetData={handleGetData}
      />
      { startingMessage && <h2>{startingMessage}</h2>}
      { decreasingStreak && <DecreasingStreak decreasingStreak={decreasingStreak} />}
      { highestTradingVolume && <HighestTradingVolume highestTradingVolume={highestTradingVolume}/>}
      { timeMachine && <TimeMachine timeMachine={timeMachine}/>}
    </div>
  );
}

export default App;
