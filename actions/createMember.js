// This function creates a new member.
export function createMember({first_name, last_name, username, password}) {
	// The replay flag can be used to coerse old data into a new format
	if( this.replay ){
		if( username.length < 20 ){
			username = username + Array(20).join('_')
		}
	}
	// mutation actions return SQL that alters the querystore
	return [`
		insert into member (
			id, first_name, last_name, username, password
		) values ($1, $2, $3, $4, $5)
	`, this.session.member_id, first_name, last_name, username, password]
}
