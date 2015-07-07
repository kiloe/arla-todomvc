// destroyTask deletes the todo item with the given id
export function destroyTask(id){
	return [`
		delete from task
		where id = $1
		and (owner_id = $2 or assignee_id = $2)
	`, id, this.member_id];
}
