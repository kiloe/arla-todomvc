// setTaskText updates the text of the todo item
export function setTaskText(id, text) {
	return [`
		update task set text = $2 where id = $1
	`, id, text];
}
