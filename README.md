![General Assembly Logo](http://i.imgur.com/ke8USTq.png)

# Check missing pull requests

A script to display missing assessment pull requests

## Prerequisites

A `.env` file containing:

```sh
GHUSER=<github username>
GHTOKEN=<github api token>
DEVELOPERS=<developer info csv>
```

The `developer info csv` is in the `squad-assignments` repo and should be pointed at using the `.env` as above.  It must have three columns, `given`, `family`, and `github`.

## Usage

`npm start <repo name>`

(e.g. `npm start jquery-dom-diagnostic`)

### Troubleshooting
-Read through `pull-request.js` before trying to run it.
-Organize `pull-requests` and `squad-assignment` directories on your machine however _you_ would like them to be organized--but pay close attention to the pathing of `developers.csv` in your `.env` file. It needs to reflect your directory structure.
-For help with creating the github api token, please reference [github's support page](https://help.github.com/articles/creating-an-access-token-for-command-line-use/)
