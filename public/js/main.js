const deleteBtn = document.querySelectorAll('.fa-trash') //set the variable that contains all the delete buttons
const item = document.querySelectorAll('.item span') //dont see where this is used
const itemCompleted = document.querySelectorAll('.item span.completed') //grab the completed items

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) //add to each button the deleteItem function
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) //add to each button the mark complete function
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) //add to each button the mark un complete function
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}
