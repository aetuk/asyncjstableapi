# asyncjstableapi
This section describes how to use asynchronous table web library API and functionality.

## XML source root
In order to read xml data is should have 4 levels. 

1. Root
2. Table
3. Row
4. Columns

The **Root** node is required as input

```xml
<tableroot>
<tablename>
 <tablerow>
<tablecolumns>
</tablecolumns>
</tablerow>
</tablename>
</tableroot>
```
Column mapping
```javascript
mapping_name = [[ HTML_Column_name, XML_Column_name, column_control,??]]
```
Example mapping,
```javascript
mapping = [[ '', 'PROPID','radioid',null],['PROPID','PROPID','',null]]
```
Putting it all together, 
```javascript
function tabledata(xml) {
	parser = new DOMParser();
	xmlDoc = parser.parseFromString(xml,"text/xml");
	console.dirxml(xmlDoc);

 	// Root node = response
	var message1 = xmlDoc.getElementsByTagName('response')[0];
	
    	//show the message in XML format
    	console.dirxml(message1);
	console.dir(message1);

    	// User defined functions to be activated on certain events : 
	// oncheck , onuncheck and onclickrow 
	var userfnlist = {
		oncheck : 'checkmain',
		onuncheck : 'null',
		onclickrow : 'null',
		rankcol : ''
		}

	var tableop = "refresh";
	var tabledata = message1;
	console.dirxml(tabledata);
	var mapping = null;

	mapping = [
			[
				'date',
				'date',
				'',
				null],
			[
				'hdurl',
				'hdurl',
				'image',
				null],
			[
				'explanation',
				'explanation',
				'',
				null],
			[
				'URL',
				'URL',
				'',
				null
			]
		];
	
	// Append result to HTML component. In this case it is output
	// API asynctable parameters 

  	// 1. tabledata
  	// 2. 'maintable' is the HTML table name
  	// 3. mapping table structure tying the incoming XML with the 
  	// table structure

  	$("#output")
		.append(asynctable(
		tabledata
	  	,'maintable'
		,mapping
		,tableop
		,'1',
    		,userfnlist));

	  tablePaginater
		.init('maintable');
		fdTableSort
		.init('maintable');
	}
  ```
