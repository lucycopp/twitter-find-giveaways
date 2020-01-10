const bot = require('./twitter/bot')

const beautySearchString = ""
const travelSearchString = ""

const searchForBeautyComps = arg => {
    arg === "popular" ? bot.run(beautySearchString, "popular") : bot.run(beautySearchString)
}

const searchForTravelComps = arg => {
    arg === "popular" ? bot.run(travelSearchString, "popular") : bot.run(travelSearchString)
}


switch(process.argv[2]) {
    case "beauty": searchForBeautyComps(process.argv[3]); break;
    case "travel": searchForTravelComps(process.argv[3]); break;
    default: bot.run();
}