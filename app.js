const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");
// An array to store all employees
const allEmployees = [];
const allEmployeesId = [];
// Declare a function to create the team start with Manager first
const createTeam = () => {
    // Question list for Manager
    const questions = [
        {
            type: "input",
            message: "What's the manager's name?",
            name: "name",
            validate: (answer) => {
                if (answer === "") {
                    return "Please enter your name";
                } else {
                    return true;
                }
            }
        },
        {
            type: "input",
            message: "What's the manager's office number?",
            name: "officeNumber"
        },
        {
            type: "input",
            message: "What's the manager's email?",
            name: "email"
        },
        {
            type: "input",
            message: "What's the manager's id?",
            name: "id",
            validate: (answer) => {
                if (answer.match(/^\d+$/)) {
                    return true
                } else {
                    return "ID can only contain numbers"
                }
            }
        }

    ]
    inquirer.prompt(questions).then(res => {
      // Create a new instance from the Manager class with info from user's input  
      const manager = new Manager(res.name, res.id, res.email, res.officeNumber);
      console.log(manager);
      // Push the new instance to the allEmployees array
      allEmployees.push(manager);
      allEmployeesId.push(manager.id)
      console.log(allEmployeesId)
      // Call the addTeamMember function to add more member or not
      addTeamMember();

    });
}
// Declare addTeamMember function to add more team members or not from user.
const addTeamMember = () => {
    const question = [
        {
            type: "list",
            message: "Would you like to add an Intern or Engineer?",
            name: "employeeType",
            choices: ["Intern","Engineer", "None"]
        }
    ]
    inquirer.prompt(question).then(res => {
        // If user choose to add Intern
        if (res.employeeType === "Intern") {
            // Call the addIntern function
            addIntern();
            // If user choose to add Engineer
        } else if (res.employeeType === "Engineer") {
            // Call the addEngineer function
            addEngineer();
        } else {
            //call buildTeam function to create file
            buildTeam();
        }
    })
}
// Declare an addIntern function
const addIntern = () => {
    const questions = [
        {
            type: "input",
            message: "What's the intern's name?",
            name: "name"
        },
        {
            type: "input",
            message: "What's the intern's id?",
            name: "id",
            validate: (answer) => {
                if (answer.match(/^\d+$/) && !(allEmployeesId.includes(answer))) {
                    return true
                } else {
                    return "ID can only contain numbers and not previously used"
                }
            }
        },
        {
            type: "input",
            message: "What's the intern's email?",
            name: "email"
        },
        {
            type: "input",
            message: "What's the intern's school?",
            name: "school"
        }
    ]
    inquirer.prompt(questions).then(res => {
        console.log(res);
        const intern = new Intern(res.name, res.id, res.email, res.school)
        allEmployees.push(intern)
        allEmployeesId.push(intern.id)
        console.log(allEmployees)
        addTeamMember()
    })
}
const addEngineer = () => {
    const questions = [
        {
            type: "input",
            message: "What's the engineer's name?",
            name: "name"
        },
        {
            type: "input",
            message: "What's the engineer's id?",
            name: "id"
        },
        {
            type: "input",
            message: "What's the engineer's email?",
            name: "email"
        },
        {
            type: "input",
            message: "What's the engineer's github?",
            name: "github"
        }
    ]
    inquirer.prompt(questions).then(res => {
        const engineer = new Engineer(res.name, res.id, res.email, res.github);
        allEmployees.push(engineer);
        allEmployeesId.push(engineer.id)
        addTeamMember();
    })
}
const buildTeam = () => {
    const html = render(allEmployees);
    fs.writeFile(outputPath, html, err => {
        if (err) throw err;
    });
}
createTeam();