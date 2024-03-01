import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDelete } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "./components/ui/Modal";

function App() {
	const inputTitleRef = useRef();
	const inputDescriptionRef = useRef();
	const [todos, setTodos] = useState([]);
	const [editTodos, setEditTodos] = useState({});
	const [editIndex, setEditIndex] = useState();
	const [deleteId, setDeleteId] = useState();
	const [isOpen, setIsOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	const closeModal = () => setIsOpen(false);
	const openModal = () => setIsOpen(true);
	const closeDeleteModal = () => setIsDeleteOpen(false);
	const openDeleteModal = () => setIsDeleteOpen(true);

	const editNotify = () =>
		toast.success("Todo updated successfully !", { autoClose: 2000 });
	const addNotify = () =>
		toast.success("Todo added successfully !", { autoClose: 2000 });
	const errorNotify = () =>
		toast.error("Title or description are empty!", { autoClose: 2000 });
	const deleteNotify = () =>
		toast.success("Todo deleted successfully!", { autoClose: 2000 });

	// add new todo
	const addTodoHandler = () => {
		const title = inputTitleRef.current.value;
		const description = inputDescriptionRef.current.value;
		if (title == "" || description == "") {
			errorNotify();
			return;
		}
		setTodos([
			...todos,
			{
				id: uuidv4(),
				title,
				description,
				checked: false,
			},
		]);
		addNotify();
		inputDescriptionRef.current.value = "";
		inputTitleRef.current.value = "";
	};

	// when you clicked at checkbox to add todo to completed todos
	const checkedHandler = (id) => {
		let mytodos = [...todos];
		mytodos = mytodos.map((item) => {
			if (item.id == id) {
				item.checked = !item.checked;
			}
			return item;
		});
		setTodos(mytodos);
	};

	// when changes inputs at edit model
	const onChangeHandler = (e) => {
		setEditTodos({
			...editTodos,
			[e.target.name]: e.target.value,
		});
	};

	//this method will called when you click on edit icon at table
	const editItem = (item, idx) => {
		setEditIndex(idx);
		setEditTodos({ ...item });
		openModal();
	};

	//this method will called when you clicked on edit button at edit model
	const onEditHandler = (e) => {
		e.preventDefault();
		const mytodos = [...todos];
		mytodos[editIndex] = editTodos;
		setTodos(mytodos);
		closeModal();
		editNotify();
	};

	//this method will called when you click on delete icon at table
	const deleteTodo = (id) => {
		setDeleteId(id);
		openDeleteModal();
	};

	//this method will called when you clicked on delete button at delete model
	const onDeleteHandler = () => {
		let mytodos = [...todos];
		mytodos = mytodos.filter((item) => item.id != deleteId);
		setTodos(mytodos);
		closeDeleteModal();
		deleteNotify();
	};

	//when click at deleted selected button
	const onDeleteAllSelected = () => {
		let mytodos = [...todos];
		mytodos = mytodos.filter((item) => {
			if (!item.checked) return item;
		});
		setTodos(mytodos);
	};

	// renders
	const renderAllTodos = todos.map((item, idx) => {
		return (
			<tr key={item.id} className='h-[40px]'>
				<td>
					<div className='flex items-center mt-[2px]'>
						<input type='checkbox' onClick={() => checkedHandler(item.id)} />
					</div>
				</td>
				<td style={{ wordBreak: "break-all", maxWidth: "100px" }}>
					{item.title}
				</td>
				<td style={{ wordBreak: "break-all", maxWidth: "100px" }}>
					{item.description}
				</td>
				<td>
					<div className='flex'>
						<FiEdit
							className='me-2 fs-5 edit'
							onClick={() => editItem(item, idx)}
						/>
						<MdOutlineDelete
							className='fs-4 delete'
							onClick={() => deleteTodo(item.id)}
						/>
					</div>
				</td>
			</tr>
		);
	});

	return (
		<div className='w-500 mx-auto mt-5'>
			<h2 className='text-center todo-title'>Todo List</h2>
			<div className='p-2 '>
				<label htmlFor='addtxt ' className='text-indigo-600 fw-semibold'>
					Add new todo
				</label>

				<div className='d-flex justify-content-between'>
					<input
						ref={inputTitleRef}
						id='addtxt'
						type='text'
						className='flex-grow-1 me-2'
						placeholder='Title...'
					/>
					<input
						ref={inputDescriptionRef}
						id='addtxt'
						type='text'
						className='flex-grow-1'
						placeholder='Description...'
					/>
					<button className='ms-3 btn btn-primary' onClick={addTodoHandler}>
						Add Todo
					</button>
				</div>

				{todos.length ? (
					<>
						<table className='table table-striped mt-5'>
							<thead>
								<tr>
									<th scope='col'>#</th>
									<th scope='col'>title</th>
									<th scope='col'>description</th>
									<th scope='col'>actions</th>
								</tr>
							</thead>
							<tbody>{renderAllTodos}</tbody>
						</table>
						<button className='btn btn-danger' onClick={onDeleteAllSelected}>
							Delete selected
						</button>
					</>
				) : (
					<div className='my-3 text-center fs-5 text-indigo-600 fw-bold'>
						There is no todos
					</div>
				)}
			</div>

			{/* edit model */}
			<Modal closeModal={closeModal} isOpen={isOpen} openModal={openModal}>
				<h2>Edit todos</h2>
				<form onSubmit={onEditHandler}>
					<div className=' space-y-2'>
						<label className='block'>title</label>
						<input
							type='text'
							className='w-100 px-2'
							placeholder='enter your todo title...'
							value={editTodos.title}
							name='title'
							onChange={onChangeHandler}
						/>
					</div>
					<div className='mt-4 space-y-2'>
						<label className='block'>descriptioin</label>
						<input
							type='text'
							className='w-100 px-2'
							placeholder='enter your todo descrption...'
							value={editTodos.description}
							name='description'
							onChange={onChangeHandler}
						/>
					</div>
					<div className='flex space-x-2 mt-3'>
						<button className='btn btn-primary w-100'>Edit</button>
						<button
							className='btn btn-danger w-100'
							type='button'
							onClick={closeModal}
						>
							cancel
						</button>
					</div>
				</form>
			</Modal>

			{/* delete model */}
			<Modal
				closeModal={closeDeleteModal}
				isOpen={isDeleteOpen}
				openModal={openDeleteModal}
			>
				<h2>delete</h2>
				<p>
					Are you sure you want to delete this item? This action cannot be
					undone. Please double-check before confirming.
				</p>
				<div className='flex space-x-2'>
					<button className='btn btn-primary w-100' onClick={onDeleteHandler}>
						Delete
					</button>
					<button className='btn btn-danger w-100' onClick={closeDeleteModal}>
						Cancel
					</button>
				</div>
			</Modal>
			<ToastContainer />
		</div>
	);
}

export default App;
