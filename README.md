# hterm.org website

This repo is the hterm.org website and related tooling.

The site uses [Firebase] for hosting.

## Site Layout

Here's the layout of the site of real files.

* `/404.html`: The default HTTP/404 error page.
* `/index.html`: The main page's HTML code.
* `/index.js`: The main page's JavaScript code.
* `/css/`: Various `.css` files.
* `/dist/`: hterm versions for live use on the site.
  * `<ver>/`: Each release goes into a versioned directory.
* `/img/`: Various image files.

Here's the pseudo layout (managed via the [firebase.json] config file).

* `/docs`: Redirect to the main set of docs.  Subpaths may be used to redirect
  to specific docs.
* `/faq`: Stable link to the hterm FAQ.
  * `<id>`: Stable links to specific questions.
* `/x/`: Namespace for stable links.  Once created, these should never be
  deleted or renamed.  Anything directly under this is hterm related.
  * `ssh/`: Namespace for ssh related links.
* `/_/`: Internal namespace for reducing URL base duplication.  Would be nice
  to avoid exposing externally, but Firebase doesn't seem to support internal
  rewrites, or variables in the config file.

## Source Layout

Here's the layout of this git repo.

* `bin/`: Various scripts to help manage the site.
* `firebase.json`: The Firebase configuration file for the site.
* `htdocs/`: All the files uploaded to the website.  See [site layout] too.

## Firebase Cheatsheet

You will need the firebase-tools package available via npm.
You can follow the [quickstart guide], or use the version bundled with the
libdot repo (that hterm is part of).
For now, we assume that `firebase` is in your $PATH.

### Local Testing

To test out changes locally, run `firebase serve`.
That will start up a webserver on the local system so you can fully test out
changes to the site and to the [firebase.json] config file.

### Deploying

To deploy the changes to the real site, run `firebase -P hterm-website deploy`.

### References

Some docs that might be useful:

* https://firebase.google.com/docs/hosting/: General hosting documentation.
* https://firebase.google.com/docs/hosting/full-config: The [firebase.json]
  specification and settings.


[Firebase]: https://firebase.google.com/
[quickstart guide]: https://firebase.google.com/docs/hosting/quickstart

[firebase.json]: ./firebase.json
[site layout]: #site-layout
