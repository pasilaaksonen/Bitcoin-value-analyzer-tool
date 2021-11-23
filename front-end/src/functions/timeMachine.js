import { checkDataGranularity } from "./decreasingStreak"

export const createTableFromDatas2 = (data, differenceInMinutes) => {

    const granularity = checkDataGranularity(differenceInMinutes)

    switch(granularity) {
      case 'hourly':
        let newDataTable = []
        let sortedDatesTable = []
        let finalTable = []
    
        data.prices.forEach(data => {
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
        return finalTable
      case 'daily':
        return data.prices
      default:
        console.log("Something went wrong")

    }
}

export const possibilityCreator = (datalist, newlist, smallestValue) => {
  
  const dataIndex1 = newlist.indexOf(smallestValue)  

  if (dataIndex1 > 0) {
    const splittedList = newlist.slice(dataIndex1)
    const highestValue = Math.max(...splittedList)
    if (highestValue > smallestValue) {
      const dataIndex2 = newlist.indexOf(highestValue)
      return [datalist[dataIndex1][0].toString().slice(4,15), datalist[dataIndex1][1], datalist[dataIndex2][0].toString().slice(4,15), datalist[dataIndex2][1], datalist[dataIndex2][1] - datalist[dataIndex1][1]]
    } else {
      return ["do not include"]
    }
  } else {
    const highestValue = Math.max(...newlist)
    if (highestValue > smallestValue) {
      const dataIndex2 = newlist.indexOf(highestValue)
      return [datalist[dataIndex1][0].toString().slice(4,15), datalist[dataIndex1][1], datalist[dataIndex2][0].toString().slice(4,15), datalist[dataIndex2][1], datalist[dataIndex2][1] - datalist[dataIndex1][1]]
    } else {
      return ["do not include"]
    }
  }
}

export const bestDatesForBuyingAndSelling = (data, differenceInMinutes) => {

  const granularity = checkDataGranularity(differenceInMinutes)
  const datalist = createTableFromDatas2(data,granularity)
  
  const newlist = datalist.map(data => data[1])
  const tempNewList = [...newlist]
  const smallestToHighest = tempNewList.sort((a, b) => a-b)
  const listOfPossibilities = []

  smallestToHighest.forEach(value => {
    listOfPossibilities.push(possibilityCreator(datalist, newlist,value))
  })
  
  const filteredListOfPossibilities = listOfPossibilities.filter(item => !item.includes("do not include"))
  
  if (!filteredListOfPossibilities) {
    return 'It is not worth to buy nor sell bitcoin'
  } else {
    const listOfProfits = filteredListOfPossibilities.map(item => item[4])
    const highestProfit = Math.max(...listOfProfits)
    const highestProfitIndex = listOfProfits.indexOf(highestProfit)
    return `Best day to buy is on ${filteredListOfPossibilities[highestProfitIndex][0]} for ${filteredListOfPossibilities[highestProfitIndex][1]} € and to sell on ${filteredListOfPossibilities[highestProfitIndex][2]} for ${filteredListOfPossibilities[highestProfitIndex][3]} € with profit of ${filteredListOfPossibilities[highestProfitIndex][4]} €/Bitcoin`
  }
}