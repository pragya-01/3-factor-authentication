//Dependencies
const mongoose = require ('mongoose')
const User = require ('../models/userModel')
const db = require ('./db')

//--- Sample Data ---
data = [
  {
    name: "MS Dhoni",
    email: "msd@gmail.com",
    password: "123456"
  },
  {
    name: "Virat kohli",
    email: "vk@gmail.com",
    password: "123456"
  }
];

//--- Function to Import Data to Database ---

const importData = async () => {
    try {
        await User.deleteMany()

        await User.insertMany(data)

        console.log('Data Imported.')
        process.exit()

    } catch (error) {
        console.log(`${error}`)
        process.exit(1)
    }
}

//--- Function to Delete data from Database ---

const destroyData = async () => {
    try {
        await User.deleteMany()

        console.log('Data Destroyed.')
        process.exit()

    } catch (error) {
        console.log(`${error}`)
        process.exit(1)
    }
}

// Check if npm run script has a flag -d or not
// -d deletes data
if(process.argv[2] === '-d'){
    destroyData();
} else {
    importData();
}