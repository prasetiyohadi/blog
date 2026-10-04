![Build Status](https://github.com/prasetiyohadi/blog/actions/workflows/hugo-deploy.yml/badge.svg)

---

My [Hugo] website, built and deployed by GitHub Actions to GitHub Pages.

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [GitHub Actions](#github-actions)
- [Building locally](#building-locally)
- [Custom domain](#custom-domain)
- [Did you fork this project?](#did-you-fork-this-project)
- [Troubleshooting](#troubleshooting)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## GitHub Actions

This project's static Pages are built and deployed by [GitHub Actions][ci],
following the steps defined in
[`.github/workflows/hugo-deploy.yml`](.github/workflows/hugo-deploy.yml) on
every push to `master`. Any other branch or pull request only builds the
site to confirm it still builds; it does not deploy.

Moved here from GitLab CI/GitLab Pages; see `git log` history before this
migration for the old `.gitlab-ci.yml`.

## Building locally

To work locally with this project, you'll have to follow the steps below:

1. Fork, clone or download this project
1. [Install][] Hugo (see `devbox.json` for the pinned version)
1. Preview your project: `hugo server`
1. Add content
1. Generate the website: `hugo` (optional)

Read more at Hugo's [documentation][].

### Preview your site

If you clone or download this project to your local computer and run `hugo server`,
your site can be accessed under `localhost:1313/`.

The theme used is `hugo-profile`, vendored under `themes/hugo-profile`.

## Custom domain

The site is served at a custom domain (`static/CNAME`), configured in this
repo's **Settings → Pages**. GitHub Pages must have its source set to
**GitHub Actions** for the workflow's deploy step to take effect.

## Did you fork this project?

If you forked this project for your own use, please go to your project's
**Settings** and remove the forking relationship, which won't be necessary
unless you want to contribute back to the upstream project.

## Troubleshooting

1. CSS is missing! That means two things:

    Either that you have wrongly set up the CSS URL in your templates, or
    your static generator has a configuration option that needs to be explicitly
    set in order to serve static assets under a relative URL.

[ci]: https://github.com/features/actions
[hugo]: https://gohugo.io
[install]: https://gohugo.io/overview/installing/
[documentation]: https://gohugo.io/overview/introduction/
