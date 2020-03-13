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
// let count = 0

// maybe for later
// const generateAlphaNumID = () => {
//     const result = []
//     for (let i = 0; i < 10; i++) {
//         let ran = Math.floor(Math.random() * numArray.length)
//         result.push(alphaNum[ran])
//     }
//     return result.join(``)
// }
const welcomeMessage = `\nWelcome to Team-Tree Generator.\n${separator}\nA simple survey of team member's basic info \nlike name, role, and email which is used to render a web page (HTML).\n${separator}\n`
// const goodbyeMessage = `\nThank you for using Team-Tree Generator.\n\nThe information for ${allMembers} will be used to fill a simple web page.\nCheck for an "output" folder.\n\n\\^_^/`

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
const questions = [
    {
        name: `intro`,
        // type: `confirm`,
        message: welcomeMessage,
    },
    {
        name: `projectname`,
        type: `input`,
        message: `What is the name the project this team will be working on?`,
        default: `Untitled Project`
    },
    {
        name: `selectMode`,
        type: `list`,
        message: `Select which mode to use:`,
        choices: [`Enter team member data one by one (recommended)`, new inquirer.Separator(`-------`), `Enter data in one line [comma separated values]`],
        filter: async input => {
            if (input === `Enter data in one line [comma separated values]`) {
                return false
            }
            return true
        }
    }
]
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
        choices: [`Manager`, `Engineer`, `Intern`, new inquirer.Separator(`-------`), `(Other Employee) < saved but not rendered in web page >`],
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
        type: `list`,
        message: `Would you like to enter another team member's information?`,
        choices: [`Yes, add another team member.`, new inquirer.Separator(`-------`), `No, render my web page.`],
        filter: async input => {
            if (input === `No, render my web page.`) {
                return false
            }
            return true
        }
    }
]
const employeesArray = []
const employeesArrayQuick = []
const askUser = async () => {
    try {
        const { projectname, selectMode } = await inquirer.prompt(questions)

        let keepAsking = true
        console.log(separator)

        while (keepAsking) {
            if (selectMode) {
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
                    renderMemberList(employeesArray)
                }
                employeesArray.unshift(projectname)
                const renderedhtml = render(employeesArray)

                fs.writeFile(outputPath, renderedhtml, err => {
                    if (err) throw err
                })
            } else {
                const { compactAnswer, addMore } = await inquirer.prompt(quickQuestions)
                const eArray = compactAnswer.split(`,`).map(data => data.trim())
                // console.log(eArray)
                const role = eArray[3]
                const name = eArray[0]
                const id = eArray[1]
                const email = eArray[2]
                const wildcard = eArray[eArray.length - 1]

                console.log(separator)
                // make new employee obj depending on role of employee (using answers)
                switch (role.toLowerCase()) {
                    case `manager`:
                        employeesArrayQuick.push(new Manager(name, id, email, wildcard))
                        break
                    case `engineer`:
                        employeesArrayQuick.push(new Engineer(name, id, email, wildcard))
                        break
                    case `intern`:
                        employeesArrayQuick.push(new Intern(name, id, email, wildcard))
                        break
                    default:
                        employeesArrayQuick.push(new Employee(name, id, email))
                        break
                }

                if (!addMore) {
                    keepAsking = false
                    renderMemberList(employeesArrayQuick)
                }
                employeesArrayQuick.unshift(projectname)
                const renderedhtml = render(employeesArrayQuick)

                fs.writeFile(outputPath, renderedhtml, err => {
                    if (err) throw err
                })
            }
        }

    } catch (err) {
        console.log(err)
    }

}
const renderMemberList = (array) => {
    let lastElement = array.length - 1
    let lastPerson = array[lastElement].name.trim().split(` `)[0]

    // adding a suffix to last element to "tag it" in case there are two team members with same name
    array[lastElement].name = `${lastPerson}++ ${array[lastElement].name.trim().split(` `)[1]}`

    let allMembers = array.map(data => data.name.split(` `)[0]).join(`, `)

    // if there is more than one team member, then find the last person and adhere an ampersond adding emphasis and alliteration
    if (array.length > 2) {
        allMembers = allMembers.replace(`${lastPerson}++`, `& ${lastPerson}`)
    } else if (array.length > 1) {
        allMembers = allMembers.replace(`, ${lastPerson}++`, ` & ${lastPerson}`)
    }
    console.log(`\nThank you for using Team-Tree Generator.\n\nThe information for ${allMembers} will be used to fill a simple web page.\nLook for an "output" folder with a "team.html" file.\n\n\\^_^/`)

    // put the first name of last person back as it was, sans '++'
    array[lastElement].name = `${lastPerson} ${array[lastElement].name.trim().split(` `)[1]}`
}
const quickQuestions = [
    {
        name: `compactAnswer`,
        type: `input`,
        message: `\nEnter employee in the following format (separated by a comma):\n- FULL NAME,\n- ID (MUST BE WHOLE NUMBER),\n- EMAIL,\n- ROLE (Manager, Engineer, or Intern),\n- TIDBIT (School if Intern, GitHub Username if Engineer, Office # if Manager)\n\nEXAMPLE: Big Bird, 7, bigboss@sesamestreet.com, engineer, hugeyellow7\n\n`,
        validate: async input => {
            if (!input) {
                return `An input is required`
            }
            return true
        },
    },
    {
        name: `addMore`,
        type: `confirm`,
        message: `Add another employee?`,
        default: false,
    }
]

const askQuickUser = async () => {
    try {
        const { projectname } = await inquirer.prompt(questions)
        let keepAsking = true

        while (keepAsking) {
            // count++
            const { compactAnswer, addMore } = await inquirer.prompt(quickQuestions)
            const eArray = compactAnswer.split(`,`).map(data => data.trim())
            // console.log(eArray)
            const role = eArray[3]
            const name = eArray[0]
            const id = eArray[1]
            const email = eArray[2]
            const wildcard = eArray[eArray.length - 1]

            console.log(separator)
            // make new employee obj depending on role of employee (using answers)
            switch (role.toLowerCase()) {
                case `manager`:
                    employeesArrayQuick.push(new Manager(name, id, email, wildcard))
                    break
                case `engineer`:
                    employeesArrayQuick.push(new Engineer(name, id, email, wildcard))
                    break
                case `intern`:
                    employeesArrayQuick.push(new Intern(name, id, email, wildcard))
                    break
                default:
                    employeesArrayQuick.push(new Employee(name, id, email))
                    break
            }

            if (!addMore) {
                keepAsking = false
                renderMemberList(employeesArrayQuick)
            }
        }
        employeesArrayQuick.unshift(projectname)
        const renderedhtml = render(employeesArrayQuick)

        fs.writeFile(outputPath, renderedhtml, err => {
            if (err) throw err
        })

    }
    catch (err) {
        console.log(err)
    }
}
const askDefaultUser = () => {

    questionsTeam[1 - 1].default = `Fakey McFakeFace`
    questionsTeam[3 - 1].default = 6699
    questionsTeam[4 - 1].default = `sample@gmail.com`
    questionsTeam[5 - 1].default = `DA STREETZ`
    questionsTeam[6 - 1].default = `gusvalenzuela`
    questionsTeam[7 - 1].default = 42
    questionsTeam[questionsTeam.length - 1].default = false
    askUser()
}

// allowing for optional commands
let option = process.argv[2]
if (option === `-d`) {
    askDefaultUser()
} else if (option === `-q`) {
    askQuickUser()
} else {
    askUser()
}
// const askOnebyOne = async (projectname) => {
//     let keepAsking = true
//     try {

//     } catch (err) {
//         console.log(err)
//     }

// }


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
