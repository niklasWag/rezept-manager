const Listr = require('listr');
const util = require('util')

const exec = util.promisify(require('child_process').exec)

const tasks = new Listr([
    {
        title: 'Compile util',
        task: async () => {
            await exec('cd rezept-util')
            await exec('npm i')
            await exec('npm run build')
            await exec('cd ..')
        },
        //skip: () => true
    },
    {
        title: 'Install backend dependencies',
        task: async () => {
            await exec('cd backend')
            await exec('npm i')
            await exec('cd ..')
        }
    },
    {
        title: 'Install frontend dependencies',
        task: async () => {
            await exec('cd frontend')
            await exec('npm i')
            await exec('cd ..')
        },
        skip: () => true
    }
])

tasks.run()