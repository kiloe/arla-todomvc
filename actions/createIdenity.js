// This function is called by the Ident service after registration of a uuid
// and password. It's job is to create the user's profile.
export function createIdentity({id, first_name, last_name, username, email}) {
	return [`
		insert into member (
			id, first_name, last_name, username, email
		) values ($1, $2, $3, $4, $5)
	`, id, first_name, last_name, username, email]
}
