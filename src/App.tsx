import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [todoList, setTodoList] = useState([])


  useEffect(() => {
    let list = getList()

    if (list && list.length) {
      setTodoList(list)
    }

  }, [])

  const saveToLocal = (list) => {
    localStorage.setItem('todolist', JSON.stringify(list))
  }

  const handleRemove = (id: number) => {

    setTodoList([...todoList.filter(item => item['id'] !== id)]);
    saveToLocal([...todoList.filter(item => item['id'] !== id)])

  }
  function saveTodo(todo: any) {
    let list = getList()
    setTodoList([...list, todo])
    saveToLocal([...list, todo])

  }
  function done(id: number) {

    let item = todoList.filter(item => item['id'] === id)[0]
    let list = [...todoList.filter(item => item['id'] !== id), { ...item, status: true }];
    setTodoList([...list])
    setTimeout(() => { saveToLocal(list) }, 10)

  }

  function getList() {
    return JSON.parse(localStorage.getItem('todolist'))
  }




  return (
    <>
      <div><h2>To do App</h2></div>
      <div className='container'>
        <AddTodo addTodosFn={saveTodo} />
        <TodoList todoList={todoList} handleRemove={handleRemove} doneFn={done} />

      </div >
    </>
  )
}



function AddTodo({ addTodosFn }) {
  const [todo, setTodo] = useState({ name: "", id: 0, status: false })
  const handleInput = (e) => {

    e.preventDefault()

    setTodo({
      id: new Date().valueOf(), name: e.target.value, status: false
    })
  }

  function addToList(e: Event) {
    addTodosFn(todo)
    setTodo({ name: "", id: 0, status: false });
  }

  return (<>
    <div>
      <input type="text" placeholder='Enter your list details here!!' value={todo.name} name="todo" onChange={(e) => { handleInput(e) }} />
      <button onClick={(e) => addToList(e)}>Add</button>
    </div>
  </>)
}


function TodoList({ todoList, handleRemove, doneFn }) {

  const [todoCopyList, setTodoCopyList] = useState([...todoList])
  useEffect(() => {
    setTodoCopyList([...todoList].sort((a, b) => a.id - b.id));
  }, [todoList]);

  function applyFilter(status: string) {
    if (status == 'Pending') {
      setTodoCopyList([...todoList].filter(item => !item.status))
    }
    else if (status == 'Completed') {
      setTodoCopyList([...todoList].filter(item => item.status))
    } else {
      setTodoCopyList([...todoList])
    }
  }


  let items = [...todoCopyList].map((item: any) => (
    <li key={item['id']} >
      <div className={item.status ? 'todoItem completed' : 'todoItem pending'} onClick={() => doneFn(item['id'])} >{item['name']}</div>
      <span className='actions'>
        {/* <button onClick={() => doneFn(item['id'])}>&#x2714;</button> */}
        <button onClick={() => handleRemove(item['id'])}>X</button></span>
    </li>))
  const list = (<ul>{items}</ul>)

  return (<>
    <h2>To do List</h2>
    {(todoCopyList.length) ? <Filters applyFilter={applyFilter} /> : 'Nothing pending'}
    {(todoCopyList.length) ? list : null}

  </>)
}


function Filters({ applyFilter }) {
  // useEffect(() => { }, [])
  const [optionsItems, setOptionsItems] = useState(['All', 'Pending', 'Completed'])
  const options = optionsItems.map((item) => (
    <option key={item} value={item}>
      {item}
    </option>
  ));

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    applyFilter(selectedValue);
  };
  return (
    <div>
      <label htmlFor="filter">Filter</label>
      <select name="filter" id="filter" onChange={handleChange} value={optionsItems[0]}>
        {options}
      </select>
    </div>

  )
}

export default App
