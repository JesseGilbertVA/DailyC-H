A simple Discord bot that posts the latest Cyanide and Happiness comic to a specific channel. Currently only sends to one specific channel, but I'll look into branching that out if more interest is shown in having the bot added to multiple servers.

The script is currently run through Windows Task Scheduler, though there are likely better options. It compares the URL obtained from Explosm to the URL in url.txt. If they match, the script ends the process. If they differ, the script updates the .txt file and shares the new comic with the discord. Currently runs every 30 minutes, except on Thursdays.

Explosm does not upload new Cyanide and Happiness comics on Thursdays. Instead of having nothing happen on Thursdays, I opted to select a random comic and share that instead.

The "subscription" aspect of the script is actually managed by a separate support bot I wrote specifically for my main Discord server. In the event anyone is interested in having this bot added to their server, I will remove those messages from the script.