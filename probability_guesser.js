var config = {
  wager: {
    value: 100,
    type: "balance",
    label: "wager",
  },
  payout: {
    value: 2,
    type: "multiplier",
    label: "payout",
  },
  threshold: {
    value: 100,
    type: "multiplier",
    label: "threshold",
  },
};



engine.on("GAME_STARTING", onGameStarting);
engine.on("GAME_ENDED", onGameEnded);

var numBets = 0;
var betting = false;

var initial_balance = 0;
var ending_balance = 0;
var profit = 0;


function onGameStarting() {
  log("game starting");
  var threshold = config.threshold.value;
  
  if(betting){
    if(numBets == 5){
      betting = false;
      numBets = 0;
      ending_balance = userInfo.balance/100;
      // log("ending balance:", ending_balance);
      profit = ending_balance - initial_balance;
      if(profit > 0){
        log("WE MADE", profit, "BITS!");
      }else{
        log("we lost", -profit, "bits :(");
      }
      
    }else{
      makeBet();
      numBets++;
    }
  }else{
    var lastGame = engine.history.first();
    var bust = lastGame.bust;
    // log("bust value:", bust);

    if(shouldBet(bust, threshold)){
      log("betting!");
      betting = true;
      makeBet();
      numBets++;
      initial_balance = userInfo.balance/100;
      // log("initial balance:", initial_balance)
    }else{
      log("not betting this round.");
    }
  }
}

function onGameEnded() {
  var lastGame = engine.history.first();

  // If we wagered, it means we played
  if (!lastGame.wager) {
    return;
  }

  if (lastGame.cashedAt) {
    var profit =
      (config.wager.value * lastGame.cashedAt - config.wager.value) / 100;
    log("we won", profit.toFixed(2), "bits");
  } else {
    log("we lost", Math.round(config.wager.value / 100), "bits");
  }
  log("game ended");
}

function shouldBet(bust, upperBound){
  // log("should bet?");
  // log("what?");
  if(bust <= upperBound && numBets == 0){
    return true;
  }else{
    return false;
  }
}

function makeBet() {
  // log("making bet #", numBets+1);
  engine.bet(config.wager.value, config.payout.value);
  log(
    "making bet #", numBets+1,
    "with a wager of",
    Math.round(config.wager.value / 100),
    "on",
    config.payout.value,
    "x"
  );

}