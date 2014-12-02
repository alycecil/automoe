// ---------------------------
// AutoMoe 
// ---------------------------
// William Cecil
// ---------------------------
// End the current task
// clear the current task
function done() {
    // set up obj
    var data = {};

    // set to done!
    data['task' + prefix] = 'done';

    chrome.storage.local.set(data);
}

function doneEvent() {
    var data = {};
    data['timeOutSummer' + prefix] = new Date().getTime();

    chrome.storage.local.set(data);
    done();
}

// choose next activity
function chooseNext() {
    // choose a random task.
    taskList = ["friend", "recommend",
        "event",
        "social", "rest", "gohome", "stats"
    ];

    // chose next task, RANDOMLY!
    var next = Math.floor((Math.random() * taskList.length));

    // setup data
    var data = {};
    data['task' + prefix] = taskList[next];

    // log out to screen
    $('body').prepend("next=" + taskList[next] + "<br>");

    // setup data
    chrome.storage.local.set(data);
}

function hasData(data) {
    return data != null && data.length != 0;
}

function amIHome() {
    var memos = $('ul#tab_memo:contains("Rec")');

    return hasData(memos);
}

// reload
function reloadMe() {
    console.log("reload !");
    window.location.reload();

    // recurve call jic
    setTimeout(reloadMe, 1000 * 60 * 5);
}

//
// navigate to home page
//
function goHome() {
    if (!amIHome()) {
        // go to my room!
        var room = $('img[alt="My Room"]');

        if (room == null || room.length == 0) {
            console.log("lost room");
            setTimeout(reloadMe, 1000 * 60 * 5);
        } else {
            room.click();
        }
    } else {
        // go to main page
        var room = $('a[href="http://us-moe-app.amz-aws.jp/#"]');

        if (room == null || room.length == 0) {
            console.log("lost root");
            setTimeout(reloadMe, 1000 * 60 * 5);
        } else {
            room[0].click();
        }
    }
}

// lets go recommend some things
function letsGoRecomend() {
    var dataValue = 'recomendTimeOut' + prefix;
    chrome.storage.local.get(
        [dataValue],
        function(data) {
            if (data[dataValue] && data[dataValue] > 0) {
                var now = new Date().getTime();
                var delta = now - data[dataValue];

                // every ~5 hours minutes
                var nextTime = 5 * 60 * Math
                    .floor((Math.random() * 21000) + 5000);
                if (delta > nextTime) {



                    doEvent = true;
                } else {
                    doEvent = false;
                }
            } else {
                doEvent = true;
            }

            if (doEvent) {
                if ($('span:contains("No more Recommending today.")') ||
                    $('span:contains("You have reached the daily Recommendation limit (400).")')) {
                    //set timeout
                    var data = {};
                    var now = new Date().getTime();
                    data[dataValue] = now;
                    chrome.storage.local.set(data);
                    done();
                    goHome();
                } else {

                    // click the recommend costume button
                    var recCostume = $('input.give[value="Rec Costume"]');

                    // is recommend on page?
                    if (recCostume == null || recCostume.length == 0) {
                        var giveIndex = $('a[href*="us-moe-app.amz-aws.jp/give/index.php?"]');

                        // roulette ?
                        var roulette = $('img[alt="Roulette Link"]');

                        if (hasData(giveIndex)) { // go to room
                            // click the element
                            giveIndex[0].click();
                        } else if (hasData(roulette)) { // go to room
                            // click the element
                            roulette.parent()[0].click();
                        } else {
                            goHome();
                        }
                    } else {
                        done();
                        recCostume.click();
                    }
                }
            } else {
                // give up
                done();
                goHome();
            }
        });

}

function evenHandler(lastHelped) {
    var eventRoot = $('a[href*="/event/"][href*="/index.php"]');

    var life = $('img[src*="/img/event/"][src*="/sp/gauge_"][src*=".png?nocache=1"][width*="%"]');

    if (hasData(life)) {
        life = parseInt(life.attr('width'));
    }else{
        life = null;

        if (hasData(eventRoot)) {
            eventRoot[0].click();
            return;
        }
    }

    if (life != null && life <= 3) {
        done();
        doneEvent();
        goHome();
    }
    if (window.location.pathname.indexOf("/event/") == 0) {

        if (lastHelped == null) {
            lastHelped = 0;
        }
        var now = new Date().getTime();
        var askForHelp = $('a[href*="/event/"][href*="/raid/help_conf.php?"]');
        if (hasData(askForHelp)) {
            askForHelp[0].click();
            return;
        }

        if (window.location.pathname.indexOf("/quest/no_life.php") > 0) {
            done();
            goHome();
        } else if (window.location.pathname.indexOf("/raid/index.php") > 0) {
            var helpsomeone = $('a[href*="/event/"][href*="/raid/detail.php?"]:not(:contains("Tired"))');
            if (hasData(helpsomeone)) {
                helpsomeone[0].click();
            } else {
                if (hasData(eventRoot)) {
                    var which = Math.floor(eventRoot.length * Math.random());

                    eventRoot[which].click();
                } else {
                    goHome();
                }
            }
        } else if (window.location.pathname.indexOf("/raid/detail.php") > 0 || window.location.pathname.indexOf("/raid/end.php") > 0) {
            // raid detail
            // either help page or attack page
            var help = $('a[href*="/event/"][href*="/raid/atk_conf.php"]:contains("Help")');
            var hasAttack = $('a[href*="/event/"][href*="/raid/atk_conf.php"]:contains("x1")');
            // if no help, go back
            var hasHelp = $('a[href*="/event/"][href*="/raid/index.php"]');

            var life = $(
                $('img[src*="/img/event/"][src*="/sp/battle_gauge_off.png"]')
                .parent()[0]).children().length - 1;
            if (life < 0) {
                //if not found set to 1
                life = 1;
            }
            if (hasData(askForHelp)) {
                askForHelp[0].click();
            } else if (hasData(hasAttack)) {
                // if has health, other wise done()

                if (life > 0) {

                    hasAttack[0].click();
                } else {
                    // maybe check stamina
                    if (hasData(askForHelp)) {
                        doneEvent();
                        askForHelp[0].click();
                    } else {
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

        } else if (window.location.pathname.indexOf("/raid/no_life.php") > 0) {
            doneEvent();
            goHome();
        } else if (window.location.pathname.indexOf("/quest/") >= 0) {
            var doneHere = false;
            if (lastHelped + 3 * 60 * 1000 < now) {
                var hasHelp = $('a[href*="/event/"][href*="/raid/index.php"]');

                if (hasData(hasHelp)) {
                    // set lastHelpered to now and help
                    // var now = new Date().getTime();
                    var data = {};
                    data['lastHelped' + prefix] = now;
                    chrome.storage.local.set(data);

                    hasHelp[0].click();
                    doneHere = true;
                }
            }

            if (!doneHere) {
				
                // maybe check stamina by % redbar
                // var encounter =
                // $('a[href*="/event/"][href*="/raid/detail.php?"]').find(".encount");

                // if i have a raid todo
                var helpsomeone = $('a[href*="/event/"][href*="/raid/detail.php?"]:not(:contains("Broom")):not(:contains("Tired state"))');

                // keep going
                var keepGoing = $('a[href*="/event/"][href*="/quest/conf.php"]');
                
                //next stage
                var nextQuest = $('a[href*="/event/"][href*="/quest/next_conf.php"]');
                
                //dont give item 
                var sayNo = $('a[href*="/event/"][href*="item_conf.php"]:contains("No")');

                if (hasData(sayNo)) {
                    sayNo[0].click();
                } else if (hasData(helpsomeone)) {
                    helpsomeone[0].click();
                } else if (hasData(keepGoing)) {
                    keepGoing[0].click();
                }else if (hasData(nextQuest)) {
                    nextQuest[0].click();
                } else if (hasData(eventRoot)) {
                    var which = Math.floor(eventRoot.length * Math.random());

                    eventRoot[which].click();
                } else {
                    goHome();
                }

            }

        } else if (window.location.pathname.indexOf("/raid/help_end.php") > 0) {
            if (hasData(eventRoot)) {
                var which = Math.floor(eventRoot.length * Math.random());

                eventRoot[which].click();
            } else {
                goHome();
            }

        } else {
            var doneHere = false;
            if (lastHelped + 3 * 60 * 1000 < now) {
                var hasHelp = $('a[href*="/event/"][href*="/raid/index.php"]');

                if (hasData(hasHelp)) {
                    // set lastHelpered to now and help
                    var data = {};
                    data['lastHelped' + prefix] = now;
                    chrome.storage.local.set(data);

                    hasHelp[0].click();
                    doneHere = true;
                }
            }

            if (!doneHere) {
                // other root triggers
                // start hunt
                var start = $('a[href*="/event/"][href*="/quest/?"]');
                if (hasData(start)) {
                    start[0].click();
                    doneHere = true;
                }

            }

            if (!doneHere) {
                // go to event

                var gotoevent = $('a[href*="/event/"][href*="/story/index.php"]')
                if (hasData(eventRoot)) {
                    var which = Math.floor(eventRoot.length * Math.random());

                    eventRoot[which].click();
                } else if (hasData(gotoevent)) {
                    var which = Math.floor(gotoevent.length * Math.random());

                    gotoevent[which].click();
                } else {
                    goHome();
                }
            }

        }

    } else {
        if (hasData(eventRoot)) {
            var which = Math.floor(eventRoot.length * Math.random());

            eventRoot[which].click();
        } else {
            goHome();
        }
    }
}

// function eventSweetPotato(lastHelped) {
//
// // root
// if (window.location.pathname.indexOf("/index.php")>0) {
// var startQuest = $('a[href*="/event/"][href*="/quest/?"]');
// var bakePotatoes = $('a[href*="/event/"][href*="/battle/?"]');
//
// if (lastHelped + 1 * 60 * 60 * 1000 < now && hasData(bakePotatoes)) {
// // set lastHelpered to now and help
// var data = {};
// data['lastHelped' + prefix] = now;
// chrome.storage.local.set(data);
//
// bakePotatoes[0].click();
// } else if (hasData(startQuest)) {
// startQuest[0].click();
// } else {
// goHome();
// }
//
// } else if (window.location.pathname.indexOf("/quest/")>0
// || window.location.pathname.indexOf("/quest/end.php")>0
// || window.location.pathname.indexOf("/quest/next.php")>0) {
// var pickUp = $('a[href*="/event/"][href*="/quest/conf.php"]');
// var nextQuest = $('a[href*="/event/"][href*="/quest/next_conf.php"]');
//
// if (hasData(pickUp)) {
// pickUp[0].click();
// } else if (hasData(nextQuest)) {
// nextQuest[0].click();
// } else {
// goHome();
// }
// } else if (window.location.pathname.indexOf("/battle/")>0) {
// var owned = $('td:contains("Potato"):contains("Owned")');
// if (hasData(owned)) {
// owned = owned.html();
// owned = owned.substring(owned.indexOf("Owned") + 7);
// owned = owned.substring(0, owned.indexOf('<br>'));
// owned = parseInt(owned);
//
// if (owned > 0) {
// var bake = $('a[href*="/event/"][href*="/battle/create_conf.php"]');
//
// if (hasData(bake)) {
// bake[0].click();
// } else {
// goHome();
// }
// } else {
// goHome();
// }
// } else {
// goHome();
// }
// } else if (window.location.pathname.indexOf("/battle/battle.php")>0) {
// // bright
// var bright = $('div.bright');
//
// if (hasData(bright)) {
// bright.parent('a')[0].click()
// } else {
// var buttons = $('a[href*="/event/"][href*="/battle/check_conf.php?"]');
//
// if (hasData(buttons)) {
// var which = Math.floor(buttons.length * Math.random());
//
// buttons[which].click();
// } else {
// goHome();
// }
// }
// } else if (window.location.pathname.indexOf("/battle/result.php")>0) {
// var cookMore = $('a[href*="/event/"][href*="/battle/select_conf.php"]');
//
// if (hasData(cookMore)) {
// var which = Math.floor(cookMore.length * Math.random());
//
// cookMore[which].click();
// } else {
// var bright = $('div.bright')
// if (hasData(bright)) {
// bright.before('a')[0].click();
// } else {
// goHome();
// }
// }
// } else if (window.location.pathname.indexOf("/battle/select.php")>0) {
// var wonSoFar = $('td:contains("Medals won:")');
//
// if (hasData(wonSoFar)) {
// wonSoFar = wonSoFar.html();
// wonSoFar = wonSoFar
// .substring(wonSoFar.indexOf("Medals won: ") + 12);
// wonSoFar = wonSoFar.substring(0, wonSoFar.indexOf('<br>'));
// wonSoFar = parseInt(wonSoFar);
//
// var giveup = $('a[href*="/event/"][href*="/battle/end_conf.php?"]');
// var cookMore = $('a[href*="/event/"][href*="/battle/create_conf.php"]');
// if (wonSoFar <= 500 && hasData(cookMore)) {
// cookMore[0].click();
// } else if (hasData(cookMore) && Math.floor(3 * Math.random()) == 0) {
// // 1 in three of going again
// cookMore[0].click();
// } else if (hasData(giveup)) {
// giveup[0].click();
// } else {
// goHome();
// }
//
// } else {
// // auto give up
// var giveup = $('a[href*="/event/"][href*="/battle/end_conf.php?"]');
//
// if (hasData(giveup)) {
// giveup[0].click();
// } else {
// goHome();
// }
// }
//
// } else {
// if (hasData(eventRoot)) {
// eventRoot[0].click();
// } else {
// goHome();
// }
// }
// }

//
// Time Check, Only run the event every so often.
//
function eventRoot() {
    var doEvent = true;
    // add time out check,
    // at most once every 5-10 minutes
    chrome.storage.local.get(
        ['timeOutSummer' + prefix, 'lastHelped' + prefix],
        function(data) {
            if (data['timeOutSummer' + prefix] && data['timeOutSummer' + prefix] > 0) {
                var now = new Date().getTime();
                var delta = now - data['timeOutSummer' + prefix];

                // every ~5-26 minutes
                var nextTime = 60 * Math
                    .floor((Math.random() * 21000) + 5000);
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

            if (doEvent) {
                var value = 0;
                if (data['lastHelped' + prefix]) {
                    value = data['lastHelped' + prefix];
                }

                // never done anything before
                evenHandler(value);
            } else {
                // give up
                done();
                goHome();
            }
        });
}

// run the socialize link, its a simple event.
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
    chrome.storage.local.get(['friendsHit' + prefix], function(items) {
        var value = 0;

        if (items['friendsHit' + prefix] != null) {
            value = items['friendsHit' + prefix];
        }

        setFriendsData(value + 1);

        actualFriendsDo(value);
    });
}

function setFriendsData(value) {
    var data = {};
    data['friendsHit' + prefix] = value;

    chrome.storage.local.set(data);
}

function actualFriendsDo(hits) {

    if (window.location.pathname == "/give/end.php") {
        var friendsList = $('a[href^="http://us-moe-app.amz-aws.jp/friend/list.php"]');
        var allMyFriends = $('a[href^="http://us-moe-app.amz-aws.jp/friend/index.php"]');
        if (hasData(allMyFriends)) {
            var index = Math.floor(Math.random() * allMyFriends.length);
            allMyFriends[index].click();
        } else if (hasData(friendsList)) {
            var index = Math.floor(Math.random() * friendsList.length);
            friendsList[index].click();
        } else {
            goHome();
        }
    } else if (window.location.pathname == "/give/index.php") {
        var friendsList = $('a[href^="http://us-moe-app.amz-aws.jp/friend/list.php"]');
        var recCostume = $('input.give[value="Rec Costume"]');

        if (hasData(recCostume)) {
            recCostume.click();
        } else if (hasData(friendsList)) {
            var index = Math.floor(Math.random() * friendsList.length);
            friendsList[index].click();
        } else {
            goHome();
        }
    } else if (window.location.pathname == "/friend/index.php") {
        var giveIndex = $('a[href*="/give/index.php?"]');
        var blanket = $('a.button1:contains("The blanket is off")');
        var bother = $('a.button1:contains("Bother")');
        var friendsList = $('a[href^="http://us-moe-app.amz-aws.jp/friend/list.php"]');

        if (hasData(giveIndex)) {
            giveIndex[0].click();
        } else if (hasData(blanket)) {
            done();
            setFriendsData(0);
            blanket[0].click();
        } else if (hasData(bother)) {
            done();
            setFriendsData(0);
            bother[0].click();
        } else if (hasData(friendsList)) {
            var index = Math.floor(Math.random() * friendsList.length);
            friendsList[index].click();
        } else {
            goHome();
        }

    } else {
        var friendsList = $('a[href^="http://us-moe-app.amz-aws.jp/friend/list.php"]');
        var allMyFriends = $('a[href^="http://us-moe-app.amz-aws.jp/friend/index.php"]');
        var other = $('a[href^="http://us-moe-app.amz-aws.jp/friend/list.php"]:contains("Others")');
        // var next =
        // $('img[src="http://us-moe-r53.amz-aws.jp/img/hp_sp/n_r.png"]').parent('a[href*="/friend/index.php"]')
        var quitCount = Math.floor(Math.random() * 30 + 10);

        // else if(hasData(next)){

        // }
        if (hasData(other) && window.location.pathname == "/friend/list.php") {
            if (hits > quitCount) {
                setFriendsData(0);
                done();
            }
            other[0].click();
        } else if (hasData(allMyFriends) && window.location.pathname == "/friend/list.php") {
            if (hits > quitCount) {
                setFriendsData(0);
                done();
            }
            var index = Math.floor(Math.random() * allMyFriends.length);
            allMyFriends[index].click();
        } else if (hasData(friendsList)) {
            var index = Math.floor(Math.random() * friendsList.length);
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
function checkMyGirl(data) {
    if (window.location.pathname == "/room/index.php") {
        console.log("Check out my girl");

        var now = new Date().getTime();
        var talkToMe = false;
        if (data['lastTalked' + prefix]) {
            if (data['lastTalked' + prefix] + 60 * 61 * 1000 > now) {
                // if an hours passed
                talkToMe = true;
            }
        } else {
            // ive never talked in this run
            talkToMe = true;
        }

        if (talkToMe) {
            // var comBtn = $('a#android_menu_com_btn');
            // if (hasData(comBtn)) {
            // comBtn.children().click();
            // //comBtn[0].click();
            //
            // }
            // var callMe = $('a#callandroid');
            //
            // if (hasData(callMe)) {
            // callMe[0].click();
            //
            // }
            // var goBtn = $('span.button1:contains("GO!")');
            //
            // if (hasData(goBtn)) {
            // goBtn[0].click();
            //
            // }
            //
            // var backBtn = $('a.button1[onclick*="loseTalk"]');
            // var busy = $('td.txt_w:contains("busy")');
            //
            // if (hasData(backBtn)) {
            // backBtn[0].click();
            //
            // var items = {};
            // items['lastTalked' + prefix] = now;
            // chrome.storage.local.set(items);
            // goHome();
            // }else if(hasData(busy)){
            // var items = {};
            // items['lastTalked' + prefix] = now;
            // chrome.storage.local.set(items);
            // goHome();
            // }
            // else {
            //
            // setTimeout(1000, checkMyGirl);
            // }

        }

        // other triggers
        var warn = $('a.button1:contains("Warn")');
        var cheer = $('a.button1:contains("Cheer")');
        var reco = $('a.button1:contains("Remove Recommendation")');
        var stroke = $('a.button1:contains("Stroke")');
        var blueHeart = $('a[href*="get_user_item/index.php"]');
        var redHeart = $('a[href*="present/get_list.php"]');
        var note = $('a:contains("Read the note")');
        var nextMoe = $('a[href*="/android/change.php"]');

        var timeTilSleep = $('a.skeleton:contains("Time remaining")');

        if (hasData(timeTilSleep)) {
            var shorten = timeTilSleep.html();

            shorten = shorten.match(/Sleep \d*h*\d+m*/);

            if (hasData(shorten)) {

                var time = shorten[0].substring(6);

                if (time.indexOf('h') < 0) {
                    // go to sleep if under 30mins

                    var timeMins = time.match(/\d*/);

                    if (hasData(timeMins)) {
                        var mins = timeMins[0];

                        mins = parseInt(mins, 10);

                        if (mins < 39) {
                            console.log('goto sleep');
                            $('a.skeleton:contains("Time remaining")').click();

                            var putToSleep = $('a.button1:contains("Put to sleep")[href*="/sleep/conf.php"]');

                            if (hasData(putToSleep)) {
                                putToSleep[0].click();
                            }
                        }
                    }

                }

            }
        }

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
            // dont always do it, have ~3 min timeout

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
// - main block -
// - - - - - - - - -
//
function letsGo() {
    try {
        chrome.storage.local.get(['task' + prefix, 'lastTalked' + prefix],
            function(items) {
                if (items['task' + prefix]) {
                    if (checkMyGirl(items)) {
                        console.log("girl cared for");
                    } else {

                        if (window.location.pathname.indexOf("/error.php") > 0) {
                            done();
                            goHome();
                        } else {
                            console
                                .log(items['task' + prefix] + " , " + prefix);
                            items.task = items['task' + prefix];
                            if (items.task == "recommend") {
                                // "recommend"
                                letsGoRecomend();
                            } else if (items.task == "social") {
                                socialize();
                            } else if (items.task == "event") {
                                eventRoot();
                            } else if (items.task == "friend") {
                                letsGoFriend();
                            } else if (items.task == "rest") {
                                letsNap();
                            } else if (items.task == "gohome") {
                                goHome();
                                done();
                            } else if (items.task == "stats") {
                                getStatsRoot();

                            } else {

                                // must be done or someones messing with us
                                chooseNext();
                                letsGo();

                            }
                        }
                    }
                } else {
                    // never ran before
                    chooseNext();
                    letsGo();
                }
            });
    } catch (e) {
        // some crazy exception, lets reset ourself
        chooseNext();
        letsGo();
    }
}

//
// Time Check, Only run the event every so often.
//
function getStatsRoot() {
        var checkStats = true;
        var dataName = 'timeOutStats';
        // add time out check,
        // at most once every 5-10 minutes
        chrome.storage.local.get([dataName + prefix], function(data) {
            if (data[dataName + prefix] && data[dataName + prefix] > 0) {
                var now = new Date().getTime();
                var delta = now - data[dataName + prefix];

                // every ~5-26 minutes
                var nextTime = 60 * Math.floor((Math.random() * 21000) + 5000);
                if (delta > nextTime) {

                    data[dataName + prefix] = 0;

                    chrome.storage.local.set(data);

                    checkStats = true;
                } else {
                    checkStats = false;
                }
            } else {
                checkStats = true;
            }

            if (checkStats) {

                // never done anything before
                getStats(data);
            } else {
                // give up
                done();
                goHome();
            }
        });
    }
    // Not currently used but gets the active girl's stats
function getStats() {

    if (window.location.pathname == "/room/status.php") {
        var attrValues = $('span[style*="color:#e70e55"]');

        var i = 0;
        var data = {};
        while (i < attrValues.length) {
            var aName = attrValues[i].innerHTML;
            var aValue = parseInt(attrValues[i + 1].innerHTML);

            i += 2;

            aName = aName.trim();
            aName = aName.substring(1, aName.length - 1);
            data[aName] = aValue;
        }

        var name = $('div.obi4').html();

        var dataStore = {};
        dataStore['moeStats:' + name] = data

        chrome.storage.local.set(dataStore);

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
var prefix = "_none"; // will be the tabId
var postedTimes = false;
var timeOutNext = 0;
var i = 0;

// time = [0ms->3000ms]+2^[0->10] ms + 663 ms
time = Math.floor(Math.pow(2, Math.random() * 10) + 663 + Math.random() * 3000);

//
// / Listener for getting tabId back
//
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.tabid) {
        console.log('The response is : ' + request.tabid);
        prefix = request.tabid;

        if (!postedTimes) {
            chrome.storage.local.get('task' + prefix, function(items) {
                $('body').prepend(
                    "event=" + items['task' + prefix] + ", prefix=" + prefix + ", delay=" + time + ", fail=" + failTime + "<br>");
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
    // if i dont have a prefix yet
    if (prefix == "_none") {
        // log a .
        $('body').prepend(".");

        // if I've done this more than 60 times,
        // go home and lets get back here later
        if (i > 60) {
            goHome();
        }

        // every 10 times lets rerun
        if (i % 10 == 0) {
            // get tabId from core
            chrome.extension.sendRequest({
                action: 'getTabId'
            });
        }
        i++;

        // try again in 300ms.
        setTimeout(main, 300);
    } else {
        // well i have done stuff
        // check if I am paused, otherwise get core variables and lets go on
        chrome.storage.local.get(['pause', 'timeOutNext' + prefix], function(
            items) {
            // Core Variable loading
            // this is the time for the next moe click
            timeOutNext = items['timeOutNext' + prefix];

            // if paused, wait 300 ms
            if (items.pause == true || items == "true") {
                // console.log("still paused");
                setTimeout(main, 300);
            } else {
                // flat line dixie, lets do some stuff
                // after a little more delay
                if (!postedTimes) {
                    chrome.storage.local.get('task' + prefix, function(items) {
                        $('body').prepend(
                            "event=" + items['task' + prefix] + ", prefix=" + prefix + ", delay=" + time + ", fail=" + failTime + "<br>");
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