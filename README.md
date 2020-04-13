# pean-server
Test repo to play around with a back end server.

Originally based on "Create a MEAN app with Angular and Docker Compose" from https://scotch.io/tutorials/create-a-mean-app-with-angular-2-and-docker-compose

**Building**
* Open command window in the root folder ($).
* $ docker-compose build (builds the server -- only needed if changes were made since last build)
* $ docker-compose up (runs the server)
* You could use Postman to test the server.

**Maintaining**
- If you need to add or remove dependencies, it's best to remote into 
the backend server container and do the `npm install <dependency>` or 
`npm uninstall <dependency>` from within the container.

**GitHub/Google authentication notes**
- For now the app just makes the auth call to GitHub/Google but doesn't do anything with the results. You can test by
logging out of GitHub/Google on their page and then clicking the GitHub/Google button on this app's signin page. You 
should be redirected to the appropriate GitHub/Google login page. After you login to GitHub/Google successfully, you 
should be redirected to this app's home page. 

**Authentication**
* GitHub OAuth App setup
  * Register app (ApplicationName, HomepageURL, ApplicationCallbackURL) for authentication at GitHub: https://github.com/settings/applications/new
  * Get ClientID and ClientSecret from: https://github.com/settings/developers
* Google OAuth 2.0 Client ID setup
  * Register app (ApplicationName, HomepageURL, ApplicationCallbackURL) for authentication at Google: https://console.developers.google.com/apis/credentials
  * Get ClientID and ClientSecret from: https://console.developers.google.com/apis/credentials/oauthclient/410288427615-gb6ldgbavceldj7trdcffoasgrenlhf1.apps.googleusercontent.com?project=bamboo-host-242317 
* NodeJS/Express app process flow for GitHub:
  * From the browser, client makes a request to https://github.com/login/oauth/authorize GitHub endpoint with ClientID
  * GitHub endpoint authorizes client using the Github login and redirects to the ApplicationCallbackURL with a new RequestToken
  * Client uses RequestToken, ClientID and ClientSecret to ask GitHub API for an AccessToken
  * If all the provided values are valid, GitHub API will respond with an AccessToken for client to make authorised requests

**Notes**
* At a minimum the following variables need to be defined in the environment (.env file). You can setup 
your own OAuth app as appropriate or obtain the values that were already set up.
  * GITHUB_CLIENT_ID -- from app setup on GitHub
  * GITHUB_CLIENT_SECRET -- from app setup on GitHub
  * GOOGLE_CLIENT_ID -- from app setup on GitHub
  * GOOGLE_CLIENT_SECRET -- from app setup on GitHub
  * DATABASE_PASSWORD -- needs to make database instance
  * APP_SECRET -- make one up
* Maybe the API shouldn't return the hash in it's results?
 
 **Useful Resources**
* Full front-end, back-end, database examples
  * https://developerhandbook.com/category/passport-authentication-series
  * https://gist.github.com/joshbirk/1732068
  * https://gist.github.com/saadtazi/f30edf299413a50697cc7cfac235563a
* Major technologies used
  * https://nodejs.org/en/
  * https://expressjs.com/
  * http://www.passportjs.org/
* Technologies explained well
  * https://hackernoon.com/passportjs-the-confusing-parts-explained-edca874ebead
* Issues encountered
  * https://github.com/jaredhanson/passport/issues?q=is%3Aissue+cors
  * https://stackoverflow.com/questions/54613793/passport-js-how-to-protect-all-routes
