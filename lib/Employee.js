// TODO: Write code to define and export the Employee class
class Employee {
    constructor(name, id, email) {
        this.id = id
        this.name = name
        if(name !== undefined){
            this.firstname = name.split(` `)[0]
            this.lastname = name.split(` `)[1]
        }
        this.email = email
    }

    emailChecker(email){
        const subdomain = email.split(`@`)[0]
        const domain = email.split(`@`)[1]
        const domainI = domain.split(`.`)[0]
        const domainII = domain.split(`.`)[1]
        
        if(!subdomain || !domainI || !domainII || !domain){
            return `expected email in "username@email.com" format`
        }
        return true
    }
    getRole() {
        return `Employee`
    }
    getId() {
        return this.id
    }
    getName(){
        return this.name
    }
    getEmail(){
        return this.email
    }

}

module.exports = Employee