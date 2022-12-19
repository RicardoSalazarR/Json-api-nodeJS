const express = require("express")
const path = require('path')
const fs = require('fs/promises')

const app = express()
const jsonPath = path.resolve('./file/tasks.json')

app.use(express.json())

app.get('/tasks',async (req, res)=>{
    const jsonFile = await fs.readFile(jsonPath,"utf-8")
    res.send(jsonFile)
})

app.post('/tasks',async(req,res)=>{
    const task = req.body
    const tasksArray = JSON.parse(await fs.readFile(jsonPath,'utf-8'))
    const newId = tasksArray[tasksArray.length-1].id+1
    tasksArray.push({...task, id: newId})
    await fs.writeFile(jsonPath, JSON.stringify(tasksArray))

    res.end()
})

app.put('/tasks', async(req,res)=>{
    const task = req.body
    const tasksArray = JSON.parse(await fs.readFile(jsonPath,'utf-8'))

    const index = tasksArray.map(e=>e.id).indexOf(task.id)
    if(index>=0){
        tasksArray[index].status=task.status
        await fs.writeFile(jsonPath, JSON.stringify(tasksArray))
    }else{
        res.send('La tarea no se encuentra en la base de datos')
    }
    
    res.end()
})
app.delete('/tasks', async(req, res)=>{
    const {id} = req.body
    const tasksArray = JSON.parse(await fs.readFile(jsonPath,'utf-8'))

    const newArray = tasksArray.filter(e=>e.id!==id)

    await fs.writeFile(jsonPath, JSON.stringify(newArray))    

    res.end()
})
//put y delete
const PORT = 8000
app.listen(PORT,()=>{
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})