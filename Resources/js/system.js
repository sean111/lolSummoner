var apiKey = 'ki6uyLMr3orPeoQKfhi2';
var champions;
function populateSettings() {
    console.log("Populate Settings");
    var summoner = localStorage.getItem('summoner');
    console.log(summoner);
    var region = localStorage.getItem('region');
    if(summoner !== undefined && summoner !== null) {
        $("[name='summoner']").val(summoner);
    }
    if(region !== undefined && region !== null) {
        $("[name='region']").prop("value", region);
    }
}

function loadPlayerData() {
    var summoner = localStorage.getItem('summoner');
    var region = localStorage.getItem('region');
    var accountId = localStorage.getItem('accountId');
    var icon = localStorage.getItem('icon');
    if(accountId !== null) {
        $('#startMessage').remove();
        $('#brand').html('<img src="http://img.lolking.net/images/profile_icons/profileIcon'+icon+'.jpg" width="36px" height="36px">&nbsp;&nbsp;'+summoner+' ['+region.toUpperCase()+']');
        var url = 'http://api.elophant.com/v2/'+region+'/recent_games/'+accountId+'/?key='+apiKey;
        console.log(url);
        $.get(url, function(data) {
            var htmlData = $('#data');
            for(x = data.data.gameStatistics.length-1; x >= 0 ; x--) {
                var match = data.data.gameStatistics[x];
                console.log(match);
                var champion = champions[match.championId];
                //The Elophant API is fucking stupid so we need to do this
                won = false;
                for(y = 0; y<match.statistics.length; y++) {
                    if(match.statistics[y].statType == "WIN") {
                        won = true;
                    }
                }
                console.log({champion: champion, win: won});
                if(won) {
                    winClass = 'matchWon';
                }
                else {
                    winClass = 'matchLoss';
                }
                htmlData.append("<div class='row-fluid "+winClass+"'><div class='span12'>"+champion+"</div></div>");
            }
        }, 'json');
    }
    $('#loading').remove();
}

function getChampions() {
    champions = new Array();
    var url = "http://api.elophant.com/v2/champions?key="+apiKey;
    $.get(url, function(data) {
        localStorage.setItem('champions', JSON.stringify(data));
        parseChampions(data);
    }, 'json');
}

function parseChampions(data) {
    for(x = 0; x < data.data.length; x++) {
        champ = data.data[x];
        champions[champ.id]=champ.name;
    }
}

$('#save').click(function() {
    var newSummoner = $("[name='summoner']").val();
    var newRegion = $("[name='region'] :selected").val();
    localStorage.setItem('summoner', newSummoner);
    localStorage.setItem('region', newRegion);
    console.log({'newSummoner': newSummoner, 'newRegion': newRegion});
    var url = 'http://api.elophant.com/v2/'+newRegion+'/summoner/'+newSummoner+'?key='+apiKey;
    console.log(url);
    $.get(url, function(data) {
        console.log(data);
        alert = $('#alert');
        if(!data.success) {
            console.error(data.error);
            alert.removeClass();
            alert.addClass("alert alert-error");
            alert.html(data.error);
        }
        else {
            accountId = data.data.acctId;
            iconId = data.data.profileIconId;
            localStorage.setItem('accountId', accountId);
            localStorage.setItem('icon', iconId);
            alert.removeClass();
            alert.addClass("alert alert-success");
            alert.html("Changes successfully saved");
        }
    }, 'json');
    //Get Account ID & Summoner Icon
});

$('#clear').click(function() {
    localStorage.clear();
});

