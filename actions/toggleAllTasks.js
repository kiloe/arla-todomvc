// toggleAllTasks inverts the complete state of all tasks.
export function toggleAllTasks() {
	return [`
		with tasks as (
			select bool_and(complete) as complete from task
		)
		update task
		set complete = not (select complete from tasks)
		where (owner_id = $1 or assignee_id = $1)
	`, this.member_id];
}
