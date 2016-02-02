[![General Assembly Logo](https://camo.githubusercontent.com/1a91b05b8f4d44b5bbfb83abac2b0996d8e26c92/687474703a2f2f692e696d6775722e636f6d2f6b6538555354712e706e67)](https://generalassemb.ly/education/web-development-immersive)

# CSS: Layout with Bootstrap

## Prequisites

-   [ga-wdi-boston/html-css-layout](https://github.com/ga-wdi-boston/html-css-layout)
-   [ga-wdi-boston/html-css-sass](https://github.com/ga-wdi-boston/html-css-sass)
-   [ga-wdi-boston/js-template-installation](https://github.com/ga-wdi-boston/js-template-installation)

## Objectives

By the end of this lesson, students should be able to:

-   Install `bootstrap-sass` into a front-end project.
-   Create mobile-first, responsive site layouts using
    [bootstrap](http://getbootstrap.com).
-   Maintain semantic HTML markup using Sass mixins provided by
    `bootstrap-sass`.
-   Reference bootstrap documentation.
-   Add a modal to a front end project.

## Preparation

1.  [Fork and clone](https://github.com/ga-wdi-boston/meta/wiki/ForkAndClone)
    this repository.
1.  Install dependencies with `npm install`.

## Twitter Bootstrap

Bootstrap is a free and open-source collection of tools for creating websites
and web applications. It contains HTML- and CSS-based design templates for
typography, forms, buttons, navigation and other interface components, as
well as optional JavaScript extensions. It aims to ease the development of
dynamic websites and web applications.

Bootstrap is a front end framework, that is, an interface for the user, unlike
the server-side code which resides on the "back end" or server.

Bootstrap is the most-starred project on GitHub, with over 90K stars and more
than 38K forks.

[Bootstrap Wiki](https://en.wikipedia.org/wiki/Bootstrap_(front-end_framework))

## Install Bootstrap

We'll use `bootstrap-sass`, the official Sass port of bootstrap. The next major
version of bootstrap will use Sass by default. For now, using Sass allows us to
keep our markup clean.

If you're starting a new project, first get a copy of
[js-template](https://github.com/ga-wdi-boston/js-template). If you're unsure
how to install the template, see the [installation
instructions](https://github.com/ga-wdi-boston/js-template-installation).

After you have the initial template files, follow these steps to install
`bootstrap-sass` into your project. For this talk, we've already installed the
template files, so you can just follow along.

-   [ ] `npm install --save-dev bootstrap-sass` to download bootstrap and add it
    as a dependency.
-   [ ] Add `bootstrap-sass` JS modules as a vendor script inside
    [`grunt/webpack.js`](grunt/webpack.js).

    ```diff
    -       vendor: ['jquery'],
    +       vendor: ['jquery', 'bootstrap-sass'],
    ```

-   [ ] Register the font path and include the `bootstrap-sass` module in your
    style manifest.

    ```diff
    + $icon-font-path: '~bootstrap-sass/assets/fonts/bootstrap/';
    + @import '~bootstrap-sass/assets/stylesheets/bootstrap';
    ```

-   [ ] Remove `normalize.css` from [`package.json`](package.json) and
    [`index.js`](index.js) since bootstrap already includes its own browser
    reset.

## Lab: Review Sites Made With Bootstrap

In squads closely inspect the following site list.  Keeping these questions in
mind please write down your thoughts and we will discuss them as a class.

1.  How are the the pages similar?
1.  How is the HTML similar among the pages?
1.  As you interact with the site how does the DOM change (if at all)?
1.  How are elements on the pages horizontally arranged?
1.  Notice any similarities among bootstrap pages in general?

-   [Divinity in Tech](http://divinityintech.com/)
-   [UI Viking](http://uiviking.com/)
-   [MintVine](https://mintvine.com/)
-   [The Tool Smith](http://thetoolsmith.com/)
-   [Fansoro](http://fansoro.org/)
-   [Pave](http://pavingtheway.net/)

## Bootstrap Documentation

For components and jQuery plugins always reference the Bootstrap docs.

 [Bootstrap Documentation](http://getbootstrap.com/)

## Lab: 12-Column Grid

After we properly install Bootstrap, lets get some firsthand experience writing
it.  Using the documentation we discussed earlier write a simple grid in the
`index.html` file located in this repo.  Make use of col-xs, sm, md, lg and xl.
Try making an evenly spaced 3x3 grid.

-   Place your column divs within a row div.
-   Place your row divs within a container div
-   Experiment with various viewport sizes

## Lab: Modals and More

Follow along as I addd a bootstrap modal to our current sandbox page.

On your own:

-   Referencing the Bootstrap documentation add an input-group or well to your
    modal.
-   Using your knowledge of jQuery write a function so that when "save changes"
    is clicked the input in the well or input group is console logged in Chrome.
-   Refrencing the Bootstrap documentation add a navbar to your page.
-   Move the button that opens up the modal to the navbar.

## Demo: Using 1bootstrap-sass1 for Semantic Markup

Follow along as I use mixins to make our grid system more semantic.

```html
<div class="container">
  <div class="row article">
    <div class="col-md-8">.col-md-8</div>
    <div class="col-md-4">.col-md-4</div>
  </div>
</div>


<div class="container">
  <div class="article">
    <div class="main-content">.col-md-8</div>
    <div class="right-sidebar">.col-md-4</div>
  </div>
</div>
```

## Lab: Semantic Markup

1.  Using the code I used above in your `index.scss` file refactor on your own.
1.  Write your own mobile ready page using Bootstrap classes.
1.  Refactor your HTML to be more semantic (copy/paste your previous code and
    refactor it using bootstrap-sass to make it semantic).

## Useful Resources

-   [Sitepoint Sass Mixins](http://www.sitepoint.com/5-useful-sass-mixins-bootstrap/)
-   [Bootstrap Grid Tricks](http://willschenk.com/bootstrap-advanced-grid-tricks/)
-   [Hongkait Grid Tricks](http://www.hongkiat.com/blog/bootstrap-and-sass/)
-   [Bootstrap Documentation](http://getbootstrap.com/)

## [License](LICENSE)

Source code distributed under the MIT license. Text and other assets copyright
General Assembly, Inc., all rights reserved.
