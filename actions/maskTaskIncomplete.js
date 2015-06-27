// markTaskIncomplete sets a task to be incomplete
export function markTaskIncomplete(id) {
	return [`
		update task set complete = false where id = $1
	`, id];
}
