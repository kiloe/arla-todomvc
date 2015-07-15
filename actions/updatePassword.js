// Update a member's password
export function updatePassword(password) {
	return [`
		update member
		set password = $1
		where id = $2
	`, password, this.session.member_id];
}
