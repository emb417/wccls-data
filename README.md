# wccls-data

Collecting "Not Holdable" availability data from [Washington County Cooperative Library Services Catalog](https://catalog.wccls.org/) for titles based on keyword search and branch ids.

## Example Usage

### Request:
* curl localhost:3000/keyword/logan

### Response:
```javascript
[{"title":"Logan [videorecording (Blu-ray + DVD)]","branch":"Beaverton City Library","items":["Out (Due: 8/23/2017)"]},{"title":"Logan [videorecording (Blu-ray + DVD)]","branch":"Beaverton Murray Scholls","items":["Out (Due: 8/22/2017)"]},{"title":"Logan [videorecording (Blu-ray + DVD)]","branch":"Cedar Mill Bethany Branch Library","items":["Out (Due: 8/26/2017)"]},{"title":"Logan [videorecording (Blu-ray + DVD)]","branch":"Cedar Mill Community Library","items":["Out (Due: 8/24/2017)"]},{"title":"Logan [videorecording (DVD)]","branch":"Beaverton City Library","items":["Out (Due: 8/22/2017)"]},{"title":"Logan [videorecording (DVD)]","branch":"Cedar Mill Bethany Branch Library","items":["Out (Due: 8/22/2017)"]},{"title":"Logan [videorecording (DVD)]","branch":"Cedar Mill Community Library","items":["Out (Due: 8/22/2017)"]}]
```

### Other Request Examples
* To request available at all branches
  * curl localhost:3000/keyword/wargames
  * curl localhost:3000/keyword/logan
  * curl localhost:3000/keyword/ghost%20in%20the%20shell
* To request availability only for a specific branch
  * curl localhost:3000/keyword/wargames/branch/20
  * curl localhost:3000/keyword/wargames/branch/9
* Or you can request via query params (WIP to support size and branch)
  * curl localhost:3000/?keyword=logan

### Branch IDs
* 9: Beaverton City Library
* 39: Beaverton Murray Scholls
* 34: Cedar Mills Bethany Branch
* 11: Cedar Mills Community Library
* 20: Hillsboro Brookwood
* 19: Hillsboro Shute Park

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
