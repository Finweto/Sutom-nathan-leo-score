export default function randomSeedGenerator(){
  //random seed by day 
  const date = new Date()
  const dateToInt = date.getDay()
  return dateToInt
}