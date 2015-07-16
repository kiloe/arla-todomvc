// create a new task
export function createTask({id, text}) {
	return [`
		insert into task (id, text, owner_id)
		values ($1, $2, $3)
	`, id, text, this.session.member_id];
}
