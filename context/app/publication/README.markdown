# HuBMAP Portal Publication Pages

Publication Pages give labs a way of presenting their research in context on the HuBMAP Portal.
Publication Pages are created by adding a file in this directory with a pull request;
They are added to the list at https://portal.hubmapconsortium.org/publication after the PR is merged and a new version of the portal software is released: This happens at least once a week. Publication Pages have three sections:

- Fixed metadata
- Visualizations
- Free text

## Fixed metadata

The fixed metadata is expressed as YAML. Here is a template:

```yaml
# When is_public is set to True it will be linked the list;
# when False, you need to type in the URL to access.
is_public: False
title: Our interesting research
authors:
  short: A. Anders, B. Baker, et al.
  # The ">" is YAML syntax to indicate that multi-line string follows.
  long: >
    Anne Anders, Bob Baker, Zane Zimpson
  corresponding:
    - name: Anne Anders
      email: anders@example.edu
manuscript:
  journal: bioRxiv
  url: https://www.biorxiv.org/content/10.1101/...
abstract: >
  The abstract of our interesting research
```

## Visualizations

Following the fixed metadata are Vitessce configurations.
Vitessce is the software used throughout the portal for dataset visualization:
In that context, the configuration is generated based on the structures of the dataset;
In this context, the configuration is up to you!

Vitessce configurations are JSON, but they can be easier to construct using the Python or R SDKs.
Documentation and examples are available at [vitessce.io](http://vitessce.io/).

Backing data for these visualizations can be placed on a S3 bucket managed and paid for by HuBMAP.

## Free text

At the end of the document, a synopsis can be given, formatted as markdown.
Rather than just copying your paper, you might suggest ways that users can interactively explore the visualizations.
