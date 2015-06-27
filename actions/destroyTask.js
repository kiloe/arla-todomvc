// destroyTask deletes the todo item with the given id
export function destroyTask(id){
	return [`delete from task where id = $1`, id];
}
