# Melania
_Facebook Messenger integration with Cisco Unified CCX Web Chat (via Cisco SocialMiner)_

[![bitHound Overall Score](https://www.bithound.io/github/umnagendra/melania/badges/score.svg)](https://www.bithound.io/github/umnagendra/melania)
[![bitHound Code](https://www.bithound.io/github/umnagendra/melania/badges/code.svg)](https://www.bithound.io/github/umnagendra/melania)
[![bitHound Dependencies](https://www.bithound.io/github/umnagendra/melania/badges/dependencies.svg)](https://www.bithound.io/github/umnagendra/melania/master/dependencies/npm)
[![Code Climate](https://codeclimate.com/github/umnagendra/melania/badges/gpa.svg)](https://codeclimate.com/github/umnagendra/melania)
[![Issue Count](https://codeclimate.com/github/umnagendra/melania/badges/issue_count.svg)](https://codeclimate.com/github/umnagendra/melania)

[![License](https://img.shields.io/github/license/umnagendra/melania.svg)](https://github.com/umnagendra/melania/blob/master/LICENSE)
[![HitCount](http://hits.dwyl.com/umnagendra/melania.svg)](http://hits.dwyl.com/umnagendra/melania)
![Heroku](http://heroku-badge.herokuapp.com/?app=ccbu-melania&style=flat&svg=1)

<img src="https://user-images.githubusercontent.com/990210/31052289-36b1dee2-a69e-11e7-985b-0d9266877f50.png" width="425"/>  <img src="https://user-images.githubusercontent.com/990210/31052292-41b8c5d0-a69e-11e7-8ab3-a55d23a33c75.png" width="425"/>

# Built With
- [Node](https://nodejs.org/)
- [Facebook Messenger Platform](https://developers.facebook.com/docs/messenger-platform)
- [Botly](https://github.com/miki2826/botly)
- [Cisco SocialMiner](https://developer.cisco.com/site/socialminer/overview)
- [Cisco Unified CCX](https://developer.cisco.com/site/contact-center-express)
- [ngrok](https://ngrok.com)
- :blue_heart:

# Design
![image](https://user-images.githubusercontent.com/990210/31053563-e8cdaa42-a6bd-11e7-89c4-70e189031843.png)

# Running
### Infrastructure
While this app is ready to be hosted on [Heroku](https://heroku.com) (see [Procfile](Procfile)), it can be hosted on any application/hosting environment or container framework.

The only considerations for the infrastructure are public addressibility and connectivity with
- facebook.com
- your SocialMiner instance

#### About Deploying SocialMiner
Cisco SocialMiner should ideally be deployed on the DMZ such that it can be addressible and connected from anywhere in the public Internet, as well as have a direct connectivity into the enterprise network where Unified CCX servers and Agents are located.

If your organization has not deployed SocialMiner in the DMZ, you will need to use a forwarding/reverse proxy (such as [ngrok](https://ngrok.com) or [nginx](https://www.nginx.com/resources/admin-guide/reverse-proxy/).

### Setup
#### Facebook Messenger Bot
See the [Getting Started](https://developers.facebook.com/docs/messenger-platform/guides/setup) guides by Facebook on how to create a facebook app (bot), acquire required tokens etc.

#### Cisco Unified CCX and Cisco SocialMiner
See
- [Cisco Unified CCX Guides, Release 11.6(1)](https://www.cisco.com/c/en/us/support/customer-collaboration/unified-contact-center-express-11-6-1/model.html#~tab-documents)
- [Cisco SocialMiner Guides, Release 11.6(1)](https://www.cisco.com/c/en/us/support/customer-collaboration/socialminer-release-11-6-1/model.html)
- [SocialMiner on Cisco DevNet](https://developer.cisco.com/site/socialminer/overview)

### Run
The following environment variables are required to be defined (in `process.env`) to launch and run the app.

|Variable|Description|
|--------|-----------|
|PORT    |A 16-bit UNIX port number where this app will bind to|
|FB_PAGE_ACCESS_TOKEN|The page access token issued by Facebook when you configure messenger for a page|
|FB_VERIFICATION_TOKEN|A token that is to be provided by your app when Facebook challenges the validity of your webhook URL|
|VIRTUAL_ASSISTANT_NAME|The name of your virtual assistant (E.g. _Siri_, _Alexa_ etc.)|
|SOCIALMINER_HOST|A valid fully qualified hostname of your SocialMiner server|
|SOCIALMINER_CHAT_FEED_ID|The ID of the chat feed in SocialMiner. Can be obtained by calling the `/feed` API on SocialMiner|
|CCX_QUEUE_ID|The ID of the CCX Chat Contact Service Queue. Can be obtained by calling the `/csq/` API on CCX|

# Licenses
### MIT License

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

### External Licenses
Cisco®, Cisco Spark™, Spark Care™, Cisco SocialMiner® etc. are registered trademarks of [Cisco Systems, Inc.](http://www.cisco.com/web/siteassets/legal/trademark.html)
