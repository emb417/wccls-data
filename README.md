# wccls-data

Collecting availability data from [Washington County Cooperative Library Services Catalog](https://catalog.wccls.org/) for titles based on keyword search and branch ids.

## Start Server

1. install node 8.4.0
1. git clone
1. npm i
1. npm start
  * Server creates needed dirs on start
    * Http server logs to logs/access.log
    * Responses output to data/[files].json
  * listens on port 1337
  * uses nodemon to reload with changes in app dir 

## Automation Setup
Automation files are included for Mac OS X.
* com.wccls.News.plist (global LaunchAgent) curls the server at /news every 15 from 9-8 (open hours)

To setup plists, try LaunchControl for nice GUI experience, or show your 1337 skillz with cp and launchctl:
* sudo cp com.wccls.News.plist /Library/LaunchAgents/.
* launchctl load /Library/LaunchAgents/com.wccls.News.plist

Included is a shell script that interacts with messages on a mac:
* imessage.sh is called by an index.js child_process
  * NOTE: make sure this script is executable (hint: chmod)

# Global modules
* server handles logging and routing
* scraper "crawls" the site
* parser uses cheerio to pull data out of the html

# App Modules
The app dir is divided into modules, each including:
* a route in server.js
* a named dir, e.g. news
* an index.js containing the express app
* a config.json for default values 

## News Module
  
### Config Setup
* Modify config.json 
  * branchIds with the ones you frequent
  * msgTo with your messages number (or email address)
  * keywords with the titles you're interested in
    * NOTE: keywords that redirect to a single item will not work

# Example API Usage

### Request:
* curl http://127.0.0.1:1337/now/ps4/9?size=100&sort=MP

#### Router
* /now is the app route

#### Keyword
* /ps4 is the terms or keywords used to search for titles

#### Branch ID
* /9 is the branch id for Beaverton City Library

#### Size
* search results size limit, bigger number means matching against more titles and longer to return results

#### Sort
* supports "MP" for Most Popular or "RELEVANCE"

#### AC (Availability Code Filters)
* In
* In -- Not Holdable
* Held
* Out (does't work yet because of due date dynamics)
* Lost
* Missing
* Transferred
* In-Transit
* On-Order
* In-Repair
* Unavailable

### Response:
```javascript
----BCC----Star Wars battlefront game----In,Lost,Out (Due: 9/9/2017) -- Not Holdable
----BCC----LEGO: Worlds game.----Out (Due: 9/9/2017),Out (Due: 9/6/2017),Out (Due: 9/9/2017) -- Not Holdable,Out (Due: 8/22/2017) -- Not Holdable,In
----BCC----LEGO Marvel Avengers game.----In,In
----BCC----LEGO Jurassic World game.----Lost,Out (Due: 9/3/2017),In,Out (Due: 9/6/2017),Lost -- Not Holdable
----BCC----Hasbro family fun pack game : 4 great games in 1----In,Out (Due: 8/31/2017)
----BCC----LEGO Marvel super heroes game.----In,Lost,Lost -- Not Holdable
----BCC----Super cool tech : technology, invention, innovation----In,Out (Due: 9/18/2017)
----BCC----Shantae game : 1/2 genie hero----In
----BCC----Angry Birds. Star Wars game.----In
----BCC----N.E.R.O. game : Nothing Ever Remains Obscure----In
----BCC----Toki Tori 2+ game----In,In -- Not Holdable
----BCC----Dragonball. Xenoverse XV game.----In,Lost,Lost -- Not Holdable,Lost,Lost -- Not Holdable
```

# Appendix Notes

Availability:
https://catalog.wccls.org/Mobile/Search/Items/1.609225.1.9.1

* 609225 = Item ID
* 9 = Branch ID

Search Form: http://catalog.wccls.org/polaris/search/default.aspx?ctx=1.1033.0.0.6&type=Default

Search Results: http://catalog.wccls.org/polaris/search/searchresults.aspx?ctx=1.1033.0.0.6
* &type=Keyword
* &term=wargames
* &by=KW
* &sort=RELEVANCE
* &limit=
* &query=
* &page=0
* &searchid=1

Set search options:  
* &listboxOrganizations=_all_
* &listboxPublicationDates=_all_
* &listboxMaterialTypes=35
* &listboxTargetAudiences=_all_
* &listboxCollections=_all_
* &listboxLanguages=_all_
* &buttonSetSearchOptions=Set+Search+Options

Material Types:
* Blu-Ray=35
* DVD=21
* Electronic Game=34

Collections:
* Board Games=331
