# wccls-data

Collecting availability data from [Washington County Cooperative Library Services Catalog](https://catalog.wccls.org/) for titles based on keyword search and branch ids.

## Dev Setup

1. install node 8.4.0
1. git clone
1. npm i
1. npm start
  * Server creates needed dirs and files on start
    * Http server logs to logs/access.log
    * Responses output to data/[files].json
    * Notifications output to notify/message.txt
  * listens on port 1337
  * uses nodemon to reload with changes in app or automation 

# Automation Setup
Automation files are included for Mac OS X.  With a little work, easily ported elsewhere, with the exception of the SMS components (uses messages on macs).  
* com.wccls.Server.plist (global LaunchDaemon) will start the server
* com.wccls.Message.plist (global LaunchAgent) watches for changes in /notify to use messages
* com.wccls.Unhold.plist (global LaunchAgent) runs unhold.sh every 15 from 9-8 (open hours)

To setup plists, try LaunchControl for nice GUI experience, or show your 1337 skillz with cp and launchctl:
* Change the paths in each plist to match the path of server.js
* sudo cp com.wccls.Server.plist /Library/LaunchDaemons/.
* sudo cp com.wccls.Scrape.plist /Library/LaunchAgents/.
* sudo cp com.wccls.Message.plist /Library/LaunchAgents/.
* launchctl load /Library/LaunchDaemons/com.wccls.Server.plist
* launchctl load /Library/LaunchAgents/com.wccls.Message.plist
* launchctl load /Library/LaunchAgents/com.wccls.Scrape.plist

Included are shell scripts that curl the server passing the configs as query params
* global.cfg contains...wait for it...global variables
* start.sh starts the server (not currently used, but could be triggered by an event)
* unhold.sh sources unhold_titles.txt
  * add or remove rows to search for different keywords
  * unhold is pre-configured to search for "In -- Not Holdable"
  * unhold is pre-configured to get availability against top ten results
* notify.sh is called by Message.plist passing messages.txt contents as params to...
  * imessage.sh processes the contents of messages.txt using messages to text msg_to
* onshelf.sh is a prototype...nuf sed...

To setup scripts...
1. Change the working_dir in each script except imessage.sh
1. chmod 777 scripts ;)

## Example API Usage

### Request:
* curl http://127.0.0.1:1337/\?size\=5\&branch\=9\&filter\=In\&keyword\=ghost%20in%20the%20shell

#### Keyword
* terms or keywords used to search for titles

#### Size
* search results size limit, bigger number means matching against more titles and longer to return results

#### Branch IDs
* 9: Beaverton City Library
* 39: Beaverton Murray Scholls
* 34: Cedar Mills Bethany Branch
* 11: Cedar Mills Community Library
* 20: Hillsboro Brookwood
* 19: Hillsboro Shute Park

#### Filters
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
[
  {
    "title": "Passengers [videorecording (Blu-ray)]",
    "branch": "Cedar Mill Bethany Branch Library",
    "items": [
      "In -- Not Holdable"
    ]
  }
]
```

# Appendix

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
