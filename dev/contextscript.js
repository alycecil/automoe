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
	data['task'+prefix]='done';
	
    chrome.storage.local.set(data);
}

//choose next activity
function chooseNext() {
    //choose a random task.
    taskList = ["friend", "recommend", "event", "social"];

	//chose next task, RANDOMLY!
    var next = Math.floor((Math.random() * taskList.length));

	//setup data
    var data = {};
    data['task'+prefix]=taskList[next];
    
    //log out to screen
    $('body').prepend("next="+taskList[next]+"<br>");
    
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

//
// navigate to home page
//
function goHome() {
    if (!amIHome()) {
    	//go to my room!
        var room = $('img[alt="My Room"]');

        if (room == null || room.length == 0) {
            console.log("lost room");
        } else {
            room.click();
        }
    } else {
    	//go to main page
        var room = $('a[href="http://us-moe-app.amz-aws.jp/#"]');

        if (room == null || room.length == 0) {
            console.log("lost root");
        } else {
            room[0].click();
        }
    }
}

//lets go recommend some things
function letsGoRecomend() {
    //click the recommend costume button
    var recCostume = $('input[value="Rec Costume"]');

    //is recommend on page?
    if (recCostume == null || recCostume.length == 0) {
        //roulette ?
        var roulette = $('img[alt="Roulette Link"]');

        if (roulette == null || roulette.length == 0) { //go to room
            goHome();
        } else {
        	//click the element
            roulette.parent()[0].click();
        }
    } else {
        done();
        recCostume.click();
    }
}

//
//summer 2014 event, actual run event
//is a list of check page, do actions by whats there 
//
function summer2014Do() {

    if (window.location.pathname == "/event/summer2014/entry.php") {
        var startFish = $('a[href*="/event/summer2014/goldfish"]');
        var startCourage = $('a[href*="/event/summer2014/courage"]');

        var whatEvent = Math.floor(Math.random() * 20);
        if (whatEvent == 0 && hasData(startFish)) {
            startFish[0].click();
        } else if (whatEvent > 0 && hasData(startCourage)) {
            startCourage[0].click();
        } else {
            var backTop = $('a[href*="/event/summer2014/"]:contains("Event Top")');

            if (hasData(backTop)) {
                backTop[0].click();
            } else {
                done();
                goHome();
            }
        }
    } else if (window.location.pathname == "/event/summer2014/courage/") {
        var c_continue = $('a[href*="/event/summer2014/courage/conf.php"]')

        if (hasData(c_continue)) {
            c_continue[0].click();
        } else {
            var backTop = $('a[href*="/event/summer2014/"]:contains("Event Top")');

            if (hasData(backTop)) {
                backTop[0].click();
            } else {
                done();
                goHome();
            }
        }
    } else if (window.location.pathname == "/event/summer2014/courage/end.php" ||
        window.location.pathname == "/event/summer2014/courage/end_ghost.php") {
        var direction = $('a[href*="/event/summer2014/courage/conf.php"]');
        var conf_done = $('a[href*="/event/summer2014/courage/conf_end.php"]');

        if (hasData(conf_done)) {
            conf_done[0].click();
        } else if (hasData(direction)) {
            direction[Math.floor(Math.random() * direction.length)].click();
        } else {
            var backTop = $('a[href*="/event/summer2014/"]:contains("Event Top")');

            if (hasData(backTop)) {
                backTop[0].click();
            } else {
                done();
                goHome();
            }
        }
    } else if (window.location.pathname == "/event/summer2014/courage/end_game.php") {
        var backTop = $('a[href*="/event/summer2014/"]:contains("Event Top")');

        if (hasData(backTop)) {
            backTop[0].click();
        } else {
            done();
            goHome();
        }
    } else {
        //var top = $('a.event_button:contains("To Event Top")');


        var entryFromHome = $('a[href*="/event/summer2014/index.php"]')
        var entryFromRoot = $('a[href*="/event/summer2014/entry.php"]');
        //[0].click()
        var fishContinue = $('a[href*="/event/summer2014/goldfish/conf.php"]');
        var fishDone = $('a[href*="/event/summer2014/goldfish/conf_end.php"]'); //[0].click()
        var levelUp = $('a.event_button:contains("Level Up")');
        var notAvailableYet = $('a.event_button:contains("Recover Stamina")');

        if (hasData(notAvailableYet)) {
        	//end case is when im out of energy and i get to this page
            done();
            var data = {};
            data['timeOutSummer'+prefix]= new Date().getTime();
            
            chrome.storage.local.set(data);
            goHome();
        } else if (hasData(fishDone)) {
            done();
            fishDone[0].click();
        } else if (hasData(levelUp)) {
            levelUp[0].click();
        } else if (hasData(fishContinue)) {
            fishContinue[0].click();
        } else if (hasData(entryFromRoot)) {
            entryFromRoot[0].click();
        } else if (hasData(entryFromHome)) {
            entryFromHome[0].click();
        } else {
            goHome();
        }

    }
}

//
// Time Check, Only run the event every so often.
//
function summer2014() {
    //add time out check,
    //at most once every 5-10 minutes
    chrome.storage.local.get('timeOutSummer'+prefix, function(data) {
        if (data['timeOutSummer'+prefix] && data['timeOutSummer'+prefix] > 0) {
            var now = new Date().getTime();
            var delta = now - data['timeOutSummer'+prefix];
            
            //every ~3-18 minutes (~10minutes)
            var nextTime = 60 * Math.floor((Math.random() * 15000) + 3000);
            if (delta > nextTime) {
               
                data['timeOutSummer'+prefix]= 0;
            
            	chrome.storage.local.set(data);
            	
            	//run actual event
            	summer2014Do();
            }else{

				//give up
            	done();
            	goHome();
            }
        } else {
        	//never done anything before
            summer2014Do();
        }
    });
}

//run the socialize link, its a simple event.
function socialize() {
    var button = $('a[href*="/contact/irara_contact_conf.php"]');

    if (hasData(button)) {
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
    var friendsList = $('a[href^="http://us-moe-app.amz-aws.jp/friend/list.php"]');
    var allMyFriends = $('a[href^="http://us-moe-app.amz-aws.jp/friend/index.php"]');
    var blanket = $('a.button1:contains("The blanket is off")');
    var bother = $('a.button1:contains("Bother")');
    //var next = $('img[src="http://us-moe-r53.amz-aws.jp/img/hp_sp/n_r.png"]').parent('a[href*="/friend/index.php"]')

    if (hasData(blanket)) {
        done();
        blanket[0].click();
    } else if (hasData(bother)) {
        done();
        bother[0].click();
    } //else if(hasData(next)){

    //}
    else if (hasData(allMyFriends) && window.location.pathname == "/friend/list.php") {
        allMyFriends[0].click();
    } else if (hasData(friendsList)) {
        friendsList[0].click();
    } else {
        done();
        goHome();
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
        }else if(hasData(note)){
        	note[0].click();
        	return true;
        }else if(hasData(nextMoe)){
        	//dont always do it, have ~3 min timeout
        	
        	
        	if (timeOutNext==null) {
        		timeOutNext=0;
        	}
            
            var now = new Date().getTime();
            var delta = now - timeOutNext;
	        var nextTime = Math.floor(1000*60 * (Math.random() * 3 + 1));
	        
	        if (delta > nextTime) {
                var data = {};
        	    data['timeOutNext'+prefix]= now;
            
				chrome.storage.local.set(data);
            	
            	nextMoe[0].click(); return true;
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

//
// - - - - - - - - - 
// -  main  block  -
// - - - - - - - - - 
//
function letsGo() {
    try {
        chrome.storage.local.get('task'+prefix, function(items) {
            if (items['task'+prefix]) {
                if (checkMyGirl()) {
                    console.log("girl cared for");
                } else {
                    console.log(items['task'+prefix]+" , "+prefix);
                    items.task=items['task'+prefix];
                    if (items.task == "recommend") {
                        //"recommend"
                        letsGoRecomend();
                    } else if (items.task == "social") {
                        socialize();
                    } else if (items.task == "event") {
                        summer2014();
                    } else if (items.task == "friend") {
                        letsGoFriend();
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
function getStats(){
	
	if(window.location.pathname=="/room/status.php"){
		var attrValues = $('span[style*="color:#e70e55"]');
		
		var len = attrValues.length/2;
		var i = 0;
		
		var data = {};
		while(i<len){
			var aName = attrValues[i].innerHTML;
			var aValue = parseInt(attrValues[i+1].innerHTML);
			
			i+=2;
			
			aName = aName.substring(2,aName.length-2);
			data[aName]=aValue;
		}
		
		var data = {};
      		  data['moeStats'+prefix]= data
   		
		chrome.storage.local.set(data);
		
		done();
		goHome();
	}else if(window.location.pathname=="/room/index.php"){
		var roomStatus = $('a[href*="/room/status.php"]');
		
		if(hasData(roomStatus)){
			roomStatus[0].click();
		}
	}else{
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
var prefix = "_none"; // will be the tabId
var postedTimes = false;
var timeOutNext = 0;
var i = 0;

//
/// Listener for getting tabId back
//
chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
    if(request.tabid)
	{
   		console.log('The response is : ' + request.tabid);
    	prefix =  request.tabid;
    
    	if(!postedTimes){
  	   		chrome.storage.local.get('task'+prefix, function(items) {
		    	$('body').prepend("event="+items['task'+prefix]+", prefix="+prefix+", delay="+time+"<br>");
			});
			postedTimes=true;
		}
    
	}else{
		alert("error!");
	}
});

//
// Main Block
//
function main(){
	//if i dont have a prefix yet
	if(prefix=="_none"){
		//log a .
		$('body').prepend(".");
		
		//if I've done this more than 60 times, 
		//  go home and lets get back here later
		if(i>60){
			goHome();
		}
		
		//every 10 times lets rerun
		if(i%10==0){
			//get tabId from core
			chrome.extension.sendRequest({ action: 'getTabId'});
		}
		i++;
		
		//try again in 300ms.
		setTimeout(main,300);
	}else{
		//well i have done stuff
		//check if I am paused, otherwise get core variables and lets go on
		chrome.storage.local.get(['pause','timeOutNext'+prefix],function(items){
			//Core Variable loading 
			//this is the time for the next moe click
			timeOutNext = items['timeOutNext'+prefix];
		
			//if paused, wait 300 ms
			if(items.pause==true||items=="true"){
				//console.log("still paused");
				setTimeout(main,300);
			}else{
				//flat line dixie, lets do some stuff 
				//after a little more delay
				//time = [0ms->3000ms]+2^[0->10] ms + 663 ms
				time = Math.floor(Math.pow(2, Math.random()*10) + 663 + Math.random()*3000);
	
				setTimeout(letsGo, time);
			}
		});
	}
}


//
// Run main function!
//
main();
