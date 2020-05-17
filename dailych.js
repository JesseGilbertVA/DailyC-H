const rp = require('request-promise');
const cheerio = require('cheerio');
const config = require('./config.json');
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client;
const url = 'http://explosm.net/comics/latest';
const thursURL = 'http://explosm.net/comics/random';


var dayOfWeek = new Date();
var currentDate = dayOfWeek.getDay();

client.on('ready', () =>{
    //Test channel: 693930196474265703
    //Production Channel: 695453825619984414
    const channel = client.channels.cache.get('695453825619984414');
    if (currentDate == 4){
        console.log(thursURL);
        rp(thursURL)
            .then(function (html) {
            // Process html...
            var thComicURL = cheerio('img', html)[1].attribs.src
            var thComic = ('http:' + thComicURL)
            channel.send('<@&695457307219198033> ' + thComic)
            channel.send('Unfortunately, today is Thursday, so there is no new C&H today. Instead, enjoy this randomly selected existing C&H comic! (WARNING: There is a chance of duplicates, but the chances are slim.)')
            channel.send('To subscribe, type "!sub dailych" in the general channel. "!unsub dailych" to stop.')  
            })
            .catch(function (err) {
            // Crawling failed...
            });
    } 
    else{
        rp(url)
            .then(function (html) {
            // Process html...
            var comicurl = cheerio('img', html)[1].attribs.src
            var comic = ('http:' + comicurl)
            fs.readFile(config.urlFile, 'UTF-8', (err, savedURL) => {    
                console.log('Saved URL:' + savedURL);
                if (comic == savedURL){
                    console.log("Duplicate URL detected. Terminating process.")
                    client.destroy();
                }
                else{
                    fs.writeFile(config.urlFile, comic, (err) => {
                        console.log('New URL detected. Updating text file and sending new URL.')
                        channel.send('<@&695457307219198033> ' + comic)
                        channel.send('To subscribe, type "!sub dailych" in the general channel. "!unsub dailych" to stop.')  
                        console.log('Daily C&H sent successfully!');
                    })
                }                
            })                  
        })
            .catch(function (err) {
            // Crawling failed...
        });       
}
})

client.on('message', (message)=>{
    if (message.author == '695057924493541406' && message.content.includes('http://')){
        message.react('⬆️')
        message.react('⬇️')
    }
    if (message.content === 'To subscribe, type "!sub dailych" in the general channel. "!unsub dailych" to stop.'){
        console.log('Process terminating.');
        setTimeout(function() {
            client.destroy()
        }, 3000)
        //client.destroy();
    }
})


client.login(config.token);





