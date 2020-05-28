const db = require ("./models")

const seeds = {


 employeeSeed(){
    const employeeSeed = [
        {first_name: "Bill", last_name: "Joeman", role_id: 3, manager_id: 1},
    ]
    employeeSeed.forEach(function(employee){
        db.employees.create(employee).then(function(){
            console.log("added")
        })
    })
}

}

module.exports = seeds