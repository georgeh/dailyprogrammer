/* https://www.reddit.com/r/dailyprogrammer/comments/3v4zsf/20151202_challenge_243_intermediate_jennys_fruit/ */

var R = require('ramda');
var readline = require('readline');

var input = [];
var priceList = {};
// var input = ['banana 32', 'kiwi 41', 'mango 97', 'papaya 254', 'pineapple 399'];

var makePriceList = R.compose(R.mapObjIndexed(parseInt), R.fromPairs, R.map(R.split(' ')));

var priceCheck = function(item) {
    return priceList[item];
}

var total = R.compose(R.sum, R.map(priceCheck));

function findBaskets(cart, items) {
    return items.reduce(function(solutions, item, index) {
        var itemCart = R.append(item, cart);
        var itemCartTotal = total(itemCart);
        if (itemCartTotal === 500) {
            solutions.push(itemCart);
        } else if (itemCartTotal < 500) {
            solutions = solutions.concat(findBaskets(itemCart, R.drop(index, items)));
        }
        return solutions;
    }, []);
}

function pluralize(word, count) {
    return (Math.abs(count) === 1) ? word : word + 's';
}

function prettyPrint(cart) {
    var currItem = cart[0],
        itemCount = 0;
        
    var reducedCart = cart.reduce(function(lineMap, item) {
            lineMap[item] = 1 + (lineMap[item] || 0);
            return lineMap;
        }, {});
    
    return R.keys(reducedCart)
        .reduce(function(output, item) { 
            var count = reducedCart[item];
            return R.append(count.toString() + ' ' + pluralize(item, count), output); 
        }, [])
        .join(', ');
}

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', function (line) {
    input.push(line);
});

rl.on('close', function() {
    priceList = makePriceList(input); 
    var validCarts = findBaskets([], R.keys(priceList));
    console.log(validCarts.map(prettyPrint).join('\n'));
});