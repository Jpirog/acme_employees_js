const employees = [
  { id: 1, name: 'moe'},
  { id: 2, name: 'larry', managerId: 1},
  { id: 4, name: 'shep', managerId: 2},
  { id: 3, name: 'curly', managerId: 1},
  { id: 5, name: 'groucho', managerId: 3},
  { id: 6, name: 'harpo', managerId: 5},
  { id: 8, name: 'shep Jr.', managerId: 4},
  { id: 99, name: 'lucy', managerId: 1}
];

const spacer = (text)=> {
  if(!text){
    return console.log('');
  }
  const stars = new Array(5).fill('*').join('');
  console.log(`${stars} ${text} ${stars}`);
}

const findEmployeeByName = (name, arr) => {
  const i = arr.findIndex(c => c.name === name);
  return {id: arr[i].id, name: name};
}

spacer('findEmployeeByName Moe')
// given a name and array of employees, return employee
console.log(findEmployeeByName('moe', employees)); // { id: 1, name: 'moe' }
spacer('')

const findManagerFor = (empObj, arr) => {
  const empIdx = arr.findIndex(c => c.name === empObj.name);
  const mgrId = arr[empIdx].managerId;
  const mgrIdx = arr.findIndex(c => c.id === mgrId)
  return mgrIdx === -1 ? [] : Object.assign (arr[mgrIdx])
}

spacer('findManagerFor Shep Jr.')
// given an employee and a list of employees, return the employee who is the manager
console.log(findManagerFor(findEmployeeByName('shep Jr.', employees), employees)); // { id: 4, name: 'shep', managerId: 2 }
spacer('')

spacer('findCoworkersFor Larry')

const findCoworkersFor = (empObj, employees) => {
  const empMgr = findManagerFor(empObj, employees).id;
  return employees.reduce ((res, c) => {
    if (c.name != empObj.name && c.managerId === empMgr) {
      res.push(c);
    }
    return res;
  },[])
}

// given an employee and a list of employees, return the employees who report to the same manager
console.log(findCoworkersFor(findEmployeeByName('larry', employees), employees));/*
[ { id: 3, name: 'curly', managerId: 1 },
  { id: 99, name: 'lucy', managerId: 1 } ]
*/

spacer('');

const findManagementChainForEmployee = (empObj, employees) => {
  const res=[];
  let mgr = findManagerFor(empObj, employees)
  while (employees.hasOwnProperty(mgr.managerId)) {
    res.push (mgr);
    empObj = findManagerFor(empObj, employees)
    mgr = findManagerFor(empObj, employees)
  }
  res.push(mgr)
  return res.reverse();
}

spacer('findManagementChain for moe')
// given an employee and a list of employees, return a the management chain for that employee. The management chain starts from the employee with no manager with the passed in employees manager
console.log(findManagementChainForEmployee(findEmployeeByName('moe', employees), employees)); // [  ]
spacer('');

spacer('findManagementChain for shep Jr.')
console.log(findManagementChainForEmployee(findEmployeeByName('shep Jr.', employees), employees));/*
[ { id: 1, name: 'moe' },
  { id: 2, name: 'larry', managerId: 1 },
  { id: 4, name: 'shep', managerId: 2 }]
*/
spacer('');

const getLevel = (idx, employees) => {
  let myObj = {id: employees[idx].id, name: employees[idx].name};
  if (employees[idx].hasOwnProperty('managerId')) {
    myObj.managerId = employees[idx].managerId;
  }
  myObj.reports = [];
  let myIdx = employees.findIndex(c => c.managerId === employees[idx].id);

  if (myIdx === -1) {
    myObj.reports = [];
  }

  for (let i = 0; i < employees.length; i++) {
    if (employees[i].hasOwnProperty('managerId') && employees[i].managerId === employees[idx].id) { 
      myObj.reports.push(getLevel(i, employees));
    }
  }
  return myObj;
}

const generateManagementTree = (employees) => {
  const topIdx = employees.findIndex(c => !c.hasOwnProperty('managerId'))
  const res = getLevel(topIdx, employees);
  return res;
}

spacer('generateManagementTree')
// given a list of employees, generate a tree like structure for the employees, starting with the employee who has no manager. Each employee will have a reports property which is an array of the employees who report directly to them.
console.log(JSON.stringify(generateManagementTree(employees), null, 2));
/*
{
  "id": 1,
  "name": "moe",
  "reports": [
    {
      "id": 2,
      "name": "larry",
      "managerId": 1,
      "reports": [
        {
          "id": 4,
          "name": "shep",
          "managerId": 2,
          "reports": [
            {
              "id": 8,
              "name": "shep Jr.",
              "managerId": 4,
              "reports": []
            }
          ]
        }
      ]
    },
    {
      "id": 3,
      "name": "curly",
      "managerId": 1,
      "reports": [
        {
          "id": 5,
          "name": "groucho",
          "managerId": 3,
          "reports": [
            {
              "id": 6,
              "name": "harpo",
              "managerId": 5,
              "reports": []
            }
          ]
        }
      ]
    },
    {
      "id": 99,
      "name": "lucy",
      "managerId": 1,
      "reports": []
    }
  ]
}
*/
spacer('');

const dispTreeLevel = (tree, dashes) => {
  console.log(`${dashes}${tree.name}`)
  dashes += '-';
  tree.reports.forEach (c => dispTreeLevel(c, dashes));}

const displayManagementTree = (tree) => {
  dispTreeLevel (tree,'');
}

spacer('displayManagementTree')
// given a tree of employees, generate a display which displays the hierarchy
displayManagementTree(generateManagementTree(employees));/*
moe
-larry
--shep
---shep Jr.
-curly
--groucho
---harpo
-lucy
*/