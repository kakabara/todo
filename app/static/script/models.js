class Task{
    constructor(task){
       Object.keys(props).forEach((key) => {
            this[key] = props[key];
        })
    }
}