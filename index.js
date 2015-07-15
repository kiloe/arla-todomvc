import * as actions from "./actions"
import * as schema from "./schema"

arla.configure({
  // Show all logs
  logLevel: console.DEBUG,
  // mutation actions
  actions: actions,
  // data schema
  schema: schema,
  // authenticate checks credentials then returns the values
  // which will be used as the "session" (claims) throughout
  // the lifetime of the user's token.
  authenticate({username, password}){
    return [`
      select id as member_id from member
      where username = $1
      and password = crypt($2, password)
    `, username, password]
  },
  // create returns a mutation that will be called to create a user.
  // by returning a mutation you have the chance to hash any sensitive
  // password data so that it does not end up in the data log.
  register({id, first_name, last_name, username, password}){
    return {
      name: "createMember",
      args: [{
        first_name: first_name,
        last_name: last_name,
        username: username,
        password: pgcrypto.crypt(password),
      }],
      token: {
        member_id: db.query(`select uuid_generate_v4() as id`)[0].id
      }
    }
  }
})
