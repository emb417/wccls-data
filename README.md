# wccls-data

Collecting availability data from [Washington County Cooperative Library Services Catalog](https://catalog.wccls.org/) for titles based on keyword search and branch ids.

## Dev Setup

1. install node 8.4.0
1. git clone
1. mkdir data
1. mkdir logs
1. touch logs/access.log
1. mkdir notify
1. touch notify/message.txt
1. npm i
1. npm start

Basic dev server runs on start; using nodemon to reload the express server as you work on your app.  scrape.sh in automation can be configured to search for different keywords, etc.

* Http server logs to logs/access.log
* Responses output to data/[files].json
* Notifications output to notify/message.txt

# Automation Setup
Automation files are included for Mac OS X.  

1. Change the working_dir in each script except imessage.sh
1. chmod 777 scripts
1. Change the paths in each plist
1. Copy com.wccls.Server.plist to /Library/LauchDaemons/.
1. Copy com.wccls.Scrape.plist and com.wccls.Message.plist to /Library/LaunchAgent/.

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
* Out (does't work yet)
* Lost
* Missing
* Transferred
* In-Transit
* Held
* -- Not Holdable (doesn't work yet)
* On-Order
* In-Repair
* Unavailable

### Response:
```javascript
[
  {
    "title": "Ghost in the shell [videorecording (Blu-ray + DVD)]",
    "branch": "Beaverton City Library",
    "items": [
      "Out (Due: 8/22/2017) -- Not Holdable",
      "Held",
      "Transferred",
      "Out (Due: 8/25/2017)"
    ]
  },
  {
    "title": "Ghost in the shell [videorecording (DVD)]",
    "branch": "Beaverton City Library",
    "items": [
      "Out (Due: 8/22/2017) -- Not Holdable",
      "Out (Due: 8/25/2017)",
      "Out (Due: 8/22/2017)",
      "Held"
    ]
  },
  {
    "title": "Ghost in the shell. S.A.C. 2nd gig [videorecording (DVD)] : [season two]",
    "branch": "Beaverton City Library",
    "items": [
      "Out (Due: 9/8/2017)"
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
