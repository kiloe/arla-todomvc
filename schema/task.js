
export class task {

	static text        = {type: 'text'}
	static complete    = {type: 'boolean'}
	static created_at  = {type: 'timestamptz', def:'now()'}
	static owner_id    = {type: 'uuid'}

	// beforeChange is a hook that will be triggered on every
	// INSERT or UPDATE of the task. Within the function "this"
	// can be altered before the data is commited.
	beforeChange(){
		if( this.text == "" ){
			throw 'text cannot be blank';
		}
	}

	// the owner property returns the member entity by looking
	// up the owner_id field on this record.
	// this.owner_id referrs to the current record's owner_id field.
	// It is important to note that this.owner_id is NOT a literal
	// value. It is a reference to the field itself. So while it can
	// be used as if it IS a value within a query ... doing something
	// like if(this.owner_id == 1){ doSomething() } from javascript
	// is not going to do what you expect!
	static owner = {type: 'member', query: function(){
		return [`
			select id,first_name,last_name
			from member
			where id = $1
		`, this.owner_id]
	}}

}
