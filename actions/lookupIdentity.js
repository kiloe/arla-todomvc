// This function is called by the Ident service to translate a friendly
// lookup name (like an email adress or username) to a uuid.
export function lookupIdentity(ref) {
	return [`
		select id from member where lower(username) = lower($1)'
	`, ref];
}
