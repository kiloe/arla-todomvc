import * as actions from "./actions"
import * as schema from "./schema"

arla.configure({
  // Show all logs
  logLevel: console.DEBUG,
  // mutation actions
  actions: actions,
  // data schema
  schema: schema,
  // authenticate returns the token values for a given set of credentials
  authenticate({username, password}){
    return [`
      select id as member_id from member
      where username = $1
      and password = crypt($2, password)
    `, username, password]
  },
  // create returns a mutation that will be called to create a user.
  register({id, first_name, last_name, username, password}){
    return {
      Token: {
        member_id: db.query(`select uuid_generate_v4() as id`)[0].id
      },
      Name: "createMember",
      Args: [{
        first_name: first_name,
        last_name: last_name,
        username: username,
        password: pgcrypto.crypt(password),
      }]
    }
  }
})
