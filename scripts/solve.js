function minimizeTransactions(scores) {
    const positives = [];
    const negatives = [];

    // Separate scores into positives and negatives
    for (const [name, money] of Object.entries(scores)) {
        if (money > 0) positives.push({ name, money });
        else if (money < 0) negatives.push({ name, money });
    }

    const dp = new Map(); // Memoization map for DP
    const transactions = []; // Array to store transaction details

    function recurse(positives, negatives) {
        // Base case: If no positives or negatives left, return 0
        if (positives.length === 0 && negatives.length === 0) return 0;

        // Generate a unique key for the current state
        const stateKey = `${positives.map(p => p.money).join(',')}:${negatives.map(n => n.money).join(',')}`;
        if (dp.has(stateKey)) return dp.get(stateKey);

        const negative = negatives[0];
        let minTransactions = Infinity;

        // Ensure the positives array is not empty before iterating
        if (positives.length === 0) return 0;

        positives.forEach((positive, index) => {
            const newPositives = [...positives]; // Shallow copy of the array
            const newNegatives = negatives.slice(1); // Remove the first negative

            const transactionMoney = Math.min(positive.money, -negative.money);

            if (positive.money === transactionMoney) {
                newPositives.splice(index, 1); // Remove the fully settled positive
            } else {
                newPositives[index] = { name: positive.name, money: positive.money - transactionMoney };
            }

            if (negative.money === -transactionMoney) {
                // Fully settled negative is already removed
            } else {
                newNegatives.push({ name: negative.name, money: negative.money + transactionMoney });
            }

            const subTransactions = recurse(newPositives, newNegatives);

            if (subTransactions + 1 < minTransactions) {
                minTransactions = subTransactions + 1;

                transactions.push({
                    from: negative.name,
                    to: positive.name,
                    money: transactionMoney,
                });
            }
        });

        dp.set(stateKey, minTransactions);
        return minTransactions;
    }

    recurse(positives, negatives);

    console.log("Transactions:", transactions);
    return transactions; 
}

function solution() {
    // Create a map-like structure to store names and scores
    let scores = {};

    // Initialize each name in the namesArray with a score of 0
    namesArray.forEach(name => {
        scores[name] = 0; // Initialize each name with score 0
    });

    console.log("Initial Scores:", scores);

    // Process the collected data (amount, pay, forr)
    amount.forEach((amt, index) => {
        // Divide the amount equally among those it is paid for
        const splitAmount = amt / forr[index].length;
        const paySplit = amt / pay[index].length;
        
        // Deduct the amount from payers' scores
        pay[index].forEach(payer => {
            scores[payer] += paySplit; // Deduct the total amount paid by the payer
        });

        // Add the split amount to the scores of those it was paid for
        forr[index].forEach(person => {
            scores[person] -= splitAmount;
        });
    });

    console.log("Final Scores:", scores);
    // Reduce transactions
    const transactions = minimizeTransactions(scores);
    console.log("Transactions:", transactions);
    return transactions;
}
