function coinflip(args, ifprofile, prefix) {
    if (args) {
        var amount = args[0];
        var side = args[1];
      }
      else {
       return "Please specify a bet.";
      }
      if (amount && side && amount > 0 && ifprofile && amount <= Number(ifprofile) && (side.toLowerCase() == "heads" || side.toLowerCase() == "tails")) {
          //Coinflip code: (includes coin flipping animation in gif emote)
        return "Successful coinflip."
      }
      else if (!ifprofile) {
          return `Create a profile first with ${prefix}create`;
      }
      else {
         return `Please specify a valid bet that is less than or equal to your current balance and a valid coin side. Check with ${prefix}balance.`; 
      }
}

module.exports = {
    flip: coinflip
}