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
  // register returns a mutation that will be called to create a user record.
  // by returning a mutation you have the chance to hash any sensitive
  // password data so that it does not end up in the data log.
  register({id, first_name, last_name, username, password}){
    return {
      name: "createMember",
      args: [{
        id: id,
        first_name: first_name,
        last_name: last_name,
        username: username,
        password: pgcrypto.crypt(password),
      }]
    }
  },
  // version is a number that will be attached to all future mutations.
  // it becomes important when you make breaking changes to your mutations
  // in the future.
  version: 1,
  // transform is responsible for migrating old mutations to be
  // compatible with new actions. If a mutation with a version less
  // than the current version (set above) is executed then the transform
  // function will be run with the targetVersion.
  // The default action is to just return the mutation as is with the latest
  // version number.
  // If the mutation that is returned is still not at the current version
  // then the transformer will be applied again. This allows for incrementatal
  // updates over time.
  // This is not actually used for anything in todomvc since everything will
  // be version=1 ... it's just for show and tell
  transform(mutation, targetVersion){
    return Object.assign(mutation, {version:targetVersion});
  }

})
