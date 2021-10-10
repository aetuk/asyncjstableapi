/* This website and its content is copyright of Web and Server Solution - © Web and Server Solution 2012. All rights reserved.
Any redistribution or reproduction of part or all of the contents in any form is prohibited.
You may not, except with our express written permission, distribute or commercially exploit 
the content. Nor may you transmit it or store it in any other website or other 
form of electronic retrieval system.
 */

(function() {

	// 1. Only include rows as stated by mapping -- pending
	// 2. Give check box or radio button option -- in progress --
	// 3. All for external function via string - 'function(a)'
	// 4. Remove ie7 option
	asynctable = function(targetNode, tablename, mapping_array, optype,
			rowsperpage, userRowfunctions) {
		// if the targetNode is xmlNode this line must be removed
		// i couldnt find a way to parse xml string to xml node
		// so i parse xml string to xml document

		$("#debug").append("asynctable\n");
		var tableexists = false;
		var headerexists = false;
		var chkchk = -1;
		var rdbchk = -1;
		var idchk = -1;
		var hdchk = -1;
		var imgchk = -1;
		var vidchk = -1;
		var idindx = -1;
		var idindx2 = -1;
		var formchk = -1;
		var formindx = -1;
		
		var chkbxindx = 0;
		var isIndx = false;
		isSort = false;
		var secondarg = null;
		var rowexist = false;
		var deleteop = false;
		var filterrow = false;
		var deletetickop = false;
		var refreshop = false;
		var dataexists = false;
		var tHead = null;
		var tBody = null;
		var tFoot = null;
		var classstring = "";
		var headerrows = 0;
		var bodyrows = 0;
		var row = null;
		var erow = null;
		var isData = true;
		//var chkbxindx2 = 0;
		var isUserFnIndx = 0;
		// var extchkbxid = null;
		var userfnlst = null;
		var isUserFn = false;
		var imgconfig = null;
		var vidconfig = null;
		var image = null;
		var video = null;
		var columnCount = 0;

		var headCell = null;
		var headRow = null;
		var footRow = null;
		var rowCount = null;

		var tblcolname = null;
		var xmllabel = null;

		// Op handling
		if (optype) {
			// There could also be an insert op
			if (optype.indexOf("delete") > -1)
				deleteop = true;

			if (optype.indexOf("refresh") > -1)
				refreshop = true;
			// TODO : Set tableexits to false - if in refresh mode

			// There could also be an insert op
			if (optype.indexOf("removeticks") > -1)
				deletetickop = true;
		}

		if (rowsperpage) {
			// There could also be an insert op
			classstring = " paginate-" + rowsperpage;
		}

		if (userRowfunctions.rankcol) {
			// There could also be an insert op
			classstring = " sortable-onload-" + userRowfunctions.rankcol
					+ classstring;
			isSort = true;

		}
		
		if (userRowfunctions.rootelement) {
			var target = targetNode.getElementsByTagName(userRowfunctions.rootelement);
			var wrap = document.createElement(userRowfunctions.rootelement);
			wrap.appendChild(target[0]);
			targetNode = wrap;
		}

		// targetNode = targetNode[0];
		targetNode = cleanup(targetNode);

		if (targetNode.childNodes[0] != null) {
			targetNode = targetNode.childNodes[0];

			if (targetNode.childNodes[0] != null) {
				columnCount = targetNode.childNodes[0].childNodes.length;
				rowCount = targetNode.childNodes.length;
			} else {
				isData = false;
			}
		} else {
			isData = false;
		}

		if (!isData) {
			if (refreshop) {
				myTable = document.getElementById(tablename);
				if (myTable) {
					tBody = myTable.getElementsByTagName('tbody')[0];
					for ( var ri = tBody.rows.length - 1; ri > -1; ri--) {
						tBody.deleteRow(ri);
					}
				}
			}
			return;
		}
		// $("#debug").append("targetNode.nodeName :" + targetNode.nodeName +
		// "\n");

		// name for the table
		// Check if table exists here
		// $("#debug").append("tablename :" + tablename + "\n");
		var myTable = null;

		// if (!refreshop)
		myTable = document.getElementById(tablename);

		// TODO : Set tableexits to false - if in refresh mode
		if (myTable) {

			headerrows = myTable.getElementsByTagName('thead')[0]
					.getElementsByTagName('tr').length;
			bodyrows = myTable.getElementsByTagName('tbody')[0]
					.getElementsByTagName('tr').length;
			tBody = myTable.getElementsByTagName('tbody')[0];

			if (refreshop) {
				for ( var ri = tBody.rows.length - 1; ri > -1; ri--) {
					tBody.deleteRow(ri);
				}
			}

			tableexists = true;
			// var tablerows = myTable.rows.length;
			$("#debug").append("The tableexists1 Rows(" + headerrows + ")\n");

			if (headerrows > 0) {
				headerexists = true;
				tableexists = true;
				$("#debug").append("The header exists: " + bodyrows + "\n");
				if ((tBody) && (bodyrows > 0)) {
					dataexists = true;
					$("#debug").append(
							"The header dataexists: " + dataexists + "\n");

				} else if (!tBody) {
					dataexists = false;
					tBody = document.createElement('tbody');
					myTable.appendChild(tBody);
				}

			} else {
				tHead = document.createElement("thead");
				tBody = document.createElement("tbody");
				tFoot = document.createElement("tfoot");
				myTable.appendChild(tHead);
				myTable.appendChild(tBody);
				myTable.appendChild(tFoot);

				// myTable.border = 1;
				// myTable.borderColor = "green";
				// myTable.id = tablename;
				// myTable.className = tablename + classstring;

				headRow = document.createElement('tr');
				tHead.appendChild(headRow);
				footRow = document.createElement('tr');
				tFoot.appendChild(footRow);
			}
		} else {
			$("#debug").append("not tableexists\n");

			myTable = document.createElement('table');
			tHead = document.createElement("thead");
			tBody = document.createElement("tbody");
			tFoot = document.createElement("tfoot");

			myTable.appendChild(tHead);
			myTable.appendChild(tBody);
			myTable.appendChild(tFoot);

			myTable.border = 1;
			// myTable.borderColor = "green";
			myTable.id = tablename;
			// myTable.className = tablename;
			myTable.className = tablename + classstring;

			// firstCell.colSpan = columnCount;
			// firstCell.innerHTML = tablename;
			// name for the columns

			headRow = document.createElement('tr');
			tHead.appendChild(headRow);
			var footRow = document.createElement('tr');
			tFoot.appendChild(footRow);

			// Footer handling - start
			// var onclickFooter1 = "pageexample('previous'); return false;";
			// var onclickFooter2 = "pageexample('next'); return false;";
			// var footRow = tFoot.insertRow(-1);
			// var newFooterCell1 = footRow.insertCell(-1);
			// var newFooterCell2 = footRow.insertCell(-1);

			/*
			 * var anchor1 = document.createElement('a'); anchor1.href='#';
			 * anchor1.innerHTML = "previous"; anchor1.setAttribute("onclick",
			 * onclickFooter1); var anchor2 = document.createElement('a');
			 * anchor2.href='#'; anchor2.innerHTML = "next";
			 * anchor2.setAttribute("onclick", onclickFooter2);
			 * newFooterCell1.appendChild(anchor1);
			 * newFooterCell1.appendChild(anchor2);
			 */

			/*
			 * newFooterCell1.className = "table-page:previous"
			 * newFooterCell1.style.cursor = "pointer" newFooterCell1.innerHTML =
			 * "previous"; newFooterCell2.className = "table-page:next";
			 * newFooterCell2.style.cursor = "pointer" newFooterCell2.innerHTML =
			 * "next";
			 */

		}

		// Fix issue

		var labelcheck = false;
		idchk = -1;
		isUserFnIndx = -1;
		isUserFn = false;

		for ( var m = 0; mapping_array.length > m; m++) {
			// Handle mapping here
			// if (mapping_array)
			// {
			// for (var m = 0; mapping_array.length > m; m++)
			for ( var i = 0; i < columnCount; i++) {
				tblcolname = mapping_array[m][0];
				xmllabel = mapping_array[m][1];
				var type = mapping_array[m][2];
				// userfnlst = mapping_array[m][3];

				// TODO hidden check here
				hdchk = type.indexOf("covered");
				var chkindchk = type.indexOf("checkbox");
				// rdbchk = type.indexOf("radio");
				idchk = type.indexOf("id");
				imgchk = type.indexOf("image");
				vidchk = type.indexOf("video");
				formchk = type.indexOf("form");

				//$("#debug").append("idchk :" + idchk + "\n");

				if (idchk > -1) {
					idindx = m;
					isIndx = true;
				}

				if (imgchk > -1) {
					imgindx = m;
					imgconfig = type;
				}
				
				if (vidchk > -1) {
					vidindx = m;
					vidconfig = type;
				}


				if (chkindchk > -1) {
					chkbxindx = m;
					//chkbxindx2 = m;
				}
				
				if (formchk > -1) {
					formindx = m;
				}

				if (mapping_array[m][3] != null) {

					userfnlst = mapping_array[m][3];
					if (isFunction(userfnlst.checkvalue)) {
						//$("#debug").append("column function exists\n");
					
						if (!targetNode.childNodes[0].childNodes[i])
						{
							$("#debug").append("targetNode.childNodes[i2].childNodes[j] is null\n");
							isUserFn = false;

						} else if (xmllabel == targetNode.childNodes[0].childNodes[i].nodeName) {
							isUserFn = true;
							isUserFnIndx = i;

						}
					}
				}
				
				if (!targetNode.childNodes[0].childNodes[i])
				{
					$("#debug").append("targetNode.childNodes[i2].childNodes[j] is null\n");
					labelcheck = false;
					break;
				} else if (xmllabel == targetNode.childNodes[0].childNodes[i].nodeName) 
				{
					labelcheck = true;
					break;
				}
			}

			if (!labelcheck)
			{
				$("#debug").append("xmllabel " + xmllabel + " not found in targetNode - place holder element added \n");
				var newel=document.createElement(xmllabel);
				var newtext=document.createTextNode(' ');
				newel.appendChild(newtext);
				targetNode.childNodes[0].appendChild(newel);
				labelcheck = true
			}
			
			if (!headerexists) {
				headCell = document.createElement("TH");
			}
			if (labelcheck && !headerexists) {
				if (hdchk > -1) {
					headCell.style.display = 'none';
				}

				if (isSort)
					headCell.className = "sortable";

				headCell.innerHTML = tblcolname;
				headRow.appendChild(headCell);
			}
			labelcheck = false;
		}

		// Check if table exists here - close
		// now fill the rows with data - go through xml
		for ( var i2 = 0; i2 < rowCount; i2++) {
			// $("#debug").append("Before Row exists check tableexists("+
			// tableexists + ")" + "idchk" + "(" + idchk + ")\n");

			if (dataexists) {
				//$("#debug").append("dataexists exists1\n");
				if (isIndx) {
					if (idindx > -1) {

						row = findrow(
								tablename,
								targetNode.childNodes[i2].childNodes[idindx].firstChild.nodeValue);
						if (row) {
							// $("#debug").append("Row exists idindx2 :" +
							// idindx +
							// ": tablename :" + tablename + "\n");
							rowexist = true;
						} else {
							// $("#debug").append("Row does not exists idindx2
							// :" +
							// idindx + " : tablename :" + tablename + "\n");
							rowexist = false;
						}
					} else {
						rowexist = false;
					}
				}
			}

			filterrow = false;

			if (isUserFn) {
				if ((isUserFnIndx > -1) && (userfnlst != null)) {
					//$("#debug").append("column function exists1\n");
					if (userfnlst
							.checkvalue(targetNode.childNodes[i2].childNodes[isUserFnIndx].firstChild)) {
						filterrow = true;
					}
				}

			}

			if (rowexist) {
				// $("#debug").append("The rowexist\n");

				// TODO : include
				// if(userfnlst != null)
				// if (isFunction(userfnlst.deleteRow)) {
				//	
				// if (userfnlst.deleteRow())
				// {
				// tBody.deleteRow((row.rowIndex));
				// }
				// }
				if (deleteop || filterrow) {
					row.parentNode.removeChild(row);
				} else if (deletetickop) {

					var fchkbxid = "checkbox"
							+ tablename
							+ targetNode.childNodes[i2].childNodes[chkbxindx].firstChild.nodeValue;

					//$("#debug").append("chkbxid :" + fchkbxid + " : \n");
					var chkbx = find2(row, fchkbxid);
					if (chkbx) {
						chkbx.checked = false;
					}
				} else {
					for ( var m = 0; mapping_array.length > m; m++) {
						tblcolname = mapping_array[m][0];
						xmllabel = mapping_array[m][1];
						var type = mapping_array[m][2];
						// userfnlst = mapping_array[m][3];

						chkchk = type.indexOf("checkbox");
						rdbchk = type.indexOf("radio");
						hdchk = type.indexOf("covered");
						imgchk = type.indexOf("image");
						vidchk = type.indexOf("video");
						formchk = type.indexOf("form");

						// Ignore checkboxes or radio buttons
						if ((chkchk == -1) || (rdbchk == -1)) {
							for ( var j = 0; j < columnCount; j++) {
								if (xmllabel == targetNode.childNodes[0].childNodes[j].nodeName) {
									/*
									 * $("#debug").append( "The rowexist
									 * xmllabel1(" + xmllabel + ")\n");
									 */

									erow = find(row, xmllabel);

									if (erow != null) {
	
										if (targetNode.childNodes[i2].childNodes[j].firstChild != null)
											erow.innerHTML = targetNode.childNodes[i2].childNodes[j].firstChild.nodeValue;
									}
								}
							}
						}
					}
				}
			} else if (!deleteop && !filterrow) {
		
				var newRow = document.createElement('tr');
				tBody.appendChild(newRow);

				// Move mapping check logic here
				for ( var m = 0; mapping_array.length > m; m++) {

					for ( var j = 0; j < columnCount; j++) {
						tblcolname = mapping_array[m][0];
						xmllabel = mapping_array[m][1];
						var type = mapping_array[m][2];
						// userfnlst = mapping_array[m][3];

						chkchk = type.indexOf("checkbox");
						rdbchk = type.indexOf("radio");
						idchk = type.indexOf("id");
						hdchk = type.indexOf("covered");
						imgchk = type.indexOf("image");
						formchk = type.indexOf("form");
						vidchk = type.indexOf("video");

						// use different idindx here
						if (idchk > -1) {
							idindx2 = m;
						} else {
							idindx2 = -1;
						}

						if (imgchk > -1) {
							imgindx = m;
							imgconfig = type;
						}

						if (vidchk > -1) {
							vidindx = m;
							vidconfig = type;
						}

						
						if (formchk > -1) {
							formindx = m;
						}
						
						//TODO - checks be performed on i2 and not 0 - then we can handle gaps in the data 
						// using the above/below routine

						if (!targetNode.childNodes[i2].childNodes[j])
						{
							$("#debug").append("targetNode.childNodes[i2].childNodes[j] is null\n");
							labelcheck = false;
							break;
						} else if (xmllabel == targetNode.childNodes[i2].childNodes[j].nodeName) {
							labelcheck = true;
							break;
						}

						// TODO : include delete row fucntionality
						// if(userfnlst != null)
						// if (isFunction(userfnlst.deleteRow)) {
						//	
						// if (userfnlst.deleteRow())
						// {
						// labelcheck = false;
						// }
						// }
						//

					}

					if (!labelcheck)
					{
						$("#debug").append("xmllabel " + xmllabel + " not found in targetNode - place holder element added \n");
						var newel=document.createElement(xmllabel);
						var newtext=document.createTextNode(' ');
						newel.appendChild(newtext);
						targetNode.childNodes[i2].appendChild(newel);
						labelcheck = true
					}
					
					if (labelcheck) {
					
						if (j == idindx2) {
							newRow
									.setAttribute(
											'id',
											targetNode.childNodes[i2].childNodes[j].firstChild.nodeValue);

							// get old onclick attribute
							var onclick = newRow.getAttribute("onclick");

							// Change second arg based on where check /radio
							// button exists
							if (chkchk > -1) {
								secondarg = "checkbox"
										+ tablename
										+ targetNode.childNodes[i2].childNodes[j].firstChild.nodeValue;
							} else if (rdbchk > -1) {
								secondarg = "radio"
										+ tablename
										+ targetNode.childNodes[i2].childNodes[j].firstChild.nodeValue;
							} else {
								secondarg = targetNode.childNodes[i2].childNodes[j].nodeName;
							}

							/*
							 * var exestring3 = "onCheckRow('" + tablename +
							 * "','" +
							 * targetNode.childNodes[i2].childNodes[j].firstChild.nodeValue +
							 * "','" + secondarg + "','#F0F0F0', " +
							 * userRowfunctions.oncheck + "," +
							 * userRowfunctions.onuncheck + "," +
							 * userRowfunctions.onclickrow + ");";
							 */

							var exestring3 = "onCheckRow('"
									+ tablename
									+ "','"
									+ targetNode.childNodes[i2].childNodes[j].firstChild.nodeValue
									+ "','" + secondarg + "',"
									+ userRowfunctions.onclickrow + ");";

							// if onclick is not a function, it's not IE7, so
							// use setAttribute
							// if(typeof(onclick) != "function") {
							if (true) {
								newRow.setAttribute('onclick', exestring3
										+ onclick); // for FF,IE8,Chrome

								// if onclick is a function, use the IE7 method
								// and call onclick() in the anonymous function
							} else {
								// Work in progress
								onCheckRow4 = function(tablename, row_id,
										check_id, default_color, userfn) {
									if (document.getElementById(check_id)) {
										if (document.getElementById(check_id).checked) {
											findrow(tablename, row_id).bgColor = '#E2E6A8';
										} else {
											findrow(tablename, row_id).bgColor = default_color;
										}

										userfn(tablename, check_id, row_id);
									}
								};

								var createClickHandler = function(tablename,
										targetNode, secondarg, userRowfunctions) {
									return function() {
										onClickRow4(
												tablename,
												targetNode.childNodes[i2].childNodes[j].firstChild.nodeValue,
												secondarg, '#F0F0F0',
												userRowfunctions);
									};
								};

								newRow.onclick = userRowfunctions(
										tablename,
										targetNode.childNodes[i2].childNodes[j].firstChild.nodeValue,
										secondarg, '#F0F0F0', userRowfunctions);

								// newRow.onclick =
								// function(targetNode,secondarg,userRowfunctions
								// ) {
								// onClickRow3(targetNode.childNodes[i2].childNodes[j].firstChild.nodeValue
								// ,secondarg
								// ,'#F0F0F0'
								// ,userRowfunctions);
								// onclick();
								// }; // for IE7

							}
						}

						// TODO : Change j to m -here
						var newCell = document.createElement("TD");
						newRow.appendChild(newCell);

						// May need to convert j==0 entry to checkbox or radio
						// button
						if (chkchk > -1) {
							var checkbox = document.createElement("input");
							checkbox.type = "checkbox";
							checkbox.name = tblcolname;
							// id needs to be modified i.e + c
							checkbox.id = "checkbox"
									+ tablename
									+ targetNode.childNodes[i2].childNodes[j].firstChild.nodeValue;
							// extchkbxid = checkbox.id;

							// set onlick functionality here for oncheck and
							// onuncheck

							var cbstring = "onCheckBox('"
									+ tablename
									+ "','"
									+ targetNode.childNodes[i2].childNodes[j].firstChild.nodeValue
									+ "','" + secondarg + "', "
									+ userRowfunctions.oncheck + ","
									+ userRowfunctions.onuncheck + ");";

							var onclickc = checkbox.getAttribute("onclick");

							checkbox.setAttribute('onclick', cbstring
									+ onclickc);

							newCell.appendChild(checkbox);

						} else if (rdbchk > -1) {
							var radio = document.createElement("input");
							radio.type = "radio";
							radio.name = tblcolname;
							// id needs to be modified i.e + r
							radio.id = "radio"
									+ tablename
									+ targetNode.childNodes[i2].childNodes[j].firstChild.nodeValue;
							newCell.appendChild(radio);
						} else if (imgchk > -1) {

							// var obj = document.createElement("object");
							//var img = document.createElement("img");
							var img = new Image();

							if (imgconfig.indexOf("base64") > -1) {
								image = imgconfig
										+ ","
										+ targetNode.childNodes[i2].childNodes[j].firstChild.nodeValue;

								var canvas = document.createElement("canvas");
								
								//TODO change this
								//canvas.width = img.width;
								//canvas.height = img.height;
								
								var ctx = canvas.getContext("2d");
								img.onload = function() {
									/*ctx.drawImage(img, 0, 0, canvas.width,
											canvas.height);*/
									
									ctx.drawImage(img, 0, 0);
								};
							}  else {
								
								
								//$("#debug").append("not base64 path\n\n");
								image = targetNode.childNodes[i2].childNodes[j].firstChild.nodeValue;
								
								//var imprpoc = function() {	$("#debug").append("image is loaded\n"); getBase64Image3('http://wass.freehostia.com/plogger/images/prodrec/items/soundcard.jpg',newCell);};
								//var imprpoc = function() {	$("#debug").append("image is loaded\n");};
								
								
								//img.addEventListener("load", function() {	$("#debug").append("image is loaded\n");}, false);
								//img.setAttribute("onload", $("#debug").append("onload image is loaded\n"));
								//img.setAttribute("onload", 'getBase64Image3('+ "'" + 'http://wass.freehostia.com/plogger/images/prodrec/items/soundcard.jpg' + "'" + ')');
								//img.setAttribute("onload", imprpoc);
								
							}
		
							
							img.name = tblcolname;
							img.id = "img" + tblcolname;
							img.setAttribute("alt", tblcolname);
							//img.setAttribute("src", image);
							img.src = image;
							
							/*$("#debug").append("IMG called\n");
							
							if (img.complete || img.readyState === 4) {
							    // image is cached
								$("#debug").append("img is cached\n");
							}
							else {
								$("#debug").append("img is not cached\n");
							}*/
							
							newCell.appendChild(img);

						} else if (vidchk > -1) {

							var vid = document.createElement("video");
	

							vid.name = tblcolname;
							vid.id = "vid" + tblcolname;
							vid.setAttribute("alt", tblcolname);
							//img.setAttribute("src", image);
							vid.src = video;
							
							/*$("#debug").append("IMG called\n");
							
							if (vid.complete || vid.readyState === 4) {
							    // image is cached
								$("#debug").append("vid is cached\n");
							}
							else {
								$("#debug").append("vid is not cached\n");
							}*/
							
							newCell.appendChild(vid);
							
						} else if (formchk > -1) {
							//Form place holder
							// Either a. set ace here b. set ace after aynctable call using a deduced id
							
							$("#debug").append("(formchk > -1)\n");				
							
							var form = null;
							var textareachk = type.indexOf("textarea");
							
							if (textareachk > -1)
							{
								// create div place holder
								var divTag = document.createElement("div");
								divTag.id = "ace";
							
								form = document.createElement("textarea");
								
								form.maxLength = "5000";
								form.cols = "80";
								form.rows = "20";
							}
							else
							{
								form = document.createElement("input");
							}
							
							form.type = "text";
							form.name = tblcolname;

							
							form.id = "form"
									+ tablename
									+ tblcolname;
									
							 if (targetNode.childNodes[i2].childNodes[j].firstChild != null)
								form.setAttribute('value', targetNode.childNodes[i2].childNodes[j].firstChild.nodeValue);
							
							if (textareachk > -1)
							{							
								newCell.appendChild(divTag);
							}
							
							newCell.appendChild(form);
							newCell.setAttribute('id', xmllabel);
								
						} else {

							if (hdchk > -1) {
								newCell.style.display = 'none';
							}

							newCell.setAttribute('id', xmllabel);

							if (targetNode.childNodes[i2].childNodes[j].firstChild != null)
								newCell.innerHTML = targetNode.childNodes[i2].childNodes[j].firstChild.nodeValue;
						}
					}
					labelcheck = false;
				}
			}
		}
		// May need to check if delete operation

		if (!tableexists)
			return myTable.outerHTML;
	};

	XMLtoString = function(elem) {

		var serialized;

		try {
			// XMLSerializer exists in current Mozilla browsers
			serializer = new XMLSerializer();
			serialized = serializer.serializeToString(elem);
		} catch (e) {
			// Internet Explorer has a different approach to serializing XML
			serialized = elem.xml;
		}

		return serialized;
	};

	cleanup = function(node) {
		for ( var i = 0; i < node.childNodes.length; i++) {
			var child = node.childNodes[i];
			if (child.nodeType == 3 && !/\S/.test(child.nodeValue)) {
				node.removeChild(child);
				i--;
			}
			if (child.nodeType == 1) {
				cleanup(child);
			}
		}
		return node;
	};

	loadXmlDocFromString = function(text) {
		try // Internet Explorer
		{
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async = "false";
			xmlDoc.loadXML(text);
			return xmlDoc;
		} catch (e) {
			try // Firefox, Mozilla, Opera, etc.
			{
				parser = new DOMParser();
				xmlDoc = parser.parseFromString(text, "text/xml");
				return xmlDoc;
			} catch (e) {
				alert(e.message);
				return;
			}
		}
	};

	find = function(t, id) {
		// $("#debug").append("In find\n");
		for ( var i = 0; i < t.childNodes.length; i++) {
			var child = t.childNodes[i];
			// $("#debug").append("In find child.id(" + child.id + ")\n");
			if (child.id == id) {
				return child;
			}
		}
		return null;
	};

	findrow = function(table, value) {
		var rows = document.getElementById(table).getElementsByTagName('tbody')[0]
				.getElementsByTagName('tr');
		// var rows = document.getElementById(table).rows;
		for ( var i = 0; i < rows.length; i++) {
			if (rows[i].id == value) {
				return rows[i];
			}
		}
		return null;

	};

	find2 = function(t, id) {
		// $("#debug").append("In find\n");
		for ( var i = 0; i < t.childNodes.length; i++) {
			var child = t.childNodes[i];
			// $("#debug").append("In find child.id(" + child.id + ")\n");
			if (child.id == id) {
				return child;
			} else {
				if (child.childNodes) {
					for ( var v = 0; v < child.childNodes.length; v++) {
						var child2 = child.childNodes[v];
						// $("#debug").append("In find child2.id(" + child.id +
						// ")\n");
						if (child2.id == id) {
							return child2;
						}
					}
				}
			}
		}
		return null;
	};

	function isFunction(functionToCheck) {
		var getType = {};
		return functionToCheck
				&& getType.toString.call(functionToCheck) == '[object Function]';
	}

	onCheckRow = function(tablename, row_id, check_id, default_color,
			onclickrow) {

		if (isFunction(onclickrow)) {
			onclickrow(tablename, check_id, row_id);
		}
	};

	onCheckRowAndBox = function(tablename, row_id, check_id, oncheck,
			onuncheck, onclickrow) {

		if (document.getElementById(check_id).checked) {
			if (isFunction(oncheck)) {
				// TODO use css
				// findrow(tablename,row_id).bgColor = '#E2E6A8';
				findrow(tablename, row_id).className = "oncheck";
				oncheck(tablename, check_id, row_id);
			}
		} else if (document.getElementById(check_id).checked) {
			if (isFunction(onuncheck)) {
				// TODO use css
				// findrow(tablename,row_id).bgColor = default_color;
				findrow(tablename, row_id).className = "onrowcheck";
				onuncheck(tablename, check_id, row_id);
			}
		}

		if (isFunction(onclickrow)) {
			onclickrow(tablename, check_id, row_id);
		}
	};

	onCheckBox = function(tablename, row_id, check_id, oncheck, onuncheck) {

		if (document.getElementById(check_id).checked) {
			if (isFunction(oncheck)) {
				// TODO use css
				// findrow(tablename,row_id).bgColor = '#E2E6A8';
				findrow(tablename, row_id).className = "oncheck";
				oncheck(tablename, check_id, row_id);
			}
		} else {
			if (isFunction(onuncheck)) {
				// TODO use css
				// findrow(tablename,row_id).bgColor = default_color;
				findrow(tablename, row_id).className = "onrowcheck";
				onuncheck(tablename, check_id, row_id);
			}
		}
	};

	test1 = function(tablename, check_id, row_id) {
		if (document.getElementById(check_id).checked) {
			var row = findrow(tablename, row_id);
			$("#debug").append(
					"test1 PRODUCT_ID :" + find(row, "PRODUCT_ID").innerHTML
							+ "\n");
		}
	};

	test2 = function(tablename, check_id, row_id) {
		if (!document.getElementById(check_id).checked) {
			var row = findrow(tablename, row_id);
			$("#debug").append(
					"test2 PRODUCT_ID :" + find(row, "PRODUCT_ID").innerHTML
							+ "\n");
		}
	};

	/*
	 * checkrow = function(inputdata) { var retval = false;
	 * 
	 * if(inputdata.indexOf("10.95") > -1) retval = true;
	 * 
	 * return retval; }
	 */

	function pageexample(page) {
		var t = document.getElementById('page');
		var res;
		if (page == "previous") {
			res = Table.pagePrevious(t);
		} else if (page == "next") {
			res = Table.pageNext(t);
		} else {
			res = Table.page(t, page);
		}
		var currentPage = res.page + 1;
		$('.pagelink').removeClass('currentpage');
		$('#page' + currentPage).addClass('currentpage');
	}

	function getBase64Image(img) {
		// Create an empty canvas element
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;

		// Copy the image contents to the canvas
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);

		// Get the data-URL formatted image
		// Firefox supports PNG and JPEG. You could check img.src to
		// guess the original format, but be aware the using "image/jpg"
		// will re-encode the image.
		var dataURL = canvas.toDataURL("image/png");

		return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

		// return dataURL
	}

	function getBase64Image2(imageDataArray) {
		// Create an empty canvas element
		var canvas = document.createElement("canvas");
		// canvas.width = img.width;
		// canvas.height = img.height;

		var ctx = canvas.getContext("2d");

		var image = "data:image/jpg;base64," + imageDataArray;

		var img = new Image();
		img.onload = function() {
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		};

		img.src = image;

		// return dataURL
	}
	
	function getBase64Image3(imageDataArray) {
		// Create an empty canvas element
		var canvas = document.createElement("canvas");
	

		var ctx = canvas.getContext("2d");

		var image =  imageDataArray;

		canvas.width = img.width;
		canvas.height = img.height;
		
		var img = new Image();
		img.onload = function() {
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		};

		img.src = image;

		// return dataURL
	}

	/*
	 * function getCheckboxIndex() { return chkbxindx2; }
	 * 
	 * function getCheckboxName() { return extchkbxid; }
	 */

	getCheckedRowsXml = function(htmltablename, xmltablename, allrows) {
		// var rowsIndex;
		var xmltable = '';
		var xmlrow = '';

		var rows = document.getElementById(htmltablename).getElementsByTagName(
				'tbody')[0].getElementsByTagName('tr');
		for ( var i = 0; i < rows.length; i++) {
			if (rows[i].getElementsByTagName('td')[0]
					.getElementsByTagName('input')[0].checked
					|| allrows) {
				// here "i" is the row number if checked

				var cells = rows[i].getElementsByTagName('td');

				// start from 1 to ignore the checked cell
				for ( var c = 1; c < cells.length; c++) {
					// xmlrow = xmlrow + '
					// '+cells[c].id+'="'+cells[c].innerHTML+'"';

					xmlrow = xmlrow + '<' + cells[c].id + '>'
							+ cells[c].innerHTML + '</' + cells[c].id + '>';
				}

				if (xmlrow != null)
					xmltable = xmltable + '<row>' + xmlrow + '</row>';

				xmlrow = '';
			}
		}
		if (xmltable != null)
			xmltable = '<' + xmltablename + '>' + xmltable + '</'
					+ xmltablename + '>';

		return (xmltable);
	};
	
	
	getFormRowsXml = function(htmltablename, xmltablename) {
		// var rowsIndex;
		var xmltable = '';
		var xmlrow = '';

		var rows = document.getElementById(htmltablename).getElementsByTagName(
				'tbody')[0].getElementsByTagName('tr');
		for ( var i = 0; i < rows.length; i++) {

				// here "i" is the row number if checked

				var cells = rows[i].getElementsByTagName('td');

				$("#debug").append("getFormRowsXml cells.length :" + cells.length + "\n");
				
				for ( var c = 0; c < cells.length; c++) {
				
					if (cells[c].id != '')
					{
					var input = cells[c].innerHTML;
			
					
					var startindex=input.indexOf("value=");
					var valuestr1 = input.substring(startindex + 7);
					var endindex = valuestr1.indexOf('"');
					var finalstring = valuestr1.substring(0,endindex); 
					
					// Check for cells here
					$("#debug").append("finalstring:" + finalstring + "\n");

					xmlrow = xmlrow + '<' + cells[c].id + '>'
							+ finalstring + '</' + cells[c].id + '>';
							
					}
							
				}

				if (xmlrow != null)
					xmltable = xmltable + '<row>' + xmlrow + '</row>';

				xmlrow = '';

		}
		if (xmltable != null)
			xmltable = '<' + xmltablename + '>' + xmltable + '</'
					+ xmltablename + '>';

		return (xmltable);
	};
	
	
	getFormXml = function(form, xmltablename) {
		var rowsIndex;
		var xmltable = '';
		var xmlrow = '';

				
		for (i = 0; i < form.length; i++) {

				// here "i" is the row number if checked
				//var cells = rows[i].getElementsByTagName('td');
				var cells = form[i];
				
				if (cells.name != '')
				{
					if ((cells.type == 'checkbox'))
					{
						if(cells.checked)
						{
							xmlrow = xmlrow + '<' + cells.name + '>'
							+ cells.value + '</' + cells.name + '>';
						}
					}
					else
					{
						xmlrow = xmlrow + '<' + cells.name + '>'
							+ cells.value + '</' + cells.name + '>';
					}	
				}

				if (xmlrow != null)
				{
					//xmltable = xmltable + '<row>' + xmlrow + '</row>';
					xmltable = xmltable + xmlrow;	
				}
				
				xmlrow = '';
		}
		
		if (xmltable != null)
			xmltable = '<' + xmltablename + '>' + xmltable + '</'
					+ xmltablename + '>';

		alert ("You typed: " + xmltable);
		return (xmltable);
	}

	
	
	// Returns true if it is a DOM node
	function isNode(o) {
		return (typeof Node === "object" ? o instanceof Node : o
				&& typeof o === "object" && typeof o.nodeType === "number"
				&& typeof o.nodeName === "string");
	}

	// Returns true if it is a DOM element
	function isElement(o) {
		return (typeof HTMLElement === "object" ? o instanceof HTMLElement : // DOM2
		o && typeof o === "object" && o.nodeType === 1
				&& typeof o.nodeName === "string");
	}

	tabletest = function() {

		var userfnlist = {
			oncheck : 'test1',
			onuncheck : 'test2',
			onclickrow : 'null'
		}

		var columnfnlist = {
			deleteRow : 'test1'
		}

		var mapping3 = [ [ 'Checkbox', 'PRODUCT_ID', 'checkboxid', null ],
				[ 'Product Id', 'PRODUCT_ID', 'covered', null ],
				[ 'Cost', 'PURCHASE_COST', '' ],
				[ 'Description', 'DESCRIPTION', '', null ] ];

		var myXml1 = '<TableName><firstRow><field1>1</field1><field2>2</field2></firstRow><firstRow><field1>3</field1><field2>4</field2></firstRow></TableName>';
		var myXml2 = '<TableName><firstRow><field1>1</field1><field2>3</field2></firstRow><firstRow><field1>3</field1><field2>4</field2></firstRow></TableName>';
		var myXml3 = '<TableName><firstRow><field1>1</field1><field2>4</field2></firstRow><firstRow><field1>3</field1><field2>4</field2></firstRow></TableName>';
		var myXml4 = '<response><state operation="displayproducts" session_id="" status="success"/><tabledata><tableoutput><data><PRODUCT_ID>980001</PRODUCT_ID><PURCHASE_COST>1095.00</PURCHASE_COST><DESCRIPTION>Identity Server</DESCRIPTION></data><data><PRODUCT_ID>980005</PRODUCT_ID><PURCHASE_COST>11500.99</PURCHASE_COST><DESCRIPTION>Accounting Application</DESCRIPTION></data><data><PRODUCT_ID>980025</PRODUCT_ID><PURCHASE_COST>2095.99</PURCHASE_COST><DESCRIPTION>1Ghz Sun Blade Computer</DESCRIPTION></data><data><PRODUCT_ID>980030</PRODUCT_ID><PURCHASE_COST>59.95</PURCHASE_COST><DESCRIPTION>10Gb Ram</DESCRIPTION></data><data><PRODUCT_ID>980032</PRODUCT_ID><PURCHASE_COST>39.95</PURCHASE_COST><DESCRIPTION>Sound Card</DESCRIPTION></data><data><PRODUCT_ID>986710</PRODUCT_ID><PURCHASE_COST>15.98</PURCHASE_COST><DESCRIPTION>Printer Cable</DESCRIPTION></data><data><PRODUCT_ID>985510</PRODUCT_ID><PURCHASE_COST>595.00</PURCHASE_COST><DESCRIPTION>24 inch Digital Monitor</DESCRIPTION></data><data><PRODUCT_ID>988765</PRODUCT_ID><PURCHASE_COST>10.95</PURCHASE_COST><DESCRIPTION>104-Key Keyboard</DESCRIPTION></data><data><PRODUCT_ID>986420</PRODUCT_ID><PURCHASE_COST>49.95</PURCHASE_COST><DESCRIPTION>Directory Server</DESCRIPTION></data><data><PRODUCT_ID>986712</PRODUCT_ID><PURCHASE_COST>69.95</PURCHASE_COST><DESCRIPTION>512X IDE DVD-ROM</DESCRIPTION></data><data><PRODUCT_ID>975789</PRODUCT_ID><PURCHASE_COST>29.98</PURCHASE_COST><DESCRIPTION>Learn Solaris 10</DESCRIPTION></data><data><PRODUCT_ID>971266</PRODUCT_ID><PURCHASE_COST>25.95</PURCHASE_COST><DESCRIPTION>Network Cable</DESCRIPTION></data><data><PRODUCT_ID>980601</PRODUCT_ID><PURCHASE_COST>2000.95</PURCHASE_COST><DESCRIPTION>300Mhz Pentium Computer</DESCRIPTION></data><data><PRODUCT_ID>980500</PRODUCT_ID><PURCHASE_COST>29.95</PURCHASE_COST><DESCRIPTION>Learn NetBeans</DESCRIPTION></data><data><PRODUCT_ID>980002</PRODUCT_ID><PURCHASE_COST>75.00</PURCHASE_COST><DESCRIPTION>Corporate Expense Survey</DESCRIPTION></data><data><PRODUCT_ID>980031</PRODUCT_ID><PURCHASE_COST>595.95</PURCHASE_COST><DESCRIPTION>Sun Studio C++</DESCRIPTION></data><data><PRODUCT_ID>978493</PRODUCT_ID><PURCHASE_COST>19.95</PURCHASE_COST><DESCRIPTION>Client Server Testing</DESCRIPTION></data><data><PRODUCT_ID>978494</PRODUCT_ID><PURCHASE_COST>18.95</PURCHASE_COST><DESCRIPTION>Learn Java in 1/2 hour</DESCRIPTION></data><data><PRODUCT_ID>978495</PRODUCT_ID><PURCHASE_COST>24.99</PURCHASE_COST><DESCRIPTION>Writing Web Service Applications</DESCRIPTION></data><data><PRODUCT_ID>964025</PRODUCT_ID><PURCHASE_COST>209.95</PURCHASE_COST><DESCRIPTION>Jax WS Application Development Environment</DESCRIPTION></data><data><PRODUCT_ID>964026</PRODUCT_ID><PURCHASE_COST>259.95</PURCHASE_COST><DESCRIPTION>Java EE 6 Application Development Environment</DESCRIPTION></data><data><PRODUCT_ID>964027</PRODUCT_ID><PURCHASE_COST>269.95</PURCHASE_COST><DESCRIPTION>Java Application Development Environment</DESCRIPTION></data><data><PRODUCT_ID>964028</PRODUCT_ID><PURCHASE_COST>219.95</PURCHASE_COST><DESCRIPTION>NetBeans Development Environment</DESCRIPTION></data><data><PRODUCT_ID>980122</PRODUCT_ID><PURCHASE_COST>1400.95</PURCHASE_COST><DESCRIPTION>Solaris x86 Computer</DESCRIPTION></data><data><PRODUCT_ID>958888</PRODUCT_ID><PURCHASE_COST>799.99</PURCHASE_COST><DESCRIPTION>Ultra Spacr 999Mhz Computer</DESCRIPTION></data><data><PRODUCT_ID>958889</PRODUCT_ID><PURCHASE_COST>595.95</PURCHASE_COST><DESCRIPTION>686 7Ghz Computer</DESCRIPTION></data><data><PRODUCT_ID>986733</PRODUCT_ID><PURCHASE_COST>69.98</PURCHASE_COST><DESCRIPTION>A1 900 watts Speakers</DESCRIPTION></data><data><PRODUCT_ID>986734</PRODUCT_ID><PURCHASE_COST>49.95</PURCHASE_COST><DESCRIPTION>Mini Computer Speakers</DESCRIPTION></data><data><PRODUCT_ID>948933</PRODUCT_ID><PURCHASE_COST>36.95</PURCHASE_COST><DESCRIPTION>Computer Tool Kit</DESCRIPTION></data><data><PRODUCT_ID>984666</PRODUCT_ID><PURCHASE_COST>199.95</PURCHASE_COST><DESCRIPTION>Flat screen Monitor</DESCRIPTION></data></tableoutput></tabledata></response>';
		var myXml6 = '<response><state operation="displayproducts" session_id="" status="success"/><tableoutput><data><PRODUCT_ID>980001</PRODUCT_ID><PURCHASE_COST>1095.00</PURCHASE_COST><DESCRIPTION>Identity Server</DESCRIPTION></data><data><PRODUCT_ID>980005</PRODUCT_ID><PURCHASE_COST>11500.99</PURCHASE_COST><DESCRIPTION>Accounting Application</DESCRIPTION></data><data><PRODUCT_ID>980025</PRODUCT_ID><PURCHASE_COST>2095.99</PURCHASE_COST><DESCRIPTION>1Ghz Sun Blade Computer</DESCRIPTION></data><data><PRODUCT_ID>980030</PRODUCT_ID><PURCHASE_COST>59.95</PURCHASE_COST><DESCRIPTION>10Gb Ram</DESCRIPTION></data><data><PRODUCT_ID>980032</PRODUCT_ID><PURCHASE_COST>39.95</PURCHASE_COST><DESCRIPTION>Sound Card</DESCRIPTION></data><data><PRODUCT_ID>986710</PRODUCT_ID><PURCHASE_COST>15.98</PURCHASE_COST><DESCRIPTION>Printer Cable</DESCRIPTION></data><data><PRODUCT_ID>985510</PRODUCT_ID><PURCHASE_COST>595.00</PURCHASE_COST><DESCRIPTION>24 inch Digital Monitor</DESCRIPTION></data><data><PRODUCT_ID>988765</PRODUCT_ID><PURCHASE_COST>10.95</PURCHASE_COST><DESCRIPTION>104-Key Keyboard</DESCRIPTION></data><data><PRODUCT_ID>986420</PRODUCT_ID><PURCHASE_COST>49.95</PURCHASE_COST><DESCRIPTION>Directory Server</DESCRIPTION></data><data><PRODUCT_ID>986712</PRODUCT_ID><PURCHASE_COST>69.95</PURCHASE_COST><DESCRIPTION>512X IDE DVD-ROM</DESCRIPTION></data><data><PRODUCT_ID>975789</PRODUCT_ID><PURCHASE_COST>29.98</PURCHASE_COST><DESCRIPTION>Learn Solaris 10</DESCRIPTION></data><data><PRODUCT_ID>971266</PRODUCT_ID><PURCHASE_COST>25.95</PURCHASE_COST><DESCRIPTION>Network Cable</DESCRIPTION></data><data><PRODUCT_ID>980601</PRODUCT_ID><PURCHASE_COST>2000.95</PURCHASE_COST><DESCRIPTION>300Mhz Pentium Computer</DESCRIPTION></data><data><PRODUCT_ID>980500</PRODUCT_ID><PURCHASE_COST>29.95</PURCHASE_COST><DESCRIPTION>Learn NetBeans</DESCRIPTION></data><data><PRODUCT_ID>980002</PRODUCT_ID><PURCHASE_COST>75.00</PURCHASE_COST><DESCRIPTION>Corporate Expense Survey</DESCRIPTION></data><data><PRODUCT_ID>980031</PRODUCT_ID><PURCHASE_COST>595.95</PURCHASE_COST><DESCRIPTION>Sun Studio C++</DESCRIPTION></data><data><PRODUCT_ID>978493</PRODUCT_ID><PURCHASE_COST>19.95</PURCHASE_COST><DESCRIPTION>Client Server Testing</DESCRIPTION></data><data><PRODUCT_ID>978494</PRODUCT_ID><PURCHASE_COST>18.95</PURCHASE_COST><DESCRIPTION>Learn Java in 1/2 hour</DESCRIPTION></data><data><PRODUCT_ID>978495</PRODUCT_ID><PURCHASE_COST>24.99</PURCHASE_COST><DESCRIPTION>Writing Web Service Applications</DESCRIPTION></data><data><PRODUCT_ID>964025</PRODUCT_ID><PURCHASE_COST>209.95</PURCHASE_COST><DESCRIPTION>Jax WS Application Development Environment</DESCRIPTION></data><data><PRODUCT_ID>964026</PRODUCT_ID><PURCHASE_COST>259.95</PURCHASE_COST><DESCRIPTION>Java EE 6 Application Development Environment</DESCRIPTION></data><data><PRODUCT_ID>964027</PRODUCT_ID><PURCHASE_COST>269.95</PURCHASE_COST><DESCRIPTION>Java Application Development Environment</DESCRIPTION></data><data><PRODUCT_ID>964028</PRODUCT_ID><PURCHASE_COST>219.95</PURCHASE_COST><DESCRIPTION>NetBeans Development Environment</DESCRIPTION></data><data><PRODUCT_ID>980122</PRODUCT_ID><PURCHASE_COST>1400.95</PURCHASE_COST><DESCRIPTION>Solaris x86 Computer</DESCRIPTION></data><data><PRODUCT_ID>958888</PRODUCT_ID><PURCHASE_COST>799.99</PURCHASE_COST><DESCRIPTION>Ultra Spacr 999Mhz Computer</DESCRIPTION></data><data><PRODUCT_ID>958889</PRODUCT_ID><PURCHASE_COST>595.95</PURCHASE_COST><DESCRIPTION>686 7Ghz Computer</DESCRIPTION></data><data><PRODUCT_ID>986733</PRODUCT_ID><PURCHASE_COST>69.98</PURCHASE_COST><DESCRIPTION>A1 900 watts Speakers</DESCRIPTION></data><data><PRODUCT_ID>986734</PRODUCT_ID><PURCHASE_COST>49.95</PURCHASE_COST><DESCRIPTION>Mini Computer Speakers</DESCRIPTION></data><data><PRODUCT_ID>948933</PRODUCT_ID><PURCHASE_COST>36.95</PURCHASE_COST><DESCRIPTION>Computer Tool Kit</DESCRIPTION></data><data><PRODUCT_ID>984666</PRODUCT_ID><PURCHASE_COST>199.95</PURCHASE_COST><DESCRIPTION>Flat screen Monitor</DESCRIPTION></data></tableoutput></response>';

		var myXml5 = '<tableoutput><data><PRODUCT_ID>980001</PRODUCT_ID><PURCHASE_COST>1095.00</PURCHASE_COST><DESCRIPTION>Identity Server</DESCRIPTION></data><data><PRODUCT_ID>980005</PRODUCT_ID><PURCHASE_COST>11500.99</PURCHASE_COST><DESCRIPTION>Accounting Application</DESCRIPTION></data><data><PRODUCT_ID>980025</PRODUCT_ID><PURCHASE_COST>2095.99</PURCHASE_COST><DESCRIPTION>1Ghz Sun Blade Computer</DESCRIPTION></data><data><PRODUCT_ID>980030</PRODUCT_ID><PURCHASE_COST>59.95</PURCHASE_COST><DESCRIPTION>10Gb Ram</DESCRIPTION></data><data><PRODUCT_ID>980032</PRODUCT_ID><PURCHASE_COST>39.95</PURCHASE_COST><DESCRIPTION>Sound Card</DESCRIPTION></data><data><PRODUCT_ID>986710</PRODUCT_ID><PURCHASE_COST>15.98</PURCHASE_COST><DESCRIPTION>Printer Cable</DESCRIPTION></data><data><PRODUCT_ID>985510</PRODUCT_ID><PURCHASE_COST>595.00</PURCHASE_COST><DESCRIPTION>24 inch Digital Monitor</DESCRIPTION></data><data><PRODUCT_ID>988765</PRODUCT_ID><PURCHASE_COST>10.95</PURCHASE_COST><DESCRIPTION>104-Key Keyboard</DESCRIPTION></data><data><PRODUCT_ID>986420</PRODUCT_ID><PURCHASE_COST>49.95</PURCHASE_COST><DESCRIPTION>Directory Server</DESCRIPTION></data><data><PRODUCT_ID>986712</PRODUCT_ID><PURCHASE_COST>69.95</PURCHASE_COST><DESCRIPTION>512X IDE DVD-ROM</DESCRIPTION></data><data><PRODUCT_ID>975789</PRODUCT_ID><PURCHASE_COST>29.98</PURCHASE_COST><DESCRIPTION>Learn Solaris 10</DESCRIPTION></data><data><PRODUCT_ID>971266</PRODUCT_ID><PURCHASE_COST>25.95</PURCHASE_COST><DESCRIPTION>Network Cable</DESCRIPTION></data><data><PRODUCT_ID>980601</PRODUCT_ID><PURCHASE_COST>2000.95</PURCHASE_COST><DESCRIPTION>300Mhz Pentium Computer</DESCRIPTION></data><data><PRODUCT_ID>980500</PRODUCT_ID><PURCHASE_COST>29.95</PURCHASE_COST><DESCRIPTION>Learn NetBeans</DESCRIPTION></data><data><PRODUCT_ID>980002</PRODUCT_ID><PURCHASE_COST>75.00</PURCHASE_COST><DESCRIPTION>Corporate Expense Survey</DESCRIPTION></data><data><PRODUCT_ID>980031</PRODUCT_ID><PURCHASE_COST>595.95</PURCHASE_COST><DESCRIPTION>Sun Studio C++</DESCRIPTION></data><data><PRODUCT_ID>978493</PRODUCT_ID><PURCHASE_COST>19.95</PURCHASE_COST><DESCRIPTION>Client Server Testing</DESCRIPTION></data><data><PRODUCT_ID>978494</PRODUCT_ID><PURCHASE_COST>18.95</PURCHASE_COST><DESCRIPTION>Learn Java in 1/2 hour</DESCRIPTION></data><data><PRODUCT_ID>978495</PRODUCT_ID><PURCHASE_COST>24.99</PURCHASE_COST><DESCRIPTION>Writing Web Service Applications</DESCRIPTION></data><data><PRODUCT_ID>964025</PRODUCT_ID><PURCHASE_COST>209.95</PURCHASE_COST><DESCRIPTION>Jax WS Application Development Environment</DESCRIPTION></data><data><PRODUCT_ID>964026</PRODUCT_ID><PURCHASE_COST>259.95</PURCHASE_COST><DESCRIPTION>Java EE 6 Application Development Environment</DESCRIPTION></data><data><PRODUCT_ID>964027</PRODUCT_ID><PURCHASE_COST>269.95</PURCHASE_COST><DESCRIPTION>Java Application Development Environment</DESCRIPTION></data><data><PRODUCT_ID>964028</PRODUCT_ID><PURCHASE_COST>219.95</PURCHASE_COST><DESCRIPTION>NetBeans Development Environment</DESCRIPTION></data><data><PRODUCT_ID>980122</PRODUCT_ID><PURCHASE_COST>1400.95</PURCHASE_COST><DESCRIPTION>Solaris x86 Computer</DESCRIPTION></data><data><PRODUCT_ID>958888</PRODUCT_ID><PURCHASE_COST>799.99</PURCHASE_COST><DESCRIPTION>Ultra Spacr 999Mhz Computer</DESCRIPTION></data><data><PRODUCT_ID>958889</PRODUCT_ID><PURCHASE_COST>595.95</PURCHASE_COST><DESCRIPTION>686 7Ghz Computer</DESCRIPTION></data><data><PRODUCT_ID>986733</PRODUCT_ID><PURCHASE_COST>69.98</PURCHASE_COST><DESCRIPTION>A1 900 watts Speakers</DESCRIPTION></data><data><PRODUCT_ID>986734</PRODUCT_ID><PURCHASE_COST>49.95</PURCHASE_COST><DESCRIPTION>Mini Computer Speakers</DESCRIPTION></data><data><PRODUCT_ID>948933</PRODUCT_ID><PURCHASE_COST>36.95</PURCHASE_COST><DESCRIPTION>Computer Tool Kit</DESCRIPTION></data><data><PRODUCT_ID>984666</PRODUCT_ID><PURCHASE_COST>199.95</PURCHASE_COST><DESCRIPTION>Flat screen Monitor</DESCRIPTION></data></tableoutput>';

		var basketdata = '<response><state operation="basketdisplayed" session_id="" status="success"/><tabledata><tableoutput><data><PRODUCT_ID>980001</PRODUCT_ID><PURCHASE_COST>1095.00</PURCHASE_COST><DESCRIPTION>Identity Server</DESCRIPTION></data><data><PRODUCT_ID>980005</PRODUCT_ID><PURCHASE_COST>11500.99</PURCHASE_COST><DESCRIPTION>Accounting Application</DESCRIPTION></data><data><PRODUCT_ID>980025</PRODUCT_ID><PURCHASE_COST>2095.99</PURCHASE_COST><DESCRIPTION>1Ghz Sun Blade Computer</DESCRIPTION></data><data><PRODUCT_ID>980030</PRODUCT_ID><PURCHASE_COST>59.95</PURCHASE_COST><DESCRIPTION>10Gb Ram</DESCRIPTION></data><data><PRODUCT_ID>980032</PRODUCT_ID><PURCHASE_COST>39.95</PURCHASE_COST><DESCRIPTION>Sound Card</DESCRIPTION></data><data><PRODUCT_ID>986710</PRODUCT_ID><PURCHASE_COST>15.98</PURCHASE_COST><DESCRIPTION>Printer Cable</DESCRIPTION></data><data><PRODUCT_ID>985510</PRODUCT_ID><PURCHASE_COST>595.00</PURCHASE_COST><DESCRIPTION>24 inch Digital Monitor</DESCRIPTION></data><data><PRODUCT_ID>988765</PRODUCT_ID><PURCHASE_COST>10.95</PURCHASE_COST><DESCRIPTION>104-Key Keyboard</DESCRIPTION></data><data><PRODUCT_ID>986420</PRODUCT_ID><PURCHASE_COST>49.95</PURCHASE_COST><DESCRIPTION>Directory Server</DESCRIPTION></data><data><PRODUCT_ID>986712</PRODUCT_ID><PURCHASE_COST>69.95</PURCHASE_COST><DESCRIPTION>512X IDE DVD-ROM</DESCRIPTION></data><data><PRODUCT_ID>975789</PRODUCT_ID><PURCHASE_COST>29.98</PURCHASE_COST><DESCRIPTION>Learn Solaris 10</DESCRIPTION></data><data><PRODUCT_ID>971266</PRODUCT_ID><PURCHASE_COST>25.95</PURCHASE_COST><DESCRIPTION>Network Cable</DESCRIPTION></data><data><PRODUCT_ID>980601</PRODUCT_ID><PURCHASE_COST>2000.95</PURCHASE_COST><DESCRIPTION>300Mhz Pentium Computer</DESCRIPTION></data><data><PRODUCT_ID>980500</PRODUCT_ID><PURCHASE_COST>29.95</PURCHASE_COST><DESCRIPTION>Learn NetBeans</DESCRIPTION></data><data><PRODUCT_ID>980002</PRODUCT_ID><PURCHASE_COST>75.00</PURCHASE_COST><DESCRIPTION>Corporate Expense Survey</DESCRIPTION></data><data><PRODUCT_ID>980031</PRODUCT_ID><PURCHASE_COST>595.95</PURCHASE_COST><DESCRIPTION>Sun Studio C++</DESCRIPTION></data><data><PRODUCT_ID>978493</PRODUCT_ID><PURCHASE_COST>19.95</PURCHASE_COST><DESCRIPTION>Client Server Testing</DESCRIPTION></data><data><PRODUCT_ID>978494</PRODUCT_ID><PURCHASE_COST>18.95</PURCHASE_COST><DESCRIPTION>Learn Java in 1/2 hour</DESCRIPTION></data><data><PRODUCT_ID>978495</PRODUCT_ID><PURCHASE_COST>24.99</PURCHASE_COST><DESCRIPTION>Writing Web Service Applications</DESCRIPTION></data><data><PRODUCT_ID>964025</PRODUCT_ID><PURCHASE_COST>209.95</PURCHASE_COST><DESCRIPTION>Jax WS Application Development Environment</DESCRIPTION></data><data><PRODUCT_ID>964026</PRODUCT_ID><PURCHASE_COST>259.95</PURCHASE_COST><DESCRIPTION>Java EE 6 Application Development Environment</DESCRIPTION></data><data><PRODUCT_ID>964027</PRODUCT_ID><PURCHASE_COST>269.95</PURCHASE_COST><DESCRIPTION>Java Application Development Environment</DESCRIPTION></data><data><PRODUCT_ID>964028</PRODUCT_ID><PURCHASE_COST>219.95</PURCHASE_COST><DESCRIPTION>NetBeans Development Environment</DESCRIPTION></data><data><PRODUCT_ID>980122</PRODUCT_ID><PURCHASE_COST>1400.95</PURCHASE_COST><DESCRIPTION>Solaris x86 Computer</DESCRIPTION></data><data><PRODUCT_ID>958888</PRODUCT_ID><PURCHASE_COST>799.99</PURCHASE_COST><DESCRIPTION>Ultra Spacr 999Mhz Computer</DESCRIPTION></data><data><PRODUCT_ID>958889</PRODUCT_ID><PURCHASE_COST>595.95</PURCHASE_COST><DESCRIPTION>686 7Ghz Computer</DESCRIPTION></data><data><PRODUCT_ID>986733</PRODUCT_ID><PURCHASE_COST>69.98</PURCHASE_COST><DESCRIPTION>A1 900 watts Speakers</DESCRIPTION></data><data><PRODUCT_ID>986734</PRODUCT_ID><PURCHASE_COST>49.95</PURCHASE_COST><DESCRIPTION>Mini Computer Speakers</DESCRIPTION></data><data><PRODUCT_ID>948933</PRODUCT_ID><PURCHASE_COST>36.95</PURCHASE_COST><DESCRIPTION>Computer Tool Kit</DESCRIPTION></data><data><PRODUCT_ID>984666</PRODUCT_ID><PURCHASE_COST>199.95</PURCHASE_COST><DESCRIPTION>Flat screen Monitor</DESCRIPTION></data></tableoutput></tabledata></response>';

		/*
		 * var myXml = '<TableName> \ <firstRow> \ <field1>1</field1> \
		 * <field2>2</field2> \ </firstRow> \ <firstRow> \ <field1>3</field1> \
		 * <field2>4</field2> \ </firstRow> \ </TableName>';
		 */

		var basketxml = loadXmlDocFromString(basketdata);
		var baskettb = basketxml.getElementsByTagName('tabledata')[0];
		$("#basketarea").append(
				asynctable(baskettb, 'grid3', mapping3, null, '5', userfnlist));
		tablePaginater.init('grid3');

		var doc3 = loadXmlDocFromString(myXml6);
		var target = doc3.getElementsByTagName('tableoutput');
		var wrap = document.createElement('tableoutput');
		wrap.appendChild(target[0]);

		$("#mainarea").append(
				asynctable(wrap, 'grid2', mapping3, null, '10', userfnlist));
		tablePaginater.init('grid2');

	};

})();
