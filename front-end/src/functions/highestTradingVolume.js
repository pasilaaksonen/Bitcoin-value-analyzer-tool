import { checkDataGranularity } from "./decreasingStreak"

const checkHighestTradingVolume = (datalist, granularity) => {

    if (granularity === 'hourly') {
      const newlist = datalist.map(data => data[1])
      const highestValue = Math.max(...newlist)
      const dataIndex = newlist.indexOf(highestValue) 
      return `The highest trading volume was ${newlist[dataIndex]} euros on ${datalist[dataIndex].toString().slice(4,15)}`
    } if (granularity === 'daily') {
        const newlist = datalist.map(data => data[1])
        const highestValue = Math.max(...newlist)
        const dataIndex = newlist.indexOf(highestValue)
        const date = new Date(datalist[dataIndex][0])
        return `The highest trading volume was ${newlist[dataIndex]} euros on ${date.toString().slice(4,15)}`
    }
  }

export const dateWithHighestTradingVolume = (data, differenceInMinutes) => {

    const granularity = checkDataGranularity(differenceInMinutes)

    switch(granularity) {
      case 'hourly':
        let newDataTable = []
        let sortedDatesTable = []
        let finalTable = []
    
        data.total_volumes.forEach(data => {
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
    
        return checkHighestTradingVolume(finalTable, granularity)
      case 'daily':
        return checkHighestTradingVolume(data.total_volumes, granularity)
      default:
        console.log("Something went wrong")
    }
  }