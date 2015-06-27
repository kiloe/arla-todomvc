// destroyCompletedTasks deletes all tasks already marked as completed.
export function destroyCompletedTasks() {
	return `
		delete from task where complete = true
	`;
}
