// ---------------------------
// AutoMoe 
// ---------------------------
// William Cecil
// ---------------------------
// End the current task
// clear the current task
function done() {
    //set up obj
    var data = {};

    //set to done!
    data['task' + prefix] = 'done';

    chrome.storage.local.set(data);
}

function doneEvent(){
	var data = {};
            data['timeOutSummer' + prefix] = new Date().getTime();

            chrome.storage.local.set(data);
            done();
}

//choose next activity
function chooseNext() {
    //choose a random task.
    taskList = ["friend", "recommend", "event", "social", "rest", "gohome"];

    //chose next task, RANDOMLY!
    var next = Math.floor((Math.random() * taskList.length));

    //setup data
    var data = {};
    data['task' + prefix] = taskList[next];

    //log out to screen
    $('body').prepend("next=" + taskList[next] + "<br>");

    //setup data
    chrome.storage.local.set(data);
}

function hasData(data) {
    return data != null && data.length != 0;
}


function amIHome() {
    var memos = $('ul#tab_memo:contains("Rec")');

    return hasData(memos);
}


//reload
function reloadMe() {
    console.log("reload !");
    window.location.reload();

    //recurve call jic
    setTimeout(reloadMe, 1000 * 60 * 5);
}


//
// navigate to home page
//
function goHome() {
    if (!amIHome()) {
        //go to my room!
        var room = $('img[alt="My Room"]');

        if (room == null || room.length == 0) {
            console.log("lost room");
            setTimeout(reloadMe, 1000 * 60 * 5);
        } else {
            room.click();
        }
    } else {
        //go to main page
        var room = $('a[href="http://us-moe-app.amz-aws.jp/#"]');

        if (room == null || room.length == 0) {
            console.log("lost root");
            setTimeout(reloadMe, 1000 * 60 * 5);
        } else {
            room[0].click();
        }
    }
}

//lets go recommend some things
function letsGoRecomend() {
    //click the recommend costume button
    var recCostume = $('input.give[value="Rec Costume"]');

    //is recommend on page?
    if (recCostume == null || recCostume.length == 0) {
        var giveIndex = $('a[href*="us-moe-app.amz-aws.jp/give/index.php?"]');

        //roulette ?
        var roulette = $('img[alt="Roulette Link"]');

        if (hasData(giveIndex)) { //go to room
            //click the element
            giveIndex[0].click();
        } else if (hasData(roulette)) { //go to room
            //click the element
            roulette.parent()[0].click();
        } else {
            goHome();
        }
    } else {
        done();
        recCostume.click();
    }
}

function observatoryEvent(lastHelped) {

    if (lastHelped == null) {
        lastHelped = 0;
    }
    var now = new Date().getTime();

    if (window.location.pathname == "/event/observatory/index.php" || window.location.pathname == "/event/observatory/") {
        var doneHere = false;
        if (lastHelped + 3 * 60 * 1000 < now ) {
            var hasHelp = $('a[href*="/event/observatory/raid/index.php"]');

            if (hasData(hasHelp)) {
                //set lastHelpered to now and help
				var data = {};
                data['lastHelped' + prefix] = now;
                chrome.storage.local.set(data);


                hasHelp[0].click();
                doneHere = true;
            }
        }

        if (!doneHere) {
            //other root triggers
            //start hunt
            var start = $('a[href*="/event/observatory/quest/?"]');
            if (hasData(start)) {
                start[0].click();
            }
        }

    } else if (window.location.pathname == "/event/observatory/raid/index.php") {
        var helpsomeone = $('a[href*="/event/observatory/raid/detail.php?"]:not(:contains("Broom")):not(:contains("Tired state"))');
        if (hasData(helpsomeone)) {
            helpsomeone[0].click();
        } else { 
        	var top = $('a[href*="/event/observatory/?"]');
			if (hasData(top)) {
 	           top[0].click();
 	       } else {
	            goHome();
	        }
        }
    } else if (window.location.pathname == "/event/observatory/raid/detail.php" || window.location.pathname == "/event/observatory/raid/end.php") {
        //raid detail
        //either help page or attack page
        var help = $('a[href*="/event/observatory/raid/atk_conf.php"]:contains("Help")');
        var hasAttack = $('a[href*="/event/observatory/raid/atk_conf.php"]:contains("Clean"):contains("x1")');
        //if no help, go back
        var hasHelp = $('a[href*="/event/observatory/raid/index.php"]');
        var askForHelp = $('a[href*="/event/observatory/raid/help_conf.php?"]');
         var life = $($('img[src*="/img/event/observatory/sp/battle_gauge_off.png"]').parent()[0]).children().length - 1;
         if(life==0){
         	
         }

        if (hasData(hasAttack)) {
            //if has health, other wise done()
           
            if (life > 0) {
                hasAttack[0].click();
            } else {
                //maybe check stamina
                if (hasData(hasHelp)) {
                	doneEvent();
            		hasHelp[0].click();
       			}else{
                	doneEvent();
                	goHome();
                }
            }
        } else if (hasData(help)) {
            help[0].click();
        } else if (hasData(hasHelp)) {
            hasHelp[0].click();
        } else {
            goHome();
        }

    } else if(window.location.pathname == "/event/observatory/raid/no_life.php"){
        doneEvent();
        goHome();
    }else if (window.location.pathname.indexOf("/event/observatory/quest/") >= 0) {
        var doneHere = false;
        if (lastHelped + 3 * 60 * 1000 < now ) {
            var hasHelp = $('a[href*="/event/observatory/raid/index.php"]');

            if (hasData(hasHelp)) {
                //set lastHelpered to now and help
                //var now = new Date().getTime();
                var data = {};
                data['lastHelped' + prefix] = now;
                chrome.storage.local.set(data);


                hasHelp[0].click();
                doneHere = true;
            }
        }

        if (!doneHere) {

            var top = $('a[href*="/event/observatory/?"]');

            //maybe check stamina by % redbar
            //var encounter = $('a[href*="/event/observatory/raid/detail.php?"]').find(".encount");

            //if i have a raid todo
            var helpsomeone = $('a[href*="/event/observatory/raid/detail.php?"]:not(:contains("Broom")):not(:contains("Tired state"))');

            //keep going
            var keepGoing = $('a[href*="/event/observatory/quest/conf.php"]');

            if (hasData(helpsomeone)) {
                helpsomeone[0].click();
            } else if (hasData(keepGoing)) {
                keepGoing[0].click();
            } else if (hasData(top)) {
                top[0].click();
            } else {
                goHome();
            }

        }

    } else if (window.location.pathname == "/event/observatory/raid/help_end.php") {
        var top = $('a[href*="/event/observatory/?"]');
        if (hasData(top)) {
            top[0].click();
        } else {
            goHome();
        }

    } else {
        //go to event
        var top = $('a[href*="/event/observatory/?"]');
        var gotoevent = $('a[href*="/event/observatory/story/index.php"]')
        if (hasData(top)) {
            top[0].click();
        } else if (hasData(gotoevent)) {
            gotoevent[0].click();
        } else {
            goHome();
        }
    } //else

    //wait ~30seconds and gohome and kill as we failed to do anything
}


//
// Time Check, Only run the event every so often.
//
function summer2014() {
	var doEvent = true;
    //add time out check,
    //at most once every 5-10 minutes
    chrome.storage.local.get(['timeOutSummer' + prefix, 'lastHelped' + prefix], function(data) {
        if (data['timeOutSummer' + prefix] && data['timeOutSummer' + prefix] > 0) {
            var now = new Date().getTime();
            var delta = now - data['timeOutSummer' + prefix];

            //every ~5-26 minutes 
            var nextTime = 60 * Math.floor((Math.random() * 21000) + 5000);
            if (delta > nextTime) {

                data['timeOutSummer' + prefix] = 0;

                chrome.storage.local.set(data);

				doEvent = true;
            } else {
				doEvent = false;
            }
        } else {
        	doEvent = true;
        }

		if(doEvent){
        	var value = 0;
			if(data['lastHelped' + prefix]){
				value = data['lastHelped' + prefix];
			}
			
			//never done anything before
            observatoryEvent(value);
		}else{
			//give up
            done();
            goHome();
		}
    });
}

//run the socialize link, its a simple event.
function socialize() {
    var button = $('a[href*="/contact/irara_contact_conf.php"]');
    var friendPage = $('a[href*="/contact/index.php"');
    if (hasData(friendPage)) {
        done();
        friendPage[0].click();
    } else if (hasData(button)) {
        done();
        button[0].click();
    } else {
        done();
        goHome();
    }
}

//
// Scroll through the friends link until I find something to do.
//
function letsGoFriend() {
 chrome.storage.local.get(['friendsHit' + prefix], function(items){
   var value = 0;
   
   if(items['friendsHit' + prefix]!=null){
   	value = items['friendsHit' + prefix];
   }
   
   setFriendsData(value+1);
   
   actualFriendsDo(value);
 });
}

function setFriendsData(value){
	var data = {};
   data['friendsHit' + prefix]=value;
   
   chrome.storage.local.set(data);
}

function actualFriendsDo(hits){
    
 if(window.location.pathname=="/give/end.php"){
 var friendsList = $('a[href^="http://us-moe-app.amz-aws.jp/friend/list.php"]');
	var allMyFriends = $('a[href^="http://us-moe-app.amz-aws.jp/friend/index.php"]');
	if (hasData(allMyFriends)) {
    	var index = Math.floor( Math.random()*allMyFriends.length);
        allMyFriends[index].click();
    }else if (hasData(friendsList)) {
   		var index = Math.floor( Math.random()*friendsList.length);
        friendsList[index].click();
    } else {
        goHome();
    }	
 }else if(window.location.pathname=="/give/index.php"){
 var friendsList = $('a[href^="http://us-moe-app.amz-aws.jp/friend/list.php"]');
	var recCostume = $('input.give[value="Rec Costume"]');
		
	if(hasData(recCostume)){
		recCostume.click();
	}else if (hasData(friendsList)) {
   		var index = Math.floor( Math.random()*friendsList.length);
        friendsList[index].click();
    } else {
        goHome();
    }
 }else if(window.location.pathname=="/friend/index.php"){
 	var giveIndex = $('a[href*="/give/index.php?"]');
 	var blanket = $('a.button1:contains("The blanket is off")');
    var bother = $('a.button1:contains("Bother")');
    var friendsList = $('a[href^="http://us-moe-app.amz-aws.jp/friend/list.php"]');
    
    if (hasData(giveIndex)) {
    	giveIndex[0].click();
    }else if (hasData(blanket)) {
        done();setFriendsData(0);
        blanket[0].click();
    } else if (hasData(bother)) {
        done();setFriendsData(0);
        bother[0].click();
    } else if (hasData(friendsList)) {
   		var index = Math.floor( Math.random()*friendsList.length);
        friendsList[index].click();
    } else {
        goHome();
    }
    
 }else{
	var friendsList = $('a[href^="http://us-moe-app.amz-aws.jp/friend/list.php"]');
    var allMyFriends = $('a[href^="http://us-moe-app.amz-aws.jp/friend/index.php"]');
    var other = $('a[href^="http://us-moe-app.amz-aws.jp/friend/list.php"]:contains("Others")');
    //var next = $('img[src="http://us-moe-r53.amz-aws.jp/img/hp_sp/n_r.png"]').parent('a[href*="/friend/index.php"]')
	var quitCount = Math.floor(Math.random()*30+10);
	
	//else if(hasData(next)){

    //}
    if(hasData(other) && window.location.pathname == "/friend/list.php"){
    	if(hits>quitCount){
    		setFriendsData(0);
    		done();
    	}
   	 	other[0].click();
    } else if (hasData(allMyFriends) && window.location.pathname == "/friend/list.php") {
   		if(hits>quitCount){
    		setFriendsData(0);
    		done();
    	}
    	var index = Math.floor( Math.random()*allMyFriends.length);
        allMyFriends[index].click();
    } else if (hasData(friendsList)) {
   		var index = Math.floor( Math.random()*friendsList.length);
        friendsList[index].click();
    } else {
        done();
        goHome();
    }
 }
}

//
// check up on my girls, occasionally go to my next moe
//
function checkMyGirl() {
    if (window.location.pathname == "/room/index.php") {
        console.log("Check out my girl");
        var warn = $('a.button1:contains("Warn")');
        var cheer = $('a.button1:contains("Cheer")');
        var reco = $('a.button1:contains("Remove Recommendation")');
        var stroke = $('a.button1:contains("Stroke")');
        var blueHeart = $('a[href*="get_user_item/index.php"]');
        var redHeart = $('a[href*="present/get_list.php"]');
        var note = $('a:contains("Read the note")');
        var nextMoe = $('a[href*="/android/change.php"]');

        if (hasData(cheer)) {
            cheer[0].click();
            return true;
        } else if (hasData(warn)) {
            warn[0].click();
            return true;
        } else if (hasData(reco)) {
            reco[0].click();
            return true;
        } else if (hasData(blueHeart)) {
            blueHeart[0].click();
            return true;
        } else if (hasData(redHeart)) {
            redHeart[0].click();
            return true;
        } else if (hasData(stroke)) {
            stroke[0].click();
            return true;
        } else if (hasData(note)) {
            note[0].click();
            return true;
        } else if (hasData(nextMoe)) {
            //dont always do it, have ~3 min timeout


            if (timeOutNext == null) {
                timeOutNext = 0;
            }

            var now = new Date().getTime();
            var delta = now - timeOutNext;
            var nextTime = Math.floor(1000 * 60 * (Math.random() * 3 + 1));

            if (delta > nextTime) {
                var data = {};
                data['timeOutNext' + prefix] = now;

                chrome.storage.local.set(data);

                nextMoe[0].click();
                return true;
            }

        }
    } else if (window.location.pathname == "/give/del_chk.php") {
        var yesReco = $('a.button1:contains("Yes")[href*="del_conf.php"]');
        if (hasData(yesReco)) {
            yesReco[0].click();
            return true;
        }
    } else if (window.location.pathname == "/present/get_list.php") {
        var getDetails = $('a[href*="present/get_detail.php"]');
        if (hasData(getDetails)) {
            getDetails[0].click();
            return true;
        }
    } else if (window.location.pathname == "/present/get_detail.php") {
        var take = $('input.button1[type="submit"][value="Take"]');
        if (hasData(take)) {
            take[0].click();
            return true;
        }
    } else if (window.location.pathname == "/present/get_end.php") {
        var thank = $('a[href*="/present/polite_conf.php"');
        if (hasData(thank)) {
            thank[0].click();
            return true;
        }
    } else if (window.location.pathname == "/get_user_item/index.php") {
        var accept = $('a[href*="get_user_item/conf.php"]');
        if (hasData(accept)) {
            accept[0].click();
            return true;
        }
    }
    return false;
}

function letsNap() {
    chrome.storage.local.get('lastNap' + prefix, function(items) {

        var now = new Date().getTime();
        var napTime = Math.floor(Math.random() * 1000 * 60 * 16);
        if (items['lastNap' + prefix] == null || items['lastNap' + prefix] + napTime * 2 < now) {
            var data = {};
            data['lastNap' + prefix] = now + napTime;

            chrome.storage.local.set(data);


            $('body').prepend("nap for " + napTime);
            setTimeout(function() {
                done();
                reloadMe();
            }, napTime);
        } else {
            $('body').prepend("No rest for the wicked.");
            done();
            letsGo();
        }
    });
}


//
// - - - - - - - - - 
// -  main  block  -
// - - - - - - - - - 
//
function letsGo() {
    try {
        chrome.storage.local.get('task' + prefix, function(items) {
            if (items['task' + prefix]) {
                if (checkMyGirl()) {
                    console.log("girl cared for");
                } else {
                    console.log(items['task' + prefix] + " , " + prefix);
                    items.task = items['task' + prefix];
                    if (items.task == "recommend") {
                        //"recommend"
                        letsGoRecomend();
                    } else if (items.task == "social") {
                        socialize();
                    } else if (items.task == "event") {
                        summer2014();
                    } else if (items.task == "friend") {
                        letsGoFriend();
                    } else if (items.task == "rest") {
                        letsNap();
                    } else if (items.task == "gohome") {
                        goHome();
                        done();
                    } else {

                        //must be done or someones messing with us
                        chooseNext();
                        letsGo();

                    }
                }
            } else {
                //never ran before
                chooseNext();
                letsGo();
            }
        });
    } catch (e) {
        //some crazy exception, lets reset ourself
        chooseNext();
        letsGo();
    }
}


// Not currently used but gets the active girl's stats
function getStats() {

    if (window.location.pathname == "/room/status.php") {
        var attrValues = $('span[style*="color:#e70e55"]');

        var len = attrValues.length / 2;
        var i = 0;

        var data = {};
        while (i < len) {
            var aName = attrValues[i].innerHTML;
            var aValue = parseInt(attrValues[i + 1].innerHTML);

            i += 2;

            aName = aName.substring(2, aName.length - 2);
            data[aName] = aValue;
        }

        var data = {};
        data['moeStats' + prefix] = data

        chrome.storage.local.set(data);

        done();
        goHome();
    } else if (window.location.pathname == "/room/index.php") {
        var roomStatus = $('a[href*="/room/status.php"]');

        if (hasData(roomStatus)) {
            roomStatus[0].click();
        }
    } else {
        goHome();
    }
}

// - - - - - - - - - // - - - - - - - - - //
//
// This is the boot up script
//
// - - - - - - - - - // - - - - - - - - - //

// Variables!
var time = 0;
var prefix = "1"; //"_none"; // will be the tabId
var postedTimes = false;
var timeOutNext = 0;
var i = 0;

//time = [0ms->3000ms]+2^[0->10] ms + 663 ms
time = Math.floor(Math.pow(2, Math.random() * 10) + 663 + Math.random() * 3000);

//
/// Listener for getting tabId back
//
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.tabid) {
        console.log('The response is : ' + request.tabid);
        prefix = request.tabid;

        if (!postedTimes) {
            chrome.storage.local.get('task' + prefix, function(items) {
                $('body').prepend("event=" + items['task' + prefix] + ", prefix=" + prefix + ", delay=" + time + ", fail=" + failTime + "<br>");
            });
            postedTimes = true;
        }

    } else {
        alert("error!");
    }
});

//
// Main Block
//
function main() {
    //if i dont have a prefix yet
    if (prefix == "_none") {
        //log a .
        $('body').prepend(".");

        //if I've done this more than 60 times, 
        //  go home and lets get back here later
        if (i > 60) {
            goHome();
        }

        //every 10 times lets rerun
        if (i % 10 == 0) {
            //get tabId from core
            chrome.extension.sendRequest({
                action: 'getTabId'
            });
        }
        i++;

        //try again in 300ms.
        setTimeout(main, 300);
    } else {
        //well i have done stuff
        //check if I am paused, otherwise get core variables and lets go on
        chrome.storage.local.get(['pause', 'timeOutNext' + prefix], function(items) {
            //Core Variable loading 
            //this is the time for the next moe click
            timeOutNext = items['timeOutNext' + prefix];

            //if paused, wait 300 ms
            if (items.pause == true || items == "true") {
                //console.log("still paused");
                setTimeout(main, 300);
            } else {
                //flat line dixie, lets do some stuff 
                //after a little more delay
                if (!postedTimes) {
                    chrome.storage.local.get('task' + prefix, function(items) {
                        $('body').prepend("event=" + items['task' + prefix] + ", prefix=" + prefix + ", delay=" + time + ", fail=" + failTime + "<br>");
                    });

                    postedTimes = true;
                }
                setTimeout(letsGo, time);
            }
        });
    }
}

//
// Run main function!
//
main();

var failTime = Math.floor(Math.random() * 1000 * 60 * 13 + 8000);
setTimeout(reloadMe, failTime);