$(document).ready(function() {
				var team_list;
				function httpRequest(url, callback){
				    var xhr = new XMLHttpRequest();
				    xhr.open("GET", url, true);
				    xhr.onreadystatechange = function() {
				        if (xhr.readyState == 4) {
				            callback(xhr.response);
				        }
				    }
				    xhr.send();
				}
				httpRequest("https://api.opendota.com/api/proPlayers/", function(result){
				    team_list = JSON.parse(result);
				    var teamArr = [];
				    teamArr.push(team_list[0].team_id);
				    var count = 0;
				    for (var i=1;i<team_list.length;i++){
				    		var k;
				    		for (k=0;k<teamArr.length;k++){
				    			if (teamArr[k]==team_list[i].team_id){
				    				k --;
				    				break;
				    			}
				    		}
				    		if (k==teamArr.length){
				    			count ++;
				    			teamArr.push(team_list[i].team_id);
				    			$('#selectTeam').editableSelect('add', '['+team_list[i].team_id+']'+team_list[i].team_name+'/'+team_list[i].team_tag);	
				    		}else{
				    			continue;
				    		}
					}
				});
				$('pre code').each(function(i, block) { hljs.highlightBlock(block); });
				$.each(['basic', 'default', 'slide', 'fade', 'appendTo', 'no-filtering', 'html'], function (i, id) {
					var $place  = $('#' + id + '-place');
					var $select = $('#base').clone().removeAttr('id').appendTo($place);
					if (id != 'basic') $select.find('option:selected').removeAttr('selected');
					$select.editableSelect($place.data());
				});
				$('#selectTeam').editableSelect().on('select.editable-select', function (e, li) {				
					var pattern = /\[(.*)\]/i;
					var select_team_id = li.text().match(pattern)[1];
					var pattern_name = /\](.*)\//i; 
					var select_team_name = li.text().match(pattern_name)[1];
					localStorage.select_team_name = select_team_name;
					localStorage.testfield = select_team_id;
					var testteam = localStorage["testfield"];
					if (localStorage["testfield"]){
						$("#loadingTeamInfo").css('display','block');	
					}				
					$("#team_member").css('display','none');
					showMe(testteam,localStorage["select_team_name"]);	
				});
				$('#methods button').on('click', function () {
					var action =  $(this).attr('id') || {
						filter:   $('#filter').val() === 'True',
						effects:  $('#effects').val(),
						duration: $('#duration').val()
					};
					$('#test').editableSelect(action);
				});
				$('#focus').on('click', function () {
				  $('#test')[0].focus();
				});
				$('#add').on('click', function () {
					$('#test').editableSelect('add', $('#text').val());
				});
				$('#remove').on('click', function () {
					$('#test').editableSelect('remove', $('#number').val());
				});
			});
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("refresh").addEventListener("click", handler);
});
function handler() {	
  localStorage.TeamName = $('input[name="search"]').val();
  showMe(localStorage["testfield"],localStorage["select_team_name"]);
}