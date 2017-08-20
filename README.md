# wccls-data

Collecting "Not Holdable" availability data from [Washington County Cooperative Library Services Catalog](https://catalog.wccls.org/) for titles based on keyword search and branch ids.

## Example Usage

### Request:
* curl http://127.0.0.1:1337/\?size\=5\&branch\=9\&keyword\=ghost%20in%20the%20shell

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

### Routing Examples
* support for routing
  * localhost:1337/keyword/:keyword/size/:size/branch/:branch
* To request available at all branches
  * curl localhost:3000/keyword/wargames
  * curl localhost:3000/keyword/logan
* To request availability at all branches using search results size limits
  * curl localhost:3000/keyword/wargames/size/50
  * curl localhost:3000/keyword/wargames/size/10
* To request availability for a specific branch
  * curl localhost:3000/keyword/wargames/branch/20
  * curl localhost:3000/keyword/wargames/branch/9
* To request availability for a specific branch using search results size limits
  * curl localhost:3000/keyword/wargames/size/10/branch/20
  * curl localhost:3000/keyword/wargames/size/10/branch/9


## Dev Setup

1. git clone
1. npm i
1. npm start

Basic dev server runs on start; using nodemon to reload the express server as you work on your app.

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
