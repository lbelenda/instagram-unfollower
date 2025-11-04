# Instagram Unfollower

Automatically cancel pending Instagram follow requests that were never accepted.

## What it does

This tool automates the tedious process of cleaning up your Instagram pending follow requests, 
perfect for clearing out old follow requests that will never be accepted.

### Download user data

In order to run this script you will need to download your `followers_and_following` data from Instagram:

 ☰ → Settings → Account Center → Your information and permissions → Download your information → Some of your information → Connections → Followers and following.

On the last step, select JSON as the format instead of the default HTML.

### Usage

paste the `pending_follow_requests.json` file on the root of the project and run with `npm start`

Application offers the possibility to open a browser to show the automation process or just run on CLI mode