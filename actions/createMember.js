// This function creates a new member.
export function createMember({first_name, last_name, username, password}) {
	return [`
		insert into member (
			id, first_name, last_name, username, password
		) values ($1, $2, $3, $4, $5)
	`, this.session.member_id, first_name, last_name, username, password]
}
