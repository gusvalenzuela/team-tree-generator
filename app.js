const Employee = require(`./lib/Employee`)
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


const alphaNumArray = `0123456789`.split("")
// maybe for later
// const generateAlphaNumID = () => {
//     const result = []
//     for (let i = 0; i < 10; i++) {
//         let ran = Math.floor(Math.random() * numArray.length)
//         result.push(alphaNum[ran])
//     }
//     return result.join(``)
// }

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
const questions = [
    {
        name: `intro`,
        type: `confirm`,
        message: `
Welcome.  
=========================
This is Team-Tree Generator. A simple survey of a team's member's basic information like name, role, and email that is used to render a web page (HTML). 
=========================
Would you like to enter the team's information one by one (recommended)? 

[Select NO (n) for Advanced Mode]
`,
    },
    {
        name: `advMode`,
        type: `input`,
        message: `enter in one line`,
        // validate: function (){},
        when: answers => !answers.intro,
    }

]
let count = 1
const questionsTeam = [
    {
        name: `name`,
        type: `input`,
        message: `Enter employee's name.`,
        validate: async input => {
            if (input === null || input === ` ` || input === `  ` || input === `   ` || input.length < 3) {
                return `A name is required (min. 3 characters)`
            }
            return true
        },
    },
    {
        name: `role`,
        type: `list`,
        message: `Is this employee a Manager, Engineer, or Intern?`,
        choices: [`Other (Employee)`, `Manager`, `Engineer`, `Intern`],
        default: `Other (Employee)`
    },
    {
        name: `id`,
        type: `input`,
        message: `Enter employee's numeric id.`,
        // default: generateID,
        validate: async input => {
            if (!input || input === NaN || isNaN(input)) {
                return `An ID is required (Must be a whole number)`
            }
            return true
        },
    },
    {
        name: `email`,
        type: `input`,
        message: `Enter employee's email address.`,
        validate: async input => {
            if (!input) {
                return `An email address is required`
            }
            return true
        },
    },
    {
        name: `school`,
        type: `input`,
        message: `Which school did this intern attend or is currently attending?`,
        when: async input => input.role === `Intern`,
    },
    {
        name: `github`,
        type: `input`,
        message: `What is the engineer's GitHub username?`,
        when: async input => input.role === `Engineer`,
    },
    {
        name: `officenum`,
        type: `input`,
        message: `Enter manager's office number.`,
        when: async input => input.role === `Manager`,
    },
    {
        name: `askAgain`,
        type: `confirm`,
        message: `Would you like to enter another team member's information?`,
        // default: generateID,
        // validate: async input => {
        //     if (!input || input === NaN || isNaN(input)) {
        //         return `An ID is required (Must be a whole number)`
        //     }
        //     return true
        // },
    }
]
const employeesArray = []
const askUser = async () => {
    try {
        await inquirer.prompt(questions)

        let keepAsking = true
        while (keepAsking) {
            const { name, id, email, role, school, github, officenum, askAgain } = await inquirer.prompt(questionsTeam)
            count++
            console.log(`=`.repeat(42))
            // make new employee obj depending on role of employee (using answers)
            switch (role) {
                case `Manager`:
                    employeesArray.push(new Manager(name, id, email, officenum))
                    break
                case `Engineer`:
                    employeesArray.push(new Engineer(name, id, email, github))
                    break
                case `Intern`:
                    employeesArray.push(new Intern(name, id, email, school))
                    break
                default:
                    employeesArray.push(new Employee(name, id, email))
                    break
            }

            if (!askAgain) {
                keepAsking = false
                console.log(`Thank you for using Team-Tree Generator.\nThe information of ${employeesArray} has been gathered.\n\nGoodbye!`)
            }
        }

        // console.log(employeesArray)
    }
    catch (err) {
        console.log(err)
    }
}

const askDefaultUser = () => {
    questionsTeam[0].default = `Gustavo Valenzuela`
    questionsTeam[1].default = 6699
    questionsTeam[questionsTeam.length - 1].default = false
    askUser()
}
let option = process.argv[2]
if (option === `-d`) {
    askDefaultUser()
} else {
    askUser()
}
// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an 
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work!```
