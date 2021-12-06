const puppeteer = require('puppeteer');
const dayjs = require('dayjs')
let Scrape = async () => {
    let allMatches = 0;
    let selectedMatches = 0;
    let selectedFalse = 0;
    let selectedTrue = 0;
    let kerror = 0;
    for (let n = 0; n < 5; n++) {
        let url = 'https://soccer365.ru/online/&date=' + dayjs('2021-09-01').add(n, 'day').format('YYYY-MM-DD');
        console.log(dayjs('2021-09-01').add(n, 'day').format('YYYY-MM-DD'))
        const browser = await puppeteer.launch({
            headless: true, // false: enables one to view the Chrome instance in action
            defaultViewport: null, // (optional) useful only in non-headless mode
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ]
        });
        const page = await browser.newPage();
        await page.goto(url);
        await page.waitForTimeout(2000);
        const tar = await page.evaluate(() => {
            target = document.querySelectorAll('.game_block');
            mas = [];
            for (i = 0; i < target.length; i++) {
                mas.push(target[i].id);
            }
            return mas;
        });
        for (i = 0; i < tar.length; i++) {
            try {
                allMatches += 1;
                var btn = '#' + tar[i] + ' > a';
                await page.click(btn);
                await page.waitForTimeout(2000);
                const matchName = await page.evaluate(() => {
                    let team1 = document.querySelector('#game_events > div.block_body_nopadding.padv15 > div.live_game.left > div.live_game_ht > a').innerHTML;
                    let team2 = document.querySelector('#game_events > div.block_body_nopadding.padv15 > div.live_game.right > div.live_game_at > a').innerHTML;
                    let info = document.querySelector('#game_events > div.block_header.bkcenter > h2').innerText;
                    return {
                        team1: team1,
                        team2: team2,
                        //time: time[0].toUpperCase() + time.slice(1),
                        info: info
                    }
                })
                const result = await page.evaluate(() => {
                    let team1match1result1 = document.querySelectorAll('.live_block_hf')[0].querySelector('div.result > div.ht > div.gls').innerHTML;
                    let team1match1result2 = document.querySelectorAll('.live_block_hf')[0].querySelector('div.result > div.at > div.gls').innerHTML;
                    let team1match1time = document.querySelectorAll('.live_block_hf')[0].querySelector('div.status > span').innerHTML;
                    let team1match1name = document.querySelectorAll('.live_block_hf')[0].querySelector('div.ht > div.name > div > span').innerHTML + ' - ' +
                        document.querySelectorAll('.live_block_hf')[0].querySelector('div.at > div.name > div > span').innerHTML;

                    let team1match2result1 = document.querySelectorAll('.live_block_hf')[0].querySelectorAll('div.result > div.ht > div.gls')[1].innerHTML;
                    let team1match2result2 = document.querySelectorAll('.live_block_hf')[0].querySelectorAll('div.result > div.at > div.gls')[1].innerHTML;
                    let team1match2time = document.querySelectorAll('.live_block_hf')[0].querySelectorAll('div.status > span')[1].innerHTML;
                    let team1match2name = document.querySelectorAll('.live_block_hf')[0].querySelectorAll('div.ht > div.name > div > span')[1].innerHTML + ' - ' +
                        document.querySelectorAll('.live_block_hf')[0].querySelectorAll('div.at > div.name > div > span')[1].innerHTML;

                    let team2match1result1 = document.querySelectorAll('.live_block_hf')[1].querySelector('div.result > div.ht > div.gls').innerHTML;
                    let team2match1result2 = document.querySelectorAll('.live_block_hf')[1].querySelector('div.result > div.at > div.gls').innerHTML;
                    let team2match1time = document.querySelectorAll('.live_block_hf')[1].querySelector('div.status > span').innerHTML;
                    let team2match1name = document.querySelectorAll('.live_block_hf')[1].querySelector('div.ht > div.name > div > span').innerHTML + ' - ' + document.querySelectorAll('.live_block_hf')[1].querySelector('div.at > div.name > div > span').innerHTML;

                    let team2match2result1 = document.querySelectorAll('.live_block_hf')[1].querySelectorAll('div.result > div.ht > div.gls')[1].innerHTML;
                    let team2match2result2 = document.querySelectorAll('.live_block_hf')[1].querySelectorAll('div.result > div.at > div.gls')[1].innerHTML;
                    let team2match2time = document.querySelectorAll('.live_block_hf')[1].querySelectorAll('div.status > span')[1].innerHTML;
                    let team2match2name = document.querySelectorAll('.live_block_hf')[1].querySelectorAll('div.ht > div.name > div > span')[1].innerHTML + ' - ' + document.querySelectorAll('.live_block_hf')[1].querySelectorAll('div.at > div.name > div > span')[1].innerHTML;
                    let finalResult = document.querySelector('#game_events > div.block_body_nopadding.padv15 > div.live_game.left > div.live_game_goal > span').innerHTML + ' : ' + document.querySelector('#game_events > div.block_body_nopadding.padv15 > div.live_game.right > div.live_game_goal > span').innerHTML;
                    return {
                        team1match1: team1match1result1 + ' : ' + team1match1result2,
                        team1match1info: team1match1time + ' ' + team1match1name + ' (' + team1match1result1 + ' : ' + team1match1result2 + ')',
                        team2match1: team2match1result1 + ' : ' + team2match1result2,
                        team2match1info: team2match1time + ' ' + team2match1name + ' (' + team2match1result1 + ' : ' + team2match1result2 + ')',
                        team1match2: team1match2result1 + ' : ' + team1match2result2,
                        team1match2info: team1match2time + ' ' + team1match2name + ' (' + team1match2result1 + ' : ' + team1match2result2 + ')',
                        team2match2: team2match2result1 + ' : ' + team2match2result2,
                        team2match2info: team2match2time + ' ' + team2match2name + ' (' + team2match2result1 + ' : ' + team2match2result2 + ')',
                        finalResult: finalResult
                    }
                })
                const positionsExist = await page.evaluate(() => {
                    if (document.querySelector('#main_container > div.tabs_items').childNodes[3].innerText == 'Таблица Live') {
                        exist = true;
                    } else {
                        exist = false;
                    }
                    return exist;
                })
                let position1 = 'no info';
                let position2 = 'no info';
                if (positionsExist == true) {
                    await page.click('#main_container > div.tabs_items > span.tabs_item.js');
                    await page.waitForTimeout(2000);
                    const getPosition = await page.evaluate(() => {
                        position1 = document.querySelectorAll('.active')[1].querySelector('.plc').innerHTML;
                        position2 = document.querySelectorAll('.active')[2].querySelector('.plc').innerHTML;
                        return {
                            first: position1,
                            second: position2,
                        }
                    })
                    position1 = getPosition.first;
                    position2 = getPosition.second;
                }
                let time = Number(matchName.info[matchName.info.length - 5] + matchName.info[matchName.info.length - 4]);
                //let match1Date = result.match1info[3] + result.match1info[4] + '.' + result.match1info[0] + result.match1info[1]
                //let match2Date = result.match2info[3] + result.match2info[4] + '.' + result.match2info[0] + result.match2info[1]
                //var nowYear = dayjs().format('YYYY');
                let date1IsNorm = true
                let date2IsNorm = true
                //let now = dayjs();
                //let ago1 = dayjs(nowYear + '.' + match1Date).from(now);
                //let ago2 = dayjs(nowYear + '.' + match2Date).from(now);
                //if(ago1.includes('months') ||  ago1.includes('years')){
                //    date1IsNorm = false;
                //}
                //if(ago2.includes('months') || ago2.includes('years')){
                //    date2IsNorm = false;
                //}
                //ago1 = Number(ago1.slice(0, ago1.indexOf(" "))) - 1;
                //ago2 = Number(ago2.slice(0, ago2.indexOf(" "))) - 1;
                //if(ago1 > 14){
                //    date1IsNorm = false;
                //}
                //if(ago2 > 14){
                //    date2IsNorm = false;
                //}
                //console.log(ago1, ago2)
                //console.log(time, match1Date, match2Date);
                let verdict = false;
                if ((result.team1match1 == '0 : 0' && result.team1match2 == '0 : 0') && date1IsNorm) {
                    verdict = true;
                }
                if ((result.team2match1 == '0 : 0' && result.team2match2 == '0 : 0') && date2IsNorm) {
                    verdict = true;
                }
                if ((result.team1match1 == '0 : 0' && result.team2match1 == '0 : 0') && date1IsNorm && date2IsNorm) {
                    verdict = true;
                }
                if (verdict && (time > 8)) {
                    selectedMatches += 1
                    perenos = `
`
                    s = String(selectedMatches) + ') ' + matchName.team1 + ` vs ` + matchName.team2 + perenos + perenos + matchName.info + perenos + position1 + ' и ' + position2 + perenos + perenos + result.team1match1info + perenos + result.team1match2info + perenos + result.team2match1info + perenos + result.team2match2info + perenos + perenos + 'Итог: ' + result.finalResult;
                    if(result.finalResult == '0 : 0'){
                        selectedFalse += 1;
                    }
                    else{
                        selectedTrue += 1;
                    }
                    console.log(s)

                }

                console.log('Checked match #' + allMatches)
                await page.goto(url);
                await page.waitForTimeout(3000);
            } catch {
                console.log('error on ' + String(i));
                kerror += 1;
                await page.goto(url);
                await page.waitForTimeout(2000);
            }
        }
        await browser.close();
    }
    console.log('Всего матчей: ' + String(allMatches));
    console.log('Всего выбрано: ' + String(selectedMatches));
    console.log('Угадано: ' + String(selectedTrue));
    console.log('Провалено: ' + String(selectedFalse));
    console.log('Error in: ' + String(kerror));
}
Scrape()