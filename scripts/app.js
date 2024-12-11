const addPersonButton = document.getElementById('addperson');
const personForm = document.getElementById('personForm');
const payerList=document.getElementById('payers');
const payCardList=document.getElementById('paycardlist');
const personTemplate = document.getElementById('personTemplate'); 
const paidForList=document.getElementById('paidfor');
const addPayCardButton = document.querySelector('.icon-wrapper');
const dataColl=document.getElementById('calc');
const takeNames=document.getElementById('takenames');
const newCalc=document.getElementById('newcalc');
const resTable=document.getElementById('results');
const resRowTemp=document.getElementById('row0');
let personCount = 0;  
let namesArray = [];
let payCardCount = 0; 
let pay=[];
let amount=[];
let forr=[];

dataColl.addEventListener('click',()=>{

    const allPayCards = document.querySelectorAll('#paycardlist > [id^="paycard"]');

    allPayCards.forEach((payCard) => {
        // Collect amount
        const amountInput = payCard.querySelector('input[type="number"]');
        if (amountInput && amountInput.value.trim() !== "") {
            amount.push(Number(amountInput.value));
        } else {
            amount.push(null); // If no amount is entered, push null
        }

        // Collect selected payers
        const payerSelect = payCard.querySelector('#payers');
        if (payerSelect) {
            const selectedPayers = Array.from(payerSelect.selectedOptions).map(option => option.value);
            pay.push(selectedPayers);
        } else {
            pay.push([]); // Push an empty array if no payers are selected
        }

        // Collect selected paid-for
        const paidForSelect = payCard.querySelector('#paidfor');
        if (paidForSelect) {
            const selectedPaidFor = Array.from(paidForSelect.selectedOptions).map(option => option.value);
            forr.push(selectedPaidFor);
        } else {
            forr.push([]); // Push an empty array if no paid-for names are selected
        }
    });

    console.log("Amounts:", amount);
    console.log("Payers:", pay);
    console.log("Paid For:", forr);
    payCardList.style.display='none';
    addPayCardButton.style.display='none';
    dataColl.style.display='none';
 
    const transactions = solution();
    resTable.style.display = 'block';
    
    // Check if transactions is empty
    if (transactions.length === 0) {
        // Create a new row with the message and display it
        const messageRow = document.createElement('div');
        messageRow.classList.add('transaction-row');
        messageRow.style.display = 'grid'; // Ensure it's visible
        messageRow.innerText = "No transactions are required, chill! 😎"; // Add the cool emoji here
        resTable.appendChild(messageRow);
    } else {
        // Loop through the transactions and display each as a row
        transactions.forEach((transaction, index) => {
            // Clone the row template
            const newRow = resRowTemp.cloneNode(true);      
            newRow.style.display = 'grid'; // Make the cloned row visible
            newRow.classList.add('transaction-row'); // Add a class for easy cleanup later
            newRow.querySelector('#from0').innerText = transaction.from;
            newRow.querySelector('#to0').innerText = transaction.to;
            newRow.querySelector('#money0').innerText = transaction.money.toFixed(2); // Display amount with 2 decimals
    
            // Append the row to the results table
            resTable.appendChild(newRow);
        });
    }
    

});

newCalc.addEventListener('click',()=>{
    location.reload(); 
});
 

addPayCardButton.addEventListener('click', () => {
    payCardCount++; // Increment payment number

    // Clone the paycard template
    const payCardTemplate = document.getElementById('paycard0');
    const newPayCard = payCardTemplate.cloneNode(true);

    // Update the ID and payment number label for the cloned paycard
    newPayCard.id = `paycard${payCardCount}`; // Unique ID for each cloned paycard
    const paymentNumberLabel = newPayCard.querySelector('p');
    paymentNumberLabel.innerText = `Payment number ${payCardCount + 1}`;

    // Clear all input fields in the cloned card
    const inputs = newPayCard.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = ''; // Clear the value
    });

    // Clear all select fields in the cloned card
    const selects = newPayCard.querySelectorAll('select');
    selects.forEach(select => {
        select.value = ''; // Reset to default value
    });

    // Append the cloned paycard to the paycard list
    payCardList.appendChild(newPayCard);

    console.log(`Added Paycard ${payCardCount + 1}`);
});



function addNamesToList() {
    // Clear existing options in the payer list and paid-for list
    payerList.innerHTML = '';  
    paidForList.innerHTML = '';
  
    // Add a default option to the payer list
    const defaultOption = document.createElement('option');
    defaultOption.disabled = true;
    defaultOption.innerText = "Select Payers";
    payerList.appendChild(defaultOption);
  
    // Add a default option to the paid-for list
    const defaultPaidForOption = document.createElement('option');
    defaultPaidForOption.disabled = true;
    defaultPaidForOption.innerText = "Select Paid For";
    paidForList.appendChild(defaultPaidForOption);
  
    namesArray.forEach(personname => {
        // Create new option elements for both payer and paid-for lists
        const newOption = document.createElement('option');
        newOption.value = personname;
        newOption.innerText = personname;  // Set the name as the option text

        // Append the new option to both payer and paid-for lists
        payerList.appendChild(newOption);  // Add option to payer list
        paidForList.appendChild(newOption.cloneNode(true));  // Add cloned option to paid-for list
    });
    
    personForm.classList.add('hidden');
    addPersonButton.classList.add('hidden');
    takeNames.classList.add('hidden');
    console.log("added to list");

    
}


takeNames.addEventListener('click',()=>{
    namesArray = [];  // Clear the array before storing new names

    // Get all input fields in the form
    const inputs = personForm.querySelectorAll('input');
  
    // Iterate over the inputs and store non-empty values
    inputs.forEach(input => {
      const name = input.value.trim();
      if (name) {
        namesArray.push(name);  // Add non-empty name to the array
      }
    });
  
    console.log('Names Array:', namesArray);
    payCardList.style.display = 'block';
    addPayCardButton.style.display='block';
    dataColl.style.display='block';
    addNamesToList();


});

addPersonButton.addEventListener('click', () => {
  personCount++;  
  const newPerson = personTemplate.cloneNode(true);
  const newInput = newPerson.querySelector('input');
  newInput.value = ''; 
  newInput.id = `name${personCount}`;  // Unique ID for each input
  newInput.placeholder = `Enter person ${personCount+1} name`;  
  personForm.appendChild(newPerson);

  console.log(`Person ${personCount+1} added`);
});
