//If there is value in localstorage, draw the match tabel
if (localStorage["testfield"]){
	console.log(localStorage["testfield"])
		showMe(localStorage["testfield"],localStorage["select_team_name"]);
	}
	else{
		document.getElementById("main_table").innerHTML = "<h4><i class=\"fa fa-exclamation-circle\" aria-hidden=\"true\"></i>  Choose your favourite team first!</h4>";
		$("#loading").css('display','none');
		$("#loadingTeamInfo").css('display','none');  
	}
setInterval(showMe,30*6*1000,localStorage["testfield"],localStorage["select_team_name"]);
function showMe(team_id,team_name){	
	var test_team_id = team_id;
	function httpRequest(url, callback){
	    var xhr = new XMLHttpRequest();
	    xhr.open("GET", url, true);
	    xhr.onreadystatechange = function() {
	        if (xhr.readyState == 4) {
	        	if (xhr.status == 200){
	        		callback(xhr.response);	
	        	}else{
	        		document.getElementById("main_table").innerHTML = "<h4>Ooops! Maybe there is something wrong with API. Wait a minute and try again.</h4>"}   } }
	    xhr.send();}
	var team_info;
	httpRequest("https://api.opendota.com/api/proPlayers/", function(result){
	    team_info = JSON.parse(result);
	    var teamMemberCode = '<h2>'+ localStorage["select_team_name"]+'</h2>';
	    var player_explain = "Big circle images represent main players and small square images represent reserved players."
	    teamMemberCode += '<p><span id="player_title">Players  </span><i class="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip" data-placement="right" title="'+ player_explain+'"></i></p>';	    
	    var numOfLine = 0;
		for (var i=0,teamLength = team_info.length;i<teamLength;i++){		
			if (team_info[i].team_id==test_team_id){		
				if (numOfLine == 0){teamMemberCode +='<tr>';}
				numOfLine ++;var avatar;var img_shape;
				if (team_info[i].is_locked){
					avatar = team_info[i].avatarmedium;
					img_shape = "img-circle";
				}else{
					avatar = team_info[i].avatar;
					img_shape = "img-rounded";
				}
				teamMemberCode += '<td class="playerAvatar"><div class="tooltip-options col-md-2">';
				teamMemberCode += '<a href="https://www.opendota.com/players/'+team_info[i].account_id+'" data-toggle="tooltip" title="'+team_info[i].name+'"target="_blank">';
				teamMemberCode += '<img src="'+avatar+'" alt="..." class="'+img_shape+'">';
				teamMemberCode += '</a>';
				teamMemberCode += '</div></td>';
				if (numOfLine == 5){
					teamMemberCode += '</tr>';
					numOfLine = 0;}}}
	$("#team_member").css('display','block');
	document.getElementById('team_member').innerHTML = teamMemberCode;
	$("#loadingTeamInfo").css('display','none'); 
	$('[data-toggle="tooltip"]').tooltip();
	});
	var r;var recentGameUrl = "https://api.opendota.com/api/explorer?sql=SELECT%0Amatches.match_id%2C%0Amatches.start_time%2C%0A((player_matches.player_slot%20%3C%20128)%20%3D%20matches.radiant_win)%20win%2C%0Aplayer_matches.hero_id%2C%0Aplayer_matches.account_id%2C%0Aleagues.name%20leaguename%0AFROM%20matches%0AJOIN%20match_patch%20using(match_id)%0AJOIN%20leagues%20using(leagueid)%0AJOIN%20player_matches%20using(match_id)%0ALEFT%20JOIN%20notable_players%20using(account_id)%0ALEFT%20JOIN%20teams%20using(team_id)%0AJOIN%20heroes%20ON%20player_matches.hero_id%20%3D%20heroes.id%0AWHERE%20TRUE%0AAND%20notable_players.team_id%20%3D%20"+test_team_id+"%0AORDER%20BY%20matches.match_id%20DESC%20NULLS%20LAST%0ALIMIT%2050"
	httpRequest(recentGameUrl, function(result){
	    r = JSON.parse(result);  var len1 = r.rowCount;
	     if (len1==0){
	    	document.getElementById("main_table").innerHTML = "<h4>Ooops!It seems your team didn't have games recently.</h4>"}
	var tableCode = '';
	$("#loading").css('display','none');
	if (localStorage["firstMatchId"] != r.rows[0].match_id){
		//chrome.browserAction.setIcon({path: {'16': 'images/icon16_notify.png'}});
	}else {
		//chrome.browserAction.setIcon({path: {'16': 'images/icon16.png'}});
	}
	localStorage["firstMatchId"] = r.rows[0].match_id;
	for (var i=0;i<len1;i++){
		if (i>=1){
			if(r.rows[i].match_id==r.rows[i-1].match_id){
				continue;}}
		var detail = new XMLHttpRequest();
		detail.open("GET","https://api.opendota.com/api/matches/"+r.rows[i].match_id,false);
		detail.send(); 
		var detaildata = JSON.parse(detail.response);		
		if (detaildata.hasOwnProperty("radiant_team")){
			var rteam = detaildata.radiant_team.name;	}
		if (detaildata.hasOwnProperty("dire_team")){
			var dteam = detaildata.dire_team.name;	}	
		var starttime = detaildata.start_time;
		if (rteam!=team_name&&dteam!=team_name){
			continue;}
		var startdate = new Date();
		startdate.setTime(starttime * 1000);
		var mainTable = document.getElementById('main_table');
		var match_detail_url = 'https://www.opendota.com/matches/'+r.rows[i].match_id;
		var startdateCut = startdate.toLocaleString('en-US',{hour12:false});
		startdateCut = startdateCut.substring(0,startdateCut.lastIndexOf(':'));
		if (r.rows[i].win==true){
			tableCode = tableCode + '<tr class="success" ><td>'+startdateCut+'</td><td>'+r.rows[i].leaguename+'</td><td>'+rteam+' VS '+dteam+'</td><td> WIN </td><td><a href="'+match_detail_url+'" target="_blank"><i class="fa fa-info-circle" aria-hidden="true"></i></a></td></tr>';} 
		else {
			tableCode = tableCode + '<tr class="danger" ><td>'+startdateCut+'</td><td>'+r.rows[i].leaguename+'</td><td>'+rteam+' VS '+dteam+'</td><td> LOSE </td><td><a href="'+match_detail_url+'" target="_blank"><i class="fa fa-info-circle" aria-hidden="true"></i></a></tr>';	}}
	if(tableCode) mainTable.innerHTML = tableCode; else document.getElementById("main_table").innerHTML = "<h4>Ooops!It seems your team didn't have games recently.</h4>"});	}