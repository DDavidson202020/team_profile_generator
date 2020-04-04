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
// An array to store all the Ids for validation 
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
                // Check if user enters name 
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
            name: "officeNumber",
            validate: (answer) => {
                // Check if user enters office number
                if (answer === "") {
                    return "Please enter your office number";
                } else {
                    return true;
                }
            }
        },
        {
            type: "input",
            message: "What's the manager's email?",
            name: "email",
            validate: (answer) => {
                if (answer === "") {
                    return "Please enter your email";
                } else {
                    return true;
                }
            }
        },
        {
            type: "input",
            message: "What's the manager's id?",
            name: "id",
            validate: (answer) => {
                // Check if the answer from user contains only numbers
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
      // Push the manager ID to allEmployeesId array
      allEmployeesId.push(manager.id)
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
            message: "What's the intern's id?",
            name: "id",
            validate: (answer) => {
                // Check if the answer from user has only numbers and cannot be used previously
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
            name: "email",
            validate: (answer) => {
                if (answer === "") {
                    return "Please enter your email";
                } else {
                    return true;
                }
            }
        },
        {
            type: "input",
            message: "What's the intern's school?",
            name: "school",
            validate: (answer) => {
                if (answer === "") {
                    return "Please enter your school";
                } else {
                    return true;
                }
            }
        }
    ]
    inquirer.prompt(questions).then(res => {
        // Create an instance from Intern class with info from user's input
        const intern = new Intern(res.name, res.id, res.email, res.school);
        // Push the new instance to allEmployees array
        allEmployees.push(intern);
        // Push intern id to the allEmployeesId array
        allEmployeesId.push(intern.id);
        // Call addTeamMember function
        addTeamMember();
    })
}
// Declare addEngineer function
const addEngineer = () => {
    // Question list for Engineer
    const questions = [
        {
            type: "input",
            message: "What's the engineer's name?",
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
            message: "What's the engineer's id?",
            name: "id",
            validate: (answer) => {
                // Check if the answer from user has only numbers and cannot be used previously
                if (answer.match(/^\d+$/) && !(allEmployeesId.includes(answer))) {
                    return true
                } else {
                    return "ID can only contain numbers and not previously used"
                }
            }
        },
        {
            type: "input",
            message: "What's the engineer's email?",
            name: "email",
            validate: (answer) => {
                if (answer === "") {
                    return "Please enter your email";
                } else {
                    return true;
                }
            }
        },
        {
            type: "input",
            message: "What's the engineer's github?",
            name: "github",
            validate: (answer) => {
                if (answer === "") {
                    return "Please enter your github";
                } else {
                    return true;
                }
            }
        }
    ]
    inquirer.prompt(questions).then(res => {
        // Create a new instance from Engineer class with info from user's input
        const engineer = new Engineer(res.name, res.id, res.email, res.github);
        // Push the instance to allEmployees array
        allEmployees.push(engineer);
        // Push the engineer'id to allEmployeesId array
        allEmployeesId.push(engineer.id);
        // Call the addTeamMember function
        addTeamMember();
    })
}
// Create a buildTeam function to build the team page 
const buildTeam = () => {
    // Pass allEmployees array to render function
    const html = render(allEmployees);
    // Write an html file and put that file in output folder.
    fs.writeFile(outputPath, html, err => {
        if (err) throw err;
    });
}
// Call the createTeam function
createTeam();