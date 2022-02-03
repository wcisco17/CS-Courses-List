const {Collection} = require('mongodb');
const {connectDB} = require('../util/db');
require('dotenv').config()

const width = "1174"
const height = "70"

const lessons = [
    {
        id: '1',
        location: 'Bristol',
        subject: 'Math',
        price: '$100',
        availibility: 5,
        isSoldOut: false,
        icon: 'fa-quidditch',
        url: `https://images.unsplash.com/photo-1596495577886-d920f1fb7238?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=${width}&q=${height}`,
    },
    {
        id: '2',
        location: 'America',
        subject: 'English',
        price: '$100',
        availibility: 5,
        isSoldOut: false,
        icon: '',
        url: `https://images.unsplash.com/photo-1539632346654-dd4c3cffad8c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=${width}&q=${height}`,
    },
    {
        id: '3',
        location: 'London',
        subject: 'Computer Science',
        price: '$100',
        availibility: 5,
        isSoldOut: false,
        icon: '',
        url: `https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80`,
    },
    {
        id: '4',
        location: 'Bristol',
        subject: 'Mandarin class',
        price: '$200',
        availibility: 5,
        isSoldOut: false,
        icon: '',
        url: `https://images.unsplash.com/photo-1519181245277-cffeb31da2e3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80`,
    },
    {
        id: '5',
        location: 'London',
        subject: 'Portuguese',
        price: '$130',
        availibility: 5,
        isSoldOut: false,
        icon: '',
        url: `https://images.unsplash.com/photo-1588614959060-4d144f28b207?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80`,
    },
    {
        id: '6',
        location: 'Bristol',
        subject: 'Law',
        price: '$120',
        availibility: 5,
        isSoldOut: false,
        icon: '',
        url: `https://images.unsplash.com/photo-1589994965851-a8f479c573a9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80`,
    },
    {
        id: '7',
        location: 'London',
        subject: 'Philosophy',
        price: '$120',
        availibility: 5,
        isSoldOut: false,
        icon: '',
        url: `https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80`,
    },
    {
        id: '8',
        location: 'Ethiopia',
        subject: 'Computer Science',
        price: '$120',
        availibility: 5,
        isSoldOut: false,
        icon: '',
        url: `https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80`,
    },
    {
        id: '9',
        location: 'Japan',
        subject: 'Writing',
        price: '$120',
        availibility: 5,
        isSoldOut: false,
        icon: '',
        url: `https://images.unsplash.com/photo-1486303954368-398fea0e72cd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80`,
    },
    {
        id: '10',
        location: 'London',
        subject: 'Artificial Intelligence',
        price: '$120',
        availibility: 5,
        isSoldOut: false,
        icon: '',
        url: `https://images.unsplash.com/photo-1636690424408-4330adc3e583?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80`,
    },
]

const generateLessons = async () => {
    /*** @type {Collection} db */
    const lesson = await connectDB(process.env.MONGODB_DB_NAME_ONE);
    lessons.map((item) => {
        return lesson.insertMany([{...item}], {}, (err, result) => {
            if (err) throw err;
            else
                console.log({
                    message: 'successfully uploaded'
                })
        })
    })
}

generateLessons()
    .then(console.log)
    .catch(console.log);
