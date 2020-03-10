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

const separator = `=`.repeat(42)
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
        // type: `confirm`,
        message: `\nWelcome to Team-Tree Generator.\n${separator}\nA simple survey of a team's member's basic information \nlike name, role, and email that is used to render a web page (HTML).\n${separator}\n`,
        // [n = Advanced Mode: enter all data in one line (feature coming soon)]
        // when: count < 1,
    },
    // {
    //     name: `advMode`,
    //     type: `input`,
    //     message: `\nI'm sorry I just can't do that. \nAdvanced features are currently under production. Come back soon\n==================================================================`,
    //     // validate: function (){},
    //     when: answers => !answers.intro,
    // }

]
let count = 0
const questionsTeam = [
    {
        name: `name`,
        type: `input`,
        message: `Enter team member's name.`,
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
        message: `Is this team member a Manager, Engineer, or Intern?`,
        choices: [`Manager`, `Engineer`, `Intern`, new inquirer.Separator(`-------`), `Other (Employee)`],
        // default: `Other (Employee)`
    },
    {
        name: `id`,
        type: `input`,
        message: `Enter team member's numeric id.`,
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
        message: `Enter team member's email address.`,
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
            console.log(separator)
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
                let allMembers = employeesArray.map(data => data.name).join(`, `)
                let lastPerson = employeesArray[employeesArray.length - 1].name.trim()
                // if there is more than one team member, then find the last person and adhere an ampersond adding emphasis and alliteration
                if (employeesArray.length > 2) {
                    allMembers = allMembers.replace(lastPerson, `& ${lastPerson}`)
                } else if(employeesArray.length > 1){
                    allMembers = allMembers.replace(`, ${lastPerson}`, ` & ${lastPerson}`)
                }

                console.log(`Thank you for using Team-Tree Generator.\n\nThe information for ${allMembers} will be used to fill a simple web page.\n\nCheck for an "output" folder.\n\\^_^/`)
            }
        }
        const renderedhtml = render(employeesArray)

        fs.writeFile(outputPath, renderedhtml, err => {
            if (err) throw err
        })
    }
    catch (err) {
        console.log(err)
    }
}
const teamMembers = (array) => {
    array.forEach(i => i.name)
}
const askDefaultUser = () => {
    questionsTeam[1-1].default = `Gustavo Valenzuela`
    questionsTeam[3-1].default = 6699
    questionsTeam[4-1].default = `sample@gmail.com`
    questionsTeam[5-1].default = `DA STREETZ`
    questionsTeam[6-1].default = `gusvalenzuela`
    questionsTeam[7-1].default = 42
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
