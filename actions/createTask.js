// create a new task
export function createTask({id, text, member_id, assignee_id}) {
	return [`
		insert into task (id, text, owner_id, assignee_id)
		values ($1, $2, $3, $4)
	`, id, text, member_id, member_id];
}
