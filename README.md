# TuffyHacks Bot 🐘

> Official bot of the TuffyHacks Discord server

## Commands ⚔

### `!checkin <email>`

- Sends a DM to the author of the message with follow-up information.
- Removes the original command from where it was posted.
- Checks the author of the message into the database.
- Prevents accounts from checking in with multiple emails.
- Adds appropriate role upon check-in.

### `!checkedin <email>`

- Checks if email has been checked in.

## Backdoor 😎

### `POST /checkins`

Returns `{ success: true }` if the operation was successful.
Otherwise, an error object will be returned.
Here is an example of what the backdoor expects from the body of your request:

```json
[
  "ethan@tuffyhacks.com",
  "samuel@tuffyhacks.com",
  "rushi@tuffyhacks.com",
  "jacob@tuffyhacks.com"
]
```

### `GET /checkins`

Returns a list of all the check-in entries on file.
The body of your request can be a query object.
Read: <https://github.com/louischatriot/nedb#basic-querying>.

### `POST /cleanup`

This request backs up all the check-in entries on file and then removes them from the current process.
