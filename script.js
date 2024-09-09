"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//Display Movements
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";
  movements.forEach(function (mov, i) {
    const depWith = mov > 0 ? "deposit" : "withdrawal";
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${depWith}">${
      i + 1
    } ${depWith}</div>
          <div class="movements__value">${mov}€</div>
        </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//Display Balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

//Display Summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(move => move > 0)
    .reduce((accu, move) => accu + move, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(move => move < 0)
    .reduce((accu, move) => accu + move, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(move => move > 0)
    .map(move => (move * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

//Create Username
const createUsername = accs => {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map(name => name[0])
      .join("");
  });
};
createUsername(accounts);
console.log(accounts);

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);
  //Display balance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

//Event Handlers
let currentAccount;

btnLogin.addEventListener("click", function (e) {
  //prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });
  // console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI & welcome message
    labelWelcome.textContent = `Welcome, ${currentAccount.owner.split(" ")[0]}`;
    containerApp.style.opacity = 100;
    //Clear input field
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    //Display movements
    //Display balance
    //Display summary
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    // ---- to check if exist, use optional chaining instead
    amount <= currentAccount.balance &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Display movements
    //Display balance
    //Display summary
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    //
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    // console.log('it works');
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    //Delete account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////
/*
const x = ['boy', 'girl', 'man'];

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//for of Loop
for (const move of movements) {
  if (move > 0) {
    console.log(`You deposited: ${move}`);
  } else {
    console.log(`You deposited: ${Math.abs(move)}`);
  }
}

//forEach Loop

// movements.forEach(function (movement) {
//   if (movement > 0) {
//     console.log(`You have deposited: ${movement}`);
//   } else {
//     console.log(`You have deposited: ${Math.abs(movement)}`);
//   }
// });

//So the first parameter always needs to be the current element, the second parameter always the current index and the third one always the entire array that we are looping over.

//movements.forEach(function (movement, index, array) {})
movements.forEach(function (movement, i, arr) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You have deposited: ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You have deposited: ${Math.abs(movement)}`);
  }
});

//forEach on Maps and Sets
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

const uniqueCurr = new Set(['NGN', 'GBR', 'USD', 'YEN', 'USD', 'GBR']);

uniqueCurr.forEach(function (value, _, map) {
  console.log(`${_}: ${value}`);
});
*/

////////////////////////////////////////////////////////
//Coding challenge
/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
const dogsJulia = [3, 5, 2, 12, 7];
const dogsKate = [4, 1, 15, 8, 3];
const dogsJulia2 = [9, 16, 6, 8, 3];
const dogsKate2 = [10, 5, 6, 1, 4];

const checkDogs = function (dogsJ, dogsK) {
  const dogsJCopy = dogsJ.slice(1, -2);
  console.log(dogsJCopy);

  const allDogs = dogsJCopy.concat(dogsK);

  allDogs.forEach(function (val, key) {
    val >= 3
      ? console.log(
          `Dog number ${key + 1} is an adult, and is ${val} years old`
        )
      : console.log(`Dog number ${key + 1} is still a puppy`);
  });
};

checkDogs(dogsJulia, dogsKate);
checkDogs(dogsJulia2, dogsKate2);

//The array methods
//Map

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const euroToUSD = 1.1;

const movementsUSD = movements.map(function (mov) {
  return mov * euroToUSD;
});

// const movementsUSD = movements.map(mov => mov * euroToUSD); //using arrow fxn

console.log(movements);
console.log(movementsUSD);

const movementsDescrp = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You have ${
      mov > 0 ? "deposited" : "withdrawn"
    } ${Math.abs(mov)}`

  // if (mov > 0) {

  //   return `Movement ${i + 1}: You have deposited: ${mov}`;
  // } else {
  //   return `Movement ${i + 1}: You have withdraawn: ${Math.abs(mov)}`;
  // }
);

console.log(movementsDescrp);

//Filter
const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(movements);
console.log(deposits);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);

//Reduce
//ACCumulator -> SNOWBALL acrrues with CURrent elenent in each iterations -> return a single . Reduce method receives 2 values, a. callback fxn, b. initial value of the accumulator at first iteration
const balance = movements.reduce(function (acc, cur, i, arr) {
  console.log(`Iteration ${i}: ${acc}`);
  return acc + cur;
}, 0);
console.log(balance);

//Using Reduce method to find maximun or minimum value of an array
const max = movements.reduce((acc, mov) => {
  if (acc > mov) {
    return acc;
  } else {
    return mov;
  }
}, movements[0]);
console.log(max);

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

//Solution
const calcAverageHumanAge = ages => {
  const dogToHumanAge = ages
    .map(age => {
      return age <= 2 ? age * 2 : age * 4 + 16;
    })
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => {
      return acc + age / arr.length;
    }, 0);

  console.log(dogToHumanAge);
};

calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

///Chaining Methods
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * euroToUSD)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUSD);

///Find Method
// Just like the Filter method, the Find method also needs a callback function that returns a Boolean. Unlike the Filter method, the Find method will actually not return a new array but it will only return the first element in the array that satisfies this condition.

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

const accountJ = accounts.find(acc => acc.owner === "Jonas Schmedtmann");
// console.log(accountJ);

for (const account of accounts) {
  if (account.owner === "Jonas Schmedtmann") {
    // console.log(account);
  }
}

// Some and every method
console.log(movements);
//CHECKS FOR EQUALITY
console.log(movements.includes(-400)); //returns a boolean

//Some -CHECKS FOR CONDITION
const anyDeeposits = movements.some(move => move > 400);
console.log(anyDeeposits);

//Every -CHECK FOR EVERY CONDITION are met
console.log(movements.every(mov => mov > 0)); //returns false
console.log(account4.movements.every(mov => mov > 0)); //returns true

//It is normal to have callback functions stored as variables to ensure DRY method of writing codes

const depositFunc = mov => mov > 0;

console.log(movements.some(depositFunc));
console.log(movements.every(depositFunc));
console.log(movements.find(depositFunc));
console.log(movements.filter(depositFunc));

//Flat and Flat methods --- ES2019

const array = [1, [2, 3, 4], [5, 6], 7, [8, 9]];
const arrayDeep = [1, [[2, 3], 4], [5, 6], 7, [8, 9]];
console.log(array.flat());
console.log(arrayDeep.flat(2));

///Using flat() method

// const accountMovement = accounts.map(acc => acc.movements);
// console.log(accountMovement);
// const allMovements = accountMovement.flat();
// console.log(allMovements);
// const overallMovement = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overallMovement);

//flat method using method chaining
const totalMovement = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalMovement);

//flatMap --- map() and flat() are always almost used together in practice| ONLY goes one leel deep unlike flat() where you can specific the levels flat(1 or 2 or 3)

const totalMovement2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalMovement2);

//Sorting --- Mutate original array| sorts by converting numbers to string
const owners = ["Melinda", "Ben", "Jack", "Jude", "Adams"];
console.log(owners.sort());
console.log(owners);

//Number
// console.log(movements);

//return < 0,  A, B (keep order)
//return > 0, B, A (switch order)
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
//   else return 0;
// });

movements.sort((a, b) => a - b);
console.log(movements);
movements.sort((a, b) => b - a);
console.log(movements);
