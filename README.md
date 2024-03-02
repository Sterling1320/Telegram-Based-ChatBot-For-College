# Telegram-Based-ChatBot-For-College
You can check out the finished project here - https://t.me/DiemsLUNABot 
I used firebase to deploy the cloud functions which would extract the user input, parse the database for matching queries and then return the required Data.
The code for the cloud function for the library database intent handling is in the index.js file.
If you want to work with different databases at the same time, we need to deploy another cloud function with the required values/parameters. Remember firebase only allows to deploy 1 cloud function at a time in the free tier.
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

************************************************************************IMPORTANT************************************************************************
These files alone are kinda useless as they work only when deployed on a node.js server and they parse databases which are hosted on my firebase console which again interacts with my dialogflow console so these files are for reference purpose only but feel free to use them as you see fit.
