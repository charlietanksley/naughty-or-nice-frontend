/* Define custom server-side HTTP routes for lineman's development server
 *   These might be as simple as stubbing a little JSON to
 *   facilitate development of code that interacts with an HTTP service
 *   (presumably, mirroring one that will be reachable in a live environment).
 *
 * It's important to remember that any custom endpoints defined here
 *   will only be available in development, as lineman only builds
 *   static assets, it can't run server-side code.
 *
 * This file can be very useful for rapid prototyping or even organically
 *   defining a spec based on the needs of the client code that emerge.
 *
 */

module.exports = {
  drawRoutes: function(app) {
    app.get('/api/naughty_count/:username', function(req, res) {
      res.json({
        username: req.params.username
      , naughtyCount: 35
      , tweetsConsidered: 44
      , naughtyTweets: [{"contributors": null, "truncated": false, "text": "Learn from your fucking mistakes.", "in_reply_to_status_id": null, "id": 258309617069727744, "favorite_count": 27, "source": "web", "retweeted": false, "coordinates": null, "entities": {"symbols": [], "user_mentions": [], "hashtags": [], "urls": []}, "in_reply_to_screen_name": null, "id_str": "258309617069727744", "retweet_count": 104, "in_reply_to_user_id": null, "favorited": false, "user": {"follow_request_sent": null, "profile_use_background_image": true, "default_profile_image": false, "id": 402744578, "verified": false, "profile_text_color": "7D7D7D", "profile_image_url_https": "https://pbs.twimg.com/profile_images/1617230111/profile_normal.jpg", "profile_sidebar_fill_color": "F5F5F5", "entities": {"description": {"urls": []}}, "followers_count": 7301, "profile_sidebar_border_color": "000000", "id_str": "402744578", "profile_background_color": "4A4A4A", "listed_count": 207, "profile_background_image_url_https": "https://si0.twimg.com/profile_background_images/365637057/graphy.png", "utc_offset": -28800, "statuses_count": 72, "description": "Wise words, strongly spoken", "friends_count": 0, "location": "The Bay", "profile_link_color": "00946A", "profile_image_url": "http://pbs.twimg.com/profile_images/1617230111/profile_normal.jpg", "following": null, "geo_enabled": false, "profile_background_image_url": "http://a0.twimg.com/profile_background_images/365637057/graphy.png", "screen_name": "FuckingDevTips", "lang": "en", "profile_background_tile": true, "favourites_count": 0, "name": "Fucking Dev Tips", "notifications": null, "url": null, "created_at": "Tue Nov 01 14:25:32 +0000 2011", "contributors_enabled": false, "time_zone": "Pacific Time (US & Canada)", "protected": false, "default_profile": false, "is_translator": false}, "geo": null, "in_reply_to_user_id_str": null, "lang": "en", "created_at": "Tue Oct 16 20:53:06 +0000 2012", "in_reply_to_status_id_str": null, "place": null}, {"contributors": null, "truncated": false, "text": "Focus on fucking code quality.", "in_reply_to_status_id": null, "id": 255711420036030464, "favorite_count": 22, "source": "web", "retweeted": false, "coordinates": null, "entities": {"symbols": [], "user_mentions": [], "hashtags": [], "urls": []}, "in_reply_to_screen_name": null, "id_str": "255711420036030464", "retweet_count": 127, "in_reply_to_user_id": null, "favorited": false, "user": {"follow_request_sent": null, "profile_use_background_image": true, "default_profile_image": false, "id": 402744578, "verified": false, "profile_text_color": "7D7D7D", "profile_image_url_https": "https://pbs.twimg.com/profile_images/1617230111/profile_normal.jpg", "profile_sidebar_fill_color": "F5F5F5", "entities": {"description": {"urls": []}}, "followers_count": 7301, "profile_sidebar_border_color": "000000", "id_str": "402744578", "profile_background_color": "4A4A4A", "listed_count": 207, "profile_background_image_url_https": "https://si0.twimg.com/profile_background_images/365637057/graphy.png", "utc_offset": -28800, "statuses_count": 72, "description": "Wise words, strongly spoken", "friends_count": 0, "location": "The Bay", "profile_link_color": "00946A", "profile_image_url": "http://pbs.twimg.com/profile_images/1617230111/profile_normal.jpg", "following": null, "geo_enabled": false, "profile_background_image_url": "http://a0.twimg.com/profile_background_images/365637057/graphy.png", "screen_name": "FuckingDevTips", "lang": "en", "profile_background_tile": true, "favourites_count": 0, "name": "Fucking Dev Tips", "notifications": null, "url": null, "created_at": "Tue Nov 01 14:25:32 +0000 2011", "contributors_enabled": false, "time_zone": "Pacific Time (US & Canada)", "protected": false, "default_profile": false, "is_translator": false}, "geo": null, "in_reply_to_user_id_str": null, "lang": "en", "created_at": "Tue Oct 09 16:48:48 +0000 2012", "in_reply_to_status_id_str": null, "place": null}]
      })
    })
  }
};