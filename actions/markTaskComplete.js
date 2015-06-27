// markTaskComplete sets a task as done
export function markTaskComplete(id){
	return [`
		update task set complete = true where id = $1
	`, id];
}
