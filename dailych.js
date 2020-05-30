// Declaring consts.
const rp = require('request-promise');
const cheerio = require('cheerio');
const config = require('./config.json');
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client;
const url = 'http://explosm.net/comics/latest';
const thursURL = 'http://explosm.net/comics/random';

// Day of week variables to determine if Explosm uploaded a new comic or not.
var dayOfWeek = new Date();
var currentDate = dayOfWeek.getDay();

client.on('ready', () =>{
    // Test channel: 693930196474265703
    // Production Channel: 695453825619984414
    const channel = client.channels.cache.get('695453825619984414');
    if (currentDate == 4){
        console.log(thursURL);
        rp(thursURL)
            .then(function (html) {
            // Process html...
            var thComicURL = cheerio('img', html)[1].attribs.src
            var thComic = ('http:' + thComicURL)
            var encodedThComic = encodeURI(thComic)
            channel.send('<@&695457307219198033> ' + encodedThComic)
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
            var encodedComic = encodeURI(comic);
            fs.readFile(config.urlFile, 'UTF-8', (err, savedURL) => {    
                console.log('Saved URL:' + savedURL);
                if (encodedComic == savedURL){
                    console.log("Duplicate URL detected. Terminating process.")
                    client.destroy();
                }
                else{
                    fs.writeFile(config.urlFile, encodedComic, (err) => {
                        console.log('New URL detected. Updating text file and sending new URL.')
                        channel.send('<@&695457307219198033> ' + encodedComic)
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

// Voting and client termination.
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





