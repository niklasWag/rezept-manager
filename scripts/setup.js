const Listr = require('listr');
const util = require('util')

const exec = util.promisify(require('child_process').exec)

const tasks = new Listr([
    {
        title: 'Compile util',
        task: async () => {
            await exec('cd kern-util && npm i && npm run build')
        }
    },
    {
        title: 'Install backend dependencies',
        task: async () => {
            await exec('cd backend && npm i ../kern-util && npm i')
        }
    },
    {
        title: 'Install frontend dependencies',
        task: async () => {
            await exec('cd frontend && npm i')
        }
    }
])

tasks.run()