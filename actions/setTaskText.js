// setTaskText updates the text of the todo item
export function setTaskText(id, text) {
	return [`
		update task set text = $2
		where id = $1 and (owner_id = $3 or assignee_id = $3)
	`, id, text, this.member_id];
}
