
// The root entity is the default "start" of the AQL "graph".
//
// All arla queries start start as calls off of this entity
//
// 		root() {     <-- you will never actually write this root() call, it is implied
// 			viewer() {
// 				first_name
// 			}
// 			tasks() {
// 				text
// 				complete
// 				assignee() {
// 					first_name
// 				}
// 			}
// 		}
//
// which would return:
//
// 		{
// 			viewer: {
// 				first_name: 'bob'
// 			},
// 			tasks: [
// 				{complete: false, text: 'todo', assignee:{first_name: 'bob'}}
// 				{complete: false, text: 'todo', assignee:{first_name: 'alice'}}
// 				{complete: false, text: 'todo', assignee:{first_name: 'alice'}}
// 			]
// 		}
//
export class root {
	// Here we define a property named "viewer" that will return
	// an object of type 'member'.
	// The property has a query defined which means that rather
	// than being a field on a table, the SQL will be executed to
	// fetch the data.
	// "this.session" in the context of a query function
	// contains the "claims" returned by the authenticate function
	// which is defined in arla.configure.
	// Here "this.session.member_id" is used in the SQL to return the
	// currently logged in member fields.
	static viewer = {type:'member', query: function(){
		return [`
			select * from member where id = $1
		`, this.session.member_id]
	}}
}
