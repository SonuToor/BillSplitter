const partyForm= document.querySelector('.initial-form');
const partySizeInput = document.getElementById("party-size");

let partyList = []; 
let itemsArray = [];

const partyMemberNamesInput = document.querySelector(".party-members-input");
const partyMembersForm = document.querySelector(".party-members-form");


const itemsForm = document.querySelector(".item-input-form");
const itemName= document.getElementById("item");
const itemQuantity = document.getElementById("quantity");
const itemPrice = document.getElementById("price");
const itemsDisplay = document.querySelector(".item-display");
const itemsList = document.querySelector(".items");

const billSplitButton = document.getElementById("calculate-totals");
const totalsTableEntries = document.querySelector(".member-entries");


partyForm.addEventListener("submit", partySetup);
partyMembersForm.addEventListener("submit", populatePartyList);
itemsForm.addEventListener("submit", populateItemsList); 
billSplitButton.addEventListener("click", splitBill);


// create inputs for the user to provide the party members names based on the party size provided 
function partySetup(e) {
   
    e.preventDefault(); 

    const partySize = Number(partySizeInput.value);

    for (let i = 0; i < (partySize - 1) ; i++) {

        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("placeholder", "Enter name.");
        input.classList.add("party-member-input");
        input.setAttribute("required", "");
        partyMemberNamesInput.appendChild(input);
    }
    partySizeInput.value = ""; 
    
    partySizeInput.setAttribute("disabled", true);
}


// create a list to store the members of the party
function populatePartyList(e){
    e.preventDefault();

    if (partyList.length > 0) {
        return
    }
    const partyMembers = document.querySelectorAll(".party-member-input");

    partyMembers.forEach(member => { 
        partyList.push(member.value)

        member.setAttribute("disabled", true)
    
    });

    createTotalTableRows(partyList);
}

// set up the table that will display what each member owes
function createTotalTableRows(list) {

    list.forEach(member => {
        let newRow = document.createElement("tr")

        newRow.classList.add(`${member}`)

        newRow.innerHTML = `<td>${member}</td> <td class="total-owed">$0.00</td>`

        totalsTableEntries.appendChild(newRow)
    });
}

// create checkboxes that represent each member to attach to each item in the items list
function memberCheckboxCreator(list) {

    let html = "";

    partyList.forEach(member => html += `<input type="checkbox" value="${member}" class ="party-member-checkbox" checked>${member}<br>`)
    
    return html; 

}

// post the item the user provides into the list with the necessary information 
function populateItemsList(e) {

    e.preventDefault();

    const item = document.createElement("li");

    item.classList.add(`${itemName.value.trim()}`);
    item.classList.add("item-entry")
    
    let checkboxes = memberCheckboxCreator(partyList);
    
    item.innerHTML = `<span class="item-entry-name">${itemName.value}</span> 
    <span class="item-entry-details">Price: $${itemPrice.value}  Quantity:${itemQuantity.value}</span><br>${checkboxes}`;

    itemsList.appendChild(item);

    storeItemInfo(itemName.value, itemPrice.value, itemQuantity.value);
    
    itemName.value = "";
    
    itemQuantity.value = "";
    
    itemPrice.value = "";

}

// create an object that has the items info and then store it in an array
function storeItemInfo(name, price, quantity) {
    
    let itemEntry = {
        "name": name,
        "price" : price,
        "quantity" : quantity
    }
    
    itemsArray.push(itemEntry);
}

// Calculate how much each person needs to pay based on the price, quantity and the party members who consumed the item. 
function itemPricePerPersonCalc(checkboxes, index) {
    let numPeopleInvolved = 0;

    checkboxes.forEach(checkbox => {
        if (checkbox.checked == true) {

            numPeopleInvolved += 1
        }
    });

    let itemObj = itemsArray[index];

    let itemPrice = +(itemObj.price);

    let itemQuantity = +(itemObj.quantity);

    let pricePer = ((itemPrice * itemQuantity) / numPeopleInvolved);

    return pricePer
}

// split the cost among the correct party members and update the table 
function splitBill() {

    if (itemsList.hasChildNodes() == false) {
        return
    }
    else {
        billSplitButton.setAttribute("disabled", true);

        items = itemsList.childNodes;
        items.forEach(function(item, i) {
            
            let partyMembersCheckboxes = Array.from(item.children);
            let totalPerPerson = itemPricePerPersonCalc(partyMembersCheckboxes, i);
            
            let partyMembersInvolved = partyMembersCheckboxes.map(checkbox => {
                if (checkbox.checked == true) {
                    return checkbox.value
                }
            });

            partyMembersInvolved.forEach(function(member){
                if (member === undefined) {
                    return
                }

                let memberRow = document.querySelector(`.${member}`);

                let totalField = memberRow.querySelector(".total-owed"); 

                let totalCurrentlyOwing = Number(memberRow.querySelector(".total-owed").innerText.substr(1));

                totalCurrentlyOwing += totalPerPerson;

                totalField.innerText = `$${totalCurrentlyOwing.toFixed(2)}`;
            });
        })
    }
}