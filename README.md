ng-s1
=========

Foundation project build on top of Angular, Sass, Node, Gulp, LiveReload integrating s1variables and s1assets.

## Setup

    $ npm install
    $ gulp


## Develop

    $ gulp dev

Your prefered browser will open to [localhost:3000](http://localhost:3000).


## Assets
Add assets to `./assets` and they'll be copied over to `./www`.

## S1
* For spacings SPC check `./www/css/spacings.css`
* For icons check `./www/css/icons.css`
* `./src/sass/styles.css` shows how to leverage s1variables

## Heroku

To push to heroku add the heroku app name to the package.json (line 7).
After building the `www` run:

    $ gulp heroku