import listToTab from './listToTab'
import randomSeedGenerator from './randomSeedGenerator'

export default function chooseTodaysWord(){
    
    const tabOfWords = listToTab()
    const seed = randomSeedGenerator()

    const index = seed%tabOfWords.length*500
    let todaysWord = tabOfWords[index]
    console.log(todaysWord)

    return todaysWord
}