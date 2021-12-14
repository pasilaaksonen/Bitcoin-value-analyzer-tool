export const checkPriceDropStreak = (data) => {

    let decreaseStreak = 0
    let currentStreak = 0
    let numberToCompare = 0

    data.forEach(data => {
      if (data[1] < numberToCompare) {
        currentStreak ++
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
    })
    return `The maximum amount of days bitcoin's price was decreasing was ${decreaseStreak} days in a row`
}

export const checkDataGranularity = (timeDifference) => {
    if (timeDifference > 90) {
      return 'daily'
    } else {
      return 'hourly'
    }
}

export const createTableFromDatas = (datas, differenceInMinutes) => {

    const granularity = checkDataGranularity(differenceInMinutes)
    
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
    

        return checkPriceDropStreak(finalTable)
      case 'daily':
        return checkPriceDropStreak(datas.prices)
      default:
        console.log("Something went wrong")
    } 
}
