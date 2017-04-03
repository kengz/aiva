  // dependencies
const _ = require('lomath')
const cgkb = require('cgkb')
const { User } = require('../db/models/index')

/* istanbul ignore next */
module.exports = (robot) => {

  robot.respond(/clear\s*kb$/i, (res) => {
    cgkb.kb.clear()
    res.send('CGKB is cleared')
  })

  robot.respond(/nlp\s*demo\s*1$/i, (res) => {
    var promise = cgkb.add('Bob brought the pizza to Alice.')
    //global.log.info("promise", promise);
    promise.then((reply)=>{
      global.log.info("cgkb2", JSON.stringify(reply, null, 2))
    })
    res.send('Your wish is my command')
  })

  robot.respond(/nlp\s*demo\s*2$/i, (res) => {
    cgkb.add('Book me a flight from New York to London for Sunday')
    res.send('Hey, Your wish is my command')
  })

  function getQuantity(what){
    var howMuch, i, modifiers = what.modifiers;

    if (modifiers && modifiers.length){
      for (i=0;i<modifiers.length; i++){
        var modifier = modifiers[i];
        if (modifier && modifier.POS_coarse === "DET"){
          howMuch = modifier;
          break;
        } 
      }

      for (i=0;i<modifiers.length; i++){
        var modifier = modifiers[i];
        if (modifier && modifier.POS_coarse === "ADJ" && (modifier.POS_fine === "PDT" || modifier.POS_fine === "PRP$")){
          howMuch = modifier;
          break;
        }
      }
    }

    return howMuch;

  }

  function getFilter(what){
    var filter, i, j, modifiers = what.modifiers;
    if (modifiers && modifiers.length){
      for (i=0;i<modifiers.length; i++){
        var modifier = modifiers[i];
        if (modifier && modifier.POS_coarse === "ADP" || modifier.POS_coarse === "VERB"){
          var subModifiers = modifier.modifiers;
          var matchFound = false;
          for (j=0;j<subModifiers.length; j++){
            var subModifier = subModifiers[j];
            if (subModifier && (subModifier.POS_fine === "NNP" || subModifier.POS_fine === "NN" || subModifier.POS_fine === "NNS" || subModifier.POS_fine === "PRP")){
              filter = subModifier;
              matchFound = true;
              break;
            }
          }
          if (matchFound){
            break;
          }
        } else if (modifier && (modifier.POS_fine === "NNP" || modifier.POS_fine === "NN" || modifier.POS_fine === "NNS" || modifier.POS_fine === "PRP")){
          filter = modifier;
          break;
        }
      }
    }
    return filter;
  }

  function getUserName(profile){
    var name = ""
    if (profile.name != ""){
      name = profile.name
    }else if (profile.displayName != ""){
      name = profile.displayName
    }else if (profile.id.length > 0){
      name = profile.id
    }
    return name
  }

  function createDemos(result){
    var demos = result.demos
    if (!demos){
      return "No such demo found!"
    }
    var SampleAttachment = function(){
      return {
        "fallback": "Demo",
        "color": "#36a64f",
        "title": "Name",
        "title_link": "http://aic.accionlabs.com/#/demo/",
        "text": "About the demo",
        "fields": [],
        "image_url": "http://aic.accionlabs.com",
        "thumb_url": "http://aic.accionlabs.com",
        "footer": "AIC Demo",
        "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
        "ts": new Date(),
        "mrkdwn_in": ["text", "pretext"]
      }
    }
    var response = { "attachments": [ ] }
    for (var i=0; i<demos.length; i++){
      var demo = demos[i]
      var attachment = new SampleAttachment()
      attachment.title = demo.title
      attachment.title_link += demo.id
      attachment.text = demo.description 
      attachment.text += '\nClick on title to open the demo \n\n--------------------------------------------'
      attachment.image_url += demo.thumbnail
      attachment.thumb_url += demo.thumbnail
      attachment.image_url = encodeURI(attachment.image_url)
      attachment.thumb_url = encodeURI(attachment.thumb_url)
      response.attachments.push(attachment)
    }
    return response;
  }

  function createProfile(result){
    var response = {
      "attachments": [
          {
              "fallback": "Here is your profile",
              "color": "#36a64f",
              "pretext": "Here is your profile",
              "title": "Name",
              "title_link": "http://aic.accionlabs.com/#/profile/user/",
              "text": "About the profile",
              "fields": [],
              "image_url": "http://aic.accionlabs.com",
              "thumb_url": "http://aic.accionlabs.com",
              "footer": "AIC profile last updated at ",
              "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
              "ts": '',
              "mrkdwn_in": ["text", "pretext"]
          }
      ]
    }
    var details = response.attachments[0]
    details.title = result.name
    details.title_link += result.id;
    details.text = result.email+'\n'
    if (result.introduction){
      details.text += '*'+result.introduction+'*\n\n'  
    }
    if (result.description){
      var str = result.description.replace('</li>',"\n");
      str = str.replace(/<{1}[^<>]{1,}>{1}/g," ")
      details.text += str + '\n\n'
    }
    if (result.introduction || result.description){
      details.text += '--------------------------------------------'
    }

    if (result.skills instanceof Array){
      var skillStr = result.skills.join(", ");
      var skillObj = {
        "title": "Skills",
        "value": skillStr,
        "short": false
      }
      details.fields.push(skillObj);
    }else{
      for (var skill in result.skills){
        var val = result.skills[skill];
        if (val.length === 0){
          continue
        }
        var skillStr = (typeof(val) === "string") ? val : val.join(", ");
        var skillObj = {
          "title": result.layers[skill].title,
          "value": skillStr,
          "short": false
        }
        details.fields.push(skillObj);
      }
    }
    if (details.fields.length){
      var skillObj = {
        "title": "Skills",
        "value": "No skills updated in the profile",
        "short": false
      }
      details.fields.push(skillObj);
    }
    details.image_url += result.photograph;
    details.thumb_url += result.photograph;
    details.ts = result._lastUpdatedTimestamp;
    return response;
  }

  function createProjects(result){
    var projects = result.projects
    if (!projects){
      return "No such project found!"
    }
    var SampleAttachment = function(){
      return {
        "fallback": "Demo",
        "color": "#36a64f",
        "title": "Name",
        "title_link": "http://aic.accionlabs.com/#/project/search",
        "pretext": "Name",
        "text": "About the project",
        "fields": [],
        "image_url": "http://aic.accionlabs.com",
        "thumb_url": "http://aic.accionlabs.com",
        "footer": "AIC Demo",
        "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
        "ts": new Date(),
        "mrkdwn_in": ["text", "pretext"]
      }
    }
    var response = { "attachments": [ ] }
    for (var projId in projects){
      var project = projects[projId]
      var attachment = new SampleAttachment()
      attachment.title = project.project_name
      attachment.pretext = project.project_name
      attachment.text = project.description 
      attachment.text += '\nClick on title to open the project \n\n--------------------------------------------'
      if (project.client_name != ""){
        attachment.fields.push({
          "title": "Client Name",
          "value": project.client_name,
          "short": true
        })
      }
      if (project.teamsize){
        attachment.fields.push({
          "title": "Total Members",
          "value": project.teamsize,
          "short": true
        })
      }
      if (project.manager){
        attachment.fields.push({
          "title": "Manager",
          "value": project.manager,
          "short": true
        })
      }
      response.attachments.push(attachment)
    }
    return response;
  }

  function authenticate(userData, data, res){
    robot.http("http://aic.accionlabs.com/locallogin")
    .header('Accept', 'application/json')
    .header('Content-Type', 'application/json')
    .post(data) (function(err, resp, body){

      global.log.info("err", JSON.stringify(err, null, 2))
        console.log("resp", resp.statusCode)
        global.log.info("body", JSON.stringify(body, null, 2))
        
        if (resp.statusCode === 200 || resp.statusCode === "200"){
          var body = JSON.parse(body)
          if (body.error){
            var message = body.message || "I could not authenticate you. Please try again!"
            res.send(message)
            userData.authenticating = false
            return
          }
          var cookie = resp.headers['set-cookie'] || body.access_token;
          userData.cookie = cookie;
          console.log("cookie", cookie)

          var req = robot.http("http://aic.accionlabs.com/check/authentication")
            .header('Accept', 'application/json')
            if (cookie){
              req = req.header('Cookie',cookie)
            }
            req.get()(function(err, resp, body){
              global.log.info("err", JSON.stringify(err, null, 2))
              global.log.info("resp", resp.statusCode)
              global.log.info("body", body)
                userData.myProfile = JSON.parse(body);
                if (userData.myProfile && userData.myProfile.payload){
                  userData.authenticated=true
                  res.send("You are authenticated now, please continue")
                }else{
                  userData = {}
                  res.send("I could not authenticate you. Please try again!")
                }
                setUserData(res, userData)
            })
          
        }else{
          userData.authenticating = false;
          res.send("I could not authenticate you. Please try again!")
        }
    })
  }

  function setUserData(res, userData){
    var brain = robot.brain
    var mes = res.message
    var user = mes.user
    brain.set(user.id, userData)
  }

  robot.respond(/.*/, (res) => {
    let text = res.match[0]
    var brain = robot.brain
    var mes = res.message
    var user = mes.user
    var userData = brain.get(user.id) || {};

    var authenticated = userData.authenticated || false;
    var cookie = userData.cookie;
    var myProfile = userData.myProfile;
    var username = userData.username;
    var password = userData.password;

    console.log("userData",userData)

    text = _.trim(_.replace(text, robot.name, ''))
    if (_.includes(text, 'nlp') || _.includes(text, 'clear kb')) {
      return
    }

    if (userData.authenticated){
      if (text.toLowerCase().indexOf("logout")>-1){
        brain.set(user.id, {})
        res.send("You are logged out successfully")
        return
      }
    }

    if (!userData.authenticated){
      if (text.toLowerCase().indexOf("login")>-1){
        userData.authenticating = true;
        if (!username){
          res.send("Please tell me your username")
          brain.set(user.id, userData)
          return
        }
      }else if (userData.authenticating){
        if (!username){
          userData.username = text
          brain.set(user.id, userData)
          res.send("Please tell me your password")
          return
        }else if (!userData.password){
          userData.password = text
          res.send('Let me authenticate you')
          var data = JSON.stringify({"username":userData.username,"password":userData.password});
          authenticate(userData, data, res)
          userData.authenticating = false
          brain.set(user.id, userData)
        }
      }else{
        res.send('Let me authenticate you as Devender Gupta for this demo')
        var data = JSON.stringify({"username":"devender.gupta@accionlabs.com","password":"kpaPv"});
        global.log.info("data", data)
        authenticate(userData, data, res)
      }
      return;
    }

    cgkb.add(text)
      .then((reply) => {
        //global.log.info('Knowledge saved to brain')
        global.log.info("reply2", JSON.stringify(reply, null, 2))    
        if (reply[0].parse_tree[0].POS_coarse != "VERB"){
          res.send('Your wish is my command, but please ask me proper questions')
          return;
        }

        var mainObject = reply[0].parse_tree[0];
        var command = mainObject;
        var what, howMuch, filter, i, modifiers = mainObject.modifiers, j;

        for (i=0;i<modifiers.length; i++){
          var modifier = modifiers[i];
          //console.log("modifier.lemma", modifier.lemma);
          if (modifier && modifier.POS_coarse === "NOUN" && !what){
            what = modifier;
          }
          if (!howMuch) howMuch = getQuantity(modifier);
          //if (howMuch) console.log("howMuch", howMuch.lemma)
          if (!filter) filter = getFilter(modifier);
          //if (filter) console.log("filter", filter.lemma)
          if (what && howMuch && filter){
            console.log("break")
            break;
          }
        }

        if (command) console.log('Command', command.lemma)
        if (what) console.log('What', what.lemma)
        if (howMuch){ console.log('Quantifier', howMuch.lemma) }else {console.log('No How Much');}
        if (filter){ console.log('Filter', filter.lemma)}else {console.log('No Filters');}


        global.client.pass({
          input: command.lemma,
          to: 'convo_classifier.py',
          intent: 'getCommand',
        })
        .then((reply) => {
          console.log("getCommand",reply)
          const convo = reply.output.convo.toLowerCase()   

          if (convo === "get" && (what.lemma === "profile" || what.lemma === "resource" || what.lemma === "people")){
            if (filter){
              res.send("Searching profiles...")
              var searchTxt = filter.lemma;
              if (searchTxt.indexOf("'")>-1 || searchTxt.indexOf("’")>-1){
                searchTxt = searchTxt.split("'")[0]
                searchTxt = searchTxt.split("’")[0]
              }
              var url = 'http://aic.accionlabs.com/search?searchTxt='+searchTxt
              global.log.info("Url used is "+ url)
              robot.http(url)
              .header('Accept', 'application/json')
              .header('Content-Type', 'application/json')
              .header('Cookie',cookie)
              .get() (function(err, resp, body){
                  if (err && err.code){
                    res.send("Some error has occurred, please try again!!!")
                    return;
                  }
                  global.log.info("err", JSON.stringify(err, null, 2))
                  global.log.info("resp", resp.statusCode)
                  global.log.info("body", body)
                  if (resp.statusCode === 200 || resp.statusCode === "200"){
                    var result = JSON.parse(body)
                    //if (what.word.toLowerCase() === "profiles" || what.word.toLowerCase() === "resources" || what.word.toLowerCase() === "people" || what.word.toLowerCase() === "peoples"){
                    if ((what.lemma === "profile" || what.lemma === "resource" || what.lemma === "people") && what.POS_fine === "NNS"){
                      var profiles = result.profiles;
                      var response = {"attachments": [{"title": filter.word, "pretext": "Here are the profiles you wanted:", "text": "", "mrkdwn_in": ["text","pretext"]}]}
                      var responseText = response.attachments[0].text + "```";
                      for (var i=0; i<profiles.length;i++){
                        responseText += "- "+getUserName(profiles[i]) +"\n";
                      }
                      if (profiles.length === 0){
                        responseText += 'No such profile found'
                      }
                      responseText += "```";
                      response.attachments[0].text = responseText;
                      res.send(response);
                    }else if ((what.lemma === "profile" || what.lemma === "resource" || what.lemma === "people") && what.POS_fine === "NN"){
                      if (result.profiles.length > 0){
                        var profileId = result.profiles[0].id
                        var profileName = result.profiles[0].name
                        res.send(`Getting profile for ${profileName}...`)
                        url = 'http://aic.accionlabs.com/profile/' + profileId
                        global.log.info("Url used is "+ url)
                        robot.http(url)
                        .header('Accept', 'application/json')
                        .header('Content-Type', 'application/json')
                        .header('Cookie',cookie)
                        .get() (function(err, resp, body){
                            if (err && err.code){
                              res.send("Some error has occurred, please try again!!!")
                              return;
                            }
                            global.log.info("err", JSON.stringify(err, null, 2))
                            global.log.info("resp", resp.statusCode)
                            global.log.info("body", body)
                            if (resp.statusCode === 200 || resp.statusCode === "200"){
                              var result = JSON.parse(body)
                              var response = createProfile(result)
                              res.send(response)
                            }else{
                              res.send("Some error has occurred, please try again!!!")
                            }
                          })
                      }else{
                        res.send("Sorry I could not find such a profile!")
                      }
                    }else{
                      res.send("Sorry I could not understand your query. Please rephrase it!")
                    }
                  }
              })
            }else{
              var url = 'http://aic.accionlabs.com/listprofiles?pageOffset=0&pageLength='
              if (howMuch && howMuch.lemma === "a"){
                url += '2'
                res.send("Getting profile...")
              } else if (howMuch && howMuch.lemma === "the" && what.POS_fine === "NNS"){
                res.send("Getting profiles...")
                url += '10'
              } else if (howMuch && howMuch.lemma === "my" && myProfile != null){
                url = 'http://aic.accionlabs.com/profile/' + myProfile.payload.userid
                res.send("Getting your profile...")
              }else{
                url += 10
              }
              global.log.info("Url used is "+ url)
              robot.http(url)
              .header('Accept', 'application/json')
              .header('Content-Type', 'application/json')
              .header('Cookie',cookie)
              .get() (function(err, resp, body){
                  if (err && err.code){
                    res.send("Some error has occurred, please try again!!!")
                    return;
                  }
                  global.log.info("err", JSON.stringify(err, null, 2))
                  global.log.info("resp", resp.statusCode)
                  global.log.info("body", body)
                  if (resp.statusCode === 200 || resp.statusCode === "200"){
                    var result = JSON.parse(body)
                    if (howMuch && howMuch.lemma === "my"){
                      var response = createProfile(result)
                      res.send(response)
                    }else{
                      var profiles = result.profiles;
                      var response = {"attachments": [{"title": "No filter", "pretext": "Here are first 10 profiles:", "text": "", "mrkdwn_in": ["text","pretext"]}]}
                      var responseText = response.attachments[0].text + "```";
                      for (var i=0; i<profiles.length;i++){
                        responseText += "- "+getUserName(profiles[i]) +"\n";
                      }
                      if (profiles.length === 0){
                        responseText += 'No such profile found'
                      }
                      responseText += "```";
                      response.attachments[0].text = responseText;
                      res.send(response);
                    }
                  }
              })
            }


          }else if (convo === "get" && what.lemma === "demo"){
            var url
            if (filter){
              url = 'http://aic.accionlabs.com/search?searchTxt='+filter.lemma
            }else{
              url = 'http://aic.accionlabs.com/listdemos?category=case-stories&pageLength=12&pageOffset=0'
            }
            res.send("Searching demo(s)...")
            global.log.info("Url used is "+ url)
            robot.http(url)
            .header('Accept', 'application/json')
            .header('Content-Type', 'application/json')
            .header('Cookie',cookie)
            .get() (function(err, resp, body){
                if (err && err.code){
                  res.send("Some error has occurred, please try again!!!")
                  return;
                }
                global.log.info("err", JSON.stringify(err, null, 2))
                global.log.info("resp", resp.statusCode)
                global.log.info("body", body.length)
                if (resp.statusCode === 200 || resp.statusCode === "200"){
                  var result = JSON.parse(body)
                  res.send(createDemos(result))
                }
              })
          }else if (convo === "get" && what.lemma === "project"){
            var url = 'http://aic.accionlabs.com/project/search_project'
            var data = { limit: 10, offset: 0}
            if (filter){
              data.search = filter.lemma
            }
            data = JSON.stringify(data);
            res.send("Searching project(s)...")
            global.log.info("Url used is "+ url)
            robot.http(url)
            .header('Accept', 'application/json')
            .header('Content-Type', 'application/json')
            .header('Cookie',cookie)
            .post(data) (function(err, resp, body){
                if (err && err.code){
                  res.send("Some error has occurred, please try again!!!")
                  return;
                }
                global.log.info("err", JSON.stringify(err, null, 2))
                global.log.info("resp", resp.statusCode)
                global.log.info("body", body)
                if (resp.statusCode === 200 || resp.statusCode === "200"){
                  var result = JSON.parse(body)
                  res.send(createProjects(result))
                }
              })
          }else if (convo === "update" || convo === "create" || convo === "delete"){
            res.send("Sorry, I am not trained to handle these commands!")
          }
        }).catch(global.log.error)

      })

  

  })
}
