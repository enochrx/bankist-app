"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
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
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  containerMovements.innerHTML = "";

  movs.forEach(function (mov, i) {
    const depWith = mov > 0 ? "deposit" : "withdrawal";
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${depWith}">${
      i + 1
    } ${depWith}</div>
          <div class="movements__value">${mov.toFixed(2)}€</div>
        </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//Display Balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

//Display Summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(move => move > 0)
    .reduce((accu, move) => accu + move, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(move => move < 0)
    .reduce((accu, move) => accu + move, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(move => move > 0)
    .map(move => (move * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
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

  if (currentAccount?.pin === +inputLoginPin.value) {
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
  } else {
    labelWelcome.textContent = `Wrong Password, Try again...`;
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
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
  const amount = Math.floor(inputLoanAmount.value);
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
    currentAccount.pin === +inputClosePin.value
  ) {
    // console.log('it works');
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    //Delete account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

//set a state variable outside event handler

let sorted = false;
btnSort.addEventListener("click", e => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
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

//////////////////Filling////////////////////
//conventional ways of creatimg arrays
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log(arr);
console.log(new Array(1, 2, 3, 4, 5, 6));

//Empty arrays + fill method
const u = new Array(9);
console.log(u);
console.log(u.fill(3, 1, 7)); // first argument is the element to fill in and the 2nd and 3rd are the beginning and end position resp.ly

//Array .from
const j = Array.from({ length: 8 }, (_, i) => i + 1); //underscore is a throwaway variale and it's used if the parameter is not gonna be used but the order of arrangement is important to access the next/2nd parameter
console.log(j);

const randomDice = Array.from(
  { length: 100 },
  (_, i) => Math.trunc(Math.random(i) * 6) + 1
);
console.log(randomDice);

labelBalance.addEventListener("click", function () {
  const movementsUI = Array.from(
    document.querySelectorAll(".movements__value"),
    el => Number(el.textContent.replace("€", ""))
  );
  console.log(movementsUI);

  //const movUI2 = [...document.querySelectorAll(".movements__value")]
});

//Array Method practice
const allDepositsSum = accounts
  .flatMap(acc => acc.movements)
  .filter(dep => dep > 0)
  .reduce((acc, dep) => acc + dep, 0);
console.log(allDepositsSum);

const depsAbove1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(dep => dep > 1000).length;

console.log(depsAbove1000);
//using reduce method
const deps1000Red = accounts
  .flatMap(acc => acc.movements)
  // .reduce((count, dep) => (dep >= 1000 ? count + 1 : count), 0);------ Using prefixed ++ operator
  .reduce((count, dep) => (dep >= 1000 ? ++count : count), 0);
console.log(deps1000Red);

//How prefixed increment ++ value works
let g = 10;
// console.log(g++); //will return initial alue 10 first
// console.log(g); //returns 11
console.log(++g); //returns 11 at start

//using reduce method to create objects or arrays

// const sums = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sum, mov) => {
//       // mov > 0 ? (sum.depos += mov) : (sum.withdr += mov);

//       sum[mov > 0 ? "depos" : "withdr"] += mov;
//       return sum;
//     },
//     { depos: 0, withdr: 0 }
//   );
// console.log(sums);

const sumsArr = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sum, mov) => {
      mov > 0 ? sum + mov : sum + mov;

      // sum[mov > 0 ?  : ] += mov;
      return sum;
    }
    // [0, 0]
  );
console.log(sumsArr);

const convertTitleCase = title => {
  const exceptions = [
    "a",
    "an",
    "and",
    "the",
    "but",
    "or",
    "is",
    "on",
    "of",
    "in",
    "with",
  ];
  const cap = str => str[0].toUpperCase() + str.slice(1);

  const titleCase = title
    .toLowerCase()
    .split(" ")
    .map(word => (exceptions.includes(word) ? word : cap(word)));

  return titleCase;
};
console.log(convertTitleCase("This is another sample here"));
console.log(convertTitleCase("This is a sample of a title"));
console.log(convertTitleCase("and here is simple sample of a title"));
console.log(convertTitleCase("and a SHORT sample of a title"));

//////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooLittle') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/
const dogs = [
  { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
  { weight: 8, curFood: 200, owners: ["Matilda"] },
  { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
  { weight: 32, curFood: 340, owners: ["Michael"] },
];

// 1.
const dogsData = dogs.forEach(
  dog => (dog.recFoodPortion = Math.trunc(dog.weight ** 0.75 * 28))
);
console.log(dogs);

//2.
const dogSarah = dogs.find(dog => dog.owners.includes("Sarah"));
console.log(
  `Sarah's dog is eating too ${
    dogSarah.curFood > dogSarah.recFoodPortion ? "much" : "little"
  }`
);

//3
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFoodPortion)
  .flatMap(dog => dog.owners);
const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFoodPortion)
  .flatMap(dog => dog.owners);

console.log(ownersEatTooLittle);
console.log(ownersEatTooMuch);

//4
console.log(`${ownersEatTooMuch.join(" and ")}'s dogs eat too much`);
console.log(`${ownersEatTooLittle.join(" and ")}'s dogs eat too little`);

//5
console.log(dogs.some(dog => dog.curFood === dog.recFoodPortion));

//6
const okayEatingDogs = dog =>
  dog.curFood > dog.recFoodPortion * 0.9 &&
  dog.curFood < dog.recFoodPortion * 1.1;

console.log(dogs.some(okayEatingDogs));

//7
const okayDogs = dogs.filter(okayEatingDogs);

console.log(okayDogs);

//8
const copyDogs = dogs.map(dog => dog);

const sortedRecFood = copyDogs.sort(
  (a, b) => a.recFoodPortion - b.recFoodPortion
);
console.log(sortedRecFood);

/////////////////////////////////////////////////////
//Numbers, Dates, Intl and Timers

console.log(23 === 23.0);

//Base 10 -- 0 to 9, 1/10 = 0.1, 3/10 = 0.333333333
//Binary base 2 -- 0, 1
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3); // returns false

//converting strings to number
console.log(+"23");
console.log(+"23"); // when JS sees a + operator, it does type coerdion and convert the operands to numbers

//Parsing
console.log(Number.parseInt("30px")); // takes out the number, as to start with a number to work 'r34' won't work

console.log(Number.parseFloat("2.5rem")); //it reads the secimals too
console.log(Number.parseInt("2.5rem"));

//ParseFloat and parseInt are both global fxns -- they can work without the "Number" but it is encouraged as Namespace

//we use isFinite to check if a value is a number in JS
console.log(Number.isFinite(20));
console.log(Number.isFinite("20"));
console.log(Number.isFinite(+"20X"));
console.log(Number.isFinite(23 / 0));

//Use isNaN to check if value is NaN
console.log(Number.isNaN(20));
console.log(Number.isNaN("20"));
console.log(Number.isNaN(+"20X"));
console.log(Number.isNaN(23 / 0));

//Math methods
console.log(Math.sqrt(25));
console.log(25 ** (1 / 2)); // ** - raise to power (1/2)- is the square root of 2
console.log(8 ** (1 / 3)); //cubic root

//max number
console.log(Math.max(5, 6, 3, 2, 56, 3));
console.log(Math.max(6, 3, 4, "36", 9, 7)); //dos type coercion
console.log(Math.max(6, 4, 2, "16px", 9)); //does not work with parsing

console.log(Math.min(8, 4, 5, 6, 3, 2, 9));
//min number
console.log(Math.PI * Number.parseFloat("5.5rem") ** 2);
console.log(Math.trunc(Math.random() * 6) + 1); //dice

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;

randomInt(5, 10);

//Rounding Integers
console.log(Math.trunc(23.3));

console.log(Math.round(24.3));
console.log(Math.round(24.9));

console.log(Math.ceil(24.3)); //Math.ceil() rounds up
console.log(Math.ceil(24.9));

console.log(Math.floor(24.3)); //Math.floor() rounds down
console.log(Math.floor("24.9")); //does type coercion

//You might think that floor and trunc are very similar, and indeed they do the same when we are dealing with positive numbers. So basically floor and trunc, both cut off the decimal part when we are dealing with positive numbers. However, for negative numbers, it doesn't work this way. So actually a floor is a little bit better than trunc because it works in all situations, no matter if we're dealing with positive or negative numbers.

console.log(Math.floor(-25.9)); //rounding works the other way around for negative values
console.log(Math.trunc(-25.9)); // it just gets truncated

//Rounding decimals
console.log((5.6).toFixed(0)); //toFixed does not do type coercion
console.log(+(2.6).toFixed(3)); // '+' -- to convert the returns string to Number
console.log(+(6.3456).toFixed(2));

//////////Remainder Operator////////////
console.log(7 % 2); //returns the remainder
console.log(7 / 2);

console.log(8 / 3);
console.log(8 % 3); //returns the remainder

labelBalance.addEventListener("click", function () {
  [...document.querySelectorAll(".movements__row")].forEach((row, i) => {
    if (i % 2 === 0) row.style.backgroundColor = "pink";
  });
});

//BigInt
console.log(2 ** 53 - 1); //Biggest number Js can interprete
console.log(Number.MAX_SAFE_INTEGER);
console.log(Number.MIN_SAFE_INTEGER);
