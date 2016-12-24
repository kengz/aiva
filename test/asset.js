// Assets for the tests
const _ = require('lomath')

const A = {
  // lib/test_todo
  todoGenProp: {
    name: 'task1',
    hash: 'ID0000001#task1',
    priority: 'medium',
    status: 'doing',
    tag: null,
    notes: null,
    due: null,
  },
  todoLegalizeProp_nonself: {
    name: 'task1',
    hash: 'ID0000002#task1',
    hash_by: 'hash',
    updated_by: 'ID0000001',
    priority: 'medium',
    status: 'doing',
    tag: null,
    notes: null,
    due: null,
  },
  todoLegalizeProp_self: {
    name: 'task1',
    hash: 'ID0000001#task1',
    hash_by: 'hash',
    updated_by: 'ID0000001',
    priority: 'medium',
    status: 'doing',
    tag: null,
    notes: null,
    due: null,
  },
  // lib/test_user
  whois_alice: [[{ name: 'alice', id: 'ID0000001', email_address: 'alice@email.com' }]],
  wrapRes_alice: { envelope: { user: { id: 'ID0000001' } } },


}

// users at robot.brain.data.users
global.users = {
  ID0000001: {
    id: 'ID0000001',
    name: 'alice',
    email_address: 'alice@email.com',
    slack: {
      id: 'ID0000001',
      team_id: 'TD0000001',
      name: 'alice',
      deleted: false,
      presence: 'away',
    },
  },
  ID0000002: {
    id: 'ID0000002',
    name: 'bob',
    email_address: 'bob@email.com',
    slack: {
      id: 'ID0000002',
      team_id: 'TD0000002',
      name: 'bob',
      deleted: false,
      presence: 'away',
    },
  },
  USLACKBOT: {
    id: 'USLACKBOT',
    name: 'slackbot',
    real_name: 'slackbot',
    email_address: null,
    slack: {
      id: 'USLACKBOT',
      team_id: 'T07S1438V',
      name: 'slackbot',
      deleted: false,
      status: null,
      color: '757575',
      real_name: 'slackbot',
      tz: null,
      tz_label: 'Pacific Standard Time',
      tz_offset: -28800,
      is_admin: false,
      is_owner: false,
      is_primary_owner: false,
      is_restricted: false,
      is_ultra_restricted: false,
      is_bot: false,
      presence: 'active',
    },
  },
}

// hubot response object
global.res = {
  message: {
    user: {
      id: 'ID0000001',
      name: 'alice',
      room: 'Shell',
    },
    text: 'hubot myid',
    id: 'messageId',
    done: false,
    room: 'Shell',
  },
  match: [
    'hubot myid',
  ],
  envelope: {
    room: 'Shell',
    user: {
      id: 'ID0000001',
      name: 'alice',
      room: 'Shell',
    },
    message: {
      user: {
        id: 'ID0000001',
        name: 'alice',
        room: 'Shell',
      },
      text: 'hubot myid',
      id: 'messageId',
      done: false,
      room: 'Shell',
    },
  },
}


module.exports = A
