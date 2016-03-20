/**
 * @file
 * Define allow and publish functions for Examples collection.
 */
/* globals Meteor, Plugins */

Meteor.publish('Plugins', function() {
    return Plugins.find();
});

// No clients may insert, update, or remove plugins
// Plugins.permit(['insert', 'update', 'remove']).never().apply();

// Clients may insert, update, or remove plugins only if an admin user is logged in
Plugins.permit(['insert', 'update', 'remove']).ifHasRole({role: 'admin', group: 'default-group'}).apply();

// Plugins.after.insert(function (userId, doc) {
//   if(doc.type === "twitter"){
//     console.log("Inserted: ",doc);
//     let twitterWall = new TwitterWall();
//     twitterWall.start("#fcabvb");
//   }
// });
let twitterWall = new TwitterWall();

Tracker.autorun(function(){
  var twitterWalls = Plugins.find({type:"twitter"}, {fields: {configs: 1, type:1}}).fetch();
  twitterWall.stopAllStreams();
  twitterWalls.forEach(function(element) {
    var config = element.configs.filter(function (el) {
      return el.config === "twitterHashtag";
    });
    var hashtag = config[0].value;
    twitterWall.start(hashtag);
  });
});
